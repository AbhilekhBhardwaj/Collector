export type BillingModel = "Hourly" | "Monthly" | "Project";

export type StoredClient = {
  id: string;
  name: string;
  email?: string;
  billingModel: BillingModel;
  amount: number; // Monthly amount for Monthly or fixed project price
  domestic: boolean;
  tdsDeducts: boolean;
  createdAt?: string; // ISO date when client added
  defaultRate?: number; // ₹/hr default for Hourly
};

export type TimeEntry = {
  id: string;
  clientId: string;
  description: string;
  date: string; // YYYY-MM-DD
  hours: number;
  rate: number; // ₹/hr
};

export type Task = {
  id: string;
  clientId: string;
  title: string;
  done: boolean;
  estimateHours?: number;
};

export type Expense = { id: string; category: string; amount: number; note?: string; date: string };

const CLIENTS_KEY = "collector_clients";
const GST_REG_KEY = "collector_gst_registered";
const TIME_KEY = "collector_time_entries";
const TASK_KEY = "collector_tasks";
const EXP_KEY = "collector_expenses";

export function getClients(): StoredClient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLIENTS_KEY);
    return raw ? (JSON.parse(raw) as StoredClient[]) : [];
  } catch {
    return [];
  }
}

export function setClients(clients: StoredClient[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function getGSTRegistered(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GST_REG_KEY) === "true";
}

export function setGSTRegistered(v: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GST_REG_KEY, String(v));
}

export function getTimeEntries(): TimeEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TIME_KEY);
    return raw ? (JSON.parse(raw) as TimeEntry[]) : [];
  } catch {
    return [];
  }
}

export function setTimeEntries(entries: TimeEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TIME_KEY, JSON.stringify(entries));
}

export function getTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TASK_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export function setTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

export function getExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EXP_KEY);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  } catch {
    return [];
  }
}

export function setExpenses(expenses: Expense[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXP_KEY, JSON.stringify(expenses));
}


