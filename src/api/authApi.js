import api from './api';

export const AuthApi = {
  /* { email, password }   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData,{skipAuth:true});
    return response.data;
  },

  /* { email,username, password }   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials,{skipAuth:true});
    return response.data;
  },

  /* { oldPassword, newPassword }   */
  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  }
};
