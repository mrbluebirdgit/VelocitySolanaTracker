import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-[var(--radius-sm)] bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle",
          "transition-[box-shadow] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)]",
          "focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--color-accent)]",
          className,
        )}
        {...props}
      />
    );
  },
);
