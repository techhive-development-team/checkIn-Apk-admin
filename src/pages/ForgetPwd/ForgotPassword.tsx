import { FormProvider } from "react-hook-form";
import InputText from "../../component/forms/InputText";
import Button from "../../component/forms/Button";
import harry from "../../assets/harry.jpg";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../component/layouts/common/Footer";
import { useForgotPasswordForm } from "./useForgetPasswordForm";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { onSubmit, loading, success, message, show, ...methods } =
    useForgotPasswordForm();

  if (success) {
    const msg = Array.isArray(message) ? message.join(", ") : message;
    navigate(`/login?message=${encodeURIComponent(msg)}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-col md:flex-row grow">
        <div className="hidden md:block md:w-2/5">
          <img
            src={harry}
            alt="Forgot Password Illustration"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full md:w-3/5 flex flex-col justify-center px-4 py-12 min-h-[calc(100vh-64px)]">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
            <div className="flex justify-center mb-6">
              <div className="ring-blue-400 ring-offset-base-100 w-20 h-20 sm:w-24 sm:h-24 rounded-xl ring-2 ring-offset-2 bg-white flex items-center justify-center shadow-md overflow-hidden">
                <img
                  src={logo}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h3 className="text-3xl font-bold text-center mb-2 text-sky-500">
              Forgot Password
            </h3>
            <p className="text-sm text-gray-400 mb-8 text-center">
              Please enter your email to receive a reset password notification email
            </p>

            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <InputText
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                />

                <Button
                  type="submit"
                  label="Send"
                  className="mt-2 w-full rounded-xl py-4 cursor-pointer"
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
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
