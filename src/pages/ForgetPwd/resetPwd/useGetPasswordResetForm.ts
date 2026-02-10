import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { authRepository } from "../../../repositories/authRepository";
import {
  PasswordResetSchema,
  type PasswordResetForm,
} from "./pwdResetValidationSchema";
import { useFormState } from "../../../hooks/useFormState";

export const useGetPasswordResetForm = () => {
  const methods = useForm<PasswordResetForm>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { loading, success, message, show, handleSubmit } =
    useFormState<PasswordResetForm>();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const onSubmit = async (data: PasswordResetForm) => {
    const { newPassword } = data;

    await handleSubmit(() =>
      authRepository.passwordReset({
        newPassword,
        token,
      }),
    );
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
