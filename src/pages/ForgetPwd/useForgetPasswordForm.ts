import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { authRepository } from '../../repositories/authRepository';
import { ForgotPwdSchema, type ForgotPwdForm } from './ForgotPwdValidationSchema';
import { useFormState } from '../../hooks/useFormState'

export const useForgotPasswordForm = () => {
  const methods = useForm<ForgotPwdForm>({
    resolver: zodResolver(ForgotPwdSchema),
    defaultValues: {
      email: '',
    },
  });

  const { loading, success, message, show, handleSubmit } = useFormState<ForgotPwdForm>();

  const onSubmit = async (data: ForgotPwdForm) => {
    await handleSubmit(() => authRepository.forgotPassword(data));
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
