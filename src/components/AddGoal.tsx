import React, { useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "./Button";
import { Input } from "./Input";

export function AddGoal({ onAdd }: { onAdd: () => void }) {
  const [goal, setGoal] = useState({ title: "", description: "" });
  const mutation = trpc.goal.create.useMutation();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoal((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        <Input type="text" name="title" id="title" onInput={handleInput} />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <Input
          type="text"
          name="description"
          id="description"
          value={goal.description}
          onInput={handleInput}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
