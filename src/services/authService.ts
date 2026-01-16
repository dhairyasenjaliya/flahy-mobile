import api from './api';

export const authService = {
  sendOtp: async (contact: string, country_code: string, login_type: number) => {
    // Endpoint inferred via investigation: /api/auth/user/send-otp
    const response = await api.post('/api/auth/user/send-otp', { contact, country_code, login_type });
    console.log("🚀 ~ response:", response)
    return response.data;
  },

  // https://flahyhealth.com/user/auth/login


  verifyOtp: async (contact: string, otp: string, login_type: number, country_code: string) => {
    console.log("🚀 ~ otp:", otp)
    const response = await api.post('/api/auth/user/verify-otp', { contact, otp, login_type, country_code });
    console.log("🚀 ~ response:", response)
    return response.data;
  },

  verifyContact: async (contact: string) => {
    const response = await api.post('/api/auth/user/login/check-type', { input_value: contact });
    return response.data;
  },

  logout: async () => {
     await api.post('/api/auth/user/logout');
  }
};
