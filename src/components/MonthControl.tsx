import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export function MonthControl({
  monthText,
  onMonthDecrease,
  onMonthIncrease,
}: {
  monthText: string;
  onMonthDecrease: () => void;
  onMonthIncrease: () => void;
}) {
  return (
    <section className="flex w-full flex-row justify-between">
      <div onClick={onMonthDecrease} className="cursor-pointer select-none">
        <FaAngleLeft />
      </div>
      <div>
        <span className="text-xl text-slate-700">{monthText}</span>
      </div>

      <div onClick={onMonthIncrease} className="cursor-pointer select-none">
        <FaAngleRight />
      </div>
    </section>
  );
}
