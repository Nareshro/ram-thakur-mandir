"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      router.push("/admin/dashboard");
    } catch (error: unknown) {
      console.error("Firebase Error:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error
      ) {
        setError(String((error as { code: string }).code));
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-stone-900 to-black flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-10 shadow-2xl">
        <div className="text-center">
          <Image
            src="/images/logo/logo.jpg.jpeg"
            alt="Temple Logo"
            width={90}
            height={90}
            className="mx-auto rounded-full border-2 border-amber-400"
          />

          <h1 className="mt-6 text-3xl font-bold text-white">
            Admin Portal
          </h1>

          <p className="mt-2 text-amber-400">
            Shri Shri Ram Thakur Seva Mandir
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-10 space-y-6">
          <div>
            <label className="text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
              <p className="text-center text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-amber-400"
          >
            ← Back to Website
          </Link>

          <p className="mt-6 font-medium text-amber-400">
            Guru Kripahi Kevalam
          </p>
        </div>
      </div>
    </main>
  );
}