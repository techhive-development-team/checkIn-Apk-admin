import { useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyRepository } from "../../../repositories/companyRepository";
import { baseUrl } from "../../../enum/urls";
import { useFormState } from "../../../hooks/useFormState";
import {
  ClientProfileSchema,
  type ClientProfileForm,
} from "../ProfileValidationSchema";
import { useGetUserById } from "../../../hooks/useGetUser";
import { useAuthStore } from "../../../stores/authStore";

export const useClientProfileEditForm = () => {
  const userId = useAuthStore((state) => state.user?.userId);
  if (!userId) return;

  const { data: userData, mutate: mutateUserData } = useGetUserById(userId);

  const companyId = userData?.company?.companyId;

  const methods: UseFormReturn<ClientProfileForm> = useForm<ClientProfileForm>({
    resolver: zodResolver(ClientProfileSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      recoveryEmail: userData?.company?.recoveryEmail || "",
      logo: userData?.logo || "",
      type: (userData?.company?.type as "Company" | "Academic" | undefined) || undefined,
      subType: userData?.company?.subType || "",
      phone: userData?.company?.phone || "",
      address: userData?.company?.address || "",
      totalEmployee:
        userData?.company?.totalEmployee != null
          ? String(userData.company.totalEmployee)
          : "",
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
        recoveryEmail: userData.company?.recoveryEmail || "",
        logo: userData.logo || "",
        type: (userData.company?.type as "Company" | "Academic" | undefined) || undefined,
        subType: userData.company?.subType || "",
        phone: userData.company?.phone || "",
        address: userData.company?.address || "",
        totalEmployee:
          userData.company?.totalEmployee != null
            ? String(userData.company.totalEmployee)
            : "",
      });

      if (userData.logo) {
        const imageUrl = `${baseUrl.replace(/\/$/, "")}/${userData.logo.replace(/^\//, "")}`;
        setLogoPreview(imageUrl);
      }
    }
  }, [userData, reset]);

  const { loading, success, message, show, handleSubmit } =
    useFormState<ClientProfileForm>();
  const [verifyingRecovery, setVerifyingRecovery] = useState(false);
  const [recoveryVerifySuccess, setRecoveryVerifySuccess] = useState(false);
  const [recoveryVerifyMessage, setRecoveryVerifyMessage] = useState("");
  const [showRecoveryVerifyMessage, setShowRecoveryVerifyMessage] =
    useState(false);

  const onSubmit = async (data: ClientProfileForm) => {
    const payload: any = {
      ...data,
      recoveryEmail: data.recoveryEmail || undefined,
      subType: data.type === "Company" ? data.subType : undefined,
    };

    // totalEmployee is a derived count shown read-only; don't persist it back.
    delete payload.totalEmployee;

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
      companyRepository.updateCompany(companyId, payload),
    );
  };

  const sendRecoveryVerification = async () => {
    if (!companyId) return;
    setVerifyingRecovery(true);
    setShowRecoveryVerifyMessage(false);
    setRecoveryVerifyMessage("");
    setRecoveryVerifySuccess(false);
    try {
      const response = await companyRepository.sendRecoveryEmailVerification(
        companyId,
      );
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
    await mutateUserData();
  };

  return {
    ...methods,
    userData,
    companyId,
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
