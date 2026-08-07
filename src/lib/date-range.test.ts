import { describe, expect, it } from "vitest";

import {
  formatDateInput,
  parseDateInput,
  selectRangeDay,
  updateRangeBoundary,
} from "./date-range";

const date = (year: number, month: number, day: number) =>
  new Date(year, month - 1, day);

describe("parseDateInput", () => {
  it("distinguishes empty, incomplete, valid, and impossible dates", () => {
    expect(parseDateInput("")).toEqual({ status: "empty" });
    expect(parseDateInput("02/2")).toEqual({ status: "incomplete" });
    expect(parseDateInput("02/29/2024")).toEqual({
      status: "valid",
      date: date(2024, 2, 29),
    });
    expect(parseDateInput("02/29/2025")).toEqual({ status: "invalid" });
    expect(parseDateInput("13/01/2025")).toEqual({ status: "invalid" });
  });

  it("round-trips formatted dates", () => {
    const value = date(2026, 7, 24);
    expect(parseDateInput(formatDateInput(value))).toEqual({
      status: "valid",
      date: value,
    });
  });

  it.each([
    ["MM/DD/YYYY", "08/12/2026"],
    ["DD/MM/YYYY", "12/08/2026"],
    ["YYYY-MM-DD", "2026-08-12"],
  ] as const)("round-trips the %s format", (format, input) => {
    const value = date(2026, 8, 12);
    expect(formatDateInput(value, format)).toBe(input);
    expect(parseDateInput(input, format)).toEqual({
      status: "valid",
      date: value,
    });
  });

  it("does not guess ambiguous dates across formats", () => {
    expect(parseDateInput("03/04/2026", "MM/DD/YYYY")).toEqual({
      status: "valid",
      date: date(2026, 3, 4),
    });
    expect(parseDateInput("03/04/2026", "DD/MM/YYYY")).toEqual({
      status: "valid",
      date: date(2026, 4, 3),
    });
  });

  it("rejects invalid dates in every supported format", () => {
    expect(parseDateInput("31/02/2026", "DD/MM/YYYY")).toEqual({
      status: "invalid",
    });
    expect(parseDateInput("2026-02-31", "YYYY-MM-DD")).toEqual({
      status: "invalid",
    });
  });
});

describe("selectRangeDay", () => {
  it("starts a range when empty", () => {
    expect(selectRangeDay(undefined, date(2026, 7, 10))).toEqual({
      from: date(2026, 7, 10),
    });
  });

  it("completes only when the second day is after the start", () => {
    expect(
      selectRangeDay({ from: date(2026, 7, 10) }, date(2026, 7, 15)),
    ).toEqual({
      from: date(2026, 7, 10),
      to: date(2026, 7, 15),
    });
  });

  it("replaces the start when the second day is earlier or equal", () => {
    expect(
      selectRangeDay({ from: date(2026, 7, 10) }, date(2026, 7, 8)),
    ).toEqual({ from: date(2026, 7, 8) });
    expect(
      selectRangeDay({ from: date(2026, 7, 10) }, date(2026, 7, 10)),
    ).toEqual({ from: date(2026, 7, 10) });
  });

  it("starts over after a completed range", () => {
    expect(
      selectRangeDay(
        { from: date(2026, 7, 10), to: date(2026, 7, 15) },
        date(2026, 8, 1),
      ),
    ).toEqual({ from: date(2026, 8, 1) });
  });
});

describe("updateRangeBoundary", () => {
  it("clears an end that becomes earlier than a newly typed start", () => {
    expect(
      updateRangeBoundary(
        { from: date(2026, 7, 10), to: date(2026, 7, 15) },
        "from",
        date(2026, 7, 20),
      ),
    ).toEqual({ from: date(2026, 7, 20), to: undefined });
  });

  it("does not commit an end before the start", () => {
    const current = { from: date(2026, 7, 20) };
    expect(
      updateRangeBoundary(current, "to", date(2026, 7, 10)),
    ).toBe(current);
  });
});
