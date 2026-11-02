"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LockKeyhole,
  UserRound,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Server se connection nahi ho paya. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF8] px-4 py-10 text-[#1E1E1E]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex justify-center">
            <Image
              src="/mr-mobile-wala-logo.png"
              alt="MR MOBILE WALA REPAIRS"
              width={220}
              height={75}
              priority
              className="h-auto w-[190px] object-contain"
            />
          </Link>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1E1E1E]/45">
            Shop Management
          </p>
        </div>

        <section className="rounded-[28px] border border-[#1E1E1E]/10 bg-white p-6 shadow-[0_20px_70px_rgba(30,30,30,0.07)] sm:p-9">
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E1E1E] text-white">
              <LockKeyhole size={22} />
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Admin Login
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#1E1E1E]/55">
              Sign in to access your repair shop dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-xs font-bold text-[#1E1E1E]/70"
              >
                Username
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1E1E]/35"
                />

                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="h-13 w-full rounded-xl border border-[#1E1E1E]/10 bg-[#FAFAF8] pl-11 pr-4 text-sm outline-none transition focus:border-[#1E1E1E]/50 focus:ring-4 focus:ring-[#1E1E1E]/5"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-bold text-[#1E1E1E]/70"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E1E1E]/35"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-13 w-full rounded-xl border border-[#1E1E1E]/10 bg-[#FAFAF8] pl-11 pr-12 text-sm outline-none transition focus:border-[#1E1E1E]/50 focus:ring-4 focus:ring-[#1E1E1E]/5"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#1E1E1E]/45 transition hover:bg-[#1E1E1E]/5 hover:text-[#1E1E1E]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#1E1E1E] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Login to Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#1E1E1E]/10 pt-6 text-xs text-[#1E1E1E]/45">
            <ShieldCheck size={16} />
            Secure admin access
          </div>
        </section>

        <Link
          href="/"
          className="mt-6 block text-center text-xs font-semibold text-[#1E1E1E]/50 transition hover:text-[#1E1E1E]"
        >
          ← Back to Customer Booking
        </Link>
      </div>
    </main>
  );
}