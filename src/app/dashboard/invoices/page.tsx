"use client";

import { useMemo, useState } from "react";

type Invoice = {
  id: string;
  client: string;
  date: string;
  items: { description: string; hours: number; rate: number }[];
  paid: boolean;
};

function toCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [client, setClient] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [hours, setHours] = useState(1);
  const [rate, setRate] = useState(1500);

  function addItem() {
    if (!client || !itemDesc) return;
    const id = crypto.randomUUID();
    setInvoices((arr) => [
      {
        id,
        client,
        date: new Date().toISOString().slice(0, 10),
        items: [{ description: itemDesc, hours, rate }],
        paid: false,
      },
      ...arr,
    ]);
    setItemDesc("");
  }

  function total(inv: Invoice) {
    return inv.items.reduce((s, it) => s + it.hours * it.rate, 0);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Invoices</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-4">
        <div className="grid gap-2">
          <label className="text-sm">Client</label>
          <input value={client} onChange={(e) => setClient(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" placeholder="Client name" />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <label className="text-sm">Item</label>
          <input value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" placeholder="Work description" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-2">
            <label className="text-sm">Hours</label>
            <input type="number" value={hours} onChange={(e) => setHours(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Rate (₹/hr)</label>
            <input type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <button onClick={addItem} className="h-10 px-4 rounded-md bg-indigo-600 text-white">Create Invoice</button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-black/10 dark:border-white/10">
            <tr>
              <th className="py-2 pr-4">Client</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Items</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4">{inv.client}</td>
                <td className="py-2 pr-4">{inv.date}</td>
                <td className="py-2 pr-4">{inv.items.map((i) => `${i.description} (${i.hours}h × ₹${i.rate})`).join(", ")}</td>
                <td className="py-2 pr-4">{toCurrency(total(inv))}</td>
                <td className="py-2 pr-4 flex gap-2">
                  <button className="px-3 h-8 rounded-md border">Export PDF</button>
                  <button className="px-3 h-8 rounded-md border">Mark Paid</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


