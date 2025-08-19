"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getClients, getTimeEntries, getTasks, setTasks, type Task } from "@/lib/store";
import MiniBar from "@/components/MiniBar";

function toCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [tasks, setTasksState] = useState<Task[]>([]);

  const client = useMemo(() => (typeof window !== "undefined" ? getClients().find((c) => c.id === id) : undefined), [id]);
  const entries = useMemo(() => (typeof window !== "undefined" ? getTimeEntries().filter((t) => t.clientId === id) : []), [id]);

  useEffect(() => {
    if (typeof window !== "undefined") setTasksState(getTasks().filter((t) => t.clientId === id));
  }, [id]);

  useEffect(() => {
    if (typeof window !== "undefined") setTasks(tasks);
  }, [tasks]);

  const totalHours = Math.round(entries.reduce((s, e) => s + e.hours, 0) * 10) / 10;
  const totalAmount = entries.reduce((s, e) => s + Math.round(e.hours * e.rate), 0);

  const perDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries) map.set(e.date, (map.get(e.date) || 0) + e.hours);
    const sorted = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    return { labels: sorted.map(([d]) => d.slice(5)), values: sorted.map(([, h]) => Math.round(h * 10) / 10) };
  }, [entries]);

  function addTask(title: string) {
    if (!title) return;
    setTasksState((arr) => [{ id: crypto.randomUUID(), clientId: id!, title, done: false }, ...arr]);
  }

  function toggleTask(tid: string) {
    setTasksState((arr) => arr.map((t) => (t.id === tid ? { ...t, done: !t.done } : t)));
  }

  function removeTask(tid: string) {
    setTasksState((arr) => arr.filter((t) => t.id !== tid));
  }

  const [newTask, setNewTask] = useState("");

  if (!client) return <div className="text-sm">Client not found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{client.name}</h1>
      <p className="mt-1 text-black/70 dark:text-white/70">Added on {client.createdAt || '—'} · Billing: {client.billingModel} {client.billingModel === 'Monthly' || client.billingModel === 'Project' ? `· ${toCurrency(client.amount)}` : client.defaultRate ? `· ₹${client.defaultRate}/hr` : ''}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">Total hours</div>
          <div className="mt-1 text-2xl font-semibold">{totalHours}h</div>
          <MiniBar className="mt-3" values={perDay.values} labels={perDay.labels} />
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">Total billed</div>
          <div className="mt-1 text-2xl font-semibold">{toCurrency(totalAmount)}</div>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">Open tasks</div>
          <div className="mt-1 text-2xl font-semibold">{tasks.filter((t) => !t.done).length}</div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-black/10 dark:border-white/10 p-5">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <div className="mt-3 flex gap-2">
          <input value={newTask} onChange={(e) => setNewTask(e.target.value)} className="h-10 flex-1 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" placeholder="Add a task for this client" />
          <button onClick={() => { addTask(newTask); setNewTask(""); }} className="h-10 px-4 rounded-md bg-indigo-600 text-white">Add</button>
        </div>
        <div className="mt-4 grid gap-2">
          {tasks.map((t) => (
            <label key={t.id} className="flex items-center justify-between rounded-md border border-black/10 dark:border-white/15 px-3 py-2">
              <span className="flex items-center gap-3">
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                <span className={t.done ? "line-through text-black/60 dark:text-white/60" : ""}>{t.title}</span>
              </span>
              <button onClick={() => removeTask(t.id)} className="px-3 h-8 rounded-md border">Delete</button>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}


