import { Link, useNavigate } from "react-router-dom";
import { useCompanyCreateForm } from "./useCompanyCreateForm";
import Layout from "../../../component/layouts/layout";
import { FormProvider } from "react-hook-form";
import Alert from "../../../component/forms/Alert";
import InputText from "../../../component/forms/InputText";
import InputFile from "../../../component/forms/InputFile";
import InputSelect from "../../../component/forms/InputSelect";
import RadioInput from "../../../component/forms/RadioInput";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";
import { useEffect } from "react";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const { onSubmit, loading, success, message, show, ...methods } = useCompanyCreateForm();
  const selectedType = methods.watch("type");

  useEffect(() => {
    if (success) {
      navigate("/company");
    }
  }, [success, navigate]);

  return (
    <Layout>
      <div className="flex justify-start">
        <div className="card card-bordered w-full max-w-2xl bg-base-100">
          <div className="card-body">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Company", path: "/company" },
                { label: "Add Company" },
              ]}
            />
            <h3 className="text-2xl font-bold my-4">Create Company</h3>

            <FormProvider {...methods}>
              <form className="space-y-4" onSubmit={methods.handleSubmit(onSubmit)}>
                {show && <Alert success={success} message={message} />}

                <InputText label="Company Name" name="name" required />
                <InputText label="Email" name="email" required type="email" />
                <RadioInput
                  label="Type"
                  name="type"
                  required
                  options={[
                    { label: "Company", value: "Company" },
                    { label: "Academic", value: "Academic" },
                  ]}
                />
                {selectedType === "Company" && (
                  <InputSelect
                    label="Company Type"
                    name="subType"
                    required
                    options={[
                      { label: "Private", value: "Private" },
                      { label: "Public", value: "Public" },
                      { label: "NGO", value: "NGO" },
                      { label: "Startup", value: "Startup" },
                    ]}
                  />
                )}
                <InputText
                  label="Recovery Email"
                  name="recoveryEmail"
                  type="email"
                  required
                />
                <p className="-mt-2 mb-3 text-xs text-base-content/70">
                  Used for account recovery if you lose access to primary email.
                </p>
                <InputText label="Address" name="address" />
                <InputText label="Phone" name="phone" />
                {/* <InputText label="Total Employees" name="totalEmployee" /> */}

                <InputFile label="Logo" name="logo" required />

                <div className="pt-4 card-actions flex justify-between">
                  <Link to="/company" className="btn btn-soft">
                    Back to Company
                  </Link>
                  <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Loading..." : "Create Company"}
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

export default CompanyCreate;
