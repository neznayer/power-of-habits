import { useRouter } from "next/router";
import { useContext } from "react";
import { trpc } from "../../utils/trpc";
import { createContext } from "react";
import type { daySchema } from "../../server/trpc/router/day";
import type { z } from "zod";
import { Checkbox } from "../../components/Checkbox";
import { useReward } from "react-rewards";
import { CalendarLayout } from "../layouts/calendar";

const CalendarContext = createContext<string | undefined>("");

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
  id,
  isToday,
}: {
  day: Date;
  onCheck: ({}: OnCheckInputI) => void;
  dayContent?: z.infer<typeof daySchema>;
  id: number;
  isToday: boolean;
}) {
  const { reward: confettiReward } = useReward("" + id, "confetti", {
    startVelocity: 15,
    lifetime: 70,
    decay: 0.9,
    spread: 180,
  });

  const goalId = useContext(CalendarContext) as unknown as string;

  function handleCheck(checked: boolean) {
    if (checked) {
      confettiReward();
    }
    onCheck({
      checked,
      dayId: dayContent ? dayContent.id : "1",
      day,
      goalId,
    });
  }

  return (
    <div
      className={
        "flex flex-col text-sm" +
        (isToday && " rounded border-2 border-orange-200")
      }
    >
      <p>{day.getDate()}</p>

      <Checkbox
        checked={dayContent ? dayContent.done : false}
        onCheck={handleCheck}
        id={"" + id}
      />
    </div>
  );
}

export default function CalendarView() {
  const { query } = useRouter();
  const utils = trpc.useContext();
  const id = query.id as string;

  const today = new Date(Date.now());

  const {
    data: goal,
    isLoading,
    isLoadingError,
  } = trpc.goal.getById.useQuery({ id }, { enabled: !!id });

  const mutation = trpc.day.update.useMutation({
    onMutate: async (update) => {
      await utils.goal.getById.cancel();

      const prevData = utils.day.getDaysByGoalId.getData({ id });

      utils.goal.getById.setData({ id }, (old) => {
        const isNewDay = !old?.days.some((day) => day.id === update.id);

        if (isNewDay) {
          return { ...old, days: [...old?.days, update] };
        }

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isLoadingError) {
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

  const rows = Math.ceil(monthDays.getDate() / 7);
  return (
    <CalendarLayout>
      <h2>{goal?.title}</h2>
      <table>
        <thead>
          <tr>
            {daysOfWeek.map((day) => {
              return <th key={day}>{day}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          <CalendarContext.Provider value={goal?.id}>
            {[...Array(rows).keys()].map((row) => {
              return (
                <tr key={row}>
                  {[...Array(7).keys()].map((cell) => {
                    const thisday = row * 7 + cell;
                    return (
                      <td key={`${row}-${cell}`}>
                        <DayCard
                          key={thisday}
                          id={thisday}
                          onCheck={onCheck}
                          day={
                            new Date(
                              date.getFullYear(),
                              date.getMonth(),
                              thisday - 1
                            )
                          }
                          isToday={thisday === today.getDate() + 1}
                          dayContent={goal?.days.find(
                            (day) =>
                              day.date.getFullYear() === date.getFullYear() &&
                              day.date.getMonth() === date.getMonth() &&
                              day.date.getDate() === thisday - 1
                          )}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </CalendarContext.Provider>
        </tbody>
      </table>
    </CalendarLayout>
  );
}
