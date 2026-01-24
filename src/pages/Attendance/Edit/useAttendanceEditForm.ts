import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { attendanceRepository } from "../../../repositories/attendanceRepository";
import { useGetAttendanceById } from "../../../hooks/useGetAttendance";
import { useFormState } from "../../../hooks/useFormState";
import {
  AttendanceUpdateSchema,
  type AttendanceUpdateForm,
} from "../AttendanceValidationSchema";
import { baseUrl } from "../../../enum/urls";

export const useAttendanceEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const { data: attendanceData } = useGetAttendanceById(id ?? "");

  const methods: UseFormReturn<AttendanceUpdateForm> =
    useForm<AttendanceUpdateForm>({
      resolver: zodResolver(AttendanceUpdateSchema),
      defaultValues: {
        checkInLocation: "",
        checkInPhoto: undefined,
        checkOutLocation: "",
        checkOutPhoto: undefined,
        status: "present",
      },
    });

  const { reset, setValue } = methods;

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
        status: attendanceData.status || "present",
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

  const handleCheckInPhotoChange = (file?: File) => {
    if (file) {
      setValue("checkInPhoto", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setCheckInPreview(reader.result as string);
    }
  };

  const handleCheckOutPhotoChange = (file?: File) => {
    if (file) {
      setValue("checkOutPhoto", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setCheckOutPreview(reader.result as string);
    }
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
    handleCheckInPhotoChange,
    handleCheckOutPhotoChange,
  };
};
