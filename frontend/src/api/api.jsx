import axios from "axios";
import { refreshToken } from "./auth.jsx";

const API_URL = "http://127.0.0.1:8000/api"; // Убедись, что URL совпадает

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ **Добавляем `Authorization: Bearer <token>` во все запросы**
api.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token");
  
  if (access_token) {
    config.headers["Authorization"] = `Bearer ${access_token}`;
  }
  return config;
});

// ✅ **Перехватываем 401 и обновляем токен**
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Access token истек, пытаемся обновить...");
      try {
        const data = await refreshToken();
        console.log("Новый токен после обновления:", data.access);
        localStorage.setItem("access_token", data.access);
        error.config.headers["Authorization"] = `Bearer ${data.access}`;
        return axios(error.config); // Повторяем запрос с новым токеном
      } catch (err) {
        console.error("Не удалось обновить токен. Выход из системы.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Перенаправляем на вход
      }
    }
    return Promise.reject(error);
  }
);

export default api; // ✅ Теперь `api` экспортируется правильно
