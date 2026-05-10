import { ReactNode } from "react";

export function PageShell({ eyebrow, title, body, children }: { eyebrow: string; title: string; body: string; children: ReactNode }) {
  return (
    <main className="min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,.18),transparent_42%)]" />
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="font-bold text-indigo-600">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">{title}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{body}</p>
        </div>
        <div className="mt-10">{children}</div>
      </section>
    </main>
  );
}
