import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import stc from "string-to-color";
import type { GoalType } from "../server/trpc/router/goal";
import DoughnutChart from "./DoughnutChart";

function Goal({
  goal,
  onDelete,
}: {
  goal: GoalType;
  onDelete: (id: string) => void;
}) {
  function handleDelete(id: string | undefined) {
    if (!id) return;
    onDelete(id);
  }

  const progress =
    (goal.currentDoneNumber ? goal.currentDoneNumber : 0) / goal.overallNumber;

  return (
    <section
      className="flex gap-2 rounded-md p-2"
      style={{ backgroundColor: stc(goal.id) }}
    >
      <Link
        href={`/goal/${goal.id}`}
        className="grid w-full max-w-lg grid-cols-[70px_1fr_50px] grid-rows-2"
      >
        <div className="row-span-2 row-start-1 self-center text-4xl">
          <DoughnutChart size={70} progress={progress} color={stc(goal.id)}>
            <em-emoji id={goal.emoji} />
          </DoughnutChart>
        </div>
        <div className=" col-start-2 row-start-1 text-lg">{goal.title}</div>
        <div className=" col-start-2 row-start-2 text-sm">
          {goal.description}
        </div>
      </Link>
      <div className=" flex items-center justify-center">
        <FaTrashAlt
          className=" cursor-pointer opacity-50 mix-blend-multiply"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(goal.id);
          }}
        />
      </div>
    </section>
  );
}
export function GoalList({
  goals,
  onDelete,
}: {
  goals: GoalType[] | undefined;
  onDelete: (id: string) => void;
}) {
  return (
    <section className=" flex flex-col gap-4">
      {goals &&
        goals.map((goal, index) => (
          <Goal key={goal.id || index} onDelete={onDelete} goal={goal} />
        ))}
    </section>
  );
}
