import { useFormContext } from "react-hook-form";
import InputText from "./InputText";

const classDayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const EmployeeWorkScheduleFields = () => {
  const { watch, setValue, formState } = useFormContext();
  const selectedDays: string[] = watch("classDays") ?? [];

  const toggleClassDay = (day: (typeof classDayOptions)[number]) => {
    const nextDays = selectedDays.includes(day)
      ? selectedDays.filter((value) => value !== day)
      : [...selectedDays, day];

    setValue("classDays", nextDays, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-base-300 p-4">
      <p className="text-sm font-semibold text-base-content">
        Part-time work schedule
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputText
          label="Work Start Time"
          name="classTimeFrom"
          type="time"
          required
        />
        <InputText
          label="Work End Time"
          name="classTimeTo"
          type="time"
          required
        />
      </div>
      <div>
        <label className="label pb-2">
          <span className="label-text text-sm font-semibold text-base-content">
            Work Days
          </span>
        </label>
        <div className="flex flex-wrap gap-3">
          {classDayOptions.map((day) => (
            <label key={day} className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={selectedDays.includes(day)}
                onChange={() => toggleClassDay(day)}
              />
              <span className="text-sm">{day}</span>
            </label>
          ))}
        </div>
        {formState.errors.classDays?.message && (
          <p className="text-red-500 text-xs mt-1">
            {formState.errors.classDays.message as string}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmployeeWorkScheduleFields;
