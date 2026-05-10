import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export default function BlogPage() {
  const posts = [
    ["How AI cutouts improve ecommerce conversion", "Practical background removal workflows for catalog and marketplace teams."],
    ["Designing a batch image processing UX", "Patterns for queues, previews, error states, and export confidence."],
    ["What to consider before shipping an image API", "Auth, rate limits, retries, webhooks, and storage decisions."]
  ];

  return (
    <PageShell eyebrow="Blog" title="Ideas for faster visual production" body="Editorial cards for SEO content, launch notes, and developer education.">
      <div className="grid gap-5 md:grid-cols-3">
        {posts.map(([title, body]) => (
          <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-white/5">
            <div className="mb-6 aspect-[1.5] rounded-2xl bg-gradient-to-br from-indigo-100 via-sky-100 to-white dark:from-indigo-500/20 dark:via-sky-500/10 dark:to-white/5" />
            <h2 className="text-xl font-black">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            <p className="mt-5 flex items-center gap-2 text-sm font-bold text-indigo-600">Read article <ArrowRight className="h-4 w-4" /></p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
