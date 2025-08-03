import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import OTP from '@/model/otp.model';

export async function POST(req: Request) {
  try {

    const { email, otp } = await req.json();
    console.log(email,otp);
    

    if (!email || !otp || typeof otp !== 'string' || otp.length !== 6) {
      return NextResponse.json({ message: 'Invalid input.' }, { status: 400 });
    }

    await connectDB();

    const record = await OTP.findOne({ email: email.toLowerCase() }).sort({ createdAt: -1 });

    if (!record) {
      return NextResponse.json({ message: 'No OTP found.' }, { status: 404 });
    }

    if (record.isVerified) {
      return NextResponse.json({ message: 'OTP already verified.' }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json({ message: 'OTP has expired.' }, { status: 410 });
    }

    if (record.otp !== otp) {
      return NextResponse.json({ message: 'Incorrect OTP.' }, { status: 401 });
    }

    record.isVerified = true;
    await record.save();

    return NextResponse.json({ message: 'OTP verified.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error.', error }, { status: 500 });
  }
}
