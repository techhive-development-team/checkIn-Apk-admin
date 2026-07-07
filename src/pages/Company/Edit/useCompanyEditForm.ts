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
import { getPlan } from "../../../config/plans";

export type CompanyMember = {
  employeeId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  memberType?: string;
  position?: string;
  studentClass?: string;
  createdAt?: string;
};

type DowngradeState = {
  open: boolean;
  targetPlanKey: string;
  targetSubStatus: string;
  cap: number;
  members: CompanyMember[];
};

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
      plan: "FREE",
      status: "active",
    },
  });

  const { reset, setValue, watch } = methods;
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);

  const subStatus = watch("subScribeStatus");
  useEffect(() => {
    if (subStatus !== "Active" && watch("plan") !== "FREE") {
      setValue("plan", "FREE", { shouldDirty: true });
    }
  }, [subStatus, setValue, watch]);

  const [downgrade, setDowngrade] = useState<DowngradeState>({
    open: false,
    targetPlanKey: "FREE",
    targetSubStatus: "Inactive",
    cap: 10,
    members: [],
  });
  const [pendingPayload, setPendingPayload] = useState<any>(null);
  const [downgradeLoading, setDowngradeLoading] = useState(false);

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
        plan: (companyData.plan as "FREE" | "BASIC" | "MEDIUM" | "ENTERPRISE") || "FREE",
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

  const buildPayload = async (data: CompanyUpdateForm) => {
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
    return payload;
  };

  const onSubmit = async (data: CompanyUpdateForm) => {
    const payload = await buildPayload(data);

    // The effective plan falls back to Free when the subscription is inactive.
    const targetSubStatus = data.subScribeStatus || "Inactive";
    const targetPlanKey = targetSubStatus === "Active" ? data.plan || "FREE" : "FREE";
    payload.plan = targetPlanKey;

    const cap = getPlan(targetPlanKey).maxEmployees;
    const members: CompanyMember[] = companyData?.employees ?? [];

    // Downgrade that can't fit the current members → require the guided flow.
    if (cap !== null && members.length > cap) {
      setPendingPayload(payload);
      setDowngrade({
        open: true,
        targetPlanKey,
        targetSubStatus,
        cap,
        members,
      });
      return;
    }

    await handleSubmit(() =>
      companyRepository.updateCompany(id || "", payload),
    );
  };

  const downloadRemovedMembers = async (removeEmployeeIds: string[]) => {
    if (!id || removeEmployeeIds.length === 0) return;
    await companyRepository.exportMembers(id, removeEmployeeIds);
  };

  const confirmDowngrade = async (removeEmployeeIds: string[]) => {
    if (!id) return;
    setDowngradeLoading(true);
    try {
      await handleSubmit(async () => {
        await companyRepository.downgradePlan(id, {
          plan: downgrade.targetPlanKey,
          subScribeStatus: downgrade.targetSubStatus,
          removeEmployeeIds,
        });
        // Members now fit the new plan; persist the remaining field edits.
        return companyRepository.updateCompany(id, {
          ...pendingPayload,
          plan: downgrade.targetPlanKey,
          subScribeStatus: downgrade.targetSubStatus,
        });
      });
      await mutateCompanyData();
      setDowngrade((prev) => ({ ...prev, open: false }));
      setPendingPayload(null);
    } finally {
      setDowngradeLoading(false);
    }
  };

  const closeDowngrade = () => {
    setDowngrade((prev) => ({ ...prev, open: false }));
    setPendingPayload(null);
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
    downgrade,
    downgradeLoading,
    confirmDowngrade,
    downloadRemovedMembers,
    closeDowngrade,
  };
};
