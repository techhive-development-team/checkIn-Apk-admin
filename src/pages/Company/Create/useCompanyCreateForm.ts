import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormReturn, useForm } from "react-hook-form";
import { useFormState } from "../../../hooks/useFormState";
import { companyRepository } from "../../../repositories/companyRepository";
import { CompanyCreateSchema, type CompanyCreateForm as Form, } from "../CompanyValidationSchema";

export const useCompanyCreateForm = () => {
  const methods: UseFormReturn<Form> = useForm<Form>({
    resolver: zodResolver(CompanyCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      logo: "",
      companyType: "",
      address: "",
      phone: "",
      // totalEmployee: ""
    },
  });

  const { loading, success, message, show, handleSubmit } =
    useFormState<Form>();

  const onSubmit = async (data: Form) => {
    let logoBase64: string | undefined = data.logo;

    if (data.logo instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(data.logo);
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          logoBase64 = reader.result as string;
          resolve();
        };
      });
    }

    const payload = { ...data, logo: logoBase64 };
    await handleSubmit(() => companyRepository.createCompany(payload));
  };

  return { ...methods, onSubmit, loading, success, message, show };
};
