import Link from "next/link";

export default function DashboardHome() {
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


