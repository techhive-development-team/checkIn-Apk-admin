import { API_URLS } from "../enum/urls";
import type { LoginFormData } from "../pages/Login/loginValidationSchema";
import type { ResetPasswordForm } from "../pages/Profile/PasswordReset/passwordValidationSchema";
import type { SignupForm } from "../pages/Signup/signupValidationSchema";
import { client } from "./client";

export const authRepository = {
  async login(data: LoginFormData) {
    return await client.exec(API_URLS.AUTH + "/login", {
      method: "post",
      body: JSON.stringify(data),
    });
  },

  async signup(data: SignupForm) {
    return await client.exec(API_URLS.AUTH + "/signup", {
      method: "post",
      body: JSON.stringify(data),
    });
  },  

  async resetPassword(data: ResetPasswordForm) {
    return await client.exec(API_URLS.AUTH + "/reset-password", {
      method: "post",
      body: JSON.stringify(data),
    });
  },
};