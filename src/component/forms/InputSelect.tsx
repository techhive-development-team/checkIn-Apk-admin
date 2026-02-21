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
      <label className="label">
        <span className="label-text">
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
              className="select select-bordered w-full"
              defaultValue=""
            >
              <option value="" disabled>
                {placeholder || `Select ${label}`}
              </option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
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