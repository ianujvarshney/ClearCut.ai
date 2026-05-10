import { Mail, MapPin, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const contacts: { icon: LucideIcon; text: string }[] = [
    { icon: Mail, text: "hello@clearcut.ai" },
    { icon: MessageSquare, text: "Live chat placeholder" },
    { icon: MapPin, text: "Remote-first team" }
  ];

  return (
    <PageShell eyebrow="Contact" title="Talk to us about image automation" body="A polished contact page for sales, support, and partnership inquiries.">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-4">
          {contacts.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm dark:bg-white/5">
              <Icon className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold">{text}</span>
            </div>
          ))}
        </div>
        <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="h-12 rounded-2xl border border-slate-200 bg-transparent px-4 focus-ring dark:border-white/10" placeholder="Name" />
            <input className="h-12 rounded-2xl border border-slate-200 bg-transparent px-4 focus-ring dark:border-white/10" placeholder="Email" />
          </div>
          <textarea className="mt-4 min-h-40 w-full rounded-2xl border border-slate-200 bg-transparent p-4 focus-ring dark:border-white/10" placeholder="Tell us what you want to build" />
          <Button className="mt-4" variant="gradient">Send message</Button>
        </form>
      </div>
    </PageShell>
  );
}
