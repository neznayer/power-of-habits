import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}
export const Card = ({ children, ...props }: Props) => {
  return (
    <div className="flex flex-col rounded p-5" {...props}>
      {children}
    </div>
  );
};
