import { Link } from "react-router-dom";
import Layout from "../../../component/layouts/layout";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";
import { FormProvider } from "react-hook-form";
import Alert from "../../../component/forms/Alert";
import InputText from "../../../component/forms/InputText";
import InputFile from "../../../component/forms/InputFile";
import InputSelect from "../../../component/forms/InputSelect";
import { useCompanyEditForm } from "./useCompanyEditForm";
import RadioInput from "../../../component/forms/RadioInput";

const CompanyEdit = () => {
  const {
    onSubmit,
    loading,
    success,
    message,
    show,
    logoPreview,
    companyData,
    verifyingRecovery,
    recoveryVerifySuccess,
    recoveryVerifyMessage,
    showRecoveryVerifyMessage,
    sendRecoveryVerification,
    refreshVerificationStatus,
    ...methods
  } =
    useCompanyEditForm();
  const selectedType = methods.watch("type");
  const isRecoveryVerified = !!companyData?.recoveryEmailVerifiedAt;
  const needsRecoveryVerification =
    !companyData?.recoveryEmail || !isRecoveryVerified;

  return (
    <Layout>
      <div className="flex justify-start">
        <div className="card card-bordered w-full max-w-2xl bg-base-100">
          <div className="card-body">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Company", path: "/company" },
                { label: "Edit Company" },
              ]}
            />

            <h3 className="text-2xl font-bold my-4">Edit Company</h3>

            <FormProvider {...methods}>
              <form
                className="space-y-4"
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                {show && <Alert success={success} message={message} />}
                {showRecoveryVerifyMessage && (
                  <Alert
                    success={recoveryVerifySuccess}
                    message={recoveryVerifyMessage}
                  />
                )}

                <InputText label="Company Name" name="name" required />
                <InputText label="Email" name="email" type="email" required />
                <InputText
                  label="Recovery Email"
                  name="recoveryEmail"
                  type="email"
                  rightBadge={
                    isRecoveryVerified ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        aria-label="Verified"
                      >
                        <circle cx="12" cy="12" r="10" fill="#1d9bf0" />
                        <path
                          d="M8.5 12.5l2.2 2.2 4.8-4.8"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : undefined
                  }
                />
                <p className="-mt-2 mb-3 text-xs text-base-content/70">
                  Used for account recovery if you lose access to primary email.
                </p>
                {needsRecoveryVerification && (
                  <div className="rounded-md border border-info/30 bg-info/10 p-3">
                    <p className="text-sm font-medium">
                      Recovery Email Verification:{" "}
                      <span className="text-warning font-semibold">
                        Not verified
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-base-content/80">
                      Verify this email to secure account recovery access.
                    </p>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline mt-3"
                      onClick={sendRecoveryVerification}
                      disabled={verifyingRecovery}
                    >
                      {verifyingRecovery ? "Sending..." : "Send Verify Email"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost mt-3 ml-2"
                      onClick={refreshVerificationStatus}
                    >
                      I already verified, refresh
                    </button>
                  </div>
                )}
                <RadioInput
                  label="Type"
                  name="type"
                  options={[
                    { label: "Company", value: "Company" },
                    { label: "Academic", value: "Academic" },
                  ]}
                />
                {selectedType === "Company" && (
                  <InputSelect
                    label="Company Type"
                    name="subType"
                    options={[
                      { label: "Private", value: "Private" },
                      { label: "Public", value: "Public" },
                      { label: "NGO", value: "NGO" },
                      { label: "Startup", value: "Startup" },
                    ]}
                  />
                )}
                <InputText label="Address" name="address" />
                <InputText label="Phone" name="phone" />
                <InputText
                  label="Total Employees"
                  name="totalEmployee"
                  type="number"
                  readonly
                />

                <InputFile
                  label="Logo"
                  name="logo"
                  defaultImage={logoPreview}
                />

                <RadioInput
                  label="Subscription"
                  name="subScribeStatus"
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                />

                <RadioInput
                  label="Status"
                  name="status"
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ]}
                />

                <div className="pt-4 card-actions flex justify-between">
                  <Link to="/company" className="btn btn-soft">
                    Back to Company
                  </Link>
                  <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Loading..." : "Edit Company"}
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

export default CompanyEdit;
