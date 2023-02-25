import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import type { GoalType } from "../server/trpc/router/goal";
import stc from "string-to-color";

function Goal({
  goal,
  onDelete,
}: {
  goal: GoalType;
  onDelete: (id: string) => void;
}) {
  async function handleDelete(id: string | undefined) {
    if (!id) return;
    onDelete(id);
  }

  return (
    <section className="flex w-[40%] min-w-fit max-w-[300px] gap-2 p-2">
      <Link
        href={`/goal/${goal.id}`}
        className="grid w-full max-w-lg grid-cols-[50px_1fr] grid-rows-2"
      >
        <div className="row-span-2 row-start-1 self-center text-4xl">
          <em-emoji id={goal.emoji} />
        </div>
        <div className=" col-start-2 row-start-1 text-lg">{goal.title}</div>
        <div className=" col-start-2 row-start-2 text-sm">
          {goal.description}
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
