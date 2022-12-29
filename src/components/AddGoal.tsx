import { useState } from "react";
import { trpc } from "../utils/trpc";

export function AddGoal({ onAdd }) {
  const [goal, setGoal] = useState({ title: "", description: "" });
  const mutation = trpc.goal.create.useMutation();

  const handleInput = (e) => {
    setGoal((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mutation.mutateAsync(goal);
    onAdd();
  };

  return (
    <form
      action=""
      method="post"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={goal.title}
          onInput={handleInput}
          className="rounded border-2 border-solid border-slate-400"
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          value={goal.description}
          onInput={handleInput}
          className="rounded border-2 border-solid border-slate-400"
        />
      </div>
      <button
        type="submit"
        className="inline-block w-[100px] border bg-orange-300"
      >
        Submit
      </button>
    </form>
  );
}
