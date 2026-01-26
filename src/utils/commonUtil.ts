import { jwtDecode } from "jwt-decode";

export type JwtUser = {
    userId: string;
    email: string;
    role: string;
    status: string;
    companyId?: string | null;
    employeeId?: string | null;
};

export type JwtPayload = {
    user: JwtUser;
    iat: number;
    exp: number;
};

export const decodeToken = (): JwtPayload | null => {
    try {
        const token = localStorage.getItem("token");

        if (!token) return null;

        return jwtDecode<JwtPayload>(token);
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};
