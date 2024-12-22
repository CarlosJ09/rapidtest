import api from "../interceptor/interceptor";

export const getAllCategories = async () => {
  return await api.get("api/categories/");
};

export const getCategory = async (id) => {
  return await api.get(`api/categories/${id}/`);
};

export const createCategory = async (data) => {
  return await api.post("api/categories/", data);
};

export const updateCategory = async (id, data) => {
  return await api.put(`api/categories/${id}/`, data);
};

export const deleteCategory = async (id) => {
  return await api.delete(`api/categories/${id}/`);
};
