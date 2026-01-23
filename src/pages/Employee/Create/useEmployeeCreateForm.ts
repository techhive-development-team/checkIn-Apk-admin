import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormReturn, useForm } from "react-hook-form";
import { useFormState } from "../../../hooks/useFormState";
import { employeeRepository } from "../../../repositories/employeeRepository";
import {
  EmployeeCreateSchema,
  type EmployeeCreateForm as Form,
} from "../EmployeeValidationSchema";

export const useEmployeeCreateForm = (companyId: string) => {
  const methods: UseFormReturn<Form> = useForm<Form>({
    resolver: zodResolver(EmployeeCreateSchema),
    defaultValues: {
      profilePic: undefined,
      firstName: "",
      lastName: "",
      position: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const { loading, success, message, show, handleSubmit } =
    useFormState<Form>();

  const onSubmit = async (data: Form) => {
    let profilePicBase64: string | undefined;

    if (data.profilePic instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(data.profilePic);

      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          profilePicBase64 = reader.result as string;
          resolve();
        };
      });
    }

    const payload = {
    ...data,
    profilePic: profilePicBase64, 
  };

    await handleSubmit(() =>
      employeeRepository.createEmployee(companyId, payload)
    );
  };

  return {
    ...methods,
    onSubmit,
    loading,
    success,
    message,
    show,
  };
};
