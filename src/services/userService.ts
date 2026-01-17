import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },

  getFiles: async () => {
    const response = await api.get('/api/user/my-all-upload-files');
    return response.data;
  },

  uploadFile: async (fileData: any) => {
    // fileData should be FormData
    const response = await api.post('/api/user/my-upload', fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/api/report/user-flahy-report');
    return response.data;
  },

  deleteFile: async (id: string) => {
    const response = await api.delete(`/api/report/${id}`);
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/api/user', data);
    return response.data;
  },

  createPassword: async (password: string) => {
    // Using create-password as typical for setting new password, or reset-password
    // Based on apiRoutes.js: createPassword: "/api/user/create-password"
    const response = await api.post('/api/user/create-password', { password });
    return response.data;
  }
};
