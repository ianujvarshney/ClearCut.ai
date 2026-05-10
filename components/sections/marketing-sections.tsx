"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { ArrowRight, Braces, Check, ChevronDown, Code2, CreditCard, Layers3, Quote, Rocket, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { faqs, features } from "@/lib/data";

export function FeatureCards() {
  const icons = [WandSparkles, Layers3, Rocket, CreditCard];
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="font-bold text-indigo-600">Built for velocity</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Everything your image workflow needs</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, body], index) => (
            (() => {
              const Icon = icons[index];
              return (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-white/5"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </motion.div>
              );
            })()
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="bg-slate-50 px-4 py-20 dark:bg-slate-900/50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">From upload to campaign-ready</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">A polished workflow that feels instant, even before you connect the production removal model.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            ["Upload", "Drop single images or full batches into the smart uploader."],
            ["Refine", "Preview transparent, solid, or custom branded backgrounds."],
            ["Export", "Download HD files or push processed assets through the API."]
          ].map(([title, body], index) => (
            <div key={title} className="relative rounded-3xl bg-white p-7 shadow-sm dark:bg-white/5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-white dark:bg-white dark:text-slate-950">{index + 1}</div>
              <h3 className="mt-6 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const quotes = [
    ["The preview flow feels as fast as the tools our design team already loves.", "Maya C.", "Growth Lead"],
    ["Batch uploads and API-first thinking make this a believable SaaS product from day one.", "Arjun P.", "CTO"],
    ["The UI hits that premium conversion feel without getting heavy or cluttered.", "Leah R.", "Creative Ops"]
  ];

  return (
    <section className="overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-black tracking-tight sm:text-5xl">Loved by teams making visual content</h2>
        <motion.div className="mt-10 flex gap-4" animate={{ x: [0, -24, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
          {quotes.map(([quote, name, role]) => (
            <div key={name} className="min-w-[290px] flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 md:min-w-0">
              <Quote className="h-6 w-6 text-indigo-500" />
              <p className="mt-5 text-lg font-semibold leading-8">{quote}</p>
              <p className="mt-6 font-black">{name}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function PricingPreview() {
  return (
    <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-bold text-sky-300">Simple pricing</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Scale from free tests to API volume</h2>
          </div>
          <Button variant="secondary">Compare plans</Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["Starter", "$0", "50 credits", ["Preview workflow", "Batch demo", "Community support"]],
            ["Pro", "$19", "1,000 credits", ["HD downloads", "Brand backgrounds", "Priority queue"]],
            ["Scale", "Custom", "API volume", ["SLA placeholder", "Stripe billing", "Storage integration"]]
          ].map(([name, price, credits, perks], index) => (
            <div key={name as string} className={`rounded-3xl border p-7 ${index === 1 ? "border-indigo-300 bg-white text-slate-950 shadow-glow" : "border-white/10 bg-white/5"}`}>
              <p className="font-black">{name}</p>
              <p className="mt-4 text-4xl font-black">{price}</p>
              <p className="mt-2 text-sm opacity-70">{credits}</p>
              <div className="mt-6 grid gap-3 text-sm">
                {(perks as string[]).map((perk) => (
                  <span key={perk} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> {perk}</span>
                ))}
              </div>
              <Button className="mt-7 w-full" variant={index === 1 ? "gradient" : "secondary"}>Get started</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApiSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-bold text-indigo-600">Developer API</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Ship background removal inside your own product</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">The app includes clean placeholders for API routing, authentication, storage, metering, and payment events.</p>
          <Button className="mt-7" variant="gradient">Read API docs <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="rounded-3xl bg-slate-950 p-5 text-sm text-slate-100 shadow-soft">
          <div className="mb-4 flex items-center gap-2 text-sky-300"><Code2 className="h-5 w-5" /> REST endpoint placeholder</div>
          <pre className="overflow-x-auto rounded-2xl bg-black/30 p-5"><code>{`const result = await clearcut.removeBackground({
  image: file,
  format: "png",
  background: "transparent",
  webhooks: true
});`}</code></pre>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Auth", "S3", "Stripe"].map((item) => <span key={item} className="rounded-2xl bg-white/10 px-4 py-3 font-bold">{item}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section className="bg-slate-50 px-4 py-20 dark:bg-slate-900/50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-black tracking-tight sm:text-5xl">Questions, answered</h2>
        <Accordion.Root type="single" collapsible className="mt-10 grid gap-3">
          {faqs.map(([question, answer]) => (
            <Accordion.Item key={question} value={question} className="rounded-3xl bg-white px-5 shadow-sm dark:bg-white/5">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between gap-4 py-5 text-left font-black">
                  {question}
                  <ChevronDown className="h-5 w-5 shrink-0 transition data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pb-5 text-sm leading-6 text-muted-foreground">{answer}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}

export function CTABanner() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 p-8 text-white shadow-glow sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold"><Braces className="h-4 w-4" /> Launch-ready SaaS shell</div>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">Turn image cleanup into a product your users will trust.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button variant="secondary" size="lg">Create account</Button>
            <Button variant="primary" size="lg">Open dashboard</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
