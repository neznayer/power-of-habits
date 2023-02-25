import { type SyntheticEvent, useState, useRef } from "react";
import { type GoalType } from "../server/trpc/router/goal";
import { Button } from "./Button";
import { Input } from "./Input";
import data, { type Emoji } from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  arrow,
} from "@floating-ui/react";
import { init } from "emoji-mart";
init({ data });

export function AddGoal({ onAdd }: { onAdd: (goal: GoalType) => void }) {
  const [goal, setGoal] = useState({ title: "", description: "" });
  const [addingMode, setAddingMode] = useState<boolean>(false);
  const [emojiId, setEmojiId] = useState("+1");
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);
  const {
    x,
    y,
    strategy,
    refs,
    context,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
    placement,
  } = useFloating({
    placement: "left",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getFloatingProps, getReferenceProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoal((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const isValid = !!goal.title;
    const formData = new FormData(e.target as HTMLFormElement);

    if (isValid) {
      onAdd(Object.fromEntries(formData) as GoalType);
    }
  };

  const staticSide =
    {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    }[placement.split("-")[0] || "left"] || "right";

  return (
    <>
      {addingMode && (
        <form action="" onSubmit={handleSubmit}>
          <section className="grid grid-cols-[90px_1fr] grid-rows-2">
            {isOpen && (
              <FloatingFocusManager context={context} modal={false}>
                <div
                  ref={refs.setFloating}
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                    width: "max-content",
                  }}
                  {...getFloatingProps()}
                >
                  <Picker
                    onEmojiSelect={(em: Emoji) => {
                      setEmojiId(em.id);
                      setIsOpen(false);
                    }}
                  />
                  <div
                    ref={arrowRef}
                    style={{
                      position: "absolute",
                      left: arrowX != null ? `${arrowX}px` : "",
                      top: arrowY != null ? `${arrowY}px` : "",
                      [staticSide]: "-6px",
                    }}
                    className="h-4 w-4 rotate-45 bg-color_text_ocean"
                  ></div>
                </div>
              </FloatingFocusManager>
            )}

            <div
              ref={refs.setReference}
              {...getReferenceProps()}
              className="col-start-1 row-span-2 flex h-20 w-20 cursor-pointer items-center justify-center self-center rounded-full text-4xl transition-colors hover:bg-color_accent"
            >
              <em-emoji id={emojiId} />
            </div>
            <input
              type="text"
              readOnly
              hidden
              name="emoji"
              id="emoji"
              value={emojiId}
            />

            <div className="col-start-2 row-start-1 text-lg">
              <label htmlFor="title">Title</label>
              <Input
                onChange={handleInput}
                type="text"
                name="title"
                id="title"
                onInput={handleInput}
              />
            </div>
            <div className="col-start-2 row-start-2 text-lg">
              <label htmlFor="description">Description</label>
              <Input
                type="text"
                name="description"
                id="description"
                value={goal.description}
                onInput={handleInput}
              />
            </div>
          </section>
          <Button type="submit">Submit</Button>
        </form>
      )}
      {!addingMode && (
        <Button onClick={() => setAddingMode(true)}> + Add new goal</Button>
      )}
    </>
  );
}
