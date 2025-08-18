import Link from "next/link";
import "../globals.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <header className="border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500" />
            <span className="font-semibold">Collector</span>
          </div>
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/dashboard/time">Time</Link>
            <Link href="/dashboard/invoices">Invoices</Link>
            <Link href="/dashboard/clients">Clients</Link>
            <Link href="/dashboard/tax">Tax</Link>
            <Link href="/dashboard/expenses">Expenses</Link>
            <Link href="/dashboard/reports">Reports</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm underline">Back to site</Link>
          </div>
        </div>
      </header>
      <main className="bg-black/[.02] dark:bg-white/[.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}


