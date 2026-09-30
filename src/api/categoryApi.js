import api from './api';

export const CategoryApi = {
  getAll: async () => {
    const response = await api.get('/category/all',{skipAuth:true});
    return response.data;
  },

  create: async (categoryName) => {
    const categoryData = {
        "categoryName":categoryName
    }
    const response = await api.post('/category/create', categoryData);
    return response.data;
  },

  delete: async (categoryId) => {
    const response = await api.delete(`/category/delete/${categoryId}`);
    return response.data;
  }
};
