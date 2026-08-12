"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "@daypicker/react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

const CalendarContext = React.createContext<{
  visualRangeStart?: Date
  unstyled?: boolean
}>({})

function Calendar({
  className,
  classNames,
  unstyled = false,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  visualRangeStart,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  unstyled?: boolean
  visualRangeStart?: Date
}) {
  const defaultClassNames = getDefaultClassNames()

  const stableComponents = React.useMemo(() => {
    return {
      Root: ({ className, rootRef, ...props }: any) => {
        return (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(className)}
            {...props}
          />
        )
      },
      Chevron: ({ className, orientation, ...props }: any) => {
        if (orientation === "left") {
          return (
            <ChevronLeftIcon
              className={cn(!unstyled && "size-4", className)}
              {...props}
            />
          )
        }

        if (orientation === "right") {
          return (
            <ChevronRightIcon
              className={cn(!unstyled && "size-4", className)}
              {...props}
            />
          )
        }

        if (orientation === "up") {
          return (
            <ChevronUpIcon
              className={cn(!unstyled && "size-4", className)}
              {...props}
            />
          )
        }

        return (
          <ChevronDownIcon
            className={cn(!unstyled && "size-4", className)}
            {...props}
          />
        )
      },
      DayButton: (props: any) => <CalendarDayButtonWrapper {...props} />,
      WeekNumber: ({ children, ...props }: any) => {
        return (
          <td {...props}>
            <div
              className={cn(
                !unstyled &&
                  "flex size-(--cell-size) items-center justify-center text-center"
              )}
            >
              {children}
            </div>
          </td>
        )
      },
      ...components,
    }
  }, [unstyled, components])

  return (
    <CalendarContext.Provider value={{ visualRangeStart, unstyled }}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn(
          !unstyled &&
            "bg-background group/calendar p-2 [--cell-size:--spacing(10)] sm:p-3 sm:[--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
          !unstyled && String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
          !unstyled && String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
          className
        )}
        captionLayout={captionLayout}
        formatters={{
          formatMonthDropdown: (date) =>
            date.toLocaleString("default", { month: "short" }),
          ...formatters,
        }}
        classNames={{
          root: cn(!unstyled && "w-fit", defaultClassNames.root),
          months: cn(
            !unstyled && "flex gap-4 flex-col md:flex-row relative",
            defaultClassNames.months
          ),
          month: cn(
            !unstyled && "flex flex-col w-full gap-4",
            defaultClassNames.month
          ),
          nav: cn(
            !unstyled &&
              "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
            defaultClassNames.nav
          ),
          button_previous: cn(
            !unstyled && buttonVariants({ variant: buttonVariant }),
            !unstyled &&
              "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
            defaultClassNames.button_previous
          ),
          button_next: cn(
            !unstyled && buttonVariants({ variant: buttonVariant }),
            !unstyled &&
              "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
            defaultClassNames.button_next
          ),
          month_caption: cn(
            !unstyled &&
              "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
            defaultClassNames.month_caption
          ),
          dropdowns: cn(
            !unstyled &&
              "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
            defaultClassNames.dropdowns
          ),
          dropdown_root: cn(
            !unstyled &&
              "relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
            defaultClassNames.dropdown_root
          ),
          dropdown: cn(
            !unstyled && "absolute bg-popover inset-0 opacity-0",
            defaultClassNames.dropdown
          ),
          caption_label: cn(
            !unstyled && "select-none font-medium",
            !unstyled &&
              (captionLayout === "label"
                ? "text-sm"
                : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5"),
            defaultClassNames.caption_label
          ),
          month_grid: cn(
            !unstyled && "w-full border-collapse",
            defaultClassNames.month_grid
          ),
          weekdays: cn(!unstyled && "flex", defaultClassNames.weekdays),
          weekday: cn(
            !unstyled &&
              "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
            defaultClassNames.weekday
          ),
          week: cn(!unstyled && "flex w-full mt-2", defaultClassNames.week),
          week_number_header: cn(
            !unstyled && "select-none w-(--cell-size)",
            defaultClassNames.week_number_header
          ),
          week_number: cn(
            !unstyled && "text-[0.8rem] select-none text-muted-foreground",
            defaultClassNames.week_number
          ),
          day: cn(
            !unstyled &&
              "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
            defaultClassNames.day
          ),
          range_start: cn(
            !unstyled && "rounded-l-md bg-accent",
            defaultClassNames.range_start
          ),
          range_middle: cn(
            !unstyled && "rounded-none",
            defaultClassNames.range_middle
          ),
          range_end: cn(
            !unstyled && "rounded-r-md bg-accent",
            defaultClassNames.range_end
          ),
          today: cn(
            !unstyled &&
              "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
            defaultClassNames.today
          ),
          outside: cn(
            !unstyled &&
              "text-muted-foreground aria-selected:text-muted-foreground",
            defaultClassNames.outside
          ),
          disabled: cn(
            !unstyled && "text-muted-foreground opacity-50",
            defaultClassNames.disabled
          ),
          hidden: cn(!unstyled && "invisible", defaultClassNames.hidden),
          ...classNames,
        }}
        components={stableComponents}
        {...props}
      />
    </CalendarContext.Provider>
  )
}

function CalendarDayButtonWrapper(
  props: React.ComponentProps<typeof DayButton>
) {
  const { visualRangeStart, unstyled } = React.useContext(CalendarContext)
  return (
    <CalendarDayButton
      {...props}
      unstyled={unstyled}
      visualRangeStart={visualRangeStart}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  unstyled = false,
  visualRangeStart,
  ...props
}: React.ComponentProps<typeof DayButton> & { unstyled?: boolean; visualRangeStart?: Date }) {
  const defaultClassNames = getDefaultClassNames()
  const dayKey = [
    day.date.getFullYear(),
    String(day.date.getMonth() + 1).padStart(2, "0"),
    String(day.date.getDate()).padStart(2, "0"),
  ].join("-")

  let staggerDelay = 0;
  if (visualRangeStart) {
    const diff = Math.abs(day.date.getTime() - visualRangeStart.getTime()) / (1000 * 60 * 60 * 24);
    staggerDelay = Math.max(0, diff - 1) * 0.03; // 30ms stagger per day
  }

  return (
    <DayButton
      day={day}
      modifiers={modifiers}
      data-day={dayKey}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        !unstyled && buttonVariants({ variant: "ghost", size: "icon" }),
        !unstyled &&
        "jca-day-button relative z-0 overflow-hidden transition-all duration-[150ms] ease-linear before:absolute before:inset-0 before:-z-10 before:transition-all before:duration-[150ms] before:ease-linear before:opacity-0",
        "data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:before:opacity-100 data-[selected-single=true]:before:bg-primary data-[selected-single=true]:rounded-md",
        "data-[range-middle=true]:text-accent-foreground data-[range-middle=true]:before:opacity-100 data-[range-middle=true]:before:bg-accent",
        "data-[range-start=true]:text-primary-foreground data-[range-start=true]:before:opacity-100 data-[range-start=true]:before:bg-primary",
        "data-[range-end=true]:text-primary-foreground data-[range-end=true]:before:opacity-100 data-[range-end=true]:before:bg-primary",
        "group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70 data-[range-start=true]:animate-pop-bounce data-[range-end=true]:animate-pop-bounce",
        defaultClassNames.day,
        className
      )}
      {...props}
      style={{ "--stagger": `${staggerDelay}s`, ...props.style } as React.CSSProperties}
    />
  )
}

export { Calendar, CalendarDayButton }
