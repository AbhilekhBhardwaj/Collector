"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { getClients, getGSTRegistered, getTimeEntries } from "@/lib/store";
import { aggregateMonthlyInvoice } from "@/lib/invoice";

function toCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);
}

export default function PrintableInvoicePage() {
  const params = useParams<{ id: string }>();
  // id format: clientId-month-year
  const [clientId, monthStr, yearStr] = (params?.id || "").split("-");
  const month = parseInt(monthStr || "0");
  const year = parseInt(yearStr || "0");
  const client = useMemo(() => getClients().find((c) => c.id === clientId), [clientId]);
  const entries = getTimeEntries();
  const gstReg = getGSTRegistered();
  const invoice = client ? aggregateMonthlyInvoice(client, entries, gstReg, month, year) : null;

  if (!client || !invoice) return <div className="p-6 text-sm">Invoice not found.</div>;

  return (
    <div className="p-6 print:p-0">
      <div className="max-w-3xl mx-auto border border-black/10 dark:border-white/10 rounded-xl p-8 print:border-0">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500" />
            <div>
              <div className="font-semibold">Collector</div>
              <div className="text-xs text-black/60 dark:text-white/60">Freelance invoicing</div>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold">Invoice</div>
            <div>Month {invoice.month}, {invoice.year}</div>
          </div>
        </header>

        <section className="mt-6 grid sm:grid-cols-2 text-sm">
          <div>
            <div className="text-black/60 dark:text-white/60">Bill to</div>
            <div className="font-medium">{client.name}</div>
            <div className="text-black/60 dark:text-white/60">{client.email || ""}</div>
          </div>
          <div className="sm:text-right mt-3 sm:mt-0">
            <div className="text-black/60 dark:text-white/60">From</div>
            <div className="font-medium">Your Name</div>
            <div className="text-black/60 dark:text-white/60">your@email.com</div>
          </div>
        </section>

        <table className="mt-6 w-full text-sm">
          <thead className="text-left border-b border-black/10 dark:border-white/10">
            <tr>
              <th className="py-2 pr-4">Description</th>
              <th className="py-2 pr-4">Hours</th>
              <th className="py-2 pr-4">Rate</th>
              <th className="py-2 pr-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.length > 0 ? invoice.items.map((i, idx) => (
              <tr key={idx} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4">{i.description}</td>
                <td className="py-2 pr-4">{i.hours}</td>
                <td className="py-2 pr-4">{toCurrency(i.rate)}</td>
                <td className="py-2 pr-4 text-right">{toCurrency(i.amount)}</td>
              </tr>
            )) : (
              <tr>
                <td className="py-2 pr-4" colSpan={4}>Monthly retainer</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-2 pr-4" colSpan={3}>Subtotal</td>
              <td className="py-2 pr-4 text-right">{toCurrency(invoice.subtotal)}</td>
            </tr>
            <tr>
              <td className="py-2 pr-4" colSpan={3}>GST</td>
              <td className="py-2 pr-4 text-right">{toCurrency(invoice.gst)}</td>
            </tr>
            <tr>
              <td className="py-2 pr-4" colSpan={3}>TDS</td>
              <td className="py-2 pr-4 text-right">{toCurrency(invoice.tds)}</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-semibold" colSpan={3}>Total</td>
              <td className="py-2 pr-4 text-right font-semibold">{toCurrency(invoice.total)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-8 text-xs text-black/60 dark:text-white/60">
          This invoice is auto-generated. GST 18% applied for domestic clients when GST-registered. TDS at 10% may be withheld by the client when annual payment exceeds ₹30,000.
        </div>

        <div className="mt-6 flex gap-3 print:hidden">
          <button onClick={() => window.print()} className="h-10 px-4 rounded-md border">Print</button>
        </div>
      </div>
    </div>
  );
}


