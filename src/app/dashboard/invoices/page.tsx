"use client";

import { useMemo, useState } from "react";
import { aggregateMonthlyInvoice } from "@/lib/invoice";
import MiniBar from "@/components/MiniBar";
import { getClients, getGSTRegistered, getTimeEntries } from "@/lib/store";

function toCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function InvoicesPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const data = useMemo(() => {
    const clients = getClients();
    const entries = getTimeEntries();
    const gstRegistered = getGSTRegistered();
    return clients.map((c) => aggregateMonthlyInvoice(c, entries, gstRegistered, month, year));
  }, [month, year]);

  const grand = useMemo(() => data.reduce((acc, inv) => {
    acc.subtotal += inv.subtotal;
    acc.gst += inv.gst;
    acc.tds += inv.tds;
    acc.total += inv.total;
    return acc;
  }, { subtotal: 0, gst: 0, tds: 0, total: 0 }), [data]);

  function openPrintable(invId: string) {
    window.open(`/dashboard/invoices/${invId}/print`, "_blank");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Invoices</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5 sm:col-span-2">
          <div className="text-sm text-black/60 dark:text-white/60">Totals composition</div>
          <MiniBar className="mt-3" values={[grand.subtotal, grand.gst, grand.tds, grand.total]} labels={["Subt","GST","TDS","Total"]} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm">Month</label>
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <label className="text-sm">Year</label>
        <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value) || year)} className="h-10 w-24 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-black/10 dark:border-white/10">
            <tr>
              <th className="py-2 pr-4">Client</th>
              <th className="py-2 pr-4">Items</th>
              <th className="py-2 pr-4">Subtotal</th>
              <th className="py-2 pr-4">GST</th>
              <th className="py-2 pr-4">TDS</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((inv) => (
              <tr key={`${inv.clientId}-${month}-${year}`} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4 font-medium">{inv.clientName}</td>
                <td className="py-2 pr-4">{inv.items.length > 0 ? inv.items.map((i) => `${i.description} (${i.hours}h × ₹${i.rate})`).join(", ") : "Monthly retainer"}</td>
                <td className="py-2 pr-4">{toCurrency(inv.subtotal)}</td>
                <td className="py-2 pr-4">{toCurrency(inv.gst)}</td>
                <td className="py-2 pr-4">{toCurrency(inv.tds)}</td>
                <td className="py-2 pr-4 font-semibold">{toCurrency(inv.total)}</td>
                <td className="py-2 pr-4 flex gap-2">
                  <button onClick={() => openPrintable(`${inv.clientId}-${month}-${year}`)} className="px-3 h-8 rounded-md border">Print</button>
                  <button className="px-3 h-8 rounded-md border">Mark Paid</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-2 pr-4 font-semibold" colSpan={2}>Grand Total</td>
              <td className="py-2 pr-4 font-semibold">{toCurrency(grand.subtotal)}</td>
              <td className="py-2 pr-4 font-semibold">{toCurrency(grand.gst)}</td>
              <td className="py-2 pr-4 font-semibold">{toCurrency(grand.tds)}</td>
              <td className="py-2 pr-4 font-semibold">{toCurrency(grand.total)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}


