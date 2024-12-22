import api from "../interceptor/interceptor";

export const login = async (data) => {
  return await api.post("api/login/", data);
};

export const register = async (data) => {
  return await api.post("api/register/", data);
};
