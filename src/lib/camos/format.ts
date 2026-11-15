import type { Currency } from "@/lib/camos/types";

const ZONE = "Africa/Kampala";

export function kampalaToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function kampalaShift(days: number): string {
  const [y, m, d] = kampalaToday().split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, (d ?? 1) + days));
  return dt.toISOString().slice(0, 10);
}

export function kampalaHour(): number {
  const h = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hourCycle: "h23",
    timeZone: ZONE,
  }).format(new Date());
  return Number(h);
}

export function salutation(hour = kampalaHour()): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatLongToday(): string {
  return new Intl.DateTimeFormat("en-UG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: ZONE,
  }).format(new Date());
}

export function formatDay(iso: string | null): string {
  if (!iso) return "No date";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(dt);
}

export function formatMonth(key: string): string {
  const [y, m] = key.split("-").map(Number);
  if (!y || !m) return key;
  const dt = new Date(Date.UTC(y, m - 1, 1));
  return new Intl.DateTimeFormat("en-UG", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(dt);
}

export function formatTime(iso: string): string {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "";
  return new Intl.DateTimeFormat("en-UG", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ZONE,
  }).format(dt);
}

export function formatMoney(amount: number, currency: Currency): string {
  if (currency === "UGX") {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function weekDates(anchor = kampalaToday()): string[] {
  const [y, m, d] = anchor.split("-").map(Number);
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(Date.UTC(y, (m ?? 1) - 1, (d ?? 1) + i));
    return dt.toISOString().slice(0, 10);
  });
}

export function weekdayShort(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return new Intl.DateTimeFormat("en-UG", { weekday: "short", timeZone: "UTC" }).format(dt);
}
