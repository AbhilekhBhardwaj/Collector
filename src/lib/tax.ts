export type Slab = { upTo: number; rate: number };

// FY 2025–26 New Regime slabs; effective exemption up to 12.75L (12L + 75k std deduction)
// We model this by starting slabs after 12.75L.
export const NEW_REGIME_SLABS: Slab[] = [
  { upTo: 8_00_000, rate: 0.05 }, // kept for reference; will be ignored by effective exemption logic
  { upTo: 12_00_000, rate: 0.1 },
  { upTo: 16_00_000, rate: 0.15 },
  { upTo: 20_00_000, rate: 0.2 },
  { upTo: 24_00_000, rate: 0.25 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
];

export type IncomeTaxResult = {
  taxableIncome: number;
  incomeTax: number;
  effectiveRate: number; // incomeTax / grossReceipts
};

export function calculateGST(params: {
  grossReceipts: number; // total revenue this FY
  domesticReceipts: number; // INR receipts from India clients
  exportReceipts: number; // INR equivalent foreign clients
  specialCategoryState?: boolean; // reduces threshold to 10L
  isRegistered?: boolean; // if user explicitly registered under GST
}): { thresholdExceeded: boolean; gstOwed: number; notes: string[] } {
  const threshold = params.specialCategoryState ? 10_00_000 : 20_00_000;
  const thresholdExceeded = params.grossReceipts >= threshold || !!params.isRegistered;
  const notes: string[] = [];
  if (!thresholdExceeded) notes.push(`GST registration optional until ₹${(threshold / 100000).toFixed(0)}L turnover.`);
  // Services at 18%; exports are zero-rated
  const taxableBase = Math.max(0, params.domesticReceipts);
  const gstOwed = thresholdExceeded ? taxableBase * 0.18 : 0;
  if (params.exportReceipts > 0) notes.push("Exports are zero-rated under GST.");
  return { thresholdExceeded, gstOwed, notes };
}

export function calculateTDS(paymentsByClient: { clientId: string; amount: number }[]): {
  tdsWithheld: number;
  clientsDeducting: string[];
  notes: string[];
} {
  const byClient: Record<string, number> = {};
  for (const p of paymentsByClient) byClient[p.clientId] = (byClient[p.clientId] || 0) + p.amount;
  const clientsDeducting = Object.entries(byClient)
    .filter(([, amt]) => amt > 30_000)
    .map(([id]) => id);
  const tdsWithheld = clientsDeducting.reduce((sum, id) => sum + (byClient[id] * 0.1), 0);
  const notes = [
    "Clients may deduct 10% TDS u/s 194J when annual payment exceeds ₹30,000.",
    "TDS is adjustable/refundable during filing.",
  ];
  return { tdsWithheld, clientsDeducting, notes };
}

export function calculateIncomeTaxNewRegime(taxableIncome: number): number {
  // Effective exemption up to ₹12.75L. If income <= 12.75L => no tax
  if (taxableIncome <= 12_75_000) return 0;
  // Apply standard deduction of ₹75,000 before slabs
  const slabBase = Math.max(0, taxableIncome - 75_000);
  // Compute tax using slabs as per prompt
  const slabs: { limit: number; rate: number }[] = [
    { limit: 4_00_000, rate: 0 },
    { limit: 8_00_000, rate: 0.05 },
    { limit: 12_00_000, rate: 0.1 },
    { limit: 16_00_000, rate: 0.15 },
    { limit: 20_00_000, rate: 0.2 },
    { limit: 24_00_000, rate: 0.25 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.3 },
  ];
  let remaining = slabBase;
  let lastLimit = 0;
  let tax = 0;
  for (const s of slabs) {
    const band = Math.max(0, Math.min(remaining, s.limit - lastLimit));
    tax += band * s.rate;
    remaining -= band;
    lastLimit = s.limit;
    if (remaining <= 0) break;
  }
  return Math.max(0, tax);
}

export function calculatePresumptive44ADA(grossReceipts: number): { presumptiveTaxableIncome: number } {
  return { presumptiveTaxableIncome: grossReceipts * 0.5 };
}

export function getTaxSummary(params: {
  grossReceipts: number;
  domesticReceipts: number;
  exportReceipts: number;
  totalExpenses: number; // deductible expenses
  paymentsByClient: { clientId: string; amount: number }[];
  specialCategoryState?: boolean;
  isGSTRegistered?: boolean;
}): {
  gst: { thresholdExceeded: boolean; gstOwed: number; notes: string[] };
  tds: { tdsWithheld: number; clientsDeducting: string[]; notes: string[] };
  regular: IncomeTaxResult;
  presumptive: IncomeTaxResult & { eligible: boolean };
  recommended: "regular" | "presumptive";
} {
  const gst = calculateGST({
    grossReceipts: params.grossReceipts,
    domesticReceipts: params.domesticReceipts,
    exportReceipts: params.exportReceipts,
    specialCategoryState: params.specialCategoryState,
    isRegistered: params.isGSTRegistered,
  });

  const tds = calculateTDS(params.paymentsByClient);

  const regularTaxableIncome = Math.max(0, params.grossReceipts - params.totalExpenses);
  const regularIncomeTax = calculateIncomeTaxNewRegime(regularTaxableIncome);
  const regular: IncomeTaxResult = {
    taxableIncome: regularTaxableIncome,
    incomeTax: regularIncomeTax,
    effectiveRate: params.grossReceipts > 0 ? regularIncomeTax / params.grossReceipts : 0,
  };

  // Presumptive eligibility: up to ₹50L (₹75L if >95% digital). We assume eligible up to ₹50L here.
  const eligible = params.grossReceipts <= 50_00_000;
  const { presumptiveTaxableIncome } = calculatePresumptive44ADA(params.grossReceipts);
  const presumptiveTax = calculateIncomeTaxNewRegime(presumptiveTaxableIncome);
  const presumptive: IncomeTaxResult & { eligible: boolean } = {
    taxableIncome: presumptiveTaxableIncome,
    incomeTax: presumptiveTax,
    effectiveRate: params.grossReceipts > 0 ? presumptiveTax / params.grossReceipts : 0,
    eligible,
  };

  const recommended = eligible && presumptive.incomeTax < regular.incomeTax ? "presumptive" : "regular";

  return { gst, tds, regular, presumptive, recommended };
}


