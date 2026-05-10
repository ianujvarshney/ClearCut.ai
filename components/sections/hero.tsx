"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploaderStudio } from "@/components/sections/uploader-studio";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,.18),transparent_38%),linear-gradient(180deg,rgba(248,250,252,1)_0%,rgba(255,255,255,1)_70%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,.26),transparent_38%),linear-gradient(180deg,rgba(2,6,23,1)_0%,rgba(15,23,42,1)_70%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-grid bg-[length:48px_48px] opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm dark:border-indigo-400/20 dark:bg-white/5 dark:text-indigo-200">
            <Sparkles className="h-4 w-4" />
            AI background removal for teams that ship daily
          </div>
          <h1 className="mt-7 text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Remove backgrounds instantly. Launch cleaner visuals faster.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            ClearCut AI turns raw product shots, portraits, and campaign images into polished assets with batch uploads, HD exports, and a developer-ready API workflow.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="gradient" size="lg">
              Start removing free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="lg">
              View API docs
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-muted-foreground">
            <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" /> Sub-second UI</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Private by design</span>
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-indigo-500" /> 50 free credits</span>
          </div>
        </motion.div>
        <div className="mt-14">
          <UploaderStudio />
        </div>
      </div>
    </section>
  );
}
