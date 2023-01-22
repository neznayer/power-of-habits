import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export const Button = ({ children, ...props }: Props) => {
  return (
    <button className="rounded text-center" {...props}>
      {children}
    </button>
  );
};
