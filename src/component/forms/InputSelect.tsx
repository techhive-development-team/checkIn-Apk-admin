import { Controller, useFormContext } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

interface InputSelectProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
}

const InputSelect: React.FC<InputSelectProps> = ({
  name,
  label,
  options,
  placeholder,
  required,
}) => {
  const { control } = useFormContext();

  return (
    <div className="form-control w-full">
      <label className="label pb-2">
        <span className="label-text text-sm text-base-content font-semibold">
          {label}
          {required ? " *" : ""}
        </span>
      </label>

      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field, fieldState: { error } }) => (
          <>
            <select
              {...field}
              value={field.value ?? ""}
              className="select select-bordered w-full border-base-300 bg-base-100 text-base-content"
            >
              <option value="" disabled>
                {placeholder || `Select ${label}`}
              </option>
              {options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="text-base-content bg-base-100"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            {error && (
              <p className="text-red-500 mt-1">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default InputSelect;