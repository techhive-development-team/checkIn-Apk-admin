import { useFormContext } from "react-hook-form";

type Props = {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "checkbox" | "date" | "time";
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  min?: string;
};

const InputText = ({
  label,
  name,
  type = "text",
  placeholder,
  readonly = false,
  required = false,
  min,
}: Props) => {
  const formContext = useFormContext();
  const register = formContext?.register;
  const errors = formContext?.formState.errors;

  const error = errors?.[name]?.message as string | undefined;

  if (type === "checkbox") {
    return (
      <div className="flex items-center gap-2 mb-4">
        <input
          {...(register ? register(name) : {})}
          type="checkbox"
          className="accent-sky-500"
          disabled={readonly}
        />
        <span className="text-sm font-medium text-gray-700">
          {label}
          {required && "*"}
        </span>
        {error && <span className="text-red-500 ml-2 text-xs">{error}</span>}
      </div>
    );
  }

  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-semibold mb-1 text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        {...(register ? register(name) : {})}
        type={type}
        placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
        readOnly={readonly}
        disabled={readonly}
        min={type === "date" ? min : undefined}
        className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400
          bg-transparent text-gray-400 placeholder-gray-400
          ${error ? "border-red-500" : "border-gray-300"}
          ${readonly ? "cursor-not-allowed" : ""}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputText;
