import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LoginSchema, type LoginFormData } from './loginValidationSchema'
import { useFormState } from '../../hooks/useFormState'
import { authRepository } from '../../repositories/authRepository'
import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '../../utils/commonUtil'
import { useEffect } from 'react'

const useLoginForm = () => {
    const methods = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const { loading, success, message, show, setMessage, setShow, setSuccess, handleSubmit } =
        useFormState()

    const onSubmit = async (data: LoginFormData) => {
        const response = await handleSubmit(() => authRepository.login(data));
        if (response?.data?.token) {
            localStorage.setItem('token', response.data.token);
            const jwtPayload = jwtDecode<JwtPayload>(response.data.token);
            const user = jwtPayload.user;
            if (user.role !== 'ADMIN' && user.role !== 'CLIENT') {
                throw new Error('Only Admin and Client users can access this portal.');
            } else {
                window.location.href = '/';
            }
            return jwtPayload;
        }
    }

    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const errorMessage = urlParams.get("error");
            if (errorMessage) {
                setMessage(errorMessage);
                setSuccess(false);
                setShow(true);
            }
        } catch (error) {
            console.log(error);
        }
    })

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
