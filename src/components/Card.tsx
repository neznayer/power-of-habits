import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
}
export const Card = ({ className, ...props }: Props) => {
  return (
    <div
      className={`flex flex-col rounded-xl border-2 border-ocean_border p-5 ${className}`}
      {...props}
    >
      {props.children}
    </div>
  );
};
