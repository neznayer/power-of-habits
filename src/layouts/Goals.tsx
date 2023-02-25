import { trpc } from "../utils/trpc";
import { GoalList } from "../components/GoalList";
import { AddGoal } from "../components/AddGoal";
import Header from "../components/Header";
import { type GoalType } from "../server/trpc/router/goal";
import { type Goal } from "@prisma/client";
import { useSession } from "next-auth/react";

const Goals = () => {
  const session = useSession();
  const { data: goals } = trpc.goal.getAll.useQuery();
  const addMutation = trpc.goal.create.useMutation({
    onMutate: async (update) => {
      await utils.goal.getAll.cancel();

      const newlyAddedGoal = {
        ...update,
        userId: session.data?.user?.id,
      } as Goal;

      utils.goal.getAll.setData(undefined, (old) => {
        if (old) {
          return [...old, newlyAddedGoal];
        }
        return [newlyAddedGoal];
      });
    },
    onSettled: () => {
      utils.goal.getAll.invalidate();
    },
  }).mutateAsync;

  const deleteMutation = trpc.goal.deleteById.useMutation({
    onMutate: async (update) => {
      await utils.goal.getAll.cancel();
      utils.goal.getAll.setData(undefined, (old) => {
        return old?.filter((goal) => goal.id !== update.id);
      });
    },
    onSettled: () => {
      utils.goal.getAll.invalidate();
    },
  }).mutateAsync;

  const utils = trpc.useContext();

  const handleAdd = async (goal: GoalType) => {
    addMutation(goal);
  };

  const handleDelete = async (goalId: string) => {
    deleteMutation({ id: goalId });
  };

  return (
    <>
      <Header />
      <main className="flex h-full flex-col items-center justify-center">
        <GoalList goals={goals} onDelete={handleDelete} />
        <AddGoal onAdd={handleAdd} />
      </main>
    </>
  );
};

export default Goals;
