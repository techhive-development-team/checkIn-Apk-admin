import { Link, useNavigate } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import { useEmployeeCreateForm } from "../../Employee/Create/useEmployeeCreateForm";
import Layout from "../../../component/layouts/layout";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";
import Alert from "../../../component/forms/Alert";
import InputFile from "../../../component/forms/InputFile";
import InputText from "../../../component/forms/InputText";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const classDayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const StudentCreate = () => {
  const navigate = useNavigate();
  const createLabel = "Create Student";
  const backPath = "/student";
  const backLabel = "Back to Students";

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token!) as { user: { companyId: string } };
  const companyId = decodedToken?.user?.companyId;
  const {
    onSubmit,
    loading,
    success,
    message,
    show,
    ...methods
  } = useEmployeeCreateForm(companyId, "STUDENT");
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

  useEffect(() => {
    if (success) {
      navigate(backPath);
    }
  }, [success, navigate, backPath]);

  return (
    <Layout>
      <div className="card card-bordered w-full max-w-3xl bg-base-100">
        <div className="card-body">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Student", path: "/student" },
              { label: "Add Student" },
            ]}
          />

          <h3 className="text-2xl font-bold my-4">{createLabel}</h3>

          <FormProvider {...methods}>
            <form
              className="space-y-4"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              {show && <Alert success={success} message={message} />}

              <InputFile
                label="Profile Picture"
                name="profilePic"
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

              <div className="pt-4 card-actions flex justify-between">
                <Link
                  to={backPath}
                  className="btn btn-soft"
                >
                  {backLabel}
                </Link>

                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "loading..." : createLabel}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Layout>
  );
};

export default StudentCreate;
