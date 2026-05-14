/**
 * SANITIZED PORTFOLIO EXAMPLE
 *
 * Это упрощённый пример operational utilities для демонстрации архитектурного подхода.
 * Реальная реализация содержит дополнительные формatters, локализацию и edge cases.
 * Реальные данные и бизнес-правила удалены.
 */

// Money utilities - работа с деньгами
export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "0 ₽";
  }

  return `${new Intl.NumberFormat("ru-RU").format(Math.round(value))} ₽`;
}

export function parsePrice(value: string): number {
  const cleaned = value.replace(/[^\d.,-]/g, "").replace(",", ".");
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

// Date/time utilities - работа с датами
export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateOnly(value: Date | string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateKey(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

// Vehicle utilities - работа с автомобилями
export function buildCarLabel(input: {
  brand?: string | null;
  model?: string | null;
  plateNumber?: string | null;
}): string {
  const brandModel = [input.brand, input.model].filter(Boolean).join(" ").trim();
  return brandModel || "Не указан";
}

export function formatVehicleDisplay(input: {
  brand?: string | null;
  model?: string | null;
  plateNumber?: string | null;
}): string {
  const carLabel = buildCarLabel(input);
  const plate = input.plateNumber?.trim();
  return plate ? `${carLabel} (${plate})` : carLabel;
}

// Client utilities - работа с клиентами
export function getClientDisplayName(input: {
  anonymous?: boolean | null;
  organizationName?: string | null;
  name?: string | null;
}): string {
  if (input.anonymous) {
    return "Анонимный клиент";
  }

  if (input.organizationName?.trim()) {
    return input.organizationName.trim();
  }

  return input.name?.trim() || "Не указан";
}

export function buildClientDisplay(input: {
  anonymous?: boolean | null;
  name?: string | null;
  contactLabel?: string | null;
}): string {
  const baseLabel = getClientDisplayName(input);
  return input.contactLabel?.trim() ? `${baseLabel} · ${input.contactLabel.trim()}` : baseLabel;
}

// Payment utilities - работа с оплатами
export function getPaymentMethodLabel(paymentMethod: string | null | undefined): string | null {
  switch (paymentMethod) {
    case "cash":
      return "Наличные";
    case "card":
      return "Карта";
    case "transfer":
      return "Перевод на карту";
    default:
      return null;
  }
}

// Duration utilities - работа с длительностью
export function formatDurationLabel(start: Date | string, end: Date | string | null | undefined): string {
  if (!end) {
    return "—";
  }

  const startDate = start instanceof Date ? start : new Date(start);
  const endDate = end instanceof Date ? end : new Date(end);
  const diffMinutes = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 60000));

  // Русское склонение "минута/минуты/минут"
  if (diffMinutes % 10 === 1 && diffMinutes % 100 !== 11) {
    return `${diffMinutes} минута`;
  }

  if (
    diffMinutes % 10 >= 2 &&
    diffMinutes % 10 <= 4 &&
    (diffMinutes % 100 < 12 || diffMinutes % 100 > 14)
  ) {
    return `${diffMinutes} минуты`;
  }

  return `${diffMinutes} минут`;
}

// Shift utilities - работа со сменами
export function formatShiftLabel(number: number, openedAt: Date | string): string {
  const date = openedAt instanceof Date ? openedAt : new Date(openedAt);

  return `№${number} от ${new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)}`;
}

// Примеры использования
const price = formatPrice(2400);
const dateLabel = formatDateTime(new Date());
const carLabel = buildCarLabel({ brand: "Toyota", model: "Camry", plateNumber: "DEMO-001" });
const clientDisplay = buildClientDisplay({ name: "Demo Client", contactLabel: "demo-contact" });
