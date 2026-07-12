import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../component/layouts/layout";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";
import { FormProvider } from "react-hook-form";
import Alert from "../../../component/forms/Alert";
import InputText from "../../../component/forms/InputText";
import InputFile from "../../../component/forms/InputFile";
import InputSelect from "../../../component/forms/InputSelect";
import { useCompanyEditForm } from "./useCompanyEditForm";
import DowngradeMembersModal from "./DowngradeMembersModal";
import RadioInput from "../../../component/forms/RadioInput";
import { useEffect } from "react";
import { useAuthStore } from "../../../stores/authStore";
import { SUBSCRIPTION_PLANS, getPlan } from "../../../config/plans";

const CompanyEdit = () => {
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.user?.role);
  const isAdmin = role === "ADMIN";
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
    downgrade,
    downgradeLoading,
    confirmDowngrade,
    downloadRemovedMembers,
    downloadRemovedMembersAttendance,
    closeDowngrade,
    ...methods
  } =
    useCompanyEditForm();
  const selectedType = methods.watch("type");
  const subscriptionActive = methods.watch("subScribeStatus") === "Active";
  const isRecoveryVerified = !!companyData?.recoveryEmailVerifiedAt;
  const needsRecoveryVerification =
    !companyData?.recoveryEmail || !isRecoveryVerified;

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

                {isAdmin ? (
                  subscriptionActive ? (
                    <div>
                      <InputSelect
                        label="Subscription Plan"
                        name="plan"
                        options={SUBSCRIPTION_PLANS.map((plan) => ({
                          label: `${plan.name} (${plan.employeeRange})`,
                          value: plan.key,
                        }))}
                      />
                      <p className="mt-1 text-xs text-base-content/70">
                        Member limit:{" "}
                        {getPlan(methods.watch("plan")).maxEmployees === null
                          ? "Unlimited"
                          : getPlan(methods.watch("plan")).maxEmployees}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border border-base-300 bg-base-200/40 p-3">
                      <p className="text-sm">
                        Subscription is inactive — this company is on the{" "}
                        <span className="font-semibold">Free</span> plan (up to
                        10 members). Set the subscription to{" "}
                        <span className="font-semibold">Active</span> to choose a
                        paid plan.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="rounded-md border border-base-300 bg-base-200/40 p-3">
                    <p className="text-sm">
                      Current plan:{" "}
                      <span className="font-semibold">
                        {getPlan(companyData?.plan).name}
                      </span>{" "}
                      <span className="text-base-content/70">
                        ({getPlan(companyData?.plan).employeeRange})
                      </span>
                    </p>
                    <Link to="/pricing" className="link link-primary text-sm">
                      View plans & contact us to upgrade
                    </Link>
                  </div>
                )}

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

      <DowngradeMembersModal
        open={downgrade.open}
        targetPlanKey={downgrade.targetPlanKey}
        cap={downgrade.cap}
        members={downgrade.members}
        loading={downgradeLoading}
        onDownload={downloadRemovedMembers}
        onDownloadAttendance={downloadRemovedMembersAttendance}
        onConfirm={confirmDowngrade}
        onClose={closeDowngrade}
      />
    </Layout>
  );
};

export default CompanyEdit;
