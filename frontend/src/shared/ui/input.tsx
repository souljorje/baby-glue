import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground placeholder:text-text-muted outline-none transition-colors duration-150 focus:border-blue focus:ring-1 focus:ring-blue',
        className
      )}
      {...props}
    />
  );
});
