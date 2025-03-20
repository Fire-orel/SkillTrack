import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const fetchUsers = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Нет авторизации");

  try {
    const response = await api.get("/users/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("Ошибка загрузки данных");
  }
};

export default function UsersPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    retry: false, // Отключаем автоматические повторные попытки
    onError: (err) => {
      console.error("Ошибка API:", err.message);
      setErrorMessage(err.message);
    },
  });


  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold text-red-600">{errorMessage}</h2>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Войти заново
        </button>
      </div>
    );
  }

  if (isLoading) return <p>Загрузка...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Список пользователей</h1>
      <ul className="space-y-2">
        {users && users.length > 0 ? (
          users.map((user) => (
            <li key={user.id} className="p-2 bg-gray-100 rounded">
              {user.surname} {user.name}
            </li>
          ))
        ) : (
          <p>Нет пользователей.</p>
        )}
      </ul>
    </div>
  );
}
