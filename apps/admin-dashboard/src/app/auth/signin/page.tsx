"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.ok) router.push(callbackUrl);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy to-slate-blue p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-ivory mb-8 text-center">
          Sign In
        </h1>
        {error && (
          <p className="text-red-400 mb-4 text-center">Error: {error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gold/30 bg-navy-900/50 text-ivory focus:outline-none focus:border-gold"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gold/30 bg-navy-900/50 text-ivory focus:outline-none focus:border-gold"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gold text-navy font-semibold rounded-lg hover:bg-gold/90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="space-y-2">
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full py-2 bg-white text-navy font-semibold rounded-lg hover:bg-gray-100"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => signIn("discord", { callbackUrl })}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
          >
            Sign in with Discord
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
