import { Copy, KeyRound, ServerCog, Webhook } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export default function ApiDocsPage() {
  const docs: { icon: LucideIcon; title: string; body: string }[] = [
    { icon: KeyRound, title: "API keys", body: "Issue scoped keys from the dashboard." },
    { icon: ServerCog, title: "Processing", body: "Send multipart uploads or asset URLs." },
    { icon: Webhook, title: "Webhooks", body: "Receive completion events for batches." }
  ];

  return (
    <PageShell eyebrow="API Docs" title="A clean integration layer for background removal" body="Use this page as the developer surface for authentication, upload handling, metering, and async processing docs.">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-4">
          {docs.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <Icon className="h-6 w-6 text-indigo-600" />
              <h2 className="mt-4 font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl bg-slate-950 p-5 text-slate-100 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="font-bold text-sky-300">POST /v1/remove-background</p>
            <Button variant="ghost" size="sm"><Copy className="h-4 w-4" /> Copy</Button>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-black/30 p-5 text-sm"><code>{`curl https://api.clearcut.ai/v1/remove-background \\
  -H "Authorization: Bearer $CLEARCUT_API_KEY" \\
  -F "image=@portrait.jpg" \\
  -F "background=transparent"`}</code></pre>
        </div>
      </div>
    </PageShell>
  );
}
