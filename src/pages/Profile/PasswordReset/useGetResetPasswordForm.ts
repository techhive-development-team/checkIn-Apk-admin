import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from '../../../hooks/useFormState'
import { ResetPasswordSchema, type ResetPasswordForm } from './passwordValidationSchema'
import { authRepository } from '../../../repositories/authRepository'
import { useForm } from 'react-hook-form'

export const useGetResetPasswordForm = () => {
  const methods = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  })

  const { loading, success, message, show, handleSubmit } = useFormState<ResetPasswordForm>()

  const onSubmit = async (data: ResetPasswordForm) => {
    await handleSubmit(() => authRepository.resetPassword(data))
  }

  return {
    ...methods,
    onSubmit, 
    loading,
    success,
    message,
    show,
  }
}

