'use client'; // Needed for using signOut (a client-side function)

import { signOut } from "next-auth/react";
import React from "react";

const LogoutPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutPage;
