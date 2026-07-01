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
      <label className="label pb-1">
        <span className="text-sm font-semibold text-base-content">
          {label}
          {required && <span className="text-red-400">*</span>}
        </span>
      </label>

      <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex cursor-pointer items-center gap-2.5">
            <input
              type="radio"
              className="radio radio-sm text-sky-600"
              value={option.value}
              {...register(name, { required })}
            />
            <span className="text-sm text-base-content">{option.label}</span>
          </label>
        ))}
      </div>

      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}
