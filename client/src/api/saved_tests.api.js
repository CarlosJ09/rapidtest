import api from "../interceptor/interceptor";

export const getAllSavedTests = async () => {
  return await api.get("api/saved_tests/");
};

export const getSavedTest = async (id) => {
  return await api.get(`api/saved_tests/${id}/`);
};

export const createSavedTest = async (data) => {
  return await api.post("api/saved_tests/", data);
};

export const deleteSavedTest = async (id) => {
  return await api.delete(`api/saved_tests/${id}/`);
};
