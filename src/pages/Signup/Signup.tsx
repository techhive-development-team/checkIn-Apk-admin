import { FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import useSignupForm from "./useSignupForm";
import InputText from "../../component/forms/InputText";
import InputFile from "../../component/forms/InputFile";
import Alert from "../../component/forms/Alert";

const Signup = () => {
  const { onSubmit, loading, success, message, show, ...methods } = useSignupForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-black text-3xl font-bold text-center mb-9">Create Company Account</h2>

        {show && <Alert success={success} message={message} />}

        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <InputText label="Company Name" name="name" required />
            <InputText label="Email" name="email" type="email" required />
            <InputFile label="Logo" name="logo" />
            <InputText label="Company Type" name="companyType" />
            <InputText label="Phone" name="phone" />
            <InputText label="Address" name="address" />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-md transition-colors"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
        </FormProvider>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
