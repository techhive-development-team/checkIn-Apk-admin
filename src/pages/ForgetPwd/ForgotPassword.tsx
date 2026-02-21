import { FormProvider } from "react-hook-form";
import InputText from "../../component/forms/InputText";
import Button from "../../component/forms/Button";
import Footer from "../../component/layouts/common/Footer";
import MeshBackground from "../../component/layouts/common/background";
import { useForgotPasswordForm } from "./useForgetPasswordForm";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { onSubmit, loading, success, message, show, ...methods } =
    useForgotPasswordForm();

  if (success) {
    const msg = Array.isArray(message) ? message.join(", ") : message;
    navigate(`/login?message=${encodeURIComponent(msg)}`);
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      <MeshBackground />

      <div className="flex items-center justify-center grow relative z-10 px-4 py-10 sm:py-12 md:py-16">
        <div
          className="
            w-full max-w-md sm:max-w-lg md:max-w-xl
            bg-white/40 backdrop-blur-lg
            border border-white/30
            rounded-2xl sm:rounded-3xl
            shadow-[0_20px_80px_rgba(15,23,42,0.08)]
            px-5 sm:px-7 md:px-8
            py-7 sm:py-9 md:py-10
          "
        >
          <div className="flex justify-center mb-3 items-start">
            <span className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-sky-600 text-center">
              CheckIn+
            </span>
          </div>

          <p className="text-xl md:text-2xl font-bold text-center mb-2 text-sky-500">
            Forgot Password
          </p>
          <p className="text-sm sm:text-base text-gray-500 mb-8 text-center">
            Enter your email to receive a reset link
          </p>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-7">
              {show && message && (
                <div className={`p-3 rounded-md text-center ${success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {Array.isArray(message) ? message.join(", ") : message}
                </div>
              )}

              <InputText
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />

              <Button
                type="submit"
                label={loading ? "Sending..." : "Send"}
                className="mt-2 mb-2 w-full cursor-pointer"
              />
            </form>
          </FormProvider>

          <div className="text-center py-2 text-black mt-3">
            Remember your password?{" "}
            <a href="/login" className="text-sky-500 font-medium hover:underline">
              Log In
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
