import { NextResponse } from "next/server";

export const response = (success: boolean, statusCode: number, message: string, data: any = {}) => {
    return NextResponse.json({
        success,
        statusCode,
        message,
        data,
    }, { status: statusCode });
};
