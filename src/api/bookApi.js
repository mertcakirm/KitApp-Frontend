import api from './api';

export const BookApi = {

  /* { title, description, coverImage, pdf, categoryIds } */
  create: async (bookData) => {
    const formData = new FormData();

    if (bookData.title) formData.append('title', bookData.title);
    if (bookData.description) formData.append('description', bookData.description);

    if (bookData.coverImage) formData.append('coverImage', bookData.coverImage);
    if (bookData.pdf) formData.append('pdf', bookData.pdf);

    if (bookData.categoryIds && Array.isArray(bookData.categoryIds)) {
      bookData.categoryIds.forEach(id => {
        formData.append('categoryIds', id); 
      });
    }

    const response = await api.post('/books/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  getAll: async (page = 1, limit = 10, search = "") => {
    const response = await api.get('/books/all', {
        skipAuth:true,
        params: { page, limit, search }
    });
    return response.data;
  },

  /* { title, description, coverImage } */
  update: async (bookId, bookData) => {
    const formData = new FormData();

    if (bookData.title) formData.append('title', bookData.title);
    if (bookData.description) formData.append('description', bookData.description);
    
    if (bookData.coverImage) {
      formData.append('coverImage', bookData.coverImage);
    }

    const response = await api.put(`/books/update/${bookId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  getByWriter: async (userId) => {
    const response = await api.get(`/books/writer/${userId}`,{skipAuth:true});
    return response.data;
  },

  delete: async (bookId) => {
    const response = await api.delete(`/books/delete/${bookId}`);
    return response.data;
  }
};
