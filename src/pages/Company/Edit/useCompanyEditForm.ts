import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyRepository } from "../../../repositories/companyRepository";
import { useGetCompanyById } from "../../../hooks/useGetCompany";
import { useFormState } from "../../../hooks/useFormState";
import {
  CompanyEditSchema,
  type CompanyCreateForm,
  type CompanyUpdateForm,
} from "../CompanyValidationSchema";
import { baseUrl } from "../../../enum/urls";

export const useCompanyEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const { data: companyData } = useGetCompanyById(id ?? "");

  const methods: UseFormReturn<CompanyUpdateForm> = useForm<CompanyUpdateForm>({
    resolver: zodResolver(CompanyEditSchema),
    defaultValues: {
      name: "",
      email: "",
      logo: "",
      companyType: "",
      address: "",
      phone: "",
      subScribeStatus: "Inactive",
      status: "active",
    },
  });

  const { reset, setValue } = methods;
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (companyData?.data) {
      const data = companyData.data;

      reset({
        name: data.name || "",
        email: data.email || "",
        logo: data.logo || undefined,
        companyType: data.companyType || "",
        address: data.address || "",
        phone: data.phone || "",
        subScribeStatus: data.subScribeStatus || "Inactive",
        status: data.status || "active",
      });

      if (data.logo) {
        const imageUrl = `${baseUrl.replace(/\/$/, "")}/${data.logo.replace(/^\//, "")}`;
        setLogoPreview(imageUrl);
      }
    }
  }, [companyData, reset]);

  const { loading, success, message, show, handleSubmit } =
    useFormState<CompanyCreateForm>();

  const onSubmit = async (data: CompanyCreateForm) => {
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
      companyRepository.updateCompany(id || "", payload),
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
