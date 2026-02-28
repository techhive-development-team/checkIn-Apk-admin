import { jwtDecode } from 'jwt-decode'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { JwtPayload } from '../utils/commonUtil'
import { useAuthStore } from '../stores/authStore'

const Google = () => {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login);

    const storeToken = async (token: string) => {
        const jwtPayload = jwtDecode<JwtPayload>(token);
        const user = jwtPayload.user;
        if (user.role !== 'ADMIN' && user.role !== 'CLIENT') {
            throw new Error('Only Admin and Client users can access this portal.');
        } else {
            login(user, token);
            window.location.href = '/';
        }
    }

    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const accessToken = urlParams.get("token");
            if (!accessToken) {
                throw new Error("Authentication failed: Token not found")
            }
            storeToken(accessToken);
        } catch (error) {
            console.log(error);
            navigate("/login")
        }
    }, [navigate])

    return (
        <div>Authenticating</div>
    )
}

export default Google
