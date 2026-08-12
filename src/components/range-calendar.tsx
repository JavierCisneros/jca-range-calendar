"use client";

import * as React from "react";
import { InputMask } from "@react-input/mask";
import { CalendarIcon } from "lucide-react";
import type { Matcher } from "@daypicker/react";

import {
  compareDays,
  formatDateInput,
  getDateInputMask,
  isDateInRange,
  parseDateInput,
  selectRangeDay,
  updateRangeBoundary,
  type DateRangeValue,
  type DateInputFormat,
} from "@/lib/date-range";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export type RangeCalendarProps = {
  children?: React.ReactNode;
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onChange?: (range: DateRangeValue | undefined) => void;
  disabled?: boolean;
  className?: string;
  fieldClassName?: string;
  classNames?: RangeCalendarClassNames;
  unstyled?: boolean;
  separator?: React.ReactNode;
  calendarProps?: RangeCalendarCalendarProps;
  inputFormat?: DateInputFormat;
  numberOfMonths?: number;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  popoverAlign?: "start" | "center" | "end";
  popoverSide?: "top" | "right" | "bottom" | "left";
  popoverAvoidCollisions?: boolean;
};

export type RangeCalendarClassNames = {
  root?: string;
  label?: string;
  field?: string;
  inputs?: string;
  fromField?: string;
  toField?: string;
  boundaryLabel?: string;
  input?: string;
  separator?: string;
  trigger?: string;
  popover?: string;
  calendar?: string;
  error?: string;
};

export type RangeCalendarCalendarProps = Omit<
  Extract<React.ComponentProps<typeof Calendar>, { mode?: undefined }>,
  | "month"
  | "onMonthChange"
  | "numberOfMonths"
  | "weekStartsOn"
  | "modifiers"
  | "onDayClick"
  | "onDayKeyDown"
  | "mode"
  | "selected"
  | "onSelect"
  | "unstyled"
>;

type Boundary = "from" | "to";

const desktopMediaQuery = "(min-width: 640px)";

function subscribeToDesktopViewport(onChange: () => void) {
  const mediaQuery = window.matchMedia(desktopMediaQuery);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getDesktopViewportSnapshot() {
  return window.matchMedia(desktopMediaQuery).matches;
}

function getDesktopViewportServerSnapshot() {
  return true;
}

function dayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function RangeCalendar(props: RangeCalendarProps) {
  const {
    children = "Date range",
    value,
    defaultValue,
    onChange,
    disabled = false,
    className,
    fieldClassName,
    classNames = {},
    unstyled = false,
    separator,
    calendarProps,
    inputFormat = "MM/DD/YYYY",
    numberOfMonths,
    weekStartsOn = 1,
    fromPlaceholder = inputFormat,
    toPlaceholder = inputFormat,
    popoverAlign = "end",
    popoverSide = "bottom",
    popoverAvoidCollisions = true,
  } = props;
  const isControlled = Object.prototype.hasOwnProperty.call(props, "value");
  const isDesktopViewport = React.useSyncExternalStore(
    subscribeToDesktopViewport,
    getDesktopViewportSnapshot,
    getDesktopViewportServerSnapshot,
  );
  const resolvedNumberOfMonths =
    numberOfMonths ?? (isDesktopViewport ? 2 : 1);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const range = isControlled ? value : internalValue;
  const [fromInput, setFromInput] = React.useState(() =>
    formatDateInput(range?.from, inputFormat),
  );
  const [toInput, setToInput] = React.useState(() =>
    formatDateInput(range?.to, inputFormat),
  );
  const [errors, setErrors] = React.useState<
    Record<Boundary, false | "invalid" | "before-start">
  >({
    from: false,
    to: false,
  });
  const [activeBoundary, setActiveBoundary] = React.useState<Boundary | null>(
    null,
  );
  const [visibleMonth, setVisibleMonth] = React.useState(
    range?.from ?? new Date(),
  );
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const calendarContentRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const fromTime = range?.from?.getTime();
  const toTime = range?.to?.getTime();
  const id = React.useId();
  const fromId = `${id}-from`;
  const toId = `${id}-to`;
  const labelId = `${id}-label`;
  const inputMask = getDateInputMask(inputFormat);
  const styles = {
    root: "grid w-full gap-2",
    label: undefined,
    field:
      "flex w-full max-w-full items-stretch overflow-hidden rounded-lg border border-input bg-background shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 sm:w-fit",
    inputs: "flex min-w-0 flex-1 items-stretch sm:flex-none",
    fromField:
      "flex min-w-0 flex-1 flex-col justify-center py-2.5 pl-3 pr-2 transition-colors data-[active=true]:bg-accent/60 sm:flex-none sm:pr-2.5",
    toField:
      "flex min-w-0 flex-1 flex-col justify-center py-2.5 pl-2 pr-3 transition-colors data-[active=true]:bg-accent/60 sm:flex-none sm:pl-2.5",
    boundaryLabel:
      "text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground transition-colors group-data-[active=true]/boundary:text-foreground",
    input:
      "h-6 w-full min-w-0 bg-transparent text-sm font-medium tabular-nums outline-none placeholder:font-normal placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[12ch]",
    separator: "flex items-center justify-center text-muted-foreground",
    trigger:
      "h-auto w-11 shrink-0 rounded-none border-l text-muted-foreground hover:text-foreground sm:w-12",
    popover:
      "max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] w-auto overflow-auto p-0",
    calendar: undefined,
    error: "min-h-4 text-xs text-destructive",
  } satisfies Record<keyof RangeCalendarClassNames, string | undefined>;

  function slotClass(slot: keyof RangeCalendarClassNames, legacy?: string) {
    return cn(!unstyled && styles[slot], classNames[slot], legacy);
  }

  React.useEffect(() => {
    const nextFrom = fromTime === undefined ? undefined : new Date(fromTime);
    const nextTo = toTime === undefined ? undefined : new Date(toTime);
    setFromInput(formatDateInput(nextFrom, inputFormat));
    setToInput(formatDateInput(nextTo, inputFormat));
    if (nextFrom) setVisibleMonth(nextFrom);
  }, [fromTime, inputFormat, toTime]);

  function commit(next: DateRangeValue | undefined) {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  function handleInput(boundary: Boundary, input: string) {
    if (boundary === "from") setFromInput(input);
    else setToInput(input);

    const result = parseDateInput(input, inputFormat);
    if (result.status === "valid") {
      const next = updateRangeBoundary(range, boundary, result.date);
      if (next !== range) commit(next);
      if (boundary === "from") setVisibleMonth(result.date);
    } else if (result.status === "empty") {
      commit(updateRangeBoundary(range, boundary, undefined));
    }
  }

  function validateBoundary(boundary: Boundary) {
    const fromResult = parseDateInput(fromInput, inputFormat);
    const toResult = parseDateInput(toInput, inputFormat);

    const error =
      boundary === "from"
        ? fromResult.status !== "empty" && fromResult.status !== "valid"
          ? "invalid"
          : false
        : toResult.status !== "empty" && toResult.status !== "valid"
          ? "invalid"
          : fromResult.status === "valid" &&
              toResult.status === "valid" &&
              compareDays(toResult.date, fromResult.date) < 0
            ? "before-start"
            : false;

    setErrors((state) => ({ ...state, [boundary]: error }));
  }

  function handleInputFocus(boundary: Boundary) {
    setActiveBoundary(boundary);
    setErrors((state) => ({ ...state, [boundary]: false }));
  }

  function handleInputKeyDown(
    boundary: Boundary,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    const input = event.currentTarget;
    const caretAtStart = input.selectionStart === 0 && input.selectionEnd === 0;
    const caretAtEnd =
      input.selectionStart === input.value.length &&
      input.selectionEnd === input.value.length;

    if (boundary === "from" && event.key === "ArrowRight" && caretAtEnd) {
      event.preventDefault();
      const nextInput = document.getElementById(toId) as HTMLInputElement | null;
      nextInput?.focus();
      nextInput?.setSelectionRange(0, 0);
    }

    if (boundary === "to" && event.key === "ArrowLeft" && caretAtStart) {
      event.preventDefault();
      const previousInput = document.getElementById(fromId) as HTMLInputElement | null;
      previousInput?.focus();
      previousInput?.setSelectionRange(
        previousInput.value.length,
        previousInput.value.length,
      );
    }
  }

  function handleDay(day: Date, modifiers: Record<string, boolean>) {
    if (modifiers.disabled || modifiers.hidden) return;
    const next = selectRangeDay(range, day);
    commit(next);
    // A controlled consumer is the source of truth. Its inputs update only
    // after the parent supplies the next value back through props.
    if (!isControlled) {
      setFromInput(formatDateInput(next.from, inputFormat));
      setToInput(formatDateInput(next.to, inputFormat));
    }
    setErrors({ from: false, to: false });
  }

  function handleCalendarOpenChange(nextOpen: boolean) {
    setCalendarOpen(nextOpen);
    if (!nextOpen) {
      window.setTimeout(() => {
        fieldRef.current
          ?.querySelector<HTMLButtonElement>(
            'button[aria-label="Open date range calendar"]',
          )
          ?.focus();
      }, 0);
    }
  }

  const fromInvalid = Boolean(errors.from);
  const toInvalid = Boolean(errors.to);

  const selectedMatcher: Matcher | undefined =
    range?.from && range.to
      ? { from: range.from, to: range.to }
      : range?.from ?? range?.to;

  return (
    <div data-slot="date-range-field" className={slotClass("root", className)}>
      {unstyled ? (
        <label
          id={labelId}
          data-slot="date-range-label"
          className={slotClass("label")}
        >
          {children}
        </label>
      ) : (
        <Label
          id={labelId}
          data-slot="date-range-label"
          className={slotClass("label")}
        >
          {children}
        </Label>
      )}
      <div
        ref={fieldRef}
        data-slot="date-range-control"
        role="group"
        aria-labelledby={labelId}
        className={slotClass("field", fieldClassName)}
      >
        <div data-slot="date-range-inputs" className={slotClass("inputs")}>
          <div
            data-active={activeBoundary === "from" ? "true" : undefined}
            data-slot="date-range-from"
            className={cn(slotClass("fromField"), "group/boundary")}
          >
            {unstyled ? (
              <label
                htmlFor={fromId}
                data-slot="date-range-boundary-label"
                className={slotClass("boundaryLabel")}
              >
                Start date
              </label>
            ) : (
              <Label
                htmlFor={fromId}
                data-slot="date-range-boundary-label"
                className={slotClass("boundaryLabel")}
              >
                Start date
              </Label>
            )}
            <InputMask
              id={fromId}
              data-slot="date-range-input"
              aria-invalid={fromInvalid}
              aria-describedby={fromInvalid ? `${fromId}-error` : undefined}
              disabled={disabled}
              inputMode="numeric"
              autoComplete="off"
              mask={inputMask}
              replacement={{ _: /\d/ }}
              separate
              value={fromInput}
              onChange={(event) => handleInput("from", event.target.value)}
              onFocus={() => handleInputFocus("from")}
              onKeyDown={(event) => handleInputKeyDown("from", event)}
              onBlur={() => validateBoundary("from")}
              placeholder={fromPlaceholder}
              className={slotClass("input")}
            />
          </div>
          <div
            aria-hidden="true"
            data-slot="date-range-separator"
            className={slotClass("separator")}
          >
            {separator ?? <span className="h-7 w-px bg-border" />}
          </div>
          <div
            data-active={activeBoundary === "to" ? "true" : undefined}
            data-slot="date-range-to"
            className={cn(slotClass("toField"), "group/boundary")}
          >
            {unstyled ? (
              <label
                htmlFor={toId}
                data-slot="date-range-boundary-label"
                className={slotClass("boundaryLabel")}
              >
                End date
              </label>
            ) : (
              <Label
                htmlFor={toId}
                data-slot="date-range-boundary-label"
                className={slotClass("boundaryLabel")}
              >
                End date
              </Label>
            )}
            <InputMask
              id={toId}
              data-slot="date-range-input"
              aria-invalid={toInvalid}
              aria-describedby={toInvalid ? `${toId}-error` : undefined}
              disabled={disabled}
              inputMode="numeric"
              autoComplete="off"
              mask={inputMask}
              replacement={{ _: /\d/ }}
              separate
              value={toInput}
              onChange={(event) => handleInput("to", event.target.value)}
              onFocus={() => handleInputFocus("to")}
              onKeyDown={(event) => handleInputKeyDown("to", event)}
              onBlur={() => validateBoundary("to")}
              placeholder={toPlaceholder}
              className={slotClass("input")}
            />
          </div>
        </div>
        <Popover open={calendarOpen} onOpenChange={handleCalendarOpenChange}>
          <PopoverTrigger asChild>
            {unstyled ? (
              <button
                type="button"
                disabled={disabled}
                aria-label="Open date range calendar"
                data-slot="date-range-trigger"
                className={slotClass("trigger")}
              >
                <CalendarIcon aria-hidden="true" />
              </button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                aria-label="Open date range calendar"
                data-slot="date-range-trigger"
                className={slotClass("trigger")}
              >
                <CalendarIcon aria-hidden="true" />
              </Button>
            )}
          </PopoverTrigger>
          <PopoverContent
            ref={calendarContentRef}
            align={popoverAlign}
            avoidCollisions={popoverAvoidCollisions}
            side={popoverSide}
            unstyled={unstyled}
            data-slot="date-range-popover"
            className={slotClass("popover")}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              const preferredDay = range?.from ?? new Date();

              requestAnimationFrame(() => {
                const content = calendarContentRef.current;
                const preferred = content?.querySelector<HTMLButtonElement>(
                  `button[data-day="${dayKey(preferredDay)}"]`,
                );
                const fallback =
                  content?.querySelector<HTMLButtonElement>("button[data-day]");
                (preferred ?? fallback)?.focus();
              });
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
            }}
          >
            <Calendar
              {...calendarProps}
              unstyled={unstyled}
              className={cn(calendarProps?.className, classNames.calendar)}
              month={visibleMonth}
              onMonthChange={setVisibleMonth}
              numberOfMonths={resolvedNumberOfMonths}
              weekStartsOn={weekStartsOn}
              modifiers={{
                selected: selectedMatcher,
                range_start: range?.from,
                range_end: range?.to,
                range_middle: (day) =>
                  Boolean(
                    range?.from &&
                    range.to &&
                    isDateInRange(day, range) &&
                    compareDays(day, range.from) > 0 &&
                    compareDays(day, range.to) < 0,
                  ),
              }}
              onDayClick={handleDay}
              onDayKeyDown={(day, modifiers, event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  handleDay(day, modifiers);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div
        data-slot="date-range-error"
        aria-live="polite"
        className={slotClass("error")}
      >
        {fromInvalid ? (
          <span id={`${fromId}-error`}>Enter a valid start date.</span>
        ) : toInvalid ? (
          <span id={`${toId}-error`}>
            {errors.to === "before-start"
              ? "The end date must be after the start date."
              : "Enter a valid end date."}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default RangeCalendar;
