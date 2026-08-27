# JCA Date Range Field

**[View the Live Demo](https://range.javiercisneros.me/)**

A typed and visual date-range field for React with deliberate, predictable
selection behavior.

This project is not trying to replace a calendar engine. It owns the difficult
coordination between two masked inputs and a calendar:

- strict, configurable date parsing that rejects impossible dates;
- synchronized text fields and calendar selection;
- controlled and uncontrolled values;
- a responsive calendar with one month on mobile and two on desktop;
- accessible labels, keyboard selection, and validation messages;
- a popover that stays open until the user dismisses it.

## Selection behavior

Calendar selection follows a small state machine:

| Current value | Click | Result |
| --- | --- | --- |
| Empty | Any enabled date | Start a new range |
| Start only | Date after start | Complete the range |
| Start only | Date on/before start | Replace the start |
| Complete range | Any enabled date | Start a new range |

The behavior is implemented and tested in
`src/lib/date-range.ts`. DayPicker renders the calendar but does not own the
range transitions, which keeps the product behavior independent from its UI
adapter.

## Technology choices

- [`@daypicker/react`](https://daypicker.dev/) v10 renders the accessible
  calendar grid.
- [`@react-input/mask`](https://github.com/GoncharukOrg/react-input) provides
  cursor-aware input masking.
- Radix Popover handles focus, Escape, and outside-click dismissal.

Neither dependency appears in the component's public value API. They can be
replaced later without changing the range model or selection rules.

## Run the demo

This repository currently uses pnpm:

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Usage

Uncontrolled:

```tsx
import { DateRangeField } from "@/index";

<DateRangeField
  defaultValue={{
    from: new Date(2026, 6, 20),
    to: new Date(2026, 6, 24),
  }}
  onChange={(range) => console.log(range)}
>
  Travel dates
</DateRangeField>;
```

Controlled:

```tsx
import { useState } from "react";
import {
  DateRangeField,
  type DateRangeValue,
} from "@/index";

function Filters() {
  const [range, setRange] = useState<DateRangeValue>();

  return (
    <DateRangeField value={range} onChange={setRange}>
      Report period
    </DateRangeField>
  );
}
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `children` | `ReactNode` | `"Date range"` |
| `value` | `DateRangeValue` | — |
| `defaultValue` | `DateRangeValue` | — |
| `onChange` | `(range) => void` | — |
| `disabled` | `boolean` | `false` |
| `separator` | `ReactNode` | Subtle divider |
| `classNames` | `RangeCalendarClassNames` | — |
| `unstyled` | `boolean` | `false` |
| `calendarProps` | `RangeCalendarCalendarProps` | — |
| `inputFormat` | `"MM/DD/YYYY" \| "DD/MM/YYYY" \| "YYYY-MM-DD"` | `"MM/DD/YYYY"` |
| `fieldClassName` | `string` | — |
| `numberOfMonths` | `number` | Responsive: `1` mobile, `2` desktop |
| `weekStartsOn` | `0 \| 1 \| ... \| 6` | `1` |
| `fromPlaceholder` | `string` | Value of `inputFormat` |
| `toPlaceholder` | `string` | Value of `inputFormat` |
| `popoverAlign` | `"start" \| "center" \| "end"` | `"end"` |
| `popoverSide` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` |
| `className` | `string` | — |

The default separator can be replaced with any React node. Use `classNames` to
style individual slots without replacing the component behavior:

```tsx
<DateRangeField
  separator="to"
  classNames={{
    field: "max-w-sm rounded-full",
    fromField: "pl-4 pr-1",
    separator: "px-1 text-xs text-muted-foreground",
    toField: "pl-1",
    trigger: "rounded-r-full",
  }}
  popoverAlign="start"
  popoverSide="top"
/>
```

Available slots are `root`, `label`, `field`, `inputs`, `fromField`,
`toField`, `boundaryLabel`, `input`, `separator`, `trigger`, `popover`,
`calendar`, and `error`. Every element also exposes a stable `data-slot`
attribute for CSS selectors.

For an existing design system, `unstyled` removes the package's visual
classes while preserving its accessible structure and behavior:

```tsx
<DateRangeField
  unstyled
  classNames={{
    root: styles.root,
    field: styles.control,
    input: styles.input,
    separator: styles.separator,
    calendar: styles.calendar,
  }}
  calendarProps={{
    classNames: {
      month_caption: styles.monthCaption,
      day: styles.day,
    },
  }}
/>
```

`calendarProps` accepts presentational DayPicker options, including locale,
disabled dates, formatters, custom components, and DayPicker `classNames`.
Range selection, navigation state, and keyboard handlers remain owned by the
field so custom styling cannot accidentally change its selection behavior.

## International date formats

The input format is explicit so ambiguous values are never guessed from the
browser locale. The mask, placeholder, parser, and formatter stay synchronized:

```tsx
<DateRangeField inputFormat="DD/MM/YYYY" />
<DateRangeField inputFormat="YYYY-MM-DD" />
```

Input format, calendar language, and first day of the week are independent
concerns. For example, a British English field can combine `DD/MM/YYYY`, an
English locale passed through `calendarProps.locale`, and `weekStartsOn={1}`.

## Responsive defaults

Without configuration, the field fills narrow containers and switches from
two calendar months on desktop to one below `640px`. Day targets grow on small
screens and the popover is constrained to the available viewport.

Passing `numberOfMonths` opts out of the responsive month count and forces that
exact value at every viewport size:

```tsx
<DateRangeField />                   // 1 mobile, 2 desktop
<DateRangeField numberOfMonths={1} /> // Always 1
<DateRangeField numberOfMonths={2} /> // Always 2
```

## Verification

```bash
pnpm test
pnpm build
```

The pure tests cover strict parsing, leap years, impossible dates, range
completion, restarting, and typed-boundary normalization.
