import connectDB from "@/lib/db";
import User from "@/model/user.model";
import { verifyEmailVerificationToken } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();

    console.log('here check token');
    const { token } = await request.json();
    
    // Verify token and extract email payload
    const payload = verifyEmailVerificationToken(token);
    const email = payload.email;
  
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "User already verified" },
        { status: 200 }
      );
    }

    // Mark user as verified
    user.isEmailVerified = true;
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email verification error:", error);

    const message =
      error.name === "TokenExpiredError"
        ? "Verification token has expired"
        : "Invalid verification token";

    return NextResponse.json({ message }, { status: 400 });
  }
}
