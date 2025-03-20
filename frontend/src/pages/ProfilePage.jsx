import { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Декодируем токен, чтобы получить user_id
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.user_id; // Django использует user_id в токене

        const response = await api.get(`/users/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) return <p>Загрузка...</p>;
  if (!user) return <p>Пользователь не найден.</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Левая панель */}
      <aside className="w-64 bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Личный кабинет</h2>
        <ul className="space-y-2">
          <li className="p-2 bg-gray-200 rounded">Личные данные</li>
          <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">Портфолио</li>
          <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">Образование</li>
          <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">Навыки</li>
          <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">Маршрутная карта</li>
          <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">Достижения</li>
        </ul>
      </aside>

      {/* Контент */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Личные данные</h1>
        <div className="mt-4 p-4 bg-white shadow-md rounded">
          <p><strong>Фамилия:</strong> {user.surname}</p>
          <p><strong>Имя:</strong> {user.name}</p>
          <p><strong>Отчество:</strong> {user.patronimyc}</p>
          <p><strong>Дата рождения:</strong> {user.birthdate}</p>
          <p><strong>Телефон:</strong> {user.phone}</p>
        </div>
      </main>
    </div>
  );
}
