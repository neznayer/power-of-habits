import Link from "next/link";
import { FaTimes, FaTrashAlt } from "react-icons/fa";
import type { GoalType } from "../server/trpc/router/goal";
import { trpc } from "../utils/trpc";

function Goal({ goal }: { goal: GoalType }) {
  const utils = trpc.useContext();
  const mutation = trpc.goal.deleteById.useMutation().mutateAsync;

  async function handleDelete(id: string | undefined) {
    if (!id) return;
    await mutation({ id });
    utils.goal.getAll.invalidate();
  }

  return (
    <div className="grid w-full grid-cols-3 grid-rows-2 p-2" key={goal.id}>
      <div className="row-span-2 row-start-1 self-center">icon</div>
      <div className=" col-start-2 row-start-1"> Title</div>
      <div className=" col-start-2 row-start-2"> Description</div>
      <div className=" col-start-3 row-span-2 row-start-1 self-center justify-self-center">
        <FaTrashAlt />
      </div>
      {/* <div className="h-full rounded-full">icon</div>
      <div>
        <Link href={`/goal/${goal.id}`}> {goal.title}</Link>
      </div>
      <td>{goal.description}</td>
      <td>
        <button onClick={() => handleDelete(goal.id)}>
          <FaTimes />
        </button>
      </td> */}
    </div>
  );
}
export function GoalList({ goals }: { goals: GoalType[] | undefined }) {
  return (
    <>
      {goals && (
        <table className="table-auto">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <Goal key={goal.id} goal={goal} />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
