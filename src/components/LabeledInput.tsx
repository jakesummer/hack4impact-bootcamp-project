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
    <label className="flex flex-col" htmlFor={id}>
      {labelText}
      <input
        type={inputType}
        id={id}
        name={inputName}
        required={required}
        value={value}
        onChange={onChange}
        className="border-black border-solid border-2"
      />
    </label>
  );
}
