interface PrimaryButtonProps {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  form?: string;
}

export default function PrimaryButton({
  text,
  onClick,
  form,
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      form={form}
      className="bg-green-medium w-full text-2xl text-cream-light py-3 rounded-xl cursor-pointer hover:bg-green-dark"
    >
      {text}
    </button>
  );
}
