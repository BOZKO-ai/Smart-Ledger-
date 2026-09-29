import { NextRequest, NextResponse } from "next/server";
import { getCookieValue, verifyToken, AuthTokenPayload } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Profile from "@/models/Profile";

export async function getAuthorizedProfile(request: Request | NextRequest) {
  const token = getCookieValue(request as any);
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  await dbConnect();
  const profile = await Profile.findOne({ authUserId: payload.profileId });
  return profile;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
