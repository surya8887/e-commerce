'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const OTP_LENGTH = 6;

export default function VerifyOTPPage() {
  const params = useParams();
  const router = useRouter();
  const email = params.email ? decodeURIComponent(params.email as string) : '';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.replace('/login');
    }
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text').trim().slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasteData)) return;

    const pasteArray = pasteData.split('');
    setOtp(pasteArray);
    pasteArray.forEach((digit, i) => {
      if (inputRefs.current[i]) inputRefs.current[i]!.value = digit;
    });

    const nextIndex = pasteArray.length < OTP_LENGTH ? pasteArray.length : OTP_LENGTH - 1;
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== OTP_LENGTH) {
      alert('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: fullOtp }), // ✅ Send both email and otp in body
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'OTP verification failed');

      alert('OTP verified successfully');
      router.push('/profile');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-6 text-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
          <p className="text-sm text-gray-600">
            A 6-digit code was sent to{' '}
            <span className="font-medium text-blue-600">{email}</span>
          </p>
        </div>

        <div className="flex justify-between gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoComplete="one-time-code"
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-medium border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ref={(el: HTMLInputElement | null) => {
                inputRefs.current[index] = el;
              }}
              value={digit}
              disabled={loading}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        <Button className="w-full mt-4" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <p className="text-xs text-gray-500">
          Didn’t receive the code?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Resend
          </a>
        </p>
      </div>
    </div>
  );
}
