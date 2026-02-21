import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leaveRequestRepository } from "../../../repositories/leaveRepository";
import { useFormState } from "../../../hooks/useFormState";
import {
  LeaveRequestCreateSchema,
  type LeaveRequestCreateForm,
} from "../LeaveValidationSchema";
import { useGetLeaveById } from "../../../hooks/useGetLeave";
import { baseUrl } from "../../../enum/urls";

const formatDateForInput = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useLeaveEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const { data: leaveData } = useGetLeaveById(id ?? "");

  const methods: UseFormReturn<LeaveRequestCreateForm> =
    useForm<LeaveRequestCreateForm>({
      resolver: zodResolver(LeaveRequestCreateSchema),
      defaultValues: {
        leaveType: undefined,
        startDate: "",
        endDate: "",
        reason: "",
        file: undefined,
      },
    });

  const { reset } = methods;
  const [filePreview, setFilePreview] = useState<string | undefined>();

  useEffect(() => {
    if (leaveData) {
      reset({
        leaveType: leaveData.leaveType,
        startDate: formatDateForInput(leaveData.startDate),
        endDate: formatDateForInput(leaveData.endDate),
        reason: leaveData.reason || "",
        file: undefined,
      });

      if (leaveData.file) {
        const imageUrl = `${baseUrl.replace(/\/$/, "")}/${leaveData.file.replace(/^\//, "")}`;
        setFilePreview(imageUrl);
      }
    }
  }, [leaveData, reset]);

  const { loading, success, message, show, handleSubmit } =
    useFormState<LeaveRequestCreateForm>();

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
    });

  const onSubmit = async (data: LeaveRequestCreateForm) => {
    let fileBase64 = data.file;

    if (data.file instanceof File) {
      fileBase64 = await fileToBase64(data.file);
    }

    const payload = {
      ...data,
      file: fileBase64,
    };

    await handleSubmit(() =>
      leaveRequestRepository.updateLeave(id ?? "", payload)
    );
  };

  return {
    ...methods,
    onSubmit,
    loading,
    success,
    message,
    show,
    filePreview,
  };
};