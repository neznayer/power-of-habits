const Divider = ({ text }: { text: string }) => {
  return (
    <div className="flex w-full items-center justify-center gap-1">
      <hr className="flex-1 border-color_text_ocean" />{" "}
      <span className="inline-block text-ocean">{text}</span>
      <hr className="flex-1 border-color_text_ocean" />
    </div>
  );
};

export default Divider;
