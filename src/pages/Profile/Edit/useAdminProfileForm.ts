import { useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRepository } from "../../../repositories/userRepository";
import { baseUrl } from "../../../enum/urls";
import { useFormState } from "../../../hooks/useFormState";
import {
  AdminProfileSchema,
  type AdminProfileForm,
} from "../ProfileValidationSchema";
import { useGetUserById } from "../../../hooks/useGetUser";
import { jwtDecode } from "jwt-decode";

export const useAdminProfileEditForm = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const decodedToken = jwtDecode<{ user: { userId: string; role: string } }>(
    token,
  );
  const userId = decodedToken.user.userId;

  const { data: userData } = useGetUserById(userId);

  const methods: UseFormReturn<AdminProfileForm> = useForm<AdminProfileForm>({
    resolver: zodResolver(AdminProfileSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      logo: userData?.logo || "",
    },
  });

  const { reset } = methods;
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    userData?.logo
      ? `${baseUrl.replace(/\/$/, "")}/${userData.logo.replace(/^\//, "")}`
      : undefined,
  );

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        email: userData.email || "",
        logo: userData.logo || "",
      });

      if (userData.logo) {
        const imageUrl = `${baseUrl.replace(/\/$/, "")}/${userData.logo.replace(/^\//, "")}`;
        setLogoPreview(imageUrl);
      }
    }
  }, [userData, reset]);

  const { loading, success, message, show, handleSubmit } =
    useFormState<AdminProfileForm>();

  const onSubmit = async (data: AdminProfileForm) => {
    const payload: any = { ...data };

    if (!(data.logo instanceof File)) {
      delete payload.logo;
    } else {
      payload.logo = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(data.logo);
        reader.onloadend = () => resolve(reader.result as string);
      });
    }

    if (!userId) return;

    await handleSubmit(() => userRepository.updateUser(userId, payload));
  };

  return {
    ...methods,
    onSubmit,
    loading,
    success,
    message,
    show,
    logoPreview,
  };
};
