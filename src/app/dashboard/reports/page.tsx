"use client";

import { useMemo, useState } from "react";

function toCSV(rows: Record<string, string | number>[]) {
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => r[h]).join(","))];
  return lines.join("\n");
}

export default function ReportsPage() {
  const [quarter, setQuarter] = useState("Q1");
  const data = useMemo(() => (
    [
      { metric: "Hours", value: 186 },
      { metric: "Invoices", value: 8 },
      { metric: "Revenue", value: 320000 },
      { metric: "GST Owed", value: 46000 },
      { metric: "Expenses", value: 74000 },
    ]
  ), []);

  function downloadCSV() {
    const csv = toCSV(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `collector-${quarter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Reports</h1>
      <p className="mt-1 text-black/70 dark:text-white/70">Download CSV/PDF quarterly summaries for your CA.</p>
      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm">Quarter</label>
        <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3">
          <option>Q1</option>
          <option>Q2</option>
          <option>Q3</option>
          <option>Q4</option>
        </select>
        <button onClick={downloadCSV} className="h-10 px-4 rounded-md border">Download CSV</button>
        <button className="h-10 px-4 rounded-md border">Export PDF</button>
      </div>

      <div className="mt-6 rounded-xl border border-black/10 dark:border-white/10 p-5">
        <div className="grid sm:grid-cols-5 gap-4 text-sm">
          {data.map((d) => (
            <div key={d.metric} className="rounded-lg border border-black/10 dark:border-white/10 p-4">
              <div className="text-black/60 dark:text-white/60">{d.metric}</div>
              <div className="mt-1 text-lg font-semibold">{d.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


