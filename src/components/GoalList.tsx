import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import type { GoalType } from "../server/trpc/router/goal";
import { trpc } from "../utils/trpc";
import { GoalListItem } from "./GoalListItem";

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
      {
        goals && (
          <section className="flex w-full content-center">
            {goals.map((goal) => (
              <Link key={goal.id} href={`/goal/${goal.id}`}>
                <GoalListItem
                  title={goal.title}
                  description={goal.description}
                  icon="👍"
                  percentage={12}
                />
              </Link>
            ))}
          </section>
        )
      }
    </>
  );
}
