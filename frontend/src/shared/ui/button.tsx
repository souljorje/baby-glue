import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-brand-foreground hover:bg-brand-hover hover:-translate-y-px hover:shadow-glow-lime active:translate-y-0',
        secondary:
          'bg-pink text-brand-foreground hover:bg-pink-hover hover:-translate-y-px hover:shadow-glow-pink active:translate-y-0',
        ghost:
          'bg-surface text-foreground border border-border hover:bg-surface-hover hover:border-text-muted'
      },
      size: {
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-6 text-base'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant, size, ...props }, ref) {
  return <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
