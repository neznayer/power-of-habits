import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { createContext } from "react";
import { date } from "zod";

const CalendarContext = createContext([]);

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0);
}

function DayCard({ day, onCheck, dayContent }) {
  const golaId = useContext(CalendarContext);
  function handleCheck(e) {
    onCheck(e.target.checked, dayContent ? dayContent.id : "1", day, golaId);
  }

  return (
    <div className="flex flex-col border-2 border-solid border-amber-400 text-sm">
      <p>{day.getDate()}</p>
      <input
        type="checkbox"
        name="done"
        id="done"
        checked={dayContent ? dayContent.done : false}
        onChange={handleCheck}
      />
    </div>
  );
}

export default function CalendarView() {
  const { query, isReady } = useRouter();
  const utils = trpc.useContext();
  //const [goalState, setGoalState] = useState();
  const { id } = query;
  const { data: goal } = trpc.goal.getById.useQuery({ id });
  const mutation = trpc.day.update.useMutation().mutateAsync;

  if (!id) {
    return <div>Loading...</div>;
  }

  if (id && isReady && !goal) {
    return <div>Goal not found</div>;
  }

  const date = new Date();

  const monthDays = daysInMonth(date.getMonth(), date.getFullYear());

  async function onCheck(checked, id, date, goalId) {
    await mutation({ done: checked, id, date, goalId });
    utils.goal.invalidate();
  }

  return (
    <>
      <h2>{goal?.title}</h2>
      <section className="grid grid-cols-7 gap-5">
        <CalendarContext.Provider value={goal?.id}>
          {[...Array(monthDays.getDate()).keys()].map((thisday) => (
            <DayCard
              key={thisday}
              onCheck={onCheck}
              day={new Date(date.getFullYear(), date.getMonth(), thisday - 1)}
              dayContent={goal?.days.find(
                (day) =>
                  day.date.getFullYear() === date.getFullYear() &&
                  day.date.getMonth() === date.getMonth() &&
                  day.date.getDate() === thisday - 1
              )}
            />
          ))}
        </CalendarContext.Provider>
      </section>
    </>
  );
}
