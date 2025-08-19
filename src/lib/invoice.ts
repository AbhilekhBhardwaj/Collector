import { StoredClient, TimeEntry } from "./store";

export type AggregatedInvoice = {
  clientId: string;
  clientName: string;
  month: number; // 1-12
  year: number;
  items: { description: string; hours: number; rate: number; amount: number }[];
  subtotal: number;
  gst: number;
  tds: number;
  total: number;
};

function monthFromDate(date: string) {
  const d = new Date(date + "T00:00:00");
  return { month: d.getMonth() + 1, year: d.getFullYear() };
}

export function aggregateMonthlyInvoice(
  client: StoredClient,
  entries: TimeEntry[],
  gstRegistered: boolean,
  targetMonth: number,
  targetYear: number
): AggregatedInvoice {
  const relevant = entries.filter((e) => e.clientId === client.id).filter((e) => {
    const { month, year } = monthFromDate(e.date);
    return month === targetMonth && year === targetYear;
  });

  const items = relevant.map((e) => ({
    description: e.description,
    hours: e.hours,
    rate: e.rate,
    amount: Math.round(e.hours * e.rate),
  }));
  const subtotalFromTime = items.reduce((s, i) => s + i.amount, 0);
  let base = subtotalFromTime;
  if (client.billingModel === "Monthly") base = client.amount;
  if (client.billingModel === "Project") base = client.amount; // fixed per project period
  const gst = client.domestic && gstRegistered ? Math.round(base * 0.18) : 0;
  // Compute YTD receipts for TDS eligibility
  const ytd = entries
    .filter((e) => {
      const d = new Date(e.date + "T00:00:00");
      return d.getFullYear() === targetYear && d.getMonth() + 1 <= targetMonth;
    })
    .filter((e) => e.clientId === client.id)
    .reduce((s, e) => s + Math.round(e.hours * e.rate), 0);
  const annualized = client.billingModel === "Monthly" ? client.amount * 12 : ytd;
  const tds = client.tdsDeducts && annualized > 30_000 ? Math.round(base * 0.1) : 0;
  const total = base + gst - tds;

  return {
    clientId: client.id,
    clientName: client.name,
    month: targetMonth,
    year: targetYear,
    items,
    subtotal: base,
    gst,
    tds,
    total,
  };
}


