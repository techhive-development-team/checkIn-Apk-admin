import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { employeeRepository } from "../../../repositories/employeeRepository";
import { useGetEmployeeById } from "../../../hooks/useGetEmployee";
import { useFormState } from "../../../hooks/useFormState";
import {
  EmployeeUpdateSchema,
  type EmployeeUpdateForm,
} from "../EmployeeValidationSchema";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../../../enum/urls";

export const useEmployeeEditForm = () => {
  const { id } = useParams<{ id: string }>();

  const token = localStorage.getItem("token");
  const companyId = token
    ? jwtDecode<{ user: { companyId: string } }>(token).user.companyId
    : "";

  const { data: employeeData } = useGetEmployeeById(companyId ?? "", id ?? "");

  const methods: UseFormReturn<EmployeeUpdateForm> =
    useForm<EmployeeUpdateForm>({
      resolver: zodResolver(EmployeeUpdateSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        profilePic: "",
        position: "",
        phone: "",
        address: "",
        status: "active",
      },
    });

  const { reset } = methods;
  const [profilePreview, setProfilePreview] = useState<string | undefined>();

  useEffect(() => {
    if (employeeData) {
      reset({
        firstName: employeeData.firstName || "",
        lastName: employeeData.lastName || "",
        email: employeeData.email || "",
        profilePic: employeeData.profilePic || undefined,
        position: employeeData.position || "",
        phone: employeeData.phone || "",
        address: employeeData.address || "",
        status: employeeData.status || "active",
      });

      if (employeeData.profilePic) {
        const imageUrl = `${baseUrl.replace(/\/$/, "")}/${employeeData.profilePic.replace(/^\//, "")}`;
        setProfilePreview(imageUrl);
      }
    }
  }, [employeeData, reset]);

  const { loading, success, message, show, handleSubmit } =
    useFormState<EmployeeUpdateForm>();

  const onSubmit = async (data: EmployeeUpdateForm) => {
    const payload: any = { ...data };

    if (!(data.profilePic instanceof File)) {
      delete payload.profilePic;
    } else {
      payload.profilePic = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(data.profilePic);
        reader.onloadend = () => resolve(reader.result as string);
      });
    }

    if (!employeeData?.companyId) return;

    await handleSubmit(() =>
      employeeRepository.updateEmployee(
        employeeData.companyId,
        id || "",
        payload,
      ),
    );
  };

  return {
    ...methods,
    onSubmit,
    loading,
    success,
    message,
    show,
    profilePreview,
  };
};
