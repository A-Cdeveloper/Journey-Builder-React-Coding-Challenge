type FormItemProps = {
  itemId: string;
  itemName: string;
  isSelected: boolean;
  classes: string;
  onSelect: (nodeId: string) => void;
};

export default function FormItem({
  itemId,
  itemName,
  isSelected,
  classes,
  onSelect,
}: FormItemProps) {
  const basicStyle =
    "w-full cursor-pointer rounded-md p-2 text-left text-sm text-slate-800 hover:bg-slate-100";

  return (
    <button
      type="button"
      onClick={() => onSelect(itemId)}
      aria-pressed={isSelected}
      aria-label={`Select form ${itemName}`}
      className={`${basicStyle} ${classes}
      ${isSelected ? "bg-slate-200 font-medium text-slate-900" : ""}
      `}
    >
      {itemName}
    </button>
  );
}
