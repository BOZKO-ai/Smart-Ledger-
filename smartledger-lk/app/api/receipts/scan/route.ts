
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import dbConnect from "@/lib/mongodb";
import { checkScanLimit, incrementScanCount } from "@/lib/subscriptions";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const profile = await getAuthorizedProfile(request);
    if (!profile) {
      return unauthorizedResponse();
    }

    // Check subscription scan limit
    const scanCheck = await checkScanLimit(profile.businessId);
    if (!scanCheck.canScan) {
      return NextResponse.json(
        {
          success: false,
          message: "Free tier scan limit reached",
          upgradeRequired: true,
          scansUsed: scanCheck.scansUsed,
          limit: scanCheck.limit
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("receipt");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No receipt file provided" },
        { status: 400 }
      );
    }

    // --- Image compression & processing
    const buffer = Buffer.from(await file.arrayBuffer());
    const compressedBuffer = await sharp(buffer)
      .rotate()
      .resize(1600, 1600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer();
    const base64 = compressedBuffer.toString("base64");
    const mimeType = "image/jpeg";

    // --- Save image to public/uploads folder (local storage)
    let publicUrl: string | undefined;
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "receipts");
      await mkdir(uploadsDir, { recursive: true });
      const fileName = `${profile._id.toString()}-${Date.now()}.jpg`;
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, compressedBuffer);
      publicUrl = `/uploads/receipts/${fileName}`;
    } catch (storageErr) {
      console.warn("Could not save receipt image locally:", storageErr);
    }

    // --- Call Gemini Vision for OCR extraction
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a receipt parser OCR system. Analyze the provided receipt image and extract
Extract only the following fields as strict JSON:
- amount: total amount on receipt (as a number, exclude any currency symbols)
- date: transaction date in ISO  YYYY-MM-DD (best guess from receipt, if unreadable use today)
- vendor: name of the shop/merchant (if unreadable, use "Unknown Vendor"
- category: one of [Supplies, Rent, Utilities, Marketing, Transport, Salaries, Other
- confidence: "high" OR "low" (high if you are confident all fields are correct, low otherwise)
Return ONLY the JSON, no extra text, no markdown.`;
    const imagePart = { inlineData: { data: base64, mimeType } };
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // --- Clean and validate the JSON response
    let extractedData = text.replace(/```json|```/g, "").trim();
    let parsed = JSON.parse(extractedData);

    // --- Validate extracted data
    if (!parsed.amount || isNaN(parseFloat(parsed.amount))) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not read the amount from receipt, please try again",
        },
        { status: 400 }
      );
    }

    parsed.amount = parseFloat(parsed.amount);
    parsed.confidence = parsed.confidence || "low";
    if (!["high", "low"].includes(parsed.confidence)) {
      parsed.confidence = "low";
    }

    // Increment scan count after successful scan
    await incrementScanCount(profile.businessId);

    return NextResponse.json({
      extractedData: parsed,
      imageUrl: publicUrl,
      scansUsed: scanCheck.scansUsed + 1,
      limit: scanCheck.limit
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while scanning receipt. Please try again.",
      },
      { status: 500 }
    );
  }
}
