"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Unknown error";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy to-slate-blue">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-ivory mb-4">Auth Error</h1>
        <p className="text-gold mb-8">{error}</p>
        <Link
          href="/auth/signin"
          className="px-6 py-2 bg-gold text-navy font-semibold rounded-lg hover:bg-gold/90"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
