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
  const { data: companyData, mutate: mutateCompanyData } = useGetCompanyById(id ?? "");

  const methods: UseFormReturn<CompanyUpdateForm> = useForm<CompanyUpdateForm>({
    resolver: zodResolver(CompanyEditSchema),
    defaultValues: {
      name: "",
      email: "",
      recoveryEmail: "",
      type: undefined,
      subType: "",
      logo: "",
      address: "",
      phone: "",
      totalEmployee: "",
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
        recoveryEmail: companyData.recoveryEmail || "",
        type: (companyData.type as "Company" | "Academic" | undefined) || undefined,
        subType: companyData.subType || "",
        logo: companyData.logo || undefined,
        address: companyData.address || "",
        phone: companyData.phone || "",
        totalEmployee: companyData.totalEmployee || "",

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
  const [verifyingRecovery, setVerifyingRecovery] = useState(false);
  const [recoveryVerifySuccess, setRecoveryVerifySuccess] = useState(false);
  const [recoveryVerifyMessage, setRecoveryVerifyMessage] = useState("");
  const [showRecoveryVerifyMessage, setShowRecoveryVerifyMessage] =
    useState(false);

  const onSubmit = async (data: CompanyUpdateForm) => {
    const payload: any = {
      ...data,
      recoveryEmail: data.recoveryEmail || undefined,
      subType: data.type === "Company" ? data.subType : undefined,
    };

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

  const sendRecoveryVerification = async () => {
    if (!id) return;
    setVerifyingRecovery(true);
    setShowRecoveryVerifyMessage(false);
    setRecoveryVerifyMessage("");
    setRecoveryVerifySuccess(false);
    try {
      const response = await companyRepository.sendRecoveryEmailVerification(id);
      setRecoveryVerifySuccess(true);
      setRecoveryVerifyMessage(
        response?.message || "Verification email sent successfully.",
      );
    } catch (error: any) {
      setRecoveryVerifySuccess(false);
      setRecoveryVerifyMessage(
        error?.message || "Failed to send verification email.",
      );
    } finally {
      setShowRecoveryVerifyMessage(true);
      setVerifyingRecovery(false);
    }
  };

  const refreshVerificationStatus = async () => {
    await mutateCompanyData();
  };

  return {
    ...methods,
    companyData,
    onSubmit,
    loading,
    success,
    message,
    show,
    logoPreview,
    verifyingRecovery,
    recoveryVerifySuccess,
    recoveryVerifyMessage,
    showRecoveryVerifyMessage,
    sendRecoveryVerification,
    refreshVerificationStatus,
  };
};
