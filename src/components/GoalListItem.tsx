import type { Goal } from "@prisma/client";
import styles from "./goal-list-item.module.sass";

type InputGoalT = Pick<Goal, "title" | "description"> & {
  icon: string;
  percentage: number;
  bgColor?: string;
};

export function GoalListItem({
  title,
  description,
  icon,
  percentage,
  bgColor,
}: InputGoalT) {
  return (
    <section
      className={`${styles["list-item-container"]} ${
        styles[bgColor || "color-1"]
      }`}
    >
      <div className={styles["icon-container"]}>
        <p className="text-center text-3xl">{icon}</p>
      </div>
      <h2 className={styles.title}>{title}</h2>
      <h3 className={styles.description}>{description}</h3>
      <h3 className={styles.percentage}>{percentage}%</h3>
    </section>
  );
}
