import { API_URLS } from "../enum/urls";
import type { ForgotPwdForm } from "../pages/ForgetPwd/ForgotPwdValidationSchema";
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

  async forgotPassword(data: ForgotPwdForm) {
    return await client.exec(API_URLS.AUTH + "/forgot-password", {
      method: "post",
      body: JSON.stringify(data),
    });
  },

  async passwordReset(data: { newPassword: string; token: string })  {
    return await client.exec(API_URLS.AUTH + "/password-reset", {
      method: "post",
      body: JSON.stringify(data),
    });
  },
};