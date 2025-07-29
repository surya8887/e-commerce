"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail } from "lucide-react"; // icon lib used by ShadCN

function VerifyMail() {
  const [isVerified, setIsVerified] = useState(false);

  const handleMockVerify = () => {
    // Simulate verification
    setTimeout(() => {
      setIsVerified(true);
    }, 1500); // fake delay
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-10">
          {!isVerified ? (
            <>
              <Mail className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                We've sent a verification link to your inbox. Click it to verify your email.
              </p>
              <Button onClick={handleMockVerify}>I’ve Verified My Email</Button>
            </>
          ) : (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You're all set. You can now continue.
              </p>
              <Button variant="default" onClick={() => console.log("Redirect to dashboard or login")}>
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
