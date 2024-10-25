import { createContext, useContext, JSX } from "solid-js";
import { createStore } from "solid-js/store";

type RadioContextType = {
  value: string;
  onChange: (value: string) => void;
};

const RadioContext = createContext<RadioContextType>();

type RadioProps = {
  value: string;
  children: JSX.Element;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

export function Radio(props: RadioProps) {
  const context = useContext(RadioContext)

  if (!context) {
    throw new Error("Radio must be used within a RadioGroup");
  }

  return (
    <label
      class={`
        px-6 py-4 shadow rounded-lg cursor-pointer transition-all 
        ${context.value === props.value
          ? "bg-gradient-to-t from-red-700 to-red-900 text-red-100 shadow-red-500"
          : "bg-gradient-to-t from-gray-800 to-gray-900 shadow-gray-700"
        }
      `}
    >
      <input
        type="radio"
        class="hidden"
        checked={context.value === props.value}
        onChange={() => context.onChange(props.value)}
        {...props}
      />
      {props.children}
    </label>
  );
}

type RadioGroupProps = {
  initialValue: string;
  children: JSX.Element;
  onChange: Function;
};

export function RadioGroup(props: RadioGroupProps) {
  const [state, setState] = createStore({
    value: props.initialValue,
    onChange: (newValue: string) => {
      setState({ value: newValue });
      props.onChange(newValue);
    },
  });

  return (
    <RadioContext.Provider value={state}>
      {props.children}
    </RadioContext.Provider>
  );
}