import { FormProvider } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import InputText from "../../../component/forms/InputText";
import Button from "../../../component/forms/Button";
import { useGetPasswordResetForm } from "./useGetPasswordResetForm";

const PasswordReset = () => {
  const navigate = useNavigate();
  const { onSubmit, loading, success, message, ...methods } =
    useGetPasswordResetForm();

  if (success) {
    const msg = Array.isArray(message) ? message.join(", ") : message;
    navigate(`/login?message=${encodeURIComponent(msg)}`);
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-sky-500">
          Reset Password
        </h1>

        {message && (
          <p
            className={`mb-4 text-center ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <InputText
              label="New Password"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              required
            />
            <InputText
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              required
            />

            <Button
              type="submit"
              label={loading ? "Resetting..." : "Reset Password"}
              className="w-full mt-2 rounded-xl py-4 cursor-pointer"
              disabled={loading}
            />
          </form>
        </FormProvider>

        <div className="text-center py-3 text-black mt-6">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-sky-500 font-medium hover:underline"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
