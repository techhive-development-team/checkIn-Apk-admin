import { useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeRepository } from "../../../repositories/employeeRepository";
import { baseUrl } from "../../../enum/urls";
import { useFormState } from "../../../hooks/useFormState";
import {
  UserProfileSchema,
  type UserProfileForm,
} from "../ProfileValidationSchema";
import { useGetUserById } from "../../../hooks/useGetUser";
import { jwtDecode } from "jwt-decode";

export const useUserProfileForm = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const decodedToken = jwtDecode<{ user: { userId: string } }>(token);
  const userId = decodedToken.user.userId;

  const { data: userData } = useGetUserById(userId);

  const employeeId = userData?.employee?.employeeId;
  const companyId = userData?.employee?.companyId;

  const methods: UseFormReturn<UserProfileForm> = useForm<UserProfileForm>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      firstName: userData?.employee?.firstName || "",
      lastName: userData?.employee?.lastName || "",
      email: userData?.email || "",
      position: userData?.employee?.position || "",
      phone: userData?.employee?.phone || "",
      address: userData?.employee?.address || "",
      profilePic: userData?.employee?.profilePic || "", 
    },
  });

  const { reset } = methods;

  const [profilePreview, setProfilePreview] = useState<string | undefined>(
    userData?.employee?.profilePic
      ? `${baseUrl.replace(/\/$/, "")}/${userData.employee.profilePic.replace(/^\//, "")}`
      : undefined
  );

  useEffect(() => {
    if (!userData) return;

    reset({
      firstName: userData.employee?.firstName || "",
      lastName: userData.employee?.lastName || "",
      email: userData.email || "",
      position: userData.employee?.position || "",
      phone: userData.employee?.phone || "",
      address: userData.employee?.address || "",
      profilePic: userData.employee?.profilePic || "",
    });

    if (userData.employee?.profilePic) {
      const imageUrl = `${baseUrl.replace(/\/$/, "")}/${userData.employee.profilePic.replace(/^\//, "")}`;
      setProfilePreview(imageUrl);
    }
  }, [userData, reset]);

  const { loading, success, message, show, handleSubmit } =
    useFormState<UserProfileForm>();
 
  const onSubmit = async (data: UserProfileForm) => {
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

    await handleSubmit(() =>
      employeeRepository.updateEmployee(companyId, employeeId, payload)
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