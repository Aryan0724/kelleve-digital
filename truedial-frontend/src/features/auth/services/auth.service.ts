import api from '@/lib/api';

export interface SendOtpPayload {
  phone: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
  company_name?: string;
}

export const authService = {
  sendOtp: async (data: SendOtpPayload) => {
    const response = await api.post('/truedial/auth/otp/send', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpPayload) => {
    const response = await api.post('/truedial/auth/otp/verify', data);
    return response.data;
  },
};
