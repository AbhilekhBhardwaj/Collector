"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getClients,
  setClients,
  getGSTRegistered,
  setGSTRegistered,
  getTimeEntries,
  setTimeEntries,
  type StoredClient,
  type TimeEntry,
  type BillingModel,
} from "@/lib/store";

function toCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function ClientsPage() {
  const [clients, setClientState] = useState<StoredClient[]>([]);
  const [gstRegistered, setGstRegisteredState] = useState(false);
  const [timeEntries, setTimeEntriesState] = useState<TimeEntry[]>([]);

  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [billingModel, setBillingModel] = useState<BillingModel>("Hourly");
  const [amount, setAmount] = useState(25000);
  const [domestic, setDomestic] = useState(true);
  const [tds, setTds] = useState(true);
  const [defaultRate, setDefaultRate] = useState<number>(1500);
  // log work form
  const [workClientId, setWorkClientId] = useState<string>("");
  const [workDesc, setWorkDesc] = useState("");
  const [workDate, setWorkDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [workHours, setWorkHours] = useState<number>(2);
  const [workRate, setWorkRate] = useState<number>(1500);

  // load/save localStorage for simple persistence before real auth/db
  useEffect(() => {
    setClientState(getClients());
    setGstRegisteredState(getGSTRegistered());
    setTimeEntriesState(getTimeEntries());
  }, []);

  useEffect(() => {
    setClients(clients);
  }, [clients]);

  useEffect(() => {
    setGSTRegistered(gstRegistered);
  }, [gstRegistered]);

  useEffect(() => {
    setTimeEntries(timeEntries);
  }, [timeEntries]);

  function addClient() {
    if (!name || !amount) return;
    setClientState((arr) => [
      { id: crypto.randomUUID(), name, email, billingModel, amount, domestic, tdsDeducts: tds, createdAt: new Date().toISOString().slice(0,10), defaultRate },
      ...arr,
    ]);
    setName("");
    setEmail("");
  }

  function removeClient(id: string) {
    setClientState((arr) => arr.filter((c) => c.id !== id));
  }

  function editClient(id: string, updates: Partial<StoredClient>) {
    setClientState((arr) => arr.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }

  function removeEntry(id: string) {
    setTimeEntriesState((arr) => arr.filter((e) => e.id !== id));
  }

  function calcRow(c: StoredClient) {
    // Monthly base depends on billing model
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    let base = c.amount;
    if (c.billingModel === "Hourly") {
      base = timeEntries
        .filter((t) => t.clientId === c.id)
        .filter((t) => {
          const d = new Date(t.date + "T00:00:00");
          return d.getMonth() + 1 === thisMonth && d.getFullYear() === thisYear;
        })
        .reduce((s, t) => s + Math.round(t.hours * t.rate), 0);
    }
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

  function logWork() {
    if (!workClientId || !workDesc || workHours <= 0 || workRate <= 0) return;
    setTimeEntriesState((arr) => [
      {
        id: crypto.randomUUID(),
        clientId: workClientId,
        description: workDesc,
        date: workDate,
        hours: workHours,
        rate: workRate,
      },
      ...arr,
    ]);
    setWorkDesc("");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Clients & Charges</h1>
      <p className="mt-1 text-black/70 dark:text-white/70">Add clients and see estimated GST/TDS and net receivable per month or per project.</p>

      <div className="mt-4 flex items-center gap-4">
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" checked={gstRegistered} onChange={(e) => setGstRegisteredState(e.target.checked)} />
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
            <option>Hourly</option>
            <option>Monthly</option>
            <option>Project</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Amount (₹)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Default rate (₹/hr)</label>
          <input type="number" value={defaultRate} onChange={(e) => setDefaultRate(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
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

      <div className="mt-8 rounded-xl border border-black/10 dark:border-white/10 p-5">
        <h2 className="text-lg font-semibold">Log Work</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-6 items-end">
          <div className="grid gap-2 sm:col-span-2">
            <label className="text-sm">Client</label>
            <select value={workClientId} onChange={(e) => setWorkClientId(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3">
              <option value="">Select client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <label className="text-sm">Work description</label>
            <input value={workDesc} onChange={(e) => setWorkDesc(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" placeholder="Feature build / Design / Consulting" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Date</label>
            <input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Hours</label>
            <input type="number" value={workHours} onChange={(e) => setWorkHours(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Rate (₹/hr)</label>
            <input type="number" value={workRate} onChange={(e) => setWorkRate(parseFloat(e.target.value) || 0)} className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3" />
          </div>
        </div>
        <div className="mt-3">
          <button onClick={logWork} className="h-10 px-4 rounded-md bg-indigo-600 text-white">Add Entry</button>
        </div>
        {timeEntries.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left border-b border-black/10 dark:border-white/10">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Client</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Hours</th>
                  <th className="py-2 pr-4">Rate</th>
                  <th className="py-2 pr-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.map((t) => {
                  const client = clients.find((c) => c.id === t.clientId);
                  return (
                    <tr key={t.id} className="border-b border-black/5 dark:border-white/5">
                      <td className="py-2 pr-4">{t.date}</td>
                      <td className="py-2 pr-4">{client?.name || "—"}</td>
                      <td className="py-2 pr-4">
                        <input value={t.description} onChange={(e) => setTimeEntriesState((arr) => arr.map((x) => x.id === t.id ? { ...x, description: e.target.value } : x))} className="h-8 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 text-sm w-56" />
                      </td>
                      <td className="py-2 pr-4">
                        <input type="number" value={t.hours} onChange={(e) => setTimeEntriesState((arr) => arr.map((x) => x.id === t.id ? { ...x, hours: parseFloat(e.target.value) || 0 } : x))} className="h-8 w-20 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 text-sm" />
                      </td>
                      <td className="py-2 pr-4">
                        <input type="number" value={t.rate} onChange={(e) => setTimeEntriesState((arr) => arr.map((x) => x.id === t.id ? { ...x, rate: parseInt(e.target.value || "0") } : x))} className="h-8 w-24 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 text-sm" />
                      </td>
                      <td className="py-2 pr-4">{toCurrency(Math.round(t.hours * t.rate))}</td>
                      <td className="py-2 pr-4 text-right">
                        <button onClick={() => removeEntry(t.id)} className="px-3 h-8 rounded-md border">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
                  <td className="py-2 pr-4">
                    <select value={c.billingModel} onChange={(e) => editClient(c.id, { billingModel: e.target.value as BillingModel })} className="h-8 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 text-sm">
                      <option>Hourly</option>
                      <option>Monthly</option>
                      <option>Project</option>
                    </select>
                  </td>
                  <td className="py-2 pr-4">
                    <input type="number" value={c.amount} onChange={(e) => editClient(c.id, { amount: parseInt(e.target.value || "0") })} className="h-8 w-28 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-2 text-sm" />
                  </td>
                  <td className="py-2 pr-4">{toCurrency(r.gst)}</td>
                  <td className="py-2 pr-4">{toCurrency(r.tds)}</td>
                  <td className="py-2 pr-4">{toCurrency(r.net)}</td>
                  <td className="py-2 pr-4 text-black/60 dark:text-white/60">{r.note}</td>
                  <td className="py-2 pr-4 flex gap-2">
                    <a href={`/dashboard/clients/${c.id}`} className="px-3 h-8 rounded-md border">View</a>
                    <button onClick={() => editClient(c.id, { domestic: !c.domestic })} className="px-3 h-8 rounded-md border" title="Toggle domestic/export">{c.domestic ? "Domestic" : "Export"}</button>
                    <button onClick={() => editClient(c.id, { tdsDeducts: !c.tdsDeducts })} className="px-3 h-8 rounded-md border" title="Toggle TDS">{c.tdsDeducts ? "TDS On" : "TDS Off"}</button>
                    <button onClick={() => editClient(c.id, { name: prompt("Edit name", c.name) || c.name })} className="px-3 h-8 rounded-md border">Edit</button>
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


