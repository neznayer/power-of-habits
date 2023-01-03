export function DaysInRow({ mode }: { mode: "start" | "end" | "middle" | "" }) {
  let className = "";

  switch (mode) {
    case "start":
      className += " rounded-l-full w-full ";
      break;
    case "end":
      className += " rounded-r-full w-full ";
      break;
    case "middle":
      className += " w-full ";
      break;
    default:
      break;
  }

  return (
    <div
      className={
        className + "absolute bottom-0 left-0 z-0 h-[35px] bg-orange-300"
      }
    ></div>
  );
}
