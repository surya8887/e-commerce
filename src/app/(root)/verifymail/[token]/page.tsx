"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail } from "lucide-react";

function VerifyMail({ token }: { token: string }) {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (data.success) {
          setIsVerified(true);
        } else {
          setError(data.message || "Verification failed");
        }
      } catch (err) {
        setError("Something went wrong during verification.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verify();
    } else {
      setLoading(false);
      setError("Token not found in URL");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-10">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Verifying...</p>
          ) : error ? (
            <>
              <h1 className="text-2xl font-bold mb-2 text-red-500">Verification Failed</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            </>
          ) : !isVerified ? (
            <>
              <Mail className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                We’ve sent a verification link to your inbox.
              </p>
            </>
          ) : (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You’re all set. You can now continue.
              </p>
              <Button
                variant="default"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Go to Dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyMail;
