import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css"; // Подключаем CSS

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Декодируем токен, чтобы получить user_id
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.user_id;

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.user_id;

      const updatedUser = {
        surname: event.target.surname.value,
        name: event.target.name.value,
        patronimyc: event.target.patronimyc.value,
        birthdate: event.target.birthdate.value,
      };

      const response = await api.put(`/users/${userId}/`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      alert("Данные успешно обновлены");
    } catch (error) {
      console.error("Ошибка обновления данных:", error);
      alert("Не удалось обновить данные");
    }
  };

  if (loading) return <p className="loading">Загрузка...</p>;
  if (!user) return <p className="loading">Пользователь не найден.</p>;

  return (
    <div className="profile-container">
      {/* Левая панель */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Личный кабинет</h2>
        <ul className="menu">
          <li className="menu-item active">Личные данные</li>
          <li className="menu-item">Портфолио</li>
          <li className="menu-item">Образование</li>
          <li className="menu-item">Навыки</li>
          <li className="menu-item">Маршрутная карта</li>
          <li className="menu-item">Достижения</li>
        </ul>
      </aside>

      {/* Контент */}
      <main className="profile-content">
        <h1 className="profile-title">Личные данные</h1>
        <div className="profile-form">
          <h2 className="form-title">Анкета</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="surname" className="input-field" placeholder="Фамилия" defaultValue={user.surname} />
            <input type="text" name="name" className="input-field" placeholder="Имя" defaultValue={user.name} />
            <input type="text" name="patronimyc" className="input-field" placeholder="Отчество" defaultValue={user.patronimyc} />
            <input type="date" name="birthdate" className="input-field" defaultValue={user.birthdate} />
            <button type="submit" className="save-button">Сохранить изменения</button>
          </form>
        </div>
      </main>
    </div>
  );
}
