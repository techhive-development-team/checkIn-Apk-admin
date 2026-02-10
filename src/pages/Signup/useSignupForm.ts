import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useFormState } from "../../hooks/useFormState";
import { authRepository } from "../../repositories/authRepository";
import { SignupSchema, type SignupForm as Form } from "./signupValidationSchema";

const useSignupForm = () => {
  const methods: UseFormReturn<Form> = useForm<Form>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      logo: undefined,
      companyType: "",
      address: "",
      phone: "",
      
    },
  });

  const { loading, success, message, show, handleSubmit } = useFormState<Form>();

  const onSubmit = async (data: Form) => {
    let logoBase64: string | undefined;

    if (data.logo instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(data.logo);

      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          logoBase64 = reader.result as string;
          resolve();
        };
      });
    }

    const payload = {
      ...data,
      logo: logoBase64,
    };

    return await handleSubmit(async () => {
      const response = await authRepository.signup(payload);
      if (response?.statusCode === 200) {
        console.log("Company signup successful:", response);
        if (response.token) localStorage.setItem("token", response.token);
      }
      return response;

    });
  };

  return {
    ...methods,
    onSubmit, 
    loading,
    success,
    message,
    show,
  };
};

export default useSignupForm;
