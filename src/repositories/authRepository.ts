import { API_URLS } from "../enum/urls";
import type { LoginFormData } from "../pages/Login/loginValidationSchema";
import { client } from "./client";

export const authRepository = {
    async login(data: LoginFormData) {
        const response = await client.exec(API_URLS.AUTH + "/login", {
            method: "post",
            body: JSON.stringify(data),
        });
        return response;
    }
};