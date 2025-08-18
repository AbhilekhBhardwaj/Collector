"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Hydrate theme from localStorage
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved === "dark") document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[hsl(220,20%,96%)] dark:to-[hsl(220,20%,8%)] text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500" />
            <span className="font-semibold text-lg tracking-tight">Collector</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Features</a>
            <a href="#how" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">How it works</a>
            <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Pricing</a>
            <a href="#testimonials" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Testimonials</a>
            <a href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="hidden sm:inline-flex h-9 items-center rounded-md bg-indigo-600 px-4 text-white hover:bg-indigo-500 transition">Start Free</Link>
            <a href="#demo" className="hidden sm:inline-flex h-9 items-center rounded-md border border-black/10 dark:border-white/15 px-4 hover:bg-black/5 dark:hover:bg-white/10 transition">Demo Tour</a>
            <button onClick={() => document.documentElement.classList.toggle("dark") || localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light")} aria-label="Toggle theme" className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10">
              <span className="hidden dark:inline">☀️</span>
              <span className="dark:hidden">🌙</span>
            </button>
            <button className="md:hidden ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 dark:border-white/15" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">≡</button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-black/5 dark:border-white/10">
            <div className="px-4 py-3 flex flex-col gap-3 text-sm">
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="#testimonials">Testimonials</a>
              <a href="#contact">Contact</a>
              <Link href="/dashboard" className="h-9 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 text-white">Start Free</Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]">
            <div className="absolute -top-40 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-500/60 via-sky-400/60 to-emerald-400/60 blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Track time. Invoice smart. Calculate your taxes.</h1>
                <p className="mt-4 text-lg text-black/70 dark:text-white/70">All-in-one dashboard for productivity & compliance.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/dashboard" className="inline-flex h-11 items-center rounded-md bg-indigo-600 px-6 text-white hover:bg-indigo-500 transition">Start Free</Link>
                  <a href="#demo" className="inline-flex h-11 items-center rounded-md border border-black/10 dark:border-white/15 px-6 hover:bg-black/5 dark:hover:bg-white/10 transition">Demo Tour</a>
                </div>
                <div className="mt-6 text-sm text-black/60 dark:text-white/60">No credit card required</div>
              </div>
              <div className="relative">
                <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/30 backdrop-blur shadow-sm p-4">
                  <div className="h-6 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900/40" />
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                      <div className="text-sm text-black/60 dark:text-white/60">Today</div>
                      <div className="mt-1 text-2xl font-semibold">5h 12m</div>
                    </div>
                    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                      <div className="text-sm text-black/60 dark:text-white/60">Invoices</div>
                      <div className="mt-1 text-2xl font-semibold">₹38k</div>
                    </div>
                    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                      <div className="text-sm text-black/60 dark:text-white/60">GST</div>
                      <div className="mt-1 text-2xl font-semibold">18%</div>
                    </div>
                  </div>
                  <div className="mt-4 h-28 rounded-md bg-gradient-to-tr from-indigo-500/20 to-emerald-400/20" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Everything you need</h2>
            <p className="mt-2 text-black/70 dark:text-white/70">Time Tracking, Invoicing, Tax Estimate (GST, TDS, Income Tax), Expense Management, Export & Reports.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { t: "Time Tracking", d: "Start/stop timers, tag projects, and see daily/weekly stats." },
                { t: "Invoicing", d: "Create professional invoices and export to PDF." },
                { t: "Tax Estimate", d: "Auto-calc GST, TDS, and income tax with India rules." },
                { t: "Expense Management", d: "Track expenses and auto-calc deductions." },
                { t: "Reports", d: "Export CSV/PDF summaries for your CA." },
                { t: "Dark Mode", d: "Futuristic yet friendly design with smooth animations." },
              ].map((f) => (
                <div key={f.t} className="rounded-xl border border-black/10 dark:border-white/10 p-6 hover:shadow-sm transition">
                  <div className="text-lg font-semibold">{f.t}</div>
                  <div className="mt-2 text-sm text-black/70 dark:text-white/70">{f.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="py-16 sm:py-20 bg-black/[.03] dark:bg-white/[.03]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold">How it works</h2>
            <div className="mt-8 grid sm:grid-cols-3 gap-6">
              {[
                { s: "Track Time", d: "Run a timer while you work." },
                { s: "Generate Invoice", d: "Convert hours to invoices in one click." },
                { s: "Get Tax Summary", d: "See GST, TDS, and income tax instantly." },
              ].map((step, i) => (
                <div key={step.s} className="rounded-xl border border-black/10 dark:border-white/10 p-6">
                  <div className="text-sm text-black/60 dark:text-white/60">Step {i + 1}</div>
                  <div className="mt-1 text-lg font-semibold">{step.s}</div>
                  <div className="mt-1 text-sm text-black/70 dark:text-white/70">{step.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Simple pricing</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { name: "Free", price: "₹0", desc: "Basic tracking", highlight: false, cta: "Get started" },
                { name: "Pro", price: "₹299/mo", desc: "Everything you need", highlight: true, cta: "Start Pro" },
                { name: "Business", price: "₹699/mo", desc: "Teams & reports", highlight: false, cta: "Choose Business" },
              ].map((p) => (
                <div key={p.name} className={`rounded-2xl border p-6 ${p.highlight ? "border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.15)]" : "border-black/10 dark:border-white/10"}`}>
                  <div className="flex items-baseline gap-2">
                    <div className="text-xl font-semibold">{p.name}</div>
                    {p.highlight && <span className="rounded-full bg-indigo-600/10 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 text-xs">Most popular</span>}
                  </div>
                  <div className="mt-2 text-3xl font-bold">{p.price}</div>
                  <div className="mt-2 text-sm text-black/70 dark:text-white/70">{p.desc}</div>
                  <a href="#signup" className={`mt-6 inline-flex h-10 items-center justify-center rounded-md px-4 ${p.highlight ? "bg-indigo-600 text-white hover:bg-indigo-500" : "border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"}`}>{p.cta}</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 sm:py-20 bg-black/[.03] dark:bg-white/[.03]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Loved by freelancers</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { q: "Collector makes taxes feel effortless.", a: "Ananya, Designer" },
                { q: "I invoice faster and get paid sooner.", a: "Rohit, Developer" },
                { q: "Peace of mind during filings.", a: "Sana, Consultant" },
              ].map((t) => (
                <div key={t.a} className="rounded-xl border border-black/10 dark:border-white/10 p-6">
                  <div className="text-sm">“{t.q}”</div>
                  <div className="mt-3 text-sm text-black/60 dark:text-white/60">— {t.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-indigo-500/50 bg-indigo-600/10 p-8 text-center">
              <h3 className="text-2xl font-semibold">Ready to streamline your freelance workflow?</h3>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Link href="/dashboard" className="inline-flex h-11 items-center rounded-md bg-indigo-600 px-6 text-white hover:bg-indigo-500 transition">Sign Up Free</Link>
                <a href="#demo" className="inline-flex h-11 items-center rounded-md border border-black/10 dark:border-white/15 px-6 hover:bg-black/5 dark:hover:bg-white/10 transition">Demo Tour</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-black/5 dark:border-white/10 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500" />
            <span className="font-semibold">Collector</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#">Docs</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="flex items-center gap-4 text-xl">
            <a aria-label="X" href="#">𝕏</a>
            <a aria-label="LinkedIn" href="#">in</a>
            <a aria-label="GitHub" href="#">GH</a>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-black/60 dark:text-white/50">© {new Date().getFullYear()} Collector. All rights reserved.</div>
      </footer>
    </div>
  );
}
