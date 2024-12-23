import api from "../interceptor/interceptor";

export const getAllTests = async (page, category) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (category) params.append("category", category);

  const url = `api/tests/?${params.toString()}`;

  return await api.get(url);
};

export const getInstructorTests = async (page, category) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (category) params.append("category", category);
  params.append("user", true);

  let url = `api/tests/?${params.toString()}`;
  return await api.get(url);
};

export const getTest = async (id) => {
  return await api.get(`api/tests/${id}/`);
};

export const createTest = async (data) => {
  return await api.post("api/tests/", data);
};

export const updateTest = async (id, data) => {
  return await api.put(`api/tests/${id}/`, data);
};

export const deleteTest = async (id) => {
  return await api.delete(`api/tests/${id}/`);
};
