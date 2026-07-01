import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "../../../hooks/useFormState";
import { employeeRepository } from "../../../repositories/employeeRepository";
import {
  EmployeeCreateSchema,
  type EmployeeCreateForm as Form,
} from "../EmployeeValidationSchema";

export const useEmployeeCreateForm = (
  companyId: string,
  fixedMemberType: "EMPLOYEE" | "STUDENT" = "EMPLOYEE",
) => {
  const methods = useForm<Form>({
    resolver: zodResolver(EmployeeCreateSchema),
    defaultValues: {
      memberType: fixedMemberType,
      profilePic: undefined,
      firstName: "",
      lastName: "",
      studentClass: "",
      classTime: "",
      classTimeFrom: "",
      classTimeTo: "",
      duration: "",
      durationFrom: "",
      durationTo: "",
      classDays: [],
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
      memberType: fixedMemberType,
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
