import { useId, type HTMLInputTypeAttribute } from "react";

interface LabeledInputProps {
  labelText: string;
  inputType?: HTMLInputTypeAttribute;
  inputName: string;
  required: boolean
}

export default function LabeledInput({
  labelText,
  inputType = "text",
  inputName,
  required
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
        className="border-black border-solid border-2"
      />
    </label>
  );
}
