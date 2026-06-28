"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/lib/actions";
import type { AuthState } from "@/lib/types";

const initial: AuthState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04070d] px-6 text-slate-200">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora left-1/2 top-[-140px] h-[420px] w-[620px] -translate-x-1/2 bg-emerald-500/20" />
        <div className="absolute inset-0 bg-grid opacity-60" />
      </div>
      <div className="w-full max-w-sm fade-in">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>
          </span>
          <span className="text-lg font-semibold tracking-tight">PulseWatch</span>
        </Link>
        <div className="glow-soft rounded-2xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl">
          <h1 className="text-xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to your dashboard.</p>
          <form action={action} className="mt-6 space-y-4">
            {state.error ? (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/20">{state.error}</p>
            ) : null}
            <div>
              <label htmlFor="email" className="block text-sm text-slate-300">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email"
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm text-slate-300">Password</label>
              <input id="password" name="password" type="password" required autoComplete="current-password"
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <button type="submit" disabled={pending}
              className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-60">
              {pending ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            New to PulseWatch? <Link href="/signup" className="font-medium text-emerald-400 hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
