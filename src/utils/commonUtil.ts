import { jwtDecode } from "jwt-decode";

interface User {
  userId: string;
  name: string;
  logo: string;
  email: string;
  role: string;
  companyId: string;
  employeeId: string;
}

export type JwtPayload = {
    user: User;
    iat: number;
    exp: number;
};

export const decodeToken = (token: string | null): JwtPayload | null => {
    try {
        if (!token) return null;
        return jwtDecode<JwtPayload>(token);
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};
