import { Link } from "react-router-dom";
import Layout from "../../../component/layouts/layout";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";
import { FormProvider } from "react-hook-form";
import Alert from "../../../component/forms/Alert";
import InputText from "../../../component/forms/InputText";
import InputFile from "../../../component/forms/InputFile";
import RadioInput from "../../../component/forms/RadioInput";

import { useAttendanceEditForm } from "./useAttendanceEditForm";

const AttendanceEdit = () => {
  const {
    onSubmit,
    loading,
    success,
    message,
    show,
    ...methods
  } = useAttendanceEditForm();

  return (
    <Layout>
      <div className="flex justify-start">
        <div className="card card-bordered w-full max-w-2xl bg-base-100">
          <div className="card-body">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Attendance", path: "/attendance" },
                { label: "Edit Attendance" },
              ]}
            />

            <h3 className="text-2xl font-bold my-4">
              Edit Attendance
            </h3>

            <FormProvider {...methods}>
              <form
                className="space-y-4"
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                {show && (
                  <Alert success={success} message={message} />
                )}

                {/* Check-in Section */}
                <InputText
                  label="Check In Location"
                  name="checkInLocation"
                />

                <InputFile
                  label="Check In Photo"
                  name="checkInPhoto"
                />

                {/* Check-out Section */}
                <InputText
                  label="Check Out Location"
                  name="checkOutLocation"
                />

                <InputFile
                  label="Check Out Photo"
                  name="checkOutPhoto"
                />

                {/* Status */}
                <RadioInput
                  label="Status"
                  name="status"
                  options={[
                    { label: "Present", value: "present" },
                    { label: "Absent", value: "absent" },
                  ]}
                />

                <div className="pt-4 card-actions flex justify-between">
                  <Link
                    to="/attendance"
                    className="btn btn-soft"
                  >
                    Back to Attendance
                  </Link>

                  <button
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Edit Attendance"}
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceEdit;
