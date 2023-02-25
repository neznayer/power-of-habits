import { type InputHTMLAttributes } from "react";

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className="block h-8 w-full rounded-xl border-[1px] border-gray_border p-2"
      {...props}
    />
  );
};
