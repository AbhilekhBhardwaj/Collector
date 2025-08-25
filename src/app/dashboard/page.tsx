"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
    image?: string;
    stats?: {
      totalClients: number;
      totalInvoices: number;
      totalHours: number;
    };
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      // Fetch user-specific data
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/user/stats');
          if (response.ok) {
            const stats = await response.json();
            setUserData({
              name: session.user?.name || undefined,
              email: session.user?.email || undefined,
              image: session.user?.image || undefined,
              stats
            });
          } else {
            // Fallback to default data
            setUserData({
              name: session.user?.name || undefined,
              email: session.user?.email || undefined,
              image: session.user?.image || undefined,
              stats: {
                totalClients: 0,
                totalInvoices: 0,
                totalHours: 0,
              }
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to default data
          setUserData({
            name: session.user?.name || undefined,
            email: session.user?.email || undefined,
            image: session.user?.image || undefined,
            stats: {
              totalClients: 0,
              totalInvoices: 0,
              totalHours: 0,
            }
          });
        }
      };

      fetchUserData();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-black/70 dark:text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[hsl(220,20%,96%)] dark:to-[hsl(220,20%,8%)]">
      <header className="border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500" />
            <span className="font-semibold text-lg">Collector</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {userData?.image && (
                <Image 
                  src={userData.image} 
                  alt={userData.name || "User"} 
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm font-medium">{userData?.name}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {userData?.name?.split(' ')[0]}!</h1>
          <p className="text-black/70 dark:text-white/70 mt-2">Here&apos;s your dashboard overview.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-black/30 backdrop-blur">
            <div className="text-sm text-black/60 dark:text-white/60">Total Clients</div>
            <div className="mt-2 text-3xl font-bold">{userData?.stats?.totalClients || 0}</div>
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-black/30 backdrop-blur">
            <div className="text-sm text-black/60 dark:text-white/60">Total Invoices</div>
            <div className="mt-2 text-3xl font-bold">{userData?.stats?.totalInvoices || 0}</div>
          </div>
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-black/30 backdrop-blur">
            <div className="text-sm text-black/60 dark:text-white/60">Hours Tracked</div>
            <div className="mt-2 text-3xl font-bold">{userData?.stats?.totalHours || 0}h</div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-black/30 backdrop-blur hover:shadow-lg transition-all duration-300">
            <div className="text-2xl mb-3">⏱️</div>
            <h3 className="text-lg font-semibold mb-2">Time Tracking</h3>
            <p className="text-sm text-black/70 dark:text-white/70 mb-4">Track your work hours and manage projects.</p>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Coming soon</button>
          </div>
          
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-black/30 backdrop-blur hover:shadow-lg transition-all duration-300">
            <div className="text-2xl mb-3">📄</div>
            <h3 className="text-lg font-semibold mb-2">Invoices</h3>
            <p className="text-sm text-black/70 dark:text-white/70 mb-4">Create and manage professional invoices.</p>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Coming soon</button>
          </div>
          
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-black/30 backdrop-blur hover:shadow-lg transition-all duration-300">
            <div className="text-2xl mb-3">👥</div>
            <h3 className="text-lg font-semibold mb-2">Clients</h3>
            <p className="text-sm text-black/70 dark:text-white/70 mb-4">Manage your client relationships.</p>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Coming soon</button>
          </div>
          
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-black/30 backdrop-blur hover:shadow-lg transition-all duration-300">
            <div className="text-2xl mb-3">💰</div>
            <h3 className="text-lg font-semibold mb-2">Tax Overview</h3>
            <p className="text-sm text-black/70 dark:text-white/70 mb-4">Track GST, TDS, and income tax.</p>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Coming soon</button>
          </div>
          
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-black/30 backdrop-blur hover:shadow-lg transition-all duration-300">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">Reports</h3>
            <p className="text-sm text-black/70 dark:text-white/70 mb-4">Generate reports and analytics.</p>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Coming soon</button>
          </div>
          
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-black/30 backdrop-blur hover:shadow-lg transition-all duration-300">
            <div className="text-2xl mb-3">⚙️</div>
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-sm text-black/70 dark:text-white/70 mb-4">Configure your account preferences.</p>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Coming soon</button>
          </div>
        </div>
      </main>
    </div>
  );
}
