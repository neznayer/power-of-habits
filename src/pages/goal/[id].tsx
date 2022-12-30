import { useRouter } from "next/router";
import { useContext } from "react";
import { trpc } from "../../utils/trpc";
import { createContext } from "react";
import type { daySchema } from "../../server/trpc/router/day";
import type { z } from "zod";
import { Checkbox } from "../../components/Checkbox";

const CalendarContext = createContext<string | undefined>("");

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0);
}

interface OnCheckInputI {
  checked: boolean;
  dayId?: string;
  day: Date;
  goalId: string;
}

function DayCard({
  day,
  onCheck,
  dayContent,
}: {
  day: Date;
  onCheck: ({}: OnCheckInputI) => void;
  dayContent?: z.infer<typeof daySchema>;
}) {
  const goalId = useContext(CalendarContext) as unknown as string;

  function handleCheck(checked: boolean) {
    onCheck({
      checked,
      dayId: dayContent ? dayContent.id : "1",
      day,
      goalId,
    });
  }

  return (
    <div className="flex flex-col border-2 border-solid border-amber-400 text-sm">
      <p>{day.getDate()}</p>
      <Checkbox
        checked={dayContent ? dayContent.done : false}
        onCheck={handleCheck}
      />
    </div>
  );
}

export default function CalendarView() {
  const { query, isReady } = useRouter();
  const utils = trpc.useContext();
  const id = query.id as string;

  const { data: goal } = trpc.goal.getById.useQuery({ id }, { enabled: !!id });

  const mutation = trpc.day.update.useMutation({
    onMutate: async (update) => {
      console.log("optimistic update", update);
      await utils.goal.getById.cancel();

      const prevData = utils.day.getDaysByGoalId.getData({ id });

      utils.goal.getById.setData({ id }, (old) => {
        const optimisticDays = old?.days?.map((day) => {
          if (day.id === update.id) {
            return update;
          } else {
            return day;
          }
        });
        return { ...old, days: optimisticDays };
      });

      return { prevData };
    },
    onSettled: () => {
      utils.goal.getById.invalidate();
    },
  }).mutateAsync;

  if (id && isReady && !goal) {
    return <div>Goal not found</div>;
  }

  const date = new Date();

  const monthDays = daysInMonth(date.getMonth(), date.getFullYear());

  async function onCheck(input: OnCheckInputI) {
    await mutation({
      done: input.checked,
      id: input.dayId,
      date: input.day,
      goalId: input.goalId,
    });
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
