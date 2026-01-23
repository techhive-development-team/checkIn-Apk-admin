import { FormProvider } from "react-hook-form";
import Layout from "../../../component/layouts/layout";
import Alert from "../../../component/forms/Alert";
import InputText from "../../../component/forms/InputText";
import InputFile from "../../../component/forms/InputFile";
import { useEmployeeEditForm } from "./useEmployeeEditForm";
import RadioInput from "../../../component/forms/RadioInput";
import { Link } from "react-router-dom";

const EmployeeEdit = () => {
  const {
    onSubmit,
    loading,
    success,
    message,
    show,
    profilePreview,
    ...methods
  } = useEmployeeEditForm();

  return (
    <Layout>
      <div className="card max-w-3xl bg-base-100 border">
        <div className="card-body">
          <h2 className="text-2xl font-bold mb-4">Edit Employee</h2>

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

              <InputText label="Email" name="email" type="email" required />
              <InputText label="Position" name="position" />
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
                <Link to="/employee" className="btn btn-soft">
                  Back to Employee
                </Link>
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "Loading..." : "Edit Employee"}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeEdit;
