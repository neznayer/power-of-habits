import Link from "next/link";
import { FaTimes } from "react-icons/fa";
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
    <tr key={goal.id}>
      <td>
        <Link href={`/goal/${goal.id}`}> {goal.title}</Link>
      </td>
      <td>{goal.description}</td>
      <td>
        <button onClick={() => handleDelete(goal.id)}>
          <FaTimes />
        </button>
      </td>
    </tr>
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
