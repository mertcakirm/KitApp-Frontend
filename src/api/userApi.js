import api from './api';

export const UserApi = {
  getMyProfile: async () => {
    const response = await api.get('/users/my-profile');
    return response.data;
  },

  deleteMyProfile: async () => {
    const response = await api.delete('/users/delete-my-profile');
    return response.data;
  },

  getAllWriters: async (page = 1, limit = 10, search = "") => {
    const response = await api.get('/users/writers-all', {
        skipAuth: true,
      params: { page, limit, search }
    });
    return response.data;
  },

  getWriterProfile: async (id) => {
    const response = await api.get(`/users/writer/${id}`, {
      skipAuth: true 
    });
    return response.data;
  }
};
