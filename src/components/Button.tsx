import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface Props extends ComponentPropsWithoutRef<"button"> {
  children?: ReactNode;
  className?: string;
}

export const Button = ({ children, className, ...props }: Props) => {
  return (
    <button
      className={`flex items-center justify-center gap-1 rounded-xl bg-color_accent p-2 text-ocean ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
