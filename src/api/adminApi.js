import api from './api';

export const AdminApi = {
  getAllUsers: async (page = 1, limit = 10, search = "") => {
    const response = await api.get('/admin/all-users', {
      params: { page, limit, search }
    });
    return response.data;
  },

  getAllBooks: async (page = 1, limit = 10, search = "") => {
    const response = await api.get('/admin/all-books', {
      params: { page, limit, search }
    });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/delete-user/${userId}`);
    return response.data;
  },

  deleteBook: async (bookId) => {
    const response = await api.delete(`/admin/delete-book/${bookId}`);
    return response.data;
  },

  unverifyBook: async (bookId) => {
    const response = await api.put(`/admin/unverify-book/${bookId}`);
    return response.data;
  },

  verifyBook: async (bookId) => {
    const response = await api.put(`/admin/verify-book/${bookId}`);
    return response.data;
  }
};
