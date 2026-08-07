import type { Metadata } from "next";

import RangeCalendarPlayground from "@/components/range-calendar-playground";

export const metadata: Metadata = {
  title: "Range Calendar Playground",
  description: "Explore date range field styling and behavior controls.",
};

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] px-5 py-12 text-slate-950 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-2xl">
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Range Calendar Playground
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Explore the field&apos;s visual direction and behavior in one place.
          </p>
        </header>

        <RangeCalendarPlayground />
      </div>
    </main>
  );
}
