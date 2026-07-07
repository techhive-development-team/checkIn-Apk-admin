import { Link } from "react-router-dom";
import Layout from "../../../component/layouts/layout";
import Breadcrumb from "../../../component/layouts/common/Breadcrumb";
import { FormProvider } from "react-hook-form";
import Alert from "../../../component/forms/Alert";
import InputText from "../../../component/forms/InputText";
import InputFile from "../../../component/forms/InputFile";
import InputSelect from "../../../component/forms/InputSelect";
import RadioInput from "../../../component/forms/RadioInput";
import { useAdminProfileEditForm } from "./useAdminProfileForm";
import { useClientProfileEditForm } from "./useClientProfileForm";
import { useAuthStore } from "../../../stores/authStore";
import { useUserProfileForm } from "./useUserProfileForm";
import ClientAccountDangerZone from "../../../component/profile/ClientAccountDangerZone";

const ProfileEdit = () => {
  const role = useAuthStore((state) => state.user?.role);

  if (role === "ADMIN") {
    const formHook = useAdminProfileEditForm();
    if (!formHook) return null;

    const {
      onSubmit,
      loading,
      success,
      message,
      show,
      logoPreview,
      ...methods
    } = formHook;

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
                <form
                  className="space-y-4"
                  onSubmit={methods.handleSubmit(onSubmit)}
                >
                  {show && <Alert success={success} message={message} />}
                  <InputText label="Name" name="name" />
                  <InputText label="Email" name="email" type="email" required />
                  <InputFile
                    label="Logo"
                    name="logo"
                    defaultImage={logoPreview}
                  />
                  <div className="pt-4 card-actions flex justify-between">
                    <Link to="/profile" className="btn btn-soft">
                      Back to Profile
                    </Link>
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

  if (role === "CLIENT") {
    const formHook = useClientProfileEditForm();
    if (!formHook) return null;

    const {
      onSubmit,
      loading,
      success,
      message,
      show,
      logoPreview,
      userData,
      verifyingRecovery,
      recoveryVerifySuccess,
      recoveryVerifyMessage,
      showRecoveryVerifyMessage,
      sendRecoveryVerification,
      refreshVerificationStatus,
      ...methods
    } = formHook;
    const isRecoveryVerified = !!userData?.company?.recoveryEmailVerifiedAt;
    const needsRecoveryVerification =
      !userData?.company?.recoveryEmail || !isRecoveryVerified;
    const selectedType = methods.watch("type");

    return (
      <Layout>
        <div className="flex flex-col items-start">
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
                  <InputText label="Name" name="name" required />
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
                        Verify this email before accessing other dashboard pages.
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
                  <InputText label="Phone" name="phone" />
                  <InputText label="Address" name="address" />
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
                  <div className="pt-4 card-actions flex justify-between">
                    {needsRecoveryVerification ? (
                      <span className="text-sm text-warning">
                        Complete recovery email verification to continue.
                      </span>
                    ) : (
                      <Link to="/profile" className="btn btn-soft">
                        Back to Profile
                      </Link>
                    )}
                    <button className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>

          <ClientAccountDangerZone />
        </div>
      </Layout>
    );
  }

  if (role === "USER") {
    const formHook = useUserProfileForm();
    if (!formHook) return null;

    const {
      onSubmit,
      loading,
      success,
      message,
      show,
      profilePreview,
      ...methods
    } = formHook;

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
                <form
                  className="space-y-4"
                  onSubmit={methods.handleSubmit(onSubmit)}
                >
                  {show && <Alert success={success} message={message} />}

                  <InputText label="First Name" name="firstName" required />
                  <InputText label="Last Name" name="lastName" required />
                  <InputText label="Email" name="email" type="email" required />
                  <InputText label="Position" name="position" />
                  <InputText label="Phone" name="phone" />
                  <InputText label="Address" name="address" />

                  <InputFile
                    label="Profile Picture"
                    name="profilePic"
                    defaultImage={profilePreview}
                  />

                  <div className="pt-4 card-actions flex justify-between">
                    <Link to="/profile" className="btn btn-soft">
                      Back to Profile
                    </Link>
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
