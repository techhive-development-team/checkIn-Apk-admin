import { FormProvider } from "react-hook-form";
import Layout from "../../../component/layouts/layout";
import Alert from "../../../component/forms/Alert";
import InputText from "../../../component/forms/InputText";
import InputFile from "../../../component/forms/InputFile";
import { useEmployeeEditForm } from "../../Employee/Edit/useEmployeeEditForm";
import RadioInput from "../../../component/forms/RadioInput";
import { Link } from "react-router-dom";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";

const classDayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const StudentEdit = () => {
  const listPath = "/student";
  const title = "Edit Student";

  const {
    onSubmit,
    loading,
    success,
    message,
    show,
    profilePreview,
    ...methods
  } = useEmployeeEditForm("STUDENT");
  const selectedDays = methods.watch("classDays") ?? [];

  const toggleClassDay = (day: (typeof classDayOptions)[number]) => {
    const nextDays = selectedDays.includes(day)
      ? selectedDays.filter((value) => value !== day)
      : [...selectedDays, day];

    methods.setValue("classDays", nextDays, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <Layout>
      <div className="card max-w-3xl bg-base-100 border">
        <div className="card-body">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Student", path: listPath },
              { label: title },
            ]}
          />
          <h2 className="text-2xl font-bold mb-4">{title}</h2>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {show && <Alert success={success} message={message} />}

              <InputFile
                label="Profile Picture"
                name="profilePic"
                defaultImage={profilePreview}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputText label="First Name" name="firstName" required />
                <InputText label="Last Name" name="lastName" required />
              </div>

              <InputText label="Class" name="studentClass" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputText
                  label="Class Start Time"
                  name="classTimeFrom"
                  type="time"
                  required
                />
                <InputText
                  label="Class End Time"
                  name="classTimeTo"
                  type="time"
                  required
                />
              </div>
              <div>
                <label className="label pb-2">
                  <span className="label-text text-sm font-semibold text-base-content">
                    Class Days
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
                {methods.formState.errors.classDays?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {methods.formState.errors.classDays.message as string}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputText
                  label="Start Date"
                  name="durationFrom"
                  type="date"
                  required
                />
                <InputText
                  label="End Date"
                  name="durationTo"
                  type="date"
                  required
                />
              </div>
              <InputText label="Email" name="email" type="email" required />
              <InputText label="Phone" name="phone" />
              <InputText label="Address" name="address" />

              <RadioInput
                label="Status"
                name="status"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />

              <div className="pt-4 card-actions flex justify-between">
                <Link to={listPath} className="btn btn-soft">
                  Back to Students
                </Link>
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Loading..." : title}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Layout>
  );
};

export default StudentEdit;
