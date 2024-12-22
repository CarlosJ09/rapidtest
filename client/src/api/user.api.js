import api from "../interceptor/interceptor";

export const getUser = async (id) => {
  return await api.get(`api/users/${id}/`);
};
