"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { loginUser, saveAuthSession } from "@/lib/auth-api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const session = await loginUser({ email, password });
      saveAuthSession(session);
      router.push("/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell eyebrow="Welcome back" title="Log in to your ClearCut workspace" body="Access your image history, credits, and exports.">
      <form onSubmit={handleSubmit} className="max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <label className="text-sm font-bold" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-transparent px-4 focus-ring dark:border-white/10" placeholder="you@company.com" />
        <label className="mt-5 block text-sm font-bold" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-transparent px-4 focus-ring dark:border-white/10" placeholder="Password" />
        {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">{error}</p> : null}
        <Button className="mt-6 w-full" variant="gradient" type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Log in"}</Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">New here? <Link href="/register" className="font-bold text-indigo-600">Create an account</Link></p>
      </form>
    </PageShell>
  );
}
