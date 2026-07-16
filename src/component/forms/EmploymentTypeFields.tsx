import { useFormContext } from "react-hook-form";
import RadioInput from "./RadioInput";
import EmployeeWorkScheduleFields from "./EmployeeWorkScheduleFields";

const EmploymentTypeFields = () => {
  const { watch } = useFormContext();
  const employmentType = watch("employmentType");

  return (
    <div className="space-y-4">
      <RadioInput
        label="Employment Type"
        name="employmentType"
        options={[
          { label: "Full-time", value: "FULL_TIME" },
          { label: "Part-time", value: "PART_TIME" },
        ]}
      />
      {employmentType === "PART_TIME" && <EmployeeWorkScheduleFields />}
    </div>
  );
};

export default EmploymentTypeFields;
