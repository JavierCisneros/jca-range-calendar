import RangeCalendar, {
  type RangeCalendarProps,
} from "@/components/range-calendar";

const demoRange = {
  from: new Date(2026, 7, 12),
  to: new Date(2026, 7, 18),
};

type ShowcaseCardProps = {
  title: string;
  description: string;
  fieldLabel: string;
  surfaceClassName: string;
  calendarProps?: RangeCalendarProps;
  dark?: boolean;
};

function ShowcaseCard({
  title,
  description,
  fieldLabel,
  surfaceClassName,
  calendarProps,
  dark = false,
}: ShowcaseCardProps) {
  return (
    <article
      className={`group rounded-3xl border border-black/[0.07] bg-white p-2 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1 ${
        dark ? "dark" : ""
      }`}
    >
      <div
        className={`flex min-h-72 items-center justify-center rounded-[1.15rem] p-3 sm:p-8 ${surfaceClassName}`}
      >
        <div className="w-full max-w-md">
          <RangeCalendar defaultValue={demoRange} {...calendarProps}>
            {fieldLabel}
          </RangeCalendar>
        </div>
      </div>
      <div className="px-4 pb-5 pt-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </article>
  );
}

function Home() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] px-5 py-16 text-slate-950 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,0.75fr)] lg:gap-16">
          <div>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-6xl">
              Date ranges without the fragile edge cases.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg">
              A complete field for picking, typing and validating date ranges.
              Bring your own visual system; keep one reliable interaction model.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] sm:p-7">
            <p className="text-sm font-semibold text-slate-950">
              Try the field
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Type a date, select a new range, or open the calendar with the
              keyboard.
            </p>
            <div className="mt-6">
              <RangeCalendar defaultValue={demoRange}>Stay dates</RangeCalendar>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
              <span>Masked input</span>
              <span>Range validation</span>
              <span>Focus-safe</span>
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
          <div className="bg-white p-6 sm:p-7">
            <h2 className="text-base font-semibold tracking-tight text-slate-950">
              Reliable behavior
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Range transitions, typed input and validation stay in sync.
            </p>
          </div>
          <div className="bg-white p-6 sm:p-7">
            <h2 className="text-base font-semibold tracking-tight text-slate-950">
              Keyboard-ready
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Navigation and focus restoration are considered from the start.
            </p>
          </div>
          <div className="bg-white p-6 sm:p-7">
            <h2 className="text-base font-semibold tracking-tight text-slate-950">
              Designed to adapt
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use slots, data attributes or an unstyled base in any system.
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-8 border-y border-slate-200 py-12 lg:grid-cols-[0.7fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Fit it into your stack.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              Start with useful defaults, tune every visual slot, or remove the
              defaults entirely and connect it to your own primitives.
            </p>
          </div>
          <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-200"><code>{`<RangeCalendar\n  defaultValue={range}\n  inputFormat="YYYY-MM-DD"\n  classNames={{ field: "your-field" }}\n/>`}</code></pre>
        </section>

        <section className="mt-16">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              The same behavior, three different directions.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Styling is not an afterthought: the field can live naturally in
              product, consumer and data-heavy interfaces.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <ShowcaseCard
            title="Neutral product UI"
            description="The original use case: selecting a reliable period for generated reports."
            fieldLabel="Report period"
            surfaceClassName="bg-[#fafafa]"
          />

            <ShowcaseCard
            title="Dense analytics dashboard"
            description="Full-width, compact and high-contrast for data-heavy workflows."
            fieldLabel="Analytics period"
            surfaceClassName="bg-slate-100"
            calendarProps={{
              classNames: {
                root: "gap-1.5",
                label: "text-xs font-semibold text-slate-700",
                field:
                  "w-full rounded-md border-slate-300 bg-white shadow-none focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20",
                inputs: "flex-1",
                fromField: "flex-1 py-2 pl-3 pr-2",
                toField: "flex-1 py-2 pl-2 pr-3",
                boundaryLabel: "text-[0.62rem] font-bold text-blue-700",
                input: "w-full text-[0.82rem]",
                trigger:
                  "w-10 border-slate-200 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                calendar:
                  "[--primary:#2563eb] [--primary-foreground:#fff] [--accent:#dbeafe] [--accent-foreground:#172554]",
              },
              numberOfMonths: 1,
              inputFormat: "DD/MM/YYYY",
              popoverAlign: "start",
            }}
          />

            <ShowcaseCard
            title="Travel and lifestyle"
            description="Soft, expressive and friendly without changing range behavior."
            fieldLabel="Travel dates"
            surfaceClassName="bg-gradient-to-br from-violet-100 via-fuchsia-50 to-orange-50"
            calendarProps={{
              separator: (
                <span className="grid size-6 place-items-center rounded-full bg-violet-100 text-xs font-semibold text-violet-500">
                  →
                </span>
              ),
              classNames: {
                label: "ml-2 text-sm font-semibold text-violet-950",
                field:
                  "rounded-full border-violet-200 bg-white/90 shadow-[0_12px_35px_-18px_rgba(109,40,217,0.65)] focus-within:border-violet-400 focus-within:ring-violet-400/20",
                inputs: "flex min-w-0 flex-1",
                fromField: "min-w-0 flex-1 py-3 pl-5 pr-2",
                toField: "min-w-0 flex-1 py-3 pl-2 pr-2",
                boundaryLabel: "text-[0.58rem] font-bold text-violet-500",
                input: "w-full min-w-0 text-[0.76rem]",
                separator: "px-0.5",
                trigger:
                  "!w-12 !min-w-12 !shrink-0 rounded-r-full border-violet-200 bg-violet-600 text-white hover:bg-violet-700 hover:text-white [&_svg]:block [&_svg]:size-5 [&_svg]:stroke-[2.5]",
                popover:
                  "overflow-hidden rounded-2xl border-violet-100 shadow-2xl",
                calendar:
                  "[--primary:#7c3aed] [--primary-foreground:#fff] [--accent:#ede9fe] [--accent-foreground:#4c1d95]",
              },
              numberOfMonths: 1,
            }}
          />

            <ShowcaseCard
              title="Dark technical interface"
              description="Monospace dates and a crisp cyan accent for technical products."
              fieldLabel="Log interval"
              surfaceClassName="bg-[#09090b]"
              dark
              calendarProps={{
                classNames: {
                  root: "gap-2 text-zinc-100",
                  label:
                    "font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-zinc-400",
                  field:
                    "rounded-md border-zinc-800 bg-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/15",
                  fromField: "py-2.5 pl-3 pr-2.5",
                  toField: "py-2.5 pl-2.5 pr-3",
                  boundaryLabel:
                    "font-mono text-[0.58rem] tracking-[0.12em] text-zinc-500",
                  input:
                    "font-mono text-xs text-zinc-100 placeholder:text-zinc-700",
                  separator: "text-zinc-800",
                  trigger:
                    "w-11 border-zinc-800 bg-zinc-900 text-cyan-400 hover:bg-zinc-800 hover:text-cyan-300",
                  popover: "border-zinc-800 bg-zinc-950 shadow-2xl",
                  calendar:
                    "bg-zinc-950 text-zinc-100 [--primary:#22d3ee] [--primary-foreground:#083344] [--accent:#164e63] [--accent-foreground:#ecfeff]",
                  error: "font-mono text-xs text-red-400",
                },
                numberOfMonths: 1,
                inputFormat: "YYYY-MM-DD",
                popoverSide: "top",
              }}
            />

            <ShowcaseCard
              title="Minimal, content-first UI"
              description="Almost no chrome: typography and whitespace do the visual work."
              fieldLabel="Publication window"
              surfaceClassName="bg-[#f3efe7]"
              calendarProps={{
                separator: <span className="size-1 rounded-full bg-stone-400" />,
                classNames: {
                  label:
                    "font-serif text-base font-normal italic text-stone-700",
                  field:
                    "rounded-none border-x-0 border-t-0 border-stone-400 bg-transparent shadow-none focus-within:border-stone-900 focus-within:ring-0",
                  fromField: "py-3 pl-0 pr-4",
                  toField: "py-3 pl-4 pr-4",
                  boundaryLabel:
                    "text-[0.6rem] font-medium tracking-[0.18em] text-stone-500",
                  input: "font-serif text-base font-normal text-stone-950",
                  trigger:
                    "w-9 border-l-0 text-stone-500 hover:bg-transparent hover:text-stone-950",
                  popover: "rounded-none border-stone-300 bg-[#faf7f0] shadow-xl",
                  calendar:
                    "bg-[#faf7f0] font-serif [--primary:#292524] [--primary-foreground:#fafaf9] [--accent:#e7e5e4] [--accent-foreground:#292524]",
                },
                numberOfMonths: 1,
                popoverAlign: "start",
              }}
            />

            <ShowcaseCard
              title="Bold commerce UI"
              description="A branded block treatment for checkout and promotional experiences."
              fieldLabel="Campaign period"
              surfaceClassName="bg-[#fff2cc]"
              calendarProps={{
                classNames: {
                  label:
                    "w-fit bg-black px-2 py-1 text-xs font-black uppercase tracking-wider text-white",
                  field:
                    "rounded-none border-2 border-black bg-[#fffdf5] shadow-[5px_5px_0_#111] focus-within:ring-0",
                  fromField: "py-2.5 pl-3 pr-2.5",
                  toField: "py-2.5 pl-2.5 pr-3",
                  boundaryLabel: "text-[0.6rem] font-black text-black",
                  input: "font-bold text-black placeholder:text-black/40",
                  separator: "text-black",
                  trigger:
                    "w-12 border-l-2 border-black bg-[#ff5c35] text-black hover:bg-[#ff805f]",
                  popover:
                    "rounded-none border-2 border-black shadow-[6px_6px_0_#111]",
                  calendar:
                    "[--primary:#ff5c35] [--primary-foreground:#111] [--accent:#ffe08a] [--accent-foreground:#111]",
                },
                numberOfMonths: 1,
              }}
            />

          </div>
        </section>

      </div>
    </main>
  );
}

export default Home;
