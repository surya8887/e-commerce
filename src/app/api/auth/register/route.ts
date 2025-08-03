import connectDB from "@/lib/db";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    console.log(username)

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Please provide username, email, and password" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or username already exists" },
        { status: 409 } // Conflict
      );
    }


    const user = await User.create({
      username,
      email,
      password: password,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
