import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css"; // Подключаем CSS

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("Личные данные");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    navigate("/");
  };

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

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  if (loading) return <p className="loading">Загрузка...</p>;
  if (!user) return <p className="loading">Пользователь не найден.</p>;

  return (

    <div>
      <header className="top-bar">
        <div className="logo-area"></div>
        <nav className="top-menu">
          <a href="#">Профориентация</a>
          <a href="#">Обучение</a>
          <a href="#">Работа</a>
        </nav>
        <div className="user-options">
          {/* <a href="#">Личный кабинет</a> */}
          {/* <a href="#">Выйти</a> */}
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </header>
      <div className="profile-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Личный кабинет</h2>
        <ul className="menu">
          <li className={`menu-item ${activeSection === "Личные данные" ? "active" : ""}`} onClick={() => handleSectionChange("Личные данные")}>
            Личные данные
          </li>
          <li className={`menu-item ${activeSection === "Портфолио" ? "active" : ""}`} onClick={() => handleSectionChange("Портфолио")}>
            Портфолио
          </li>
          <li className={`menu-item ${activeSection === "Образование" ? "active" : ""}`} onClick={() => handleSectionChange("Образование")}>
            Образование
          </li>
          <li className={`menu-item ${activeSection === "Навыки" ? "active" : ""}`} onClick={() => handleSectionChange("Навыки")}>
            Навыки
          </li>
          <li className={`menu-item ${activeSection === "Маршрутная карта" ? "active" : ""}`} onClick={() => handleSectionChange("Маршрутная карта")}>
            Маршрутная карта
          </li>
        </ul>
      </aside>
      <main className="profile-content">
        <h1 className="profile-title">{activeSection}</h1>
        {activeSection === "Личные данные" && (
          <div className="profile-form">
            <h2 className="form-title">Анкета</h2>
            <form>
              <input type="text" name="surname" className="input-field" placeholder="Фамилия" defaultValue={user.surname} />
              <input type="text" name="name" className="input-field" placeholder="Имя" defaultValue={user.name} />
              <input type="text" name="patronimyc" className="input-field" placeholder="Отчество" defaultValue={user.patronimyc} />
              <input type="date" name="birthdate" className="input-field" defaultValue={user.birthdate} />
              <button type="submit" className="save-button">Сохранить изменения</button>
            </form>
          </div>
        )}
        {activeSection === "Портфолио" && <div>Содержимое раздела Портфолио</div>}
        {activeSection === "Образование" && <div>Содержимое раздела Образование</div>}
        {activeSection === "Навыки" && <div>Содержимое раздела Навыки</div>}
        {activeSection === "Маршрутная карта" && <div>Содержимое раздела Маршрутная карта</div>}
      </main>
    </div>
    </div>
  );
}
