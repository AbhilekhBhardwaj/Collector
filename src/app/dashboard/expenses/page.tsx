"use client";

import { useMemo, useState } from "react";

type Expense = { id: string; category: string; amount: number; note?: string; date: string };

function toCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "e1", category: "Internet", amount: 1200, date: new Date().toISOString().slice(0, 10) },
    { id: "e2", category: "Subscriptions", amount: 899, date: new Date().toISOString().slice(0, 10) },
  ]);
  const [category, setCategory] = useState("Laptop");
  const [amount, setAmount] = useState(50000);
  const [note, setNote] = useState("");

  function add() {
    if (!amount || amount <= 0) return;
    setExpenses((arr) => [
      { id: crypto.randomUUID(), category, amount, note, date: new Date().toISOString().slice(0, 10) },
      ...arr,
    ]);
    setAmount(0);
    setNote("");
  }

  const total = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Expenses</h1>
      <p className="mt-1 text-black/70 dark:text-white/70">Track expenses like laptop, internet, and subscriptions. Deductions auto-aggregate.</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-4 items-end">
        <div className="grid gap-2">
          <label className="text-sm">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <label className="text-sm">Note (optional)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
        </div>
      </div>
      <div className="mt-3">
        <button onClick={add} className="h-10 px-4 rounded-md bg-indigo-600 text-white">Add Expense</button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">Total deductions (FY)</div>
          <div className="mt-1 text-2xl font-semibold">{toCurrency(total)}</div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-black/10 dark:border-white/10">
            <tr>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Note</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4">{e.date}</td>
                <td className="py-2 pr-4">{e.category}</td>
                <td className="py-2 pr-4">{toCurrency(e.amount)}</td>
                <td className="py-2 pr-4">{e.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


