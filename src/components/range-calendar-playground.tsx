"use client";

import * as React from "react";

import type { DateRangeValue } from "@/lib/date-range";
import RangeCalendar, { type RangeCalendarProps } from "./range-calendar";

type Theme = "clean" | "violet" | "dark" | "bold";

const themes: Record<Theme, Pick<RangeCalendarProps, "classNames">> = {
  clean: {
    classNames: {
      field: "border-slate-300 bg-white shadow-sm",
      trigger: "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
      calendar:
        "[--primary:#0f172a] [--primary-foreground:#fff] [--accent:#e2e8f0] [--accent-foreground:#0f172a]",
    },
  },
  violet: {
    classNames: {
      label: "text-violet-950",
      field:
        "rounded-full border-violet-200 bg-white shadow-[0_12px_35px_-18px_rgba(109,40,217,0.65)]",
      trigger:
        "rounded-r-full border-violet-200 bg-violet-600 text-white hover:bg-violet-700 hover:text-white",
      calendar:
        "[--primary:#7c3aed] [--primary-foreground:#fff] [--accent:#ede9fe] [--accent-foreground:#4c1d95]",
    },
  },
  dark: {
    classNames: {
      root: "text-zinc-100",
      label: "font-mono text-xs uppercase tracking-widest text-zinc-400",
      field: "rounded-md border-zinc-700 bg-zinc-950 shadow-none",
      boundaryLabel: "text-zinc-500",
      input: "font-mono text-zinc-100 placeholder:text-zinc-700",
      trigger:
        "border-zinc-700 bg-zinc-900 text-cyan-400 hover:bg-zinc-800 hover:text-cyan-300",
      popover: "border-zinc-800 bg-zinc-950 shadow-2xl",
      calendar:
        "bg-zinc-950 text-zinc-100 [--primary:#22d3ee] [--primary-foreground:#083344] [--accent:#164e63] [--accent-foreground:#ecfeff]",
    },
  },
  bold: {
    classNames: {
      label: "w-fit bg-black px-2 py-1 text-xs font-black uppercase tracking-wider text-white",
      field:
        "rounded-none border-2 border-black bg-[#fffdf5] shadow-[5px_5px_0_#111]",
      boundaryLabel: "font-black text-black",
      input: "font-bold text-black",
      trigger:
        "border-l-2 border-black bg-[#ff5c35] text-black hover:bg-[#ff805f]",
      popover: "rounded-none border-2 border-black shadow-[6px_6px_0_#111]",
      calendar:
        "bg-[#fffdf5] font-bold [--primary:#ff5c35] [--primary-foreground:#111] [--accent:#ffe08a] [--accent-foreground:#111] [&_.rdp-button_next]:rounded-none [&_.rdp-button_next]:border-2 [&_.rdp-button_next]:border-black [&_.rdp-button_next]:bg-[#ff5c35] [&_.rdp-button_previous]:rounded-none [&_.rdp-button_previous]:border-2 [&_.rdp-button_previous]:border-black [&_.rdp-button_previous]:bg-[#ff5c35] [&_[data-slot=calendar]]:bg-[#fffdf5]",
    },
  },
};

const themeOptions: Array<{ value: Theme; label: string }> = [
  { value: "clean", label: "Clean" },
  { value: "violet", label: "Violet" },
  { value: "dark", label: "Dark" },
  { value: "bold", label: "Bold" },
];

const initialRange: DateRangeValue = {
  from: new Date(2026, 7, 12),
  to: new Date(2026, 7, 18),
};

export default function RangeCalendarPlayground() {
  const [theme, setTheme] = React.useState<Theme>("violet");
  const [format, setFormat] = React.useState<"MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD">(
    "MM/DD/YYYY",
  );
  const [months, setMonths] = React.useState<1 | 2>(1);
  const [weekStartsOn, setWeekStartsOn] = React.useState<0 | 1>(1);
  const [controlled, setControlled] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [unstyled, setUnstyled] = React.useState(false);
  const [weekendsDisabled, setWeekendsDisabled] = React.useState(false);
  const [popoverSide, setPopoverSide] = React.useState<"top" | "bottom">(
    "bottom",
  );
  const [lockPopoverSide, setLockPopoverSide] = React.useState(true);
  const [range, setRange] = React.useState<DateRangeValue | undefined>(
    initialRange,
  );

  const dark = theme === "dark";
  const code = buildApiSnippet({
    controlled,
    disabled,
    format,
    months,
    lockPopoverSide,
    popoverSide,
    theme,
    unstyled,
    weekendsDisabled,
    weekStartsOn,
  });

  return (
    <section className={`mt-20 rounded-3xl border p-3 transition-colors duration-300 ease-out sm:p-5 ${dark ? "dark border-zinc-800 bg-zinc-950" : "border-slate-200 bg-white"}`}>
      <div className="grid gap-8 rounded-[1.1rem] p-4 sm:p-7 lg:grid-cols-[0.72fr_1fr] lg:items-center">
        <div className={`transition-colors duration-300 ease-out ${dark ? "text-zinc-100" : "text-slate-950"}`}>
          <h2 className="text-2xl font-semibold tracking-tight">
            Make it yours.
          </h2>
          <p className={`mt-3 max-w-md text-sm leading-6 transition-colors duration-300 ease-out ${dark ? "text-zinc-400" : "text-slate-600"}`}>
            Change a few decisions and see the same range behavior adapt in
            real time.
          </p>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <Control label="Visual direction" dark={dark}>
              <div className="grid grid-cols-4  gap-1 rounded-lg bg-black/5 p-1 dark:bg-white/10">
                {themeOptions.map((option) => (
                  <button
                    className={`rounded-md  py-2 text-xs font-semibold transition ${theme === option.value ? "bg-white text-slate-950 shadow-sm dark:bg-zinc-800 dark:text-white" : "text-slate-500 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white"}`}
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Control>

            <Control label="Date format" dark={dark}>
              <ChoiceGroup
                dark={dark}
                onChange={setFormat}
                options={[
                  { label: "US", value: "MM/DD/YYYY" },
                  { label: "EU", value: "DD/MM/YYYY" },
                  { label: "ISO", value: "YYYY-MM-DD" },
                ]}
                value={format}
              />
            </Control>

            <Control label="Months shown" dark={dark}>
              <ChoiceGroup
                dark={dark}
                onChange={setMonths}
                options={[
                  { label: "One", value: 1 },
                  { label: "Two", value: 2 },
                ]}
                value={months}
              />
            </Control>

            <Control label="Week starts on" dark={dark}>
              <ChoiceGroup
                dark={dark}
                onChange={setWeekStartsOn}
                options={[
                  { label: "Monday", value: 1 },
                  { label: "Sunday", value: 0 },
                ]}
                value={weekStartsOn}
              />
            </Control>

            <Control label="Popover side" dark={dark}>
              <ChoiceGroup
                dark={dark}
                onChange={setPopoverSide}
                options={[
                  { label: "Below", value: "bottom" },
                  { label: "Above", value: "top" },
                ]}
                value={popoverSide}
              />
            </Control>

            <div className="grid gap-2 sm:col-span-2">
              <p className={`text-xs font-semibold ${dark ? "text-zinc-300" : "text-slate-700"}`}>
                Behavior
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Toggle active={controlled} dark={dark} onClick={() => setControlled((value) => !value)}>
                  Controlled value
                </Toggle>
                <Toggle active={disabled} dark={dark} onClick={() => setDisabled((value) => !value)}>
                  Disabled
                </Toggle>
                <Toggle active={unstyled} dark={dark} onClick={() => setUnstyled((value) => !value)}>
                  Unstyled base
                </Toggle>
              <Toggle active={weekendsDisabled} dark={dark} onClick={() => setWeekendsDisabled((value) => !value)}>
                Disable weekends
              </Toggle>
              <Toggle active={lockPopoverSide} dark={dark} onClick={() => setLockPopoverSide((value) => !value)}>
                Keep selected side
              </Toggle>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-5 transition-colors duration-300 ease-out sm:p-8 ${dark ? "bg-zinc-900" : "bg-slate-50"}`}>
          <RangeCalendar
            {...(unstyled ? {} : themes[theme])}
            {...(controlled ? { onChange: setRange, value: range } : {})}
            calendarProps={
              weekendsDisabled ? { disabled: { dayOfWeek: [0, 6] } } : undefined
            }
            className="transition-colors w-fit mx-auto duration-300 ease-out [&_[data-slot]]:transition-colors [&_[data-slot]]:duration-300 [&_button]:transition-colors [&_button]:duration-300 [&_input]:transition-colors [&_input]:duration-300"
            defaultValue={initialRange}
            disabled={disabled}
            fromPlaceholder="Arrival"
            inputFormat={format}
            key={`${controlled}-${format}-${months}-${weekStartsOn}-${unstyled}`}
            numberOfMonths={months}
            popoverAvoidCollisions={!lockPopoverSide}
            popoverSide={popoverSide}
            toPlaceholder="Departure"
            unstyled={unstyled}
            weekStartsOn={weekStartsOn}
          >
            Date Range
          </RangeCalendar>
        </div>
      </div>

      <div className={`mx-4 mb-4 overflow-hidden rounded-2xl border sm:mx-7 sm:mb-7 ${dark ? "border-zinc-800 bg-zinc-950" : "border-slate-200 bg-slate-950"}`}>
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-xs font-semibold text-white">Active API</p>
          <button
            className="text-xs font-semibold text-cyan-300 hover:text-white"
            onClick={() => navigator.clipboard.writeText(code)}
            type="button"
          >
            Copy snippet
          </button>
        </div>
        <pre className="overflow-x-auto p-4 text-xs leading-6 text-slate-200 sm:text-sm"><code>{code}</code></pre>
      </div>
    </section>
  );
}

function Control({
  children,
  dark,
  label,
}: {
  children: React.ReactNode;
  dark: boolean;
  label: string;
}) {
  return (
    <label className={`grid gap-2 text-xs font-semibold ${dark ? "text-zinc-300" : "text-slate-700"}`}>
      {label}
      {children}
    </label>
  );
}

function ChoiceGroup<T extends string | number>({
  dark,
  onChange,
  options,
  value,
}: {
  dark: boolean;
  onChange: (value: T) => void;
  options: Array<T | { label: string; value: T }>;
  value: T;
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg bg-black/5 p-1 dark:bg-white/10">
      {options.map((option) => {
        const optionValue = typeof option === "object" ? option.value : option;
        const label = typeof option === "object" ? option.label : option;
        const selected = optionValue === value;

        return (
          <button
            aria-pressed={selected}
            className={`min-w-0 rounded-md px-2 py-2 text-xs font-semibold transition ${
              selected
                ? "bg-white text-slate-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-slate-500 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white"
            }`}
            key={String(optionValue)}
            onClick={() => onChange(optionValue)}
            type="button"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({
  active,
  children,
  dark,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  dark: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${
        active
          ? "border-violet-500 bg-violet-500 text-white"
          : dark
            ? "border-zinc-700 text-zinc-300 hover:border-zinc-500"
            : "border-slate-200 text-slate-600 hover:border-slate-400"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function buildApiSnippet({
  controlled,
  disabled,
  format,
  lockPopoverSide,
  months,
  popoverSide,
  theme,
  unstyled,
  weekendsDisabled,
  weekStartsOn,
}: {
  controlled: boolean;
  disabled: boolean;
  format: string;
  lockPopoverSide: boolean;
  months: number;
  popoverSide: "top" | "bottom";
  theme: Theme;
  unstyled: boolean;
  weekendsDisabled: boolean;
  weekStartsOn: number;
}) {
  const lines = ["<RangeCalendar"];

  if (controlled) {
    lines.push("  value={range}", "  onChange={setRange}");
  } else {
    lines.push("  defaultValue={range}");
  }

  lines.push(
    `  inputFormat=\"${format}\"`,
    `  numberOfMonths={${months}}`,
    `  weekStartsOn={${weekStartsOn}}`,
    `  popoverSide=\"${popoverSide}\"`,
    '  fromPlaceholder="Arrival"',
    '  toPlaceholder="Departure"',
  );

  if (disabled) lines.push("  disabled");
  if (unstyled) lines.push("  unstyled");
  if (lockPopoverSide) lines.push("  popoverAvoidCollisions={false}");
  if (weekendsDisabled) {
    lines.push("  calendarProps={{ disabled: { dayOfWeek: [0, 6] } }}");
  }

  if (!unstyled) {
    lines.push(`  classNames={${theme}Theme}`);
  }

  lines.push(">", "  Date Range", "</RangeCalendar>");
  return lines.join("\n");
}
