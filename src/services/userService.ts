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
  }
};
