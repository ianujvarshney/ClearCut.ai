import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-black">ClearCut AI</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Premium AI background removal for modern creative, commerce, and developer teams.</p>
          <div className="mt-5 flex gap-3 text-muted-foreground">
            <Twitter className="h-5 w-5" aria-label="Twitter" />
            <Github className="h-5 w-5" aria-label="GitHub" />
            <Linkedin className="h-5 w-5" aria-label="LinkedIn" />
          </div>
        </div>
        {[
          ["Product", ["Uploader", "Dashboard", "Pricing", "API Docs"]],
          ["Company", ["Blog", "Contact", "Careers", "Security"]],
          ["Legal", ["Privacy", "Terms", "DPA", "Status"]]
        ].map(([heading, links]) => (
          <div key={heading as string}>
            <p className="font-semibold">{heading}</p>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              {(links as string[]).map((link) => (
                <Link key={link} href={link === "Pricing" ? "/pricing" : "#"} className="hover:text-foreground">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
