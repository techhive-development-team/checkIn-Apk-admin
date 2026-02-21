import { useForm, type UseFormReturn } from "react-hook-form"
import { UserCreateSchema, type UserCreateForm } from "../UserValidationSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormState } from "../../../hooks/useFormState"
import { userRepository } from "../../../repositories/userRepository"

export const useUserCreateForm = () => {
  const methods: UseFormReturn<UserCreateForm> = useForm<UserCreateForm>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      logo: ""
    }
  })

  const { loading, success, message, show, handleSubmit } =
    useFormState<UserCreateForm>();

  const onSubmit = async (data: UserCreateForm) => {
    let logo: string | undefined;

    if (data.logo instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(data.logo);

      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          logo = reader.result as string;
          resolve();
        };
      });
    }

    const payload = {
      ...data,
      logo: logo,
      systemRole: 'SUPER_ADMIN'
    };

    await handleSubmit(() =>
      userRepository.createUser(payload)
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
}