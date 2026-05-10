"use client";

import { Download, FileImage, Gauge, History, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";

export default function DashboardPage() {
  const { credits, history } = useAppStore();
  const stats: { icon: LucideIcon; label: string; value: string | number }[] = [
    { icon: WalletCards, label: "Credits", value: credits },
    { icon: FileImage, label: "Images processed", value: 1284 },
    { icon: Gauge, label: "Avg. processing", value: "1.2s" }
  ];

  return (
    <PageShell eyebrow="Dashboard" title="Credits, history, and exports in one calm workspace" body="The dashboard UI is ready for auth, billing, storage, and real processing data.">
      <div className="grid gap-5 md:grid-cols-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <Icon className="h-6 w-6 text-indigo-600" />
            <p className="mt-4 text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-xl font-black"><History className="h-5 w-5" /> History and downloads</h2>
          <Button variant="gradient">Buy credits</Button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr><th className="py-3">File</th><th>Status</th><th>Date</th><th>Size</th><th className="text-right">Action</th></tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 dark:border-white/10">
                  <td className="py-4 font-semibold">{item.name}</td>
                  <td><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{item.status}</span></td>
                  <td className="text-muted-foreground">{item.createdAt}</td>
                  <td className="text-muted-foreground">{item.size}</td>
                  <td className="text-right"><Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
