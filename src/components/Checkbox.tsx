import styles from "./checkbox.module.sass";

export function Checkbox({
  checked,
  title = "",
  onCheck,
}: {
  checked: boolean;
  title?: string;
  onCheck: (checked: boolean) => void;
}) {
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    onCheck(e.target.checked);
  };
  return (
    <label className={styles.container}>
      {title}
      <input type="checkbox" checked={checked} onChange={handleCheck} />
      <span className={styles.checkmark}></span>
    </label>
  );
}
