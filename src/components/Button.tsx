import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface Props extends ComponentPropsWithoutRef<"button"> {
  children?: ReactNode;
  className?: string;
}

export const Button = ({ children, className, ...props }: Props) => {
  return (
    <button className={`rounded-xl p-2 ${className}`} {...props}>
      {children}
    </button>
  );
};
