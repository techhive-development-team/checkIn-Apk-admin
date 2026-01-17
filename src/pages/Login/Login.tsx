import InputText from "../../component/forms/InputText";
import Button from "../../component/forms/Button";
import harry from "../../assets/harry.jpg";
import { useNavigate } from "react-router-dom";
import useLoginForm from "./useLoginForm";
import { FormProvider } from "react-hook-form";
import Alert from "../../component/forms/Alert";

const Login = () => {
  const navigate = useNavigate();
  const { onSubmit, loading, success, message, show, ...methods } = useLoginForm();
  if (success) {
    navigate("/");
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-3/5 flex flex-col justify-center bg-white min-h-screen">
        <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl px-8 mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            SIGN <span className="text-sky-500">IN</span>
          </h1>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <div className="space-y-7">
                {show && <Alert success={success} message={message} />}
                <InputText
                  label="Username or Email"
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

                <div className="flex justify-end text-sm mb-4">
                  <a href="#" className="text-sky-500 hover:underline">
                    Forgot Password?
                  </a>
                </div>

                <Button type="submit" label="SIGN IN" className="mt-2" />
              </div>
            </form>
          </FormProvider>
          <div className="bg-sky-50 text-center py-3 rounded-md text-sm mt-6">
            Not a member?{" "}
            <a href="#" className="text-sky-500 font-medium hover:underline">
              Sign Up
            </a>
          </div>
        </div>
      </div>

      <div className="  w-2/5 from-red-500 to-red-400">
        <img
          src={harry}
          alt="harry"
          className="h-full object-fit"
        />
      </div>
    </div>
  );
};

export default Login;
