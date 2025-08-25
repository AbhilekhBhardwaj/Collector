"use client";

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
            <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">About</a>
            <a href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#demo" className="hidden sm:inline-flex h-9 items-center rounded-md border border-black/10 dark:border-white/15 px-4 hover:bg-black/5 dark:hover:bg-white/10 transition">Demo</a>
            <a href="/login" className="hidden sm:inline-flex h-9 items-center rounded-md bg-indigo-600 px-4 text-white hover:bg-indigo-500 transition">Sign In</a>
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
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <a href="#demo" className="h-9 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 text-white">Demo</a>
                <a href="/login" className="h-9 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 text-white">Sign In</a>
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
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Simple. Powerful. Beautiful.</h1>
              <p className="mt-6 text-xl text-black/70 dark:text-white/70">A modern app designed for the way you work.</p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <a href="/login" className="inline-flex h-12 items-center rounded-lg bg-indigo-600 px-8 text-white hover:bg-indigo-500 transition text-lg">Get Started</a>
                <a href="#features" className="inline-flex h-12 items-center rounded-lg border border-black/10 dark:border-white/15 px-8 hover:bg-black/5 dark:hover:bg-white/10 transition text-lg">Learn More</a>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold">Everything you need</h2>
              <p className="mt-4 text-lg text-black/70 dark:text-white/70">Built with modern technologies and designed for simplicity.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { 
                  title: "Modern Design", 
                  description: "Clean, intuitive interface that adapts to your preferences.",
                  icon: "🎨"
                },
                { 
                  title: "Fast Performance", 
                  description: "Lightning-fast loading times and smooth interactions.",
                  icon: "⚡"
                },
                { 
                  title: "Responsive", 
                  description: "Works perfectly on desktop, tablet, and mobile devices.",
                  icon: "📱"
                },
                { 
                  title: "Dark Mode", 
                  description: "Beautiful dark theme that&apos;s easy on your eyes.",
                  icon: "🌙"
                },
                { 
                  title: "Accessible", 
                  description: "Built with accessibility in mind for all users.",
                  icon: "♿"
                },
                { 
                  title: "Open Source", 
                  description: "Transparent, customizable, and community-driven.",
                  icon: "🔓"
                },
              ].map((feature) => (
                <div key={feature.title} className="text-center p-8 rounded-2xl border border-black/10 dark:border-white/10 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-black/70 dark:text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 sm:py-28 bg-black/[.03] dark:bg-white/[.03]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Built for the future</h2>
                <p className="text-lg text-black/70 dark:text-white/70 mb-6">
                  Collector is designed to be simple yet powerful. We believe that great software should be intuitive, fast, and beautiful.
                </p>
                <p className="text-lg text-black/70 dark:text-white/70 mb-8">
                  Whether you&apos;re a developer, designer, or just someone who appreciates well-crafted tools, Collector has something for you.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Next.js 14
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    TypeScript
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Tailwind CSS
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/30 backdrop-blur shadow-lg p-8">
                  <div className="space-y-4">
                    <div className="h-4 w-32 rounded-full bg-indigo-100 dark:bg-indigo-900/40"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                        <div className="text-sm text-black/60 dark:text-white/60">Users</div>
                        <div className="mt-1 text-2xl font-semibold">10k+</div>
                      </div>
                      <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
                        <div className="text-sm text-black/60 dark:text-white/60">Countries</div>
                        <div className="mt-1 text-2xl font-semibold">50+</div>
                      </div>
                    </div>
                    <div className="h-32 rounded-lg bg-gradient-to-tr from-indigo-500/20 to-emerald-400/20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-indigo-500/50 bg-indigo-600/10 p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-lg text-black/70 dark:text-white/70 mb-8">Join thousands of users who trust Collector for their daily workflow.</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="/login" className="inline-flex h-12 items-center rounded-lg bg-indigo-600 px-8 text-white hover:bg-indigo-500 transition text-lg">Get Started</a>
                <a href="#contact" className="inline-flex h-12 items-center rounded-lg border border-black/10 dark:border-white/15 px-8 hover:bg-black/5 dark:hover:bg-white/10 transition text-lg">Contact Us</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-black/5 dark:border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500" />
                <span className="font-semibold text-lg">Collector</span>
              </div>
              <p className="text-black/70 dark:text-white/70">Simple, powerful, and beautiful software for modern workflows.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm">
                <a href="#features" className="block text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">Features</a>
                <a href="#demo" className="block text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">Demo</a>
                <a href="#" className="block text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">Documentation</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="#about" className="block text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">About</a>
                <a href="#contact" className="block text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">Contact</a>
                <a href="#" className="block text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">Blog</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">Twitter</a>
                <a href="#" className="block text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">GitHub</a>
                <a href="#" className="block text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">Discord</a>
              </div>
            </div>
          </div>
          <div className="border-t border-black/5 dark:border-white/10 pt-8 text-center">
            <p className="text-sm text-black/60 dark:text-white/50">© {new Date().getFullYear()} Collector. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
