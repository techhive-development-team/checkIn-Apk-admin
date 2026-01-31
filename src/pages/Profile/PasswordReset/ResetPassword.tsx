import { FormProvider } from "react-hook-form"
import { Link } from "react-router-dom"
import Layout from "../../../component/layouts/layout"
import Breadcrumb from "../../../component/layouts/common/Breadcrumb"
import { useGetResetPasswordForm } from "./useGetResetPasswordForm"
import InputText from "../../../component/forms/InputText"
import Alert from "../../../component/forms/Alert"

const ResetPassword = () => {
  const { onSubmit, loading, success, message, show, ...methods } = useGetResetPasswordForm()

  return (
    <Layout>
        <div className="card card-bordered w-full max-w-md bg-base-100">
          <div className="card-body">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Profile", path: "/profile" },
                { label: "Reset Password" },
              ]}
            />
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                {show && <Alert success={success} message={message} />}
                <InputText
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  required
                />
                <InputText
                  label="New Password"
                  name="newPassword"
                  type="password"
                  required
                />

                <div className="pt-4 flex justify-between">
                  <Link to="/profile" className="btn btn-soft">
                    Back to Profile
                  </Link>
                  <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Reset Password"}
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
    </Layout>
  )
}

export default ResetPassword
