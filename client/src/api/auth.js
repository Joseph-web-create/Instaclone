import axiosInstance from "../utils/axiosinstance";

export const registerUser = async (formData) => {
  return await axiosInstance.post("auth/register", formData);
};

export const loginUser = async (formData) => {
  return await axiosInstance.post("auth/login", formData);
};

export const authenticateUser = async (token) => {
  return await axiosInstance.get("/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const resendEmailVerificationLink = async (token) => {
  return await axiosInstance.get("/auth/resend-verification-email", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const verifyAccount = async (userId, verificationToken, token) => {
  return await axiosInstance.patch(
    `/auth/verify-account/${userId}/${verificationToken}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const sendForgotPasswordMail = async (formData) => {
  return await axiosInstance.post("auth/sendforgot-password-mail", formData);
};

export const resetPassword = async (userId, passwordToken, formData) => {
  return await axiosInstance.post(
    `auth/reset-password/${userId}/${passwordToken}`,
    formData
  );
};
