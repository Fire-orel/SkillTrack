import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/token/`, { username, password });



    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    return response.data;
  } catch (error) {
    throw new Error("Ошибка авторизации. Проверьте логин и пароль.");
  }
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("Refresh token отсутствует");

  try {
    const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });

    

    localStorage.setItem("access_token", response.data.access);

    return response.data;
  } catch (error) {
    console.error("Ошибка обновления токена. Требуется повторный вход.");
    throw new Error("Ошибка обновления токена");
  }
};
