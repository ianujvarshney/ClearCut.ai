"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/data";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/30 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight" aria-label="ClearCut AI home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-sky-400 text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <span>ClearCut AI</span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" aria-label="Toggle color theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition dark:rotate-0 dark:scale-100" />
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="gradient" size="sm">
            <Link href="/register">Try free</Link>
          </Button>
        </div>
        <Button className="md:hidden" variant="ghost" size="sm" aria-label="Open menu" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </nav>
      <AnimatePresence>
        {open ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/40 md:hidden">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="ml-auto flex h-dvh w-80 max-w-[86vw] flex-col gap-4 bg-white p-5 shadow-soft dark:bg-slate-950">
              <div className="flex items-center justify-between">
                <span className="font-bold">Menu</span>
                <Button variant="ghost" size="sm" aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl px-2 py-3 font-semibold hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Button asChild variant="gradient">
                <Link href="/register">Start free</Link>
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
