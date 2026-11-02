import type { ReactNode } from 'react';

export function Label({ children }: { children: ReactNode }) {
  return <span className="mb-1.5 block text-[10.5px] font-medium uppercase tracking-[0.18em] text-cream/55">{children}</span>;
}

export function TextField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  dir?: 'rtl' | 'ltr';
  hint?: string;
}) {
  const cls =
    'w-full rounded-md border border-studio-3 bg-studio px-3 py-2 text-[13.5px] text-cream placeholder:text-cream/25 outline-none transition focus:border-cream/45';
  return (
    <label className="block">
      <Label>{props.label}</Label>
      {props.multiline ? (
        <textarea
          rows={2}
          className={`${cls} resize-none leading-snug`}
          value={props.value}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ) : (
        <input
          className={cls}
          dir={props.dir}
          value={props.value}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
        />
      )}
      {props.hint && <span className="mt-1 block text-[11px] text-cream/35">{props.hint}</span>}
    </label>
  );
}

export function Segmented<T extends string | number>(props: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <Label>{props.label}</Label>
      <div className="flex rounded-md border border-studio-3 bg-studio p-0.5">
        {props.options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => props.onChange(o.value)}
            className={`flex-1 rounded-[5px] px-2 py-1.5 text-[12px] tracking-wide transition ${
              o.value === props.value ? 'bg-cream text-burgundy' : 'text-cream/60 hover:text-cream'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Range(props: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <Label>{props.label}</Label>
        <span className="mb-1.5 text-[11px] tabular-nums text-cream/50">
          {props.value}
          {props.suffix}
        </span>
      </div>
      <input
        type="range"
        className="w-full accent-[#e5dcc9]"
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function Toggle(props: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1 text-[13px] text-cream/80">
      {props.label}
      <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        onClick={() => props.onChange(!props.checked)}
        className={`relative h-5 w-9 rounded-full transition ${props.checked ? 'bg-cream' : 'bg-studio-3'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${props.checked ? 'left-[18px] bg-burgundy' : 'left-0.5 bg-cream/60'}`}
        />
      </button>
    </label>
  );
}

export function IconButton(props: { title: string; onClick: () => void; children: ReactNode; danger?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      title={props.title}
      aria-label={props.title}
      disabled={props.disabled}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick();
      }}
      className={`grid h-7 w-7 place-items-center rounded-md text-[13px] transition disabled:opacity-25 ${
        props.danger ? 'text-cream/50 hover:bg-burgundy hover:text-cream' : 'text-cream/50 hover:bg-studio-3 hover:text-cream'
      }`}
    >
      {props.children}
    </button>
  );
}

export function Button(props: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost'; title?: string; disabled?: boolean }) {
  const v =
    props.variant === 'primary'
      ? 'bg-cream text-burgundy hover:bg-white'
      : 'border border-studio-3 text-cream/80 hover:border-cream/40 hover:text-cream';
  return (
    <button
      type="button"
      title={props.title}
      disabled={props.disabled}
      onClick={props.onClick}
      className={`rounded-md px-3 py-2 text-[12px] font-medium tracking-[0.08em] uppercase transition disabled:cursor-not-allowed disabled:opacity-35 ${v}`}
    >
      {props.children}
    </button>
  );
}
