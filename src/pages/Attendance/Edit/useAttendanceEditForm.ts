import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { attendanceRepository } from "../../../repositories/attendanceRepository";
import { useGetAttendanceById } from "../../../hooks/useGetAttendance";
import { useFormState } from "../../../hooks/useFormState";
import {
  AttendanceUpdateSchema,
  type AttendanceUpdateFormInput,
  type AttendanceUpdateForm,
} from "../AttendanceValidationSchema";
import { baseUrl } from "../../../enum/urls";

export const useAttendanceEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const { data: attendanceData } = useGetAttendanceById(id ?? "");

  const toDateTimeLocalValue = (value?: string | Date) => {
    if (!value) return undefined;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const methods: UseFormReturn<AttendanceUpdateFormInput, any, AttendanceUpdateForm> =
    useForm<AttendanceUpdateFormInput, any, AttendanceUpdateForm>({
      resolver: zodResolver(AttendanceUpdateSchema),
      defaultValues: {
        checkInTime: undefined,
        checkOutTime: undefined,
        checkInLocation: "",
        checkInPhoto: undefined,
        checkOutLocation: "",
        checkOutPhoto: undefined,
      },
    });

  const { reset } = methods;

  const [checkInPreview, setCheckInPreview] = useState<string | undefined>(
    undefined,
  );
  const [checkOutPreview, setCheckOutPreview] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (attendanceData) {
      reset({
        checkInLocation: attendanceData.checkInLocation || "",
        checkInPhoto: undefined,
        checkOutLocation: attendanceData.checkOutLocation || "",
        checkOutPhoto: undefined,
        checkInTime: toDateTimeLocalValue(attendanceData.checkInTime),
        checkOutTime: toDateTimeLocalValue(attendanceData.checkOutTime),
      });

      if (attendanceData.checkInPhoto) {
        const imageUrl = `${baseUrl.replace(/\/$/, "")}/${attendanceData.checkInPhoto.replace(/^\//, "")}`;
        setCheckInPreview(imageUrl);
      }

      if (attendanceData.checkOutPhoto) {
        const imageUrl = `${baseUrl.replace(/\/$/, "")}/${attendanceData.checkOutPhoto.replace(/^\//, "")}`;
        setCheckOutPreview(imageUrl);
      }
    }
  }, [attendanceData, reset]);

  const { loading, success, message, show, handleSubmit } =
    useFormState<AttendanceUpdateForm>();

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
    });

  const onSubmit = async (data: AttendanceUpdateForm) => {
    let checkInPhotoBase64 = data.checkInPhoto;
    let checkOutPhotoBase64 = data.checkOutPhoto;

    if (data.checkInPhoto instanceof File) {
      checkInPhotoBase64 = await fileToBase64(data.checkInPhoto);
    }

    if (data.checkOutPhoto instanceof File) {
      checkOutPhotoBase64 = await fileToBase64(data.checkOutPhoto);
    }

    const payload = {
      ...data,
      checkInPhoto: checkInPhotoBase64,
      checkOutPhoto: checkOutPhotoBase64,
    };

    await handleSubmit(() =>
      attendanceRepository.updateAttendance(id || "", payload),
    );
  };

  return {
    ...methods,
    onSubmit,
    loading,
    success,
    message,
    show,
    checkInPreview,
    checkOutPreview,
  };
};
