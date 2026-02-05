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

  const { reset } = methods;
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (companyData) {

      reset({
        name: companyData.name || "",
        email: companyData.email || "",
        logo: companyData.logo || undefined,
        companyType: companyData.companyType || "",
        address: companyData.address || "",
        phone: companyData.phone || "",
        subScribeStatus: companyData.subScribeStatus || "Inactive",
        status: companyData.status || "active",
      });

      if (companyData.logo) {
        const imageUrl = `${baseUrl.replace(/\/$/, "")}/${companyData.logo.replace(/^\//, "")}`;
        setLogoPreview(imageUrl);
      }
    }
  }, [companyData, reset]);

  const { loading, success, message, show, handleSubmit } =
    useFormState<CompanyCreateForm>();

  const onSubmit = async (data: CompanyUpdateForm) => {
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

    await handleSubmit(() =>
      companyRepository.updateCompany(id || "", payload),
    );
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
