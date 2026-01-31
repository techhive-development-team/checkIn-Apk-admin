import { useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyRepository } from "../../../repositories/companyRepository";
import { baseUrl } from "../../../enum/urls";
import { useFormState } from "../../../hooks/useFormState";
import { ClientProfileSchema, type ClientProfileForm } from "../ProfileValidationSchema";
import { useGetUserById } from "../../../hooks/useGetUser";
import { jwtDecode } from "jwt-decode";

export const useClientProfileEditForm = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const decodedToken = jwtDecode<{ user: { userId: string; role: string } }>(token);
  const userId = decodedToken.user.userId;

  const { data: userData } = useGetUserById(userId);

  const companyId = userData?.company?.companyId;

  const methods: UseFormReturn<ClientProfileForm> = useForm<ClientProfileForm>({
    resolver: zodResolver(ClientProfileSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      logo: userData?.logo || "",
      companyType: userData?.company?.companyType || "",
      phone: userData?.company?.phone || "",
      address: userData?.company?.address || "",
      totalEmployees: userData?.company?.totalEmployee || "",
    },
  });

  const { reset, setValue } = methods;
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    userData?.logo ? `${baseUrl.replace(/\/$/, "")}/${userData.logo.replace(/^\//, "")}` : undefined
  );

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        email: userData.email || "",
        logo: userData.logo || "",
        companyType: userData.company?.companyType || "",
        phone: userData.company?.phone || "",
        address: userData.company?.address || "",
        totalEmployees: userData.company?.totalEmployee || "",
      });

      if (userData.logo) {
        const imageUrl = `${baseUrl.replace(/\/$/, "")}/${userData.logo.replace(/^\//, "")}`;
        setLogoPreview(imageUrl);
      }
    }
  }, [userData, reset]);

  const { loading, success, message, show, handleSubmit } = useFormState<ClientProfileForm>();

  const onSubmit = async (data: ClientProfileForm) => {

    let logoBase64: string | File | undefined = data.logo;
    if (data.logo instanceof File) {
      logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(data.logo);
        reader.onloadend = () => resolve(reader.result as string);
      });
    }

    const payload = { ...data, logo: logoBase64 };

    await handleSubmit(() => companyRepository.updateCompany(companyId, payload));
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
