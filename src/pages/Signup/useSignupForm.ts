import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useFormState } from "../../hooks/useFormState";
import { authRepository } from "../../repositories/authRepository";
import { SignupSchema, type SignupForm as Form } from "./signupValidationSchema";
import { useAuthStore } from "../../stores/authStore";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../../utils/commonUtil";

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
    const { login } = useAuthStore.getState();
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
        if (response.token) {
          const jwtPayload = jwtDecode<JwtPayload>(response.token);
          login(jwtPayload.user, response.token);
        }
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
