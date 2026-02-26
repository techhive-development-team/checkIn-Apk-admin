import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginFormData } from "./loginValidationSchema";
import { useFormState } from "../../hooks/useFormState";
import { authRepository } from "../../repositories/authRepository";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../../utils/commonUtil";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

const useLoginForm = () => {
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    loading,
    success,
    message,
    show,
    setMessage,
    setShow,
    setSuccess,
    handleSubmit,
  } = useFormState();

  const onSubmit = async (data: LoginFormData) => {
    const {login} = useAuthStore.getState();
    const response = await handleSubmit(() => authRepository.login(data));
    if (response?.data?.token) {
      const jwtPayload = jwtDecode<JwtPayload>(response.data.token);
      login(jwtPayload.user, response.data.token);
      window.location.href = "/";
      return jwtPayload;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const message = params.get("message");
    const error = params.get("error");

    if (message) {
      setMessage(message);
      setSuccess(true);
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
        setMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }

    if (error) {
      setMessage(error);
      setSuccess(false);
      setShow(true);

      // auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);


  return {
    ...methods,
    onSubmit: methods.handleSubmit(onSubmit),
    loading,
    success,
    message,
    show,
  };
};

export default useLoginForm;
