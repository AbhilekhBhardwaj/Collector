"use client";

import { useEffect, useMemo, useState } from "react";

type BillingModel = "Monthly" | "Project";

type Client = {
  id: string;
  name: string;
  email?: string;
  billingModel: BillingModel;
  amount: number; // base amount (before tax)
  domestic: boolean; // true if India client; exports are zero-rated
  tdsDeducts: boolean;
};

function toCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [gstRegistered, setGstRegistered] = useState(false);

  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [billingModel, setBillingModel] = useState<BillingModel>("Monthly");
  const [amount, setAmount] = useState(25000);
  const [domestic, setDomestic] = useState(true);
  const [tds, setTds] = useState(true);

  // load/save localStorage for simple persistence before real auth/db
  useEffect(() => {
    const raw = localStorage.getItem("collector_clients");
    const reg = localStorage.getItem("collector_gst_registered");
    if (reg) setGstRegistered(reg === "true");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Client[];
        setClients(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("collector_clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("collector_gst_registered", String(gstRegistered));
  }, [gstRegistered]);

  function addClient() {
    if (!name || !amount) return;
    setClients((arr) => [
      { id: crypto.randomUUID(), name, email, billingModel, amount, domestic, tdsDeducts: tds },
      ...arr,
    ]);
    setName("");
    setEmail("");
  }

  function removeClient(id: string) {
    setClients((arr) => arr.filter((c) => c.id !== id));
  }

  function calcRow(c: Client) {
    const base = c.amount;
    const annualized = c.billingModel === "Monthly" ? base * 12 : base;
    const gst = c.domestic && gstRegistered ? base * 0.18 : 0;
    const tdsApplies = c.tdsDeducts && annualized > 30_000;
    const tds = tdsApplies ? base * 0.1 : 0;
    const net = base + gst - tds;
    const note = tdsApplies ? "TDS @10% applies (est. >₹30k/yr)" : "TDS likely not applicable (≤₹30k/yr)";
    return { base, gst, tds, net, note };
  }

  const totals = useMemo(() => {
    return clients.reduce(
      (acc, c) => {
        const { base, gst, tds, net } = calcRow(c);
        acc.base += base;
        acc.gst += gst;
        acc.tds += tds;
        acc.net += net;
        return acc;
      },
      { base: 0, gst: 0, tds: 0, net: 0 }
    );
  }, [clients]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Clients & Charges</h1>
      <p className="mt-1 text-black/70 dark:text-white/70">Add clients and see estimated GST/TDS and net receivable per month or per project.</p>

      <div className="mt-4 flex items-center gap-4">
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={gstRegistered} onChange={(e) => setGstRegistered(e.target.checked)} />
          GST registered?
        </label>
        <span className="text-xs text-black/60 dark:text-white/60">Exports are zero-rated; GST applies only for domestic clients.</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-6 items-end">
        <div className="grid gap-2 sm:col-span-2">
          <label className="text-sm">Client name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" placeholder="Acme Corp" />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <label className="text-sm">Email (optional)</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" placeholder="billing@acme.com" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Billing model</label>
          <select value={billingModel} onChange={(e) => setBillingModel(e.target.value as BillingModel)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3">
            <option>Monthly</option>
            <option>Project</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Amount (₹)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm">Domestic?</label>
          <input type="checkbox" checked={domestic} onChange={(e) => setDomestic(e.target.checked)} />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm">Deducts TDS?</label>
          <input type="checkbox" checked={tds} onChange={(e) => setTds(e.target.checked)} />
        </div>
      </div>
      <div className="mt-3">
        <button onClick={addClient} className="h-10 px-4 rounded-md bg-indigo-600 text-white">Add Client</button>
      </div>

      <div className="mt-6 rounded-xl border border-black/10 dark:border-white/10 p-5">
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <div className="text-black/60 dark:text-white/60 text-sm">Base</div>
            <div className="text-xl font-semibold">{toCurrency(totals.base)}</div>
          </div>
          <div>
            <div className="text-black/60 dark:text-white/60 text-sm">GST</div>
            <div className="text-xl font-semibold">{toCurrency(totals.gst)}</div>
          </div>
          <div>
            <div className="text-black/60 dark:text-white/60 text-sm">TDS</div>
            <div className="text-xl font-semibold">{toCurrency(totals.tds)}</div>
          </div>
          <div>
            <div className="text-black/60 dark:text-white/60 text-sm">Net receivable</div>
            <div className="text-xl font-semibold">{toCurrency(totals.net)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b border-black/10 dark:border-white/10">
            <tr>
              <th className="py-2 pr-4">Client</th>
              <th className="py-2 pr-4">Model</th>
              <th className="py-2 pr-4">Base</th>
              <th className="py-2 pr-4">GST</th>
              <th className="py-2 pr-4">TDS</th>
              <th className="py-2 pr-4">Net</th>
              <th className="py-2 pr-4">Notes</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => {
              const r = calcRow(c);
              return (
                <tr key={c.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="py-2 pr-4">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-black/60 dark:text-white/60">{c.email || "—"}</div>
                  </td>
                  <td className="py-2 pr-4">{c.billingModel}</td>
                  <td className="py-2 pr-4">{toCurrency(r.base)}</td>
                  <td className="py-2 pr-4">{toCurrency(r.gst)}</td>
                  <td className="py-2 pr-4">{toCurrency(r.tds)}</td>
                  <td className="py-2 pr-4">{toCurrency(r.net)}</td>
                  <td className="py-2 pr-4 text-black/60 dark:text-white/60">{r.note}</td>
                  <td className="py-2 pr-4">
                    <button onClick={() => removeClient(c.id)} className="px-3 h-8 rounded-md border">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


