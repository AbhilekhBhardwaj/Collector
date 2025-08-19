"use client";

import Link from "next/link";
import MiniBar from "@/components/MiniBar";
import { getClients, getGSTRegistered, getTimeEntries } from "@/lib/store";
import { aggregateMonthlyInvoice } from "@/lib/invoice";

export default function DashboardHome() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const clients = typeof window !== "undefined" ? getClients() : [];
  const entries = typeof window !== "undefined" ? getTimeEntries() : [];
  const gstReg = typeof window !== "undefined" ? getGSTRegistered() : false;

  const invoices = clients.map((c) => aggregateMonthlyInvoice(c, entries, gstReg, month, year));
  const kpiRevenue = invoices.reduce((s, i) => s + i.total, 0);
  const kpiGST = invoices.reduce((s, i) => s + i.gst, 0);
  const kpiTDS = invoices.reduce((s, i) => s + i.tds, 0);

  // Week bars from time entries
  const dayMs: number[] = Array(7).fill(0);
  const base = new Date(now);
  const day = now.getDay();
  base.setDate(now.getDate() - ((day + 6) % 7));
  base.setHours(0, 0, 0, 0);
  for (const t of entries) {
    const d = new Date(t.date + "T00:00:00");
    const idx = Math.floor((d.getTime() - base.getTime()) / (24 * 3600 * 1000));
    if (idx >= 0 && idx < 7) dayMs[idx] += t.hours * 3600000; // convert to ms to match scale
  }
  const weekHours = dayMs.map((ms) => Math.round((ms / 3600000) * 10) / 10);

  const cards = [
    { href: "/dashboard/time", title: "Time Tracker", desc: "Start/stop timers and view summaries." },
    { href: "/dashboard/invoices", title: "Invoices", desc: "Create and export invoices." },
    { href: "/dashboard/clients", title: "Clients", desc: "Manage client details." },
    { href: "/dashboard/tax", title: "Tax Overview", desc: "GST, TDS, and income tax estimates." },
    { href: "/dashboard/expenses", title: "Expenses", desc: "Track expenses and deductions." },
    { href: "/dashboard/reports", title: "Reports", desc: "Export summaries for your CA." },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-black/70 dark:text-white/70">Your FreelanceFlow dashboard.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">Revenue (this month)</div>
          <div className="mt-1 text-2xl font-semibold">₹{kpiRevenue.toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">GST (this month)</div>
          <div className="mt-1 text-2xl font-semibold">₹{kpiGST.toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">TDS (this month)</div>
          <div className="mt-1 text-2xl font-semibold">₹{kpiTDS.toLocaleString("en-IN")}</div>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">Hours (this week)</div>
          <MiniBar className="mt-3" values={weekHours} labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-xl border border-black/10 dark:border-white/10 p-5 hover:shadow-sm transition">
            <div className="text-lg font-semibold">{c.title}</div>
            <div className="mt-1 text-sm text-black/70 dark:text-white/70">{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}


