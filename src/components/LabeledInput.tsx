import {
  useId,
  type ChangeEventHandler,
  type HTMLInputTypeAttribute,
} from "react";

interface LabeledInputProps {
  labelText: string;
  inputType?: HTMLInputTypeAttribute;
  inputName: string;
  required: boolean;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function LabeledInput({
  labelText,
  inputType = "text",
  inputName,
  required,
  value,
  onChange,
}: LabeledInputProps) {
  const id = useId();

  return (
    <label className="flex flex-col gap-1.5 w-full" htmlFor={id}>
      {labelText}
      <input
        type={inputType}
        id={id}
        name={inputName}
        required={required}
        value={value}
        onChange={onChange}
        className="bg-white border border-black rounded-md h-10 px-3 focus:outline-2 focus:outline-offset-1 focus:outline-green-light"
      />
    </label>
  );
}
