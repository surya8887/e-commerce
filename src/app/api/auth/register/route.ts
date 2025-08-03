import { emailVerificationLink } from "@/Emails/EmailVerificationLink";
import connectDB from "@/lib/db";
import User from "@/model/user.model";
import { generateEmailVerificationToken } from "@/utils/jwt";
import sendMail from "@/utils/sendmailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Please provide username, email, and password" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    const user = await User.create({
      username,
      email,
      password: password
    });

    // Generate verification token and email body
    const token = generateEmailVerificationToken(email);
    const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/verify-email/${token}`;
    const htmlBody = emailVerificationLink(verificationUrl);

    // Send the verification email
    await sendMail({
      subject: "Email Verification from Surya Kumar",
      receiver: email, // ✅ Fixed: was `recipient`
      body: htmlBody,
    });

    return NextResponse.json(
      {
        message: "User registered successfully. Verification email sent.",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}
