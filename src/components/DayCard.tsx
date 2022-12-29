import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

interface DayProps {
  date: Date;
}

export function DayCard({ date }: DayProps) {
  const [done, setDone] = useState(false);

  return (
    <div className="flex h-[60px] w-[50px] flex-col rounded border-gray-400">
      <span>{dayjs(date).daysInMonth()}</span>
      <input
        type="checkbox"
        name="done"
        id="done"
        checked={done}
        onChange={(e) => {
          setDone(e.target.checked);
        }}
      />
    </div>
  );
}
