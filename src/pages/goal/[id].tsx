import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { createContext } from "react";
import { Checkbox } from "../../components/Checkbox";
import { useReward } from "react-rewards";
import { MonthControl } from "../../components/MonthControl";
import { CalendarLayout } from "../layouts/Calendar";

import type { Day } from "@prisma/client";
import type { Goal } from "@prisma/client";

const CalendarContext = createContext<string | undefined>("");

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDayFromGoal(goal: Goal & { days: Day[] }, currentDay: Date) {
  const result = goal.days.find(
    (day) =>
      day.date.getFullYear() === currentDay.getFullYear() &&
      day.date.getMonth() === currentDay.getMonth() &&
      day.date.getDate() === currentDay.getDate()
  );

  return result;
}

function getModeFromGoalDay(
  goal: Goal & { days: Day[] },
  currentDay: Date
): "start" | "middle" | "end" | "" {
  const curDate = new Date(currentDay);
  const thisDay = getDayFromGoal(goal, currentDay);
  const prevDay = getDayFromGoal(
    goal,
    new Date(curDate.setDate(curDate.getDate() - 1))
  );
  const nextDay = getDayFromGoal(
    goal,
    new Date(curDate.setDate(curDate.getDate() + 2))
  );

  if (prevDay?.done && thisDay?.done && nextDay?.done) {
    return "middle";
  } else if (prevDay?.done && thisDay?.done && !nextDay?.done) {
    return "end";
  } else if (!prevDay?.done && thisDay?.done && nextDay?.done) {
    return "start";
  }

  return "";
}

interface OnCheckInputI {
  checked: boolean;
  dayId: string;
  day: Date;
  goalId: string;
}

function DayCard({
  day,
  onCheck,
  dayContent,
  id,
  isToday,
  mode,
}: {
  day: Date;
  onCheck: ({}: OnCheckInputI) => void;
  dayContent?: Day;
  id: number;
  isToday: boolean;
  mode: "start" | "end" | "middle" | "";
}) {
  const { reward: confettiReward } = useReward("" + id, "confetti", {
    startVelocity: 15,
    lifetime: 70,
    decay: 0.9,
    spread: 180,
  });

  let className = "";

  switch (mode) {
    case "start":
      className += " rounded-l-full w-full left-[50%] translate-x-[-15px] ";
      break;
    case "end":
      className += " rounded-r-full w-full right-[50%] translate-x-[15px] ";
      break;
    case "middle":
      className += " w-[115%]";
      break;
    default:
      break;
  }

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
        "flex h-full flex-col items-center rounded border-2 " +
        (isToday ? " border-orange-200" : " border-transparent")
      }
    >
      <div className="w-full">
        <p>{day.getDate()}</p>
      </div>

      <div className="relative flex h-[30px] w-full flex-row justify-center">
        <div
          className={"absolute top-[0.6em] h-full bg-orange-300" + className}
        ></div>
        <Checkbox
          className="mt-3"
          checked={dayContent ? dayContent.done : false}
          onCheck={handleCheck}
          id={"" + id}
        />
      </div>
    </div>
  );
}

export default function CalendarView() {
  const { query } = useRouter();
  const utils = trpc.useContext();
  const id = query.id as string;
  const today = new Date(Date.now());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [firstDayOfWeek, setFirstDayOfWeek] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  );

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth())
  );

  useEffect(() => {
    setFirstDayOfWeek(new Date(year, month, 1).getDay());
    setCalendarMonth(new Date(year, month));
  }, [month, year]);

  const {
    data: goal,
    isLoading,
    isLoadingError,
  } = trpc.goal.getById.useQuery({ id }, { enabled: !!id });

  const mutation = trpc.day.update.useMutation({
    onMutate: async (update) => {
      await utils.goal.getById.cancel();

      utils.goal.getById.setData({ id }, (old) => {
        if (old) {
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
        }
      });
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

  async function onCheck(input: OnCheckInputI) {
    await mutation({
      done: input.checked,
      id: input.dayId,
      date: input.day,
      goalId: input.goalId,
    });
  }

  const rows = 6;

  return (
    <CalendarLayout>
      <h2>{goal?.title}</h2>
      <h3>{goal.description}</h3>
      {calendarMonth.getFullYear()}
      <button
        onClick={() => {
          setYear(today.getFullYear());
          setMonth(today.getMonth());
        }}
        className="mr-2 mb-2 rounded-lg bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-400"
      >
        Today
      </button>

      <MonthControl
        onMonthDecrease={() => setMonth(month - 1)}
        onMonthIncrease={() => setMonth(month + 1)}
        monthText={calendarMonth.toLocaleString("en-us", { month: "long" })}
      />

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
                    const thisday = row * 7 + cell + 1;

                    const currentDay = new Date(
                      year,
                      month,
                      thisday - firstDayOfWeek
                    );

                    const isToday =
                      currentDay.getDate() === today.getDate() &&
                      currentDay.getMonth() === today.getMonth() &&
                      currentDay.getFullYear() === today.getFullYear();
                    if (thisday > firstDayOfWeek) {
                      return (
                        <td
                          key={`${row}-${cell}`}
                          className="relative h-[70px] w-[50px]"
                        >
                          <DayCard
                            key={thisday}
                            id={thisday}
                            onCheck={onCheck}
                            day={currentDay}
                            isToday={isToday}
                            dayContent={goal?.days.find(
                              (day) =>
                                day.date.getFullYear() ===
                                  currentDay.getFullYear() &&
                                day.date.getMonth() === currentDay.getMonth() &&
                                day.date.getDate() === currentDay.getDate()
                            )}
                            mode={getModeFromGoalDay(goal, currentDay)}
                          />
                        </td>
                      );
                    } else {
                      return <td key={`${row}-${cell}`}></td>;
                    }
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
