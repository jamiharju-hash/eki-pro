import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/components/ui/foundation/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-eki-copper text-white border border-eki-copper hover:brightness-110 focus-visible:ring-2 focus-visible:ring-eki-copper/70',
  secondary: 'bg-eki-card text-zinc-100 border border-eki-border hover:border-eki-copper focus-visible:ring-2 focus-visible:ring-eki-copper/50',
  ghost: 'bg-transparent text-zinc-300 border border-transparent hover:text-white hover:bg-zinc-800/70 focus-visible:ring-2 focus-visible:ring-zinc-500/60',
};

export function Button({ variant = 'primary', loading = false, disabled, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </button>
  );
}
