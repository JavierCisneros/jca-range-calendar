export type DateRangeValue = {
  from?: Date;
  to?: Date;
};

export type DateInputFormat =
  | "MM/DD/YYYY"
  | "DD/MM/YYYY"
  | "YYYY-MM-DD";

export const DEFAULT_DATE_INPUT_FORMAT: DateInputFormat = "MM/DD/YYYY";

const dateInputMasks: Record<DateInputFormat, string> = {
  "MM/DD/YYYY": "__/__/____",
  "DD/MM/YYYY": "__/__/____",
  "YYYY-MM-DD": "____-__-__",
};

export function getDateInputMask(format: DateInputFormat) {
  return dateInputMasks[format];
}

export type DateInputResult =
  | { status: "empty" }
  | { status: "incomplete" }
  | { status: "invalid" }
  | { status: "valid"; date: Date };

export function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function compareDays(left: Date, right: Date) {
  const leftDay = new Date(
    left.getFullYear(),
    left.getMonth(),
    left.getDate(),
  ).getTime();
  const rightDay = new Date(
    right.getFullYear(),
    right.getMonth(),
    right.getDate(),
  ).getTime();

  return Math.sign(leftDay - rightDay);
}

/**
 * Strictly parse one of the supported public field formats.
 *
 * The round-trip check is intentional: JavaScript normalizes impossible dates
 * such as 02/31/2026 into March instead of rejecting them.
 */
export function parseDateInput(
  value: string,
  format: DateInputFormat = DEFAULT_DATE_INPUT_FORMAT,
): DateInputResult {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return { status: "empty" };
  if (digits.length < 8) return { status: "incomplete" };

  const match =
    format === "YYYY-MM-DD"
      ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
      : /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return { status: "invalid" };

  const [year, month, day] =
    format === "YYYY-MM-DD"
      ? [Number(match[1]), Number(match[2]), Number(match[3])]
      : format === "DD/MM/YYYY"
        ? [Number(match[3]), Number(match[2]), Number(match[1])]
        : [Number(match[3]), Number(match[1]), Number(match[2])];
  const date = new Date(year, month - 1, day);

  if (
    year < 1 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return { status: "invalid" };
  }

  return { status: "valid", date };
}

export function formatDateInput(
  date?: Date,
  format: DateInputFormat = DEFAULT_DATE_INPUT_FORMAT,
) {
  if (!date) return "";

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).padStart(4, "0");
  if (format === "DD/MM/YYYY") return `${day}/${month}/${year}`;
  if (format === "YYYY-MM-DD") return `${year}-${month}-${day}`;
  return `${month}/${day}/${year}`;
}

/**
 * Preserve the original product's deliberate range behavior.
 *
 * - A click after a completed range starts over.
 * - A click after the start completes the range.
 * - A click on or before the start replaces the start.
 */
export function selectRangeDay(
  current: DateRangeValue | undefined,
  clicked: Date,
): DateRangeValue {
  if (!current?.from || current.to) {
    return { from: clicked };
  }

  if (compareDays(clicked, current.from) > 0) {
    return { from: current.from, to: clicked };
  }

  return { from: clicked };
}

export function isDateInRange(date: Date, range?: DateRangeValue) {
  if (!range?.from) return false;
  if (!range.to) return isSameDay(date, range.from);

  return compareDays(date, range.from) >= 0 && compareDays(date, range.to) <= 0;
}

export function updateRangeBoundary(
  current: DateRangeValue | undefined,
  boundary: "from" | "to",
  date: Date | undefined,
): DateRangeValue | undefined {
  if (boundary === "from") {
    if (!date) {
      return current?.to ? { to: current.to } : undefined;
    }

    return {
      from: date,
      to:
        current?.to && compareDays(current.to, date) >= 0
          ? current.to
          : undefined,
    };
  }

  if (!date) {
    return current?.from ? { from: current.from } : undefined;
  }

  if (current?.from && compareDays(date, current.from) < 0) {
    return current;
  }

  return { ...current, to: date };
}
