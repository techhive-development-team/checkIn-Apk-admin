import { type UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LeaveRequestCreateSchema,
  type LeaveRequestCreateForm as Form,
} from "../LeaveValidationSchema";
import { useFormState } from "../../../hooks/useFormState";
import { leaveRequestRepository } from "../../../repositories/leaveRepository";

export const useLeaveCreateForm = () => {
  const methods: UseFormReturn<Form> = useForm<Form>({
    resolver: zodResolver(LeaveRequestCreateSchema),
    defaultValues: {
      leaveType: undefined, 
      startDate: "",
      endDate: "",
      reason: "",
      file: "",
    },
  });

  const { loading, success, message, show, handleSubmit } =
    useFormState<Form>();

  const onSubmit = async (data: Form) => {
    let fileBase64: string | undefined = data.file;

    if (data.file instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(data.file);
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          fileBase64 = reader.result as string;
          resolve();
        };
      });
    }

    const payload = { ...data, file: fileBase64 };
    await handleSubmit(() => leaveRequestRepository.createLeave(payload));
  };

  return { ...methods, onSubmit, loading, success, message, show };
};
