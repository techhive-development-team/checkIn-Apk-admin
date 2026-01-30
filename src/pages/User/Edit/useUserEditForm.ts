import { useForm, type UseFormReturn } from "react-hook-form"
import { UserEditSchema, type UserEditForm } from "../UserValidationSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "react-router-dom"
import { useGetUserById } from "../../../hooks/useGetUser"
import { useEffect, useState } from "react"
import { baseUrl } from "../../../enum/urls"
import { userRepository } from "../../../repositories/userRepository"
import { useFormState } from "../../../hooks/useFormState"

export const useUserEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const { data: userData } = useGetUserById(id ?? "");

  const methods: UseFormReturn<UserEditForm> = useForm<UserEditForm>({
    resolver: zodResolver(UserEditSchema),
    defaultValues: {
      name: "",
      email: "",
      logo: "",
      status: "active"
    }

  })

  const { loading, success, message, show, handleSubmit } = useFormState<UserEditForm>();
  const { reset, setValue } = methods;

  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        email: userData.email || "",
        logo: userData.logo || undefined,
        status: userData.status || "active",
      });
      if (userData.logo) {
        const imageUrl = `${baseUrl.replace(/\/$/, "")}/${userData.logo.replace(/^\//, "")}`;
        setLogoPreview(imageUrl);
      }
    }
  }, [userData, reset])

  const onSubmit = async (data: UserEditForm) => {
    let logoBase64 = data.logo;

    if (data.logo instanceof File) {
      logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(data.logo);
        reader.onloadend = () => resolve(reader.result as string);
      });
    }

    const payload = { ...data, logo: logoBase64 };

    await handleSubmit(() =>
      userRepository.updateUser(id || "", payload),
    );
  };

  const handleLogoChange = (file?: File) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setLogoPreview(reader.result as string);
      setValue("logo", file, { shouldValidate: true });
    }
  };

  return {
    ...methods,
    onSubmit,
    loading,
    success,
    message,
    show,
    logoPreview,
    handleLogoChange,
  };
};
