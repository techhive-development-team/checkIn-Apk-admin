import { Link } from "react-router-dom";
import Layout from "../../../component/layouts/layout";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";
import { FormProvider } from "react-hook-form";
import Alert from "../../../component/forms/Alert";
import InputText from "../../../component/forms/InputText";
import InputFile from "../../../component/forms/InputFile";
import { useAdminProfileEditForm } from "./useAdminProfileForm";
import { useClientProfileEditForm } from "./useClientProfileForm";
import { jwtDecode } from "jwt-decode";

const ProfileEdit = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decodedToken = jwtDecode<{ user: { systemRole: string; userId: string } }>(token);
  const systemRole = decodedToken?.user?.systemRole;

  if (systemRole === "SUPER_ADMIN") {
    const formHook = useAdminProfileEditForm();
    if (!formHook) return null;

    const { onSubmit, loading, success, message, show, logoPreview, ...methods } = formHook;

    return (
      <Layout>
        <div className="flex justify-start">
          <div className="card card-bordered w-full max-w-2xl bg-base-100">
            <div className="card-body">
              <Breadcrumb
                items={[
                  { label: "Home", path: "/" },
                  { label: "Profile", path: "/profile" },
                  { label: "Edit Profile" },
                ]}
              />
              <h3 className="text-2xl font-bold my-4">Edit Profile</h3>

              <FormProvider {...methods}>
                <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
                  {show && <Alert success={success} message={message} />}
                  <InputText label="Name" name="name" required />
                  <InputText label="Email" name="email" type="email" required />
                  <InputFile
                    label="Logo"
                    name="logo"
                    defaultImage={logoPreview}
                  />
                  <div className="pt-4 card-actions flex justify-between">
                    <Link to="/profile" className="btn btn-soft">Back to Profile</Link>
                    <button className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (systemRole === "CLIENT") {
    const formHook = useClientProfileEditForm();
    if (!formHook) return null;

    const { onSubmit, loading, success, message, show, logoPreview, ...methods } = formHook;

    return (
      <Layout>
        <div className="flex justify-start">
          <div className="card card-bordered w-full max-w-2xl bg-base-100">
            <div className="card-body">
              <Breadcrumb
                items={[
                  { label: "Home", path: "/" },
                  { label: "Profile", path: "/profile" },
                  { label: "Edit Profile" },
                ]}
              />
              <h3 className="text-2xl font-bold my-4">Edit Profile</h3>

              <FormProvider {...methods}>
                <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
                  {show && <Alert success={success} message={message} />}
                  <InputText label="Name" name="name" required />
                  <InputText label="Email" name="email" type="email" required />
                  <InputText label="Company Type" name="companyType" />
                  <InputText label="Phone" name="phone" />
                  <InputText label="Address" name="address" />
                  <InputText label="Total Employees" name="totalEmployees" />
                  <InputFile
                    label="Logo"
                    name="logo"
                    defaultImage={logoPreview}
                  />
                  <div className="pt-4 card-actions flex justify-between">
                    <Link to="/profile" className="btn btn-soft">Back to Profile</Link>
                    <button className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
};

export default ProfileEdit;
