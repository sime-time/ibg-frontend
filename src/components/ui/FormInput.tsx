import type { Setter } from "solid-js";
import { TextField, TextFieldLabel, TextFieldInput } from "~/components/ui/TextField"

interface FormInputProps {
  type:
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  setValue: Setter<string>;
}

export default function FormInput(props: FormInputProps) {
  return (
    <TextField class="flex flex-col gap-2">
      <TextFieldLabel for={props.name}>{props.label}</TextFieldLabel>
      <TextFieldInput
        onInput={(event) => {
          props.setValue(event.currentTarget.value);
        }}
        type={props.type}
        id={props.name}
        name={props.name}
        placeholder={props.placeholder ?? props.label}
        required={props.required ?? false}
      ></TextFieldInput>
    </TextField>
  );
}
