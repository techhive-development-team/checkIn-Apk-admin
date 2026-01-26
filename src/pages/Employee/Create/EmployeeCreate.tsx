import { Link } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import { useEmployeeCreateForm } from "./useEmployeeCreateForm";
import Layout from "../../../component/layouts/layout";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";
import Alert from "../../../component/forms/Alert";
import InputFile from "../../../component/forms/InputFile";
import InputText from "../../../component/forms/InputText";
import { jwtDecode } from "jwt-decode";

const EmployeeCreate = () => {

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
  } = useEmployeeCreateForm(companyId);

  return (
    <Layout>
      <div className="card card-bordered w-full max-w-3xl bg-base-100">
        <div className="card-body">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Employee", path: `/employee` },
              { label: "Add Employee" },
            ]}
          />

          <h3 className="text-2xl font-bold my-4">Create Employee</h3>

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

              <InputText label="Position" name="position" />

              <InputText label="Email" name="email" type="email" required />
              <InputText label="Phone" name="phone" />

              <InputText label="Address" name="address" />

              <div className="pt-4 card-actions flex justify-between">
                <Link
                  to={`/employee`}
                  className="btn btn-soft"
                >
                  Back to Employees
                </Link>

                <button className="btn btn-primary" disabled={loading}>
                  {loading ? "loading..." : "Create Employee"}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeCreate;
