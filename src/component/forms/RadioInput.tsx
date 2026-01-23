import { useFormContext } from "react-hook-form";

type RadioOption = {
  label: string;
  value: string | number;
};

type Props = {
  name: string;
  label: string;
  options: RadioOption[];
  required?: boolean;
};

export default function RadioInput({ name, label, options, required }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-semibold">
          {label}
          {required && <span className="text-red-400">*</span>}
        </span>
      </label>

      <div className="flex flex-row gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="cursor-pointer label justify-start gap-2"
          >
            <input
              type="radio"
              className="radio radio-primary"
              value={option.value}
              {...register(name, { required })}
            />
            <span className="label-text">{option.label}</span>
          </label>
        ))}
      </div>

      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}
