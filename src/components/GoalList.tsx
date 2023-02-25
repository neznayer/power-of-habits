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
    <section className="flex w-[40%] min-w-fit max-w-[400px] gap-2 p-2">
      <Link
        href={`/goal/${goal.id}`}
        className="grid w-full max-w-lg grid-cols-[50px_1fr_50px] grid-rows-2"
        style={{ backgroundColor: stc(goal.id) }}
      >
        <div className="row-span-2 row-start-1 self-center text-4xl">
          <em-emoji id={goal.emoji} />
        </div>
        <div className=" col-start-2 row-start-1 text-lg">{goal.title}</div>
        <div className=" col-start-2 row-start-2 text-sm">
          {goal.description}
        </div>
        <div className=" col-start-3 row-span-2 self-center">
          <DoughnutChart progress={progress} color={stc(goal.id)} />
        </div>
      </Link>

      <div className="flex items-center">
        <FaTrashAlt
          className=" cursor-pointer"
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
    <>
      {goals &&
        goals.map((goal, index) => (
          <Goal key={goal.id || index} onDelete={onDelete} goal={goal} />
        ))}
    </>
  );
}
