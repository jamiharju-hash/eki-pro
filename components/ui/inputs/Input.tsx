import { InputHTMLAttributes } from 'react';
import { cn } from '@/components/ui/foundation/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-zinc-300" htmlFor={inputId}>
      {label ? <span>{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-xl border bg-zinc-900/70 px-3 py-2 text-zinc-100 outline-none transition',
          error ? 'border-red-400 focus:ring-2 focus:ring-red-400/50' : 'border-eki-border hover:border-zinc-400 focus:ring-2 focus:ring-eki-copper/60',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </label>
  );
}
