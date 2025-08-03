'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmail({ params }: { params: any }) {
  const {token} : {token:string} = use(params);
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function verifyToken() {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      } catch {
        setStatus('error');
        setMessage('Network error, please try again.');
      }
    }

    verifyToken();
  }, [token]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">

        {status === 'loading' && (
          <>
            <div className="loader mx-auto mb-6"></div>
            <p className="text-gray-700 text-lg">Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-20 w-20 text-green-500 animate-bounce" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-gray-700 mb-6">{message}</p>
            <Button onClick={() => router.push('/login')} variant="default" size="lg">
              Proceed to Login
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="mx-auto mb-4 h-20 w-20 text-red-500 animate-pulse" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-700 mb-6">{message}</p>
            <Button onClick={() => router.push('/resend-verification')} variant="destructive" size="lg">
              Resend Verification Email
            </Button>
          </>
        )}
      </div>

      {/* Debug: Show token (Remove in production) */}
      <div className="mt-4 text-sm text-gray-500 break-all max-w-md text-center">
        {/* <strong>Token:</strong> {token} */}
      </div>

      {/* Loader Spinner CSS */}
      <style jsx>{`
        .loader {
          border: 4px solid rgba(59, 130, 246, 0.2);
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
