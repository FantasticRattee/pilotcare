/*
  PilotCare interface kit.

  Every screen is built from these few parts so the app reads as one product:
  ink on white, hairlines instead of shadowed cards, and colour only for status.

  Tone follows the colour code of a flight display:
    ok = normal (green) · caution (amber) · warning (red)
    plan = the active or recommended plan (magenta) · info (teal) · neutral (ink)

  No hooks here, so these parts work in server and client screens alike.
*/
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronRight, Plane, type LucideIcon } from 'lucide-react';

export type Tone = 'ok' | 'caution' | 'warning' | 'info' | 'plan' | 'neutral';

export const toneText: Record<Tone, string> = {
  ok: 'text-ok',
  caution: 'text-caution',
  warning: 'text-warning',
  info: 'text-info',
  plan: 'text-plan',
  neutral: 'text-ink-soft',
};

export const toneSoft: Record<Tone, string> = {
  ok: 'bg-ok-soft',
  caution: 'bg-caution-soft',
  warning: 'bg-warning-soft',
  info: 'bg-info-soft',
  plan: 'bg-plan-soft',
  neutral: 'bg-panel',
};

export const toneSolid: Record<Tone, string> = {
  ok: 'bg-ok',
  caution: 'bg-caution',
  warning: 'bg-warning',
  info: 'bg-info',
  plan: 'bg-plan',
  neutral: 'bg-ink-faint',
};

export const toneBorder: Record<Tone, string> = {
  ok: 'border-ok',
  caution: 'border-caution',
  warning: 'border-warning',
  info: 'border-info',
  plan: 'border-plan',
  neutral: 'border-ink-faint',
};

/* ---------- Page structure ---------- */

/** Top of a screen: its name, one line about it, and the user story it was built for. */
export function PageHeader({ title, lead, story, children }: { title: string; lead?: string; story?: number | string; children?: ReactNode }) {
  return (
    <header className="px-5 pb-6 pt-6">
      <h1 className="text-[30px] font-semibold leading-[1.1] text-ink">{title}</h1>
      {lead ? <p className="mt-1.5 text-[15px] text-ink-soft">{lead}</p> : null}
      {story !== undefined ? <p className="mt-2 text-[13px] text-ink-faint">User story {story}</p> : null}
      {children}
    </header>
  );
}

/** A titled block of a screen. `aside` sits on the right of the title (a count, a date, a link). */
export function Section({ title, aside, children, className = '' }: { title?: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`px-5 pb-7 ${className}`}>
      {title ? (
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-[19px] font-semibold leading-tight text-ink">{title}</h2>
          {aside ? <div className="shrink-0 text-[13px] text-ink-faint">{aside}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** A bordered container. Use `padded={false}` with rows so their dividers run edge to edge. */
export function Panel({ children, className = '', padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return <div className={`rounded-lg border border-line bg-surface ${padded ? 'p-4' : ''} ${className}`}>{children}</div>;
}

/** A bordered list of `Row` or `LinkRow` items. */
export function RowList({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-line bg-surface px-4 ${className}`}>{children}</div>;
}

/* ---------- Status ---------- */

/** A message that needs attention: a coloured bar on the left, in the tone of its urgency. */
export function Notice({ tone = 'info', title, children, icon: Icon, action }: { tone?: Tone; title?: ReactNode; children?: ReactNode; icon?: LucideIcon; action?: ReactNode }) {
  return (
    <div className={`rounded-lg border-l-4 ${toneBorder[tone]} ${toneSoft[tone]} px-4 py-3.5`}>
      <div className="flex items-start gap-3">
        {Icon ? <Icon size={20} strokeWidth={2} className={`mt-0.5 shrink-0 ${toneText[tone]}`} aria-hidden="true" /> : null}
        <div className="min-w-0 flex-1">
          {title ? <p className="font-display text-[18px] font-semibold leading-snug text-ink">{title}</p> : null}
          {children ? <div className={`text-[14px] text-ink-soft ${title ? 'mt-0.5' : ''}`}>{children}</div> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

/** A small status pill with a dot, for one or two words. */
export function Status({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12.5px] font-semibold leading-none ${toneSoft[tone]} ${toneText[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${toneSolid[tone]}`} aria-hidden="true" />
      {children}
    </span>
  );
}

/* ---------- Numbers ---------- */

/** A grid of `Stat` cells separated by hairlines. Use an even number of cells for two columns. */
export function StatGrid({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 | 4 }) {
  const cols = columns === 4 ? 'grid-cols-4' : columns === 3 ? 'grid-cols-3' : 'grid-cols-2';
  return <div className={`grid ${cols} gap-px overflow-hidden rounded-lg border border-line bg-line`}>{children}</div>;
}

/** One number with its label. The number takes a tone only when it carries a status. */
export function Stat({ label, value, unit, tone = 'neutral', note, icon: Icon }: { label: string; value: ReactNode; unit?: string; tone?: Tone; note?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="bg-surface p-4">
      <p className="flex items-center gap-1.5 text-[13px] text-ink-soft">
        {Icon ? <Icon size={15} strokeWidth={1.75} className="shrink-0 text-ink-faint" aria-hidden="true" /> : null}
        {label}
      </p>
      <p className="tabular mt-1.5 font-display text-[28px] font-semibold leading-none text-ink">
        <span className={tone === 'neutral' ? undefined : toneText[tone]}>{value}</span>
        {unit ? <span className="ml-1 text-[14px] font-medium text-ink-faint">{unit}</span> : null}
      </p>
      {note ? <p className="mt-1.5 text-[12.5px] leading-snug text-ink-faint">{note}</p> : null}
    </div>
  );
}

/** A label on the left and a value on the right, with a divider below. */
export function Row({ label, value, hint, tone = 'neutral', icon: Icon, children }: { label: ReactNode; value?: ReactNode; hint?: ReactNode; tone?: Tone; icon?: LucideIcon; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line-soft py-3 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        {Icon ? <Icon size={18} strokeWidth={1.75} className="shrink-0 text-ink-faint" aria-hidden="true" /> : null}
        <div className="min-w-0">
          <p className="text-[15px] text-ink">{label}</p>
          {hint ? <p className="text-[13px] text-ink-faint">{hint}</p> : null}
        </div>
      </div>
      {children ?? <p className={`tabular shrink-0 text-right text-[15px] font-medium ${tone === 'neutral' ? 'text-ink' : toneText[tone]}`}>{value}</p>}
    </div>
  );
}

/** A thin progress bar. `limit` draws a mark at a regulatory or recommended limit. */
export function Meter({ label, valueLabel, value, max = 100, tone = 'info', limit, note }: { label?: string; valueLabel?: ReactNode; value: number; max?: number; tone?: Tone; limit?: number; note?: ReactNode }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      {label || valueLabel ? (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-[14px] text-ink-soft">{label}</span>
          <span className="tabular text-[14px] font-medium text-ink">{valueLabel}</span>
        </div>
      ) : null}
      <div className="relative h-2 rounded-full bg-line-soft" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
        <div className={`h-2 rounded-full ${toneSolid[tone]}`} style={{ width: `${percent}%` }} />
        {limit !== undefined ? <span className="absolute -top-1 h-4 w-0.5 bg-ink" style={{ left: `${Math.max(0, Math.min(100, (limit / max) * 100))}%` }} aria-hidden="true" /> : null}
      </div>
      {note ? <p className="mt-1.5 text-[12.5px] text-ink-faint">{note}</p> : null}
    </div>
  );
}

/* ---------- Actions ---------- */

type ButtonVariant = 'primary' | 'secondary' | 'quiet';

const buttonBase = 'inline-flex items-center justify-center gap-2 rounded-md text-[15px] font-semibold leading-none disabled:cursor-not-allowed disabled:opacity-50';
const buttonVariant: Record<ButtonVariant, string> = {
  primary: 'bg-ink px-4 py-3 text-white hover:bg-ink-soft',
  secondary: 'border border-line bg-surface px-4 py-3 text-ink hover:bg-panel',
  quiet: 'py-1 text-info hover:underline',
};

/** A button. One `primary` per screen at most; the rest are `secondary` or `quiet`. */
export function Button({ children, onClick, variant = 'primary', icon: Icon, disabled, full, type = 'button', ariaLabel }: { children: ReactNode; onClick?: () => void; variant?: ButtonVariant; icon?: LucideIcon; disabled?: boolean; full?: boolean; type?: 'button' | 'submit'; ariaLabel?: string }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={`${buttonBase} ${buttonVariant[variant]} ${full ? 'w-full' : ''}`}>
      {Icon ? <Icon size={17} strokeWidth={2} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

/** The same look as `Button`, for moving to another screen. */
export function ButtonLink({ href, children, variant = 'primary', icon: Icon, full }: { href: string; children: ReactNode; variant?: ButtonVariant; icon?: LucideIcon; full?: boolean }) {
  return (
    <Link href={href} className={`${buttonBase} ${buttonVariant[variant]} ${full ? 'w-full' : ''}`}>
      {Icon ? <Icon size={17} strokeWidth={2} aria-hidden="true" /> : null}
      {children}
    </Link>
  );
}

/** A row that opens another screen. Place inside `RowList`. */
export function LinkRow({ href, title, hint, icon: Icon, trailing }: { href: string; title: string; hint?: string; icon?: LucideIcon; trailing?: ReactNode }) {
  return (
    <Link href={href} className="-mx-4 flex items-center gap-3.5 border-b border-line-soft px-4 py-3.5 last:border-b-0 hover:bg-panel">
      {Icon ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-panel text-ink">
          <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-ink">{title}</span>
        {hint ? <span className="block text-[13px] text-ink-faint">{hint}</span> : null}
      </span>
      {trailing}
      <ChevronRight size={18} className="shrink-0 text-ink-faint" aria-hidden="true" />
    </Link>
  );
}

/** Two to four choices where one is always selected. */
export function Segmented<T extends string>({ options, value, onChange, label }: { options: { value: T; label: string }[]; value: T; onChange: (value: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="grid gap-0.5 rounded-md border border-line bg-panel p-0.5" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={`rounded-[5px] px-3 py-2 text-[14px] font-semibold ${selected ? 'bg-surface text-ink ring-1 ring-line' : 'text-ink-faint hover:text-ink-soft'}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** An on/off switch. */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-ok' : 'bg-line'}`}>
      <span className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} aria-hidden="true" />
    </button>
  );
}

/* ---------- Time and route ---------- */

export type TapeSegment = { from: number; to: number; tone: Tone; label: string };

/**
 * A 24-hour strip: blocks of time (sleep, duty, the recommended window) on one line,
 * the way a roster shows a day. Hours run from 0 to 24; split a block that crosses midnight.
 * `now` draws a marker at the current hour.
 */
export function Tape({ segments, now, title }: { segments: TapeSegment[]; now?: number; title?: string }) {
  const ticks = [0, 6, 12, 18, 24];
  const legend = segments.filter((segment, index) => segments.findIndex((other) => other.label === segment.label) === index);
  const position = (hour: number) => `${Math.max(0, Math.min(100, (hour / 24) * 100))}%`;
  return (
    <figure>
      {title ? <p className="mb-2 text-[14px] text-ink-soft">{title}</p> : null}
      <div className="relative h-8 overflow-hidden rounded-md border border-line bg-panel">
        {segments.map((segment, index) => (
          <div key={index} title={segment.label} className={`absolute inset-y-0 ${toneSolid[segment.tone]}`} style={{ left: position(segment.from), width: `${Math.max(0, ((segment.to - segment.from) / 24) * 100)}%` }} />
        ))}
        {now !== undefined ? <div className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: position(now) }} aria-hidden="true" /> : null}
      </div>
      <div className="tabular relative mt-1 h-4 text-[11.5px] text-ink-faint" aria-hidden="true">
        {ticks.map((tick) => (
          <span key={tick} className="absolute" style={{ left: position(tick), transform: tick === 0 ? 'none' : tick === 24 ? 'translateX(-100%)' : 'translateX(-50%)' }}>
            {String(tick).padStart(2, '0')}
          </span>
        ))}
      </div>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-soft">
        {legend.map((segment) => (
          <span key={segment.label} className="inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${toneSolid[segment.tone]}`} aria-hidden="true" />
            {segment.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

/** A flight from one airport to another, drawn as a route line in the plan colour. */
export function RouteStrip({ flight, from, fromName, fromTime, to, toName, toTime, duration, aside }: { flight?: string; from: string; fromName?: string; fromTime?: string; to: string; toName?: string; toTime?: string; duration?: string; aside?: ReactNode }) {
  return (
    <div>
      {flight || aside ? (
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="tabular text-[14px] font-semibold text-ink">{flight}</p>
          {aside}
        </div>
      ) : null}
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <p className="font-display text-[30px] font-semibold leading-none text-ink">{from}</p>
          {fromName ? <p className="mt-1.5 text-[13px] text-ink-soft">{fromName}</p> : null}
          {fromTime ? <p className="tabular text-[13px] text-ink-faint">{fromTime}</p> : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-center pt-2.5">
          <div className="flex w-full items-center gap-1.5 text-plan">
            <span className="h-0.5 flex-1 rounded bg-plan" aria-hidden="true" />
            <Plane size={16} strokeWidth={2} className="rotate-45" aria-hidden="true" />
            <span className="h-0.5 flex-1 rounded bg-plan" aria-hidden="true" />
          </div>
          {duration ? <p className="tabular mt-1.5 text-[12.5px] text-ink-faint">{duration}</p> : null}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-[30px] font-semibold leading-none text-ink">{to}</p>
          {toName ? <p className="mt-1.5 text-[13px] text-ink-soft">{toName}</p> : null}
          {toTime ? <p className="tabular text-[13px] text-ink-faint">{toTime}</p> : null}
        </div>
      </div>
    </div>
  );
}
