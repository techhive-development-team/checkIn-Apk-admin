import { FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useSignupForm from "./useSignupForm";
import InputText from "../../component/forms/InputText";
import InputFile from "../../component/forms/InputFile";
import Alert from "../../component/forms/Alert";
import Button from "../../component/forms/Button";
import logo from "../../assets/logo.png";
import harry from "../../assets/harry.jpg";
import { API_URLS, baseUrl } from "../../enum/urls";
import Footer from "../../component/layouts/common/Footer";

const Signup = () => {
  const navigate = useNavigate();
  const { onSubmit, loading, success, message, show, ...methods } =
    useSignupForm();

  if (success) {
    navigate("/", { replace: true });
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-3/5 flex flex-col justify-center bg-white min-h-screen px-4">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
            <div className="flex justify-center mb-6 pt-8 sm:pt-12">
              <div className="ring-blue-400 ring-offset-base-100 w-20 h-20 sm:w-24 sm:h-24 rounded-xl ring-2 ring-offset-2 bg-white flex items-center justify-center shadow-md overflow-hidden">
                <img
                  src={logo}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-8 text-sky-500">
              CREATE COMPANY ACCOUNT
            </h2>

            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <div className="space-y-7">
                  {show && <Alert success={success} message={message} />}
                  <InputText label="Company Name" name="name" required />
                  <InputText label="Email" name="email" type="email" required />
                  <InputFile label="Logo" name="logo" />
                  <InputText label="Company Type" name="companyType" />
                  <InputText label="Phone" name="phone" />
                  <InputText label="Address" name="address" />

                  <Button
                    type="submit"
                    label={loading ? "Creating..." : "Sign Up"}
                    className="mt-2 w-full"
                  />

                  <div className="flex items-center my-4">
                    <hr className="grow border-gray-300" />
                    <span className="mx-2 text-gray-400">OR</span>
                    <hr className="grow border-gray-300" />
                  </div>

                  <Button
                  type="button"
                  label="Login with Google"
                  className="flex items-center justify-center gap-2 border border-gray-300 bg-gray-100! text-black! hover:bg-gray-300! w-full"
                  onClick={() => {
                    window.location.href = `${baseUrl}${API_URLS.AUTH}${API_URLS.GOOGLE}`;
                  }}
                >
                  <svg
                    viewBox="-0.5 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                  >
                    <path
                      d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                      fill="#FBBC05"
                    />
                    <path
                      d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                      fill="#EB4335"
                    />
                    <path
                      d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                      fill="#34A853"
                    />
                    <path
                      d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                      fill="#4285F4"
                    />
                  </svg>
                  Login with Google
                </Button>
                </div>
              </form>
            </FormProvider>

            <div className="text-center py-3 text-black mt-6 mb-8">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-sky-500 font-medium hover:underline"
              >
                Login
              </a>
            </div>
          </div>
        </div>

        <div className="hidden md:block md:w-2/5">
          <img src={harry} alt="signup" className="h-full w-full object-cover" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;
