import DBConnect from "@/lib/db";
import User from "@/model/user.model";
import { response } from "@/utils/ApiResponse";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { fullname, email,password } = await request.json();
    

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
    });

   

    return response(true, 201, "User created successfully", newUser);
  } catch (error) {
    console.error("Registration error:", error);
    return response(false, 500, "Internal Server Error");
  }
}
