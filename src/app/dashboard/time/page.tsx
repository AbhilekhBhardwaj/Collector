"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MiniBar from "@/components/MiniBar";

type TimerEntry = {
  id: string;
  project: string;
  task: string;
  startedAt: number; // epoch ms
  stoppedAt?: number; // epoch ms
};

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export default function TimeTrackerPage() {
  const [project, setProject] = useState("General");
  const [task, setTask] = useState("");
  const [entries, setEntries] = useState<TimerEntry[]>([]);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [, force] = useState(0);
  const tick = useRef<number | null>(null);

  useEffect(() => {
    if (runningId) {
      tick.current = window.setInterval(() => force((n) => n + 1), 1000);
    }
    return () => {
      if (tick.current) window.clearInterval(tick.current);
    };
  }, [runningId]);

  function startTimer() {
    if (runningId) return;
    const id = crypto.randomUUID();
    setEntries((e) => [{ id, project, task, startedAt: Date.now() }, ...e]);
    setRunningId(id);
  }

  function stopTimer() {
    if (!runningId) return;
    setEntries((e) => e.map((x) => (x.id === runningId ? { ...x, stoppedAt: Date.now() } : x)));
    setRunningId(null);
  }

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dayMs = entries.reduce((sum, e) => {
    const end = e.stoppedAt ?? Date.now();
    if (e.startedAt < startOfDay) return sum;
    return sum + Math.max(0, end - e.startedAt);
  }, 0);

  const weeklyMs = useMemo(() => {
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const startWeek = monday.getTime();
    return entries.reduce((sum, e) => {
      const end = e.stoppedAt ?? Date.now();
      if (e.startedAt < startWeek) return sum;
      return sum + Math.max(0, end - e.startedAt);
    }, 0);
  }, [entries]);

  const weekBars = useMemo(() => {
    const dayMs: number[] = Array(7).fill(0);
    const base = new Date(today);
    const day = today.getDay();
    base.setDate(today.getDate() - ((day + 6) % 7));
    base.setHours(0, 0, 0, 0);
    for (const e of entries) {
      const s = new Date(e.startedAt);
      const idx = Math.floor((s.getTime() - base.getTime()) / (24 * 3600 * 1000));
      if (idx >= 0 && idx < 7) {
        const end = e.stoppedAt ?? Date.now();
        dayMs[idx] += Math.max(0, end - e.startedAt);
      }
    }
    // convert ms to hours with one decimal
    const hours = dayMs.map((ms) => Math.round((ms / 3600000) * 10) / 10);
    const labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    return { hours, labels };
  }, [entries]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Time Tracker</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_auto] items-end">
        <div className="grid gap-2">
          <label className="text-sm">Project</label>
          <input value={project} onChange={(e) => setProject(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" placeholder="Project" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Task</label>
          <input value={task} onChange={(e) => setTask(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" placeholder="What are you working on?" />
        </div>
        <div className="flex gap-3">
          {!runningId ? (
            <button onClick={startTimer} className="h-10 px-4 rounded-md bg-indigo-600 text-white">Start</button>
          ) : (
            <button onClick={stopTimer} className="h-10 px-4 rounded-md border border-indigo-500 text-indigo-600 dark:text-indigo-300">Stop</button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">Today</div>
          <div className="mt-1 text-2xl font-semibold">{formatDuration(dayMs)}</div>
          <div className="mt-4 h-24 rounded-md bg-gradient-to-tr from-indigo-500/20 to-emerald-400/20" />
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">This week</div>
          <div className="mt-1 text-2xl font-semibold">{formatDuration(weeklyMs)}</div>
          <MiniBar className="mt-4" values={weekBars.hours} labels={weekBars.labels} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Entries</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b border-black/10 dark:border-white/10">
              <tr>
                <th className="py-2 pr-4">Project</th>
                <th className="py-2 pr-4">Task</th>
                <th className="py-2 pr-4">Started</th>
                <th className="py-2 pr-4">Stopped</th>
                <th className="py-2 pr-4">Duration</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => {
                const end = e.stoppedAt ?? Date.now();
                return (
                  <tr key={e.id} className="border-b border-black/5 dark:border-white/5">
                    <td className="py-2 pr-4">{e.project}</td>
                    <td className="py-2 pr-4">{e.task || "—"}</td>
                    <td className="py-2 pr-4">{new Date(e.startedAt).toLocaleString()}</td>
                    <td className="py-2 pr-4">{e.stoppedAt ? new Date(e.stoppedAt).toLocaleString() : "Running"}</td>
                    <td className="py-2 pr-4">{formatDuration(Math.max(0, end - e.startedAt))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


