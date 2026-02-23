import InputText from "../../component/forms/InputText";
import Button from "../../component/forms/Button";
import useLoginForm from "./useLoginForm";
import { FormProvider } from "react-hook-form";
import Alert from "../../component/forms/Alert";
import { API_URLS, baseUrl } from "../../enum/urls";
import { Link } from "react-router-dom";
import MeshBackground from "../../component/layouts/common/background";

const Login = () => {
  const { onSubmit, loading, success, message, show, ...methods } =
    useLoginForm();

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50 overflow-hidden font-sans">
      
      <MeshBackground/>

      <div className="flex flex-col md:flex-row grow relative z-10">

        <div
          className="w-full md:w-[55%] lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 md:px-20 py-8 sm:py-12 bg-white backdrop-blur-lg border border-white/30 md:rounded-tr-[120px] md:rounded-br-[120px] shadow-[30px_0_100px_rgba(15,23,42,0.06)] min-h-screen"
        >
          <div className="w-full max-w-md mx-auto">
            
            <div className="flex justify-center mb-3 items-start">
              <span className="text-4xl sm:text-4xl md:text-6xl font-extrabold text-sky-600">
                CheckIn+
              </span>
            </div>
            <div className="flex justify-center mb-9">
              <span className="text-gray-500 font-semibold">Login to your account</span>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={onSubmit}>
                <div className="space-y-6">
                  {show && <Alert success={success} message={message} />}
                  <InputText
                    label="Email"
                    name="email"
                    type="text"
                    placeholder="Enter your email"
                  />
                  <InputText
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                  <div className="flex justify-end text-sm">
                    <Link
                      to="/forgot-password"
                      className="text-sky-500 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    label={loading ? "Logging in..." : "Log In"}
                    className="mt-2 mb-2 w-full cursor-pointer"
                  />
                  <div className="flex items-center my-4 mb-6">
                    <hr className="grow border-gray-300" />
                    <span className="mx-2 text-gray-400">OR</span>
                    <hr className="grow border-gray-300" />
                  </div>
                  <Button
                    type="button"
                    label="Login with Google"
                    className="cursor-pointer flex items-center justify-center gap-2 border border-gray-300 bg-gray-100! text-black! hover:bg-gray-300! w-full"
                    onClick={() => {
                      window.location.href = `${baseUrl}${API_URLS.AUTH}${API_URLS.GOOGLE}`;
                    }}
                  >
                    <svg
                      viewBox="-0.5 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                    >
                      <path d="M9.827 24c0-1.524.253-2.986.705-4.356l-7.908-6.039c-1.541 3.13-2.41 6.657-2.41 10.386 0 3.737.867 7.262 2.406 10.39l7.904-6.05c-.448-1.364-.698-2.82-.698-4.33z" fill="#FBBC05"/>
                      <path d="M23.714 10.133c3.311 0 6.302 1.174 8.652 3.093l6.836-6.827C35.036 2.773 29.695.533 23.714.533 14.427.533 6.445 5.844 2.623 13.604l7.909 6.04c1.822-5.532 7.017-9.51 13.182-9.51z" fill="#EB4335"/>
                      <path d="M23.714 37.867c-6.164 0-11.358-3.978-13.18-9.51l-7.909 6.038c3.822 7.762 11.803 13.073 21.09 13.073 5.732 0 11.205-2.035 15.312-5.848l-7.508-5.804c-2.118 1.334-4.785 2.052-7.803 2.052z" fill="#34A853"/>
                      <path d="M46.145 24c0-1.387-.214-2.88-.534-4.267L23.714 19.733v9.067h12.605c-.63 3.091-2.345 5.468-4.8 7.014l7.508 5.804c4.315-4.004 7.121-9.969 7.121-17.618z" fill="#4285F4"/>
                    </svg> Login With Google
                  </Button>
                </div>
              </form>
            </FormProvider>

            <div className="text-center py-3 text-black mt-6">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-sky-500 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center p-12">
          <div className="text-center max-w-sm pointer-events-none">
            <h2 className="text-5xl font-extrabold text-[#23356b] mb-6 leading-[1.1] tracking-tight">
              Welcome back
            </h2>
            <p className="text-blue-950 text-xl leading-relaxed">
              Everything is ready for you to dive back into your projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
