import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../utils/cn";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...rest }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "rounded bg-gray-600 px-2 py-0.5 hover:bg-gray-500",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
