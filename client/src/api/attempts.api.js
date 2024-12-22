import api from "../interceptor/interceptor";

export const getAllAttempts = async (page, testId) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (testId) params.append("test", testId);

  const url = `api/attempts/?${params.toString()}`;

  return await api.get(url);
};

export const getTestAttempt = async (id) => {
  return await api.get(`api/attempts/${id}/`);
};

export const createTestAttempt = async (data) => {
  return await api.post("api/attempts/", data);
};

export const updateTestAttempt = async (id, data) => {
  return await api.put(`api/attempts/${id}/`, data);
};
