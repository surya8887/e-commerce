import DBConnect from "@/lib/db";
import { response } from "@/utils/ApiResponse";
import { NextRequest } from "next/server";
import User from "@/model/user.model";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await DBConnect();

    const { token } = await request.json();

    if (!token) {
      return response(false, 400, "Token is missing", null);
    }
    console.log(token);
    

    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as {
      id: string;
    };

    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return response(false, 400, "Email verification failed", null);
    }

    // Optional: Mark user as verified if not already
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
    }

    return response(true, 200, "Email verified successfully", { userId: user._id });

  } catch (error: any) {
    console.error("Email verification error:", error);
    return response(false, 500, error.message || "Internal Server Error", null);
  }
}
