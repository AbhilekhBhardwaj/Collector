"use client";

import { useMemo, useState } from "react";
import { getTaxSummary } from "@/lib/tax";

function toCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function TaxOverviewPage() {
  const [gross, setGross] = useState(12_00_000);
  const [domestic, setDomestic] = useState(10_00_000);
  const [exports, setExports] = useState(2_00_000);
  const [expenses, setExpenses] = useState(2_50_000);
  const [specialCat, setSpecialCat] = useState(false);
  const [gstReg, setGstReg] = useState(false);

  const summary = useMemo(() =>
    getTaxSummary({
      grossReceipts: gross,
      domesticReceipts: domestic,
      exportReceipts: exports,
      totalExpenses: expenses,
      paymentsByClient: [
        { clientId: "Alpha Ltd.", amount: 45_000 },
        { clientId: "Beta LLC", amount: 1_80_000 },
      ],
      specialCategoryState: specialCat,
      isGSTRegistered: gstReg,
    }), [gross, domestic, exports, expenses, specialCat, gstReg]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Tax Overview</h1>
      <p className="mt-1 text-black/70 dark:text-white/70">Auto-calculated GST, simulated TDS, and income tax (new regime). Suggests Section 44ADA when beneficial.</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <label className="text-sm">Gross receipts (FY)</label>
          <input type="number" value={gross} onChange={(e) => setGross(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Domestic receipts</label>
          <input type="number" value={domestic} onChange={(e) => setDomestic(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Export receipts</label>
          <input type="number" value={exports} onChange={(e) => setExports(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Expenses (deductible)</label>
          <input type="number" value={expenses} onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm">Special category state?</label>
          <input type="checkbox" checked={specialCat} onChange={(e) => setSpecialCat(e.target.checked)} />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm">GST registered?</label>
          <input type="checkbox" checked={gstReg} onChange={(e) => setGstReg(e.target.checked)} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">GST</div>
          <div className="mt-1 text-lg font-semibold">{summary.gst.thresholdExceeded ? toCurrency(summary.gst.gstOwed) : "Optional/Not applicable"}</div>
          <ul className="mt-3 text-sm list-disc pl-5 text-black/70 dark:text-white/70">
            {summary.gst.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">TDS (simulated)</div>
          <div className="mt-1 text-lg font-semibold">{toCurrency(summary.tds.tdsWithheld)}</div>
          <div className="mt-2 text-sm">Clients deducting: {summary.tds.clientsDeducting.join(", ") || "None"}</div>
          <ul className="mt-3 text-sm list-disc pl-5 text-black/70 dark:text-white/70">
            {summary.tds.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">Regular (new regime)</div>
          <div className="mt-1 text-lg font-semibold">Tax: {toCurrency(summary.regular.incomeTax)}</div>
          <div className="text-sm">Taxable income: {toCurrency(summary.regular.taxableIncome)}</div>
          <div className="text-sm">Effective rate: {(summary.regular.effectiveRate * 100).toFixed(1)}%</div>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5">
          <div className="text-sm text-black/60 dark:text-white/60">Presumptive (Sec 44ADA)</div>
          <div className="mt-1 text-lg font-semibold">Tax: {toCurrency(summary.presumptive.incomeTax)}</div>
          <div className="text-sm">Taxable income: {toCurrency(summary.presumptive.taxableIncome)}</div>
          <div className="text-sm">Effective rate: {(summary.presumptive.effectiveRate * 100).toFixed(1)}%</div>
          <div className="mt-2 text-sm">Eligible: {summary.presumptive.eligible ? "Yes" : "No"}</div>
        </div>
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-5 sm:col-span-2 lg:col-span-1">
          <div className="text-sm text-black/60 dark:text-white/60">Recommendation</div>
          <div className="mt-1 text-lg font-semibold capitalize">{summary.recommended} regime recommended</div>
          <p className="mt-2 text-sm text-black/70 dark:text-white/70">This is a simplified educational estimate. Consult a CA for final filing.</p>
        </div>
      </div>
    </div>
  );
}


