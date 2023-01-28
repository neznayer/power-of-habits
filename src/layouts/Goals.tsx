import { trpc } from "../utils/trpc";
import { GoalList } from "../components/GoalList";
import { AddGoal } from "../components/AddGoal";
const Goals = ({}) => {
  const { data: goals } = trpc.goal.getAll.useQuery();
  const utils = trpc.useContext();

  const handleAdd = () => {
    utils.goal.getAll.invalidate();
  };

  return (
    <>
      <main>
        <AddGoal onAdd={handleAdd} />
        <GoalList goals={goals} />
      </main>
    </>
  );
};

export default Goals;
