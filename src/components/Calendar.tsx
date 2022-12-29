import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

export function Calendar({ goal }) {
  const { data: session } = useSession();

  const days = trpc.day.getDaysByGoalId();

  return <section className="grid-cols-7 gap-0"></section>;
}
