import DBConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await DBConnect()
    return NextResponse.json({
        message: "Server is running and database connected",
        statusCode: 200
    })
}