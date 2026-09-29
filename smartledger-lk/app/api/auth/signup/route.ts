
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Business from "@/models/Business";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, businessName, ownerName, businessType, languagePref } = body;

    await dbConnect();

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email is already registered" },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    const business = await Business.create({
      ownerId: user._id.toString(),
      name: businessName,
      businessType,
      languagePref,
      planTier: "free",
    });

    const profile = await Profile.create({
      businessId: business._id,
      authUserId: user._id.toString(),
      fullName: ownerName,
      role: "owner",
      email: user.email,
    });

    const token = signToken({
      profileId: user._id.toString(),
      email: user.email,
      role: profile.role,
    });

    const response = NextResponse.json({ success: true }, { status: 201 });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to register user" },
      { status: 500 }
    );
  }
}

