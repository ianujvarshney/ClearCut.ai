"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { registerUser, saveAuthSession } from "@/lib/auth-api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const session = await registerUser({ name, email, password });
      saveAuthSession(session);
      router.push("/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell eyebrow="Start free" title="Create your AI image workspace" body="Create an account to start tracking credits, exports, and processing history.">
      <form onSubmit={handleSubmit} className="max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <label className="text-sm font-bold" htmlFor="name">Name</label>
        <input id="name" name="name" autoComplete="name" required minLength={2} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-transparent px-4 focus-ring dark:border-white/10" placeholder="Anuj Sharma" />
        <label className="mt-5 block text-sm font-bold" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-transparent px-4 focus-ring dark:border-white/10" placeholder="you@company.com" />
        <label className="mt-5 block text-sm font-bold" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-transparent px-4 focus-ring dark:border-white/10" placeholder="At least 8 characters" />
        {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">{error}</p> : null}
        <Button className="mt-6 w-full" variant="gradient" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">Already registered? <Link href="/login" className="font-bold text-indigo-600">Log in</Link></p>
      </form>
    </PageShell>
  );
}
