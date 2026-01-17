import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LoginSchema, type LoginFormData } from './loginValidationSchema'
import { useFormState } from '../../hooks/useFormState'
import { authRepository } from '../../repositories/authRepository'

const useLoginForm = () => {
    const methods = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const { loading, success, message, show, handleSubmit } = useFormState()

    const onSubmit = async (data: LoginFormData) => {
        return await handleSubmit(async () => {
            const response = await authRepository.login(data)
            if (response?.statusCode == 200) {
                console.log('Login successful:', response)
                localStorage.setItem('token', response?.token)
            }
            return response;
        })
    }

    return {
        ...methods,
        onSubmit: methods.handleSubmit(onSubmit),
        loading,
        success,
        message,
        show,
    }
}

export default useLoginForm