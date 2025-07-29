import DBConnect from "@/lib/db";
import User from "@/model/user.model";
import { response } from "@/utils/ApiResponse";
import sendMail from "@/utils/sendMail";
import { NextRequest } from "next/server";
import { emailVerificationLink } from "../../../../../emails/emailVerificationLink";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { fullname, email, password } = await request.json();

    if (!fullname || !email || !password) {
      return response(false, 400, "Please fill all fields");
    }

    await DBConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(false, 409, "Email already exists");
    }

    const newUser = await User.create({
      name: fullname,
      email,
      password,
      isVerified: false, // Optional: you can track this
    });

    // ✅ Create custom email verification token
    const emailToken = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.SECRET_KEY!,
      { expiresIn: "1h" }
    );

    const verifyUrl = `${process.env.PUBLIC_LINK}/verifymail/${emailToken}`;

    await sendMail(
      "Verify Your Email",
      email,
      emailVerificationLink(verifyUrl)
    );

    return response(true, 201, "User created successfully. Please verify your email.");
  } catch (error) {
    console.error("Registration error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
