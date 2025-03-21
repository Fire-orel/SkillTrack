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
  const [portfolio, setPortfolio] = useState({
    certificates: [],
    achievements: [],
    works: [],
    files: [],
    links: [],
  });

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    navigate("/");
  };

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

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

        const [certRes, achRes, worksRes, linksRes] = await Promise.all([
          api.get("/certificates/", { headers }),
          api.get("/achievements/", { headers }),
          api.get("/works/", { headers }),
          api.get("/links/", { headers }),  // Загружаем ссылки
        ]);

        setUser(response.data);
        setPortfolio((prev) => ({
          ...prev,
          certificates: certRes.data,
          achievements: achRes.data,
          works: worksRes.data,
          links: linksRes.data,  // Сохраняем ссылки в стейт
        }));
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", user.id);

    try {
      const response = await api.post("/certificates/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setPortfolio((prev) => ({
        ...prev,
        certificates: [...prev.certificates, response.data],
      }));
    } catch (err) {
      console.error("Ошибка при загрузке файла:", err);
    }
  };
  const handleDeleteFile = async (id) => {
    try {
      await api.delete(`/certificates/${id}/`, { headers });
      setPortfolio((prev) => ({
        ...prev,
        certificates: prev.certificates.filter((cert) => cert.id !== id),
      }));
    } catch (error) {
      console.error("Ошибка при удалении файла:", error);
    }
  };

  const handleAddLink = async (event) => {
    event.preventDefault();
    const link = event.target.link.value.trim();
    if (!link) return;

    try {
      const response = await api.post(
        "/links/",
        { url: link },
        { headers }
      );

      // Добавляем новую ссылку в состояние
      setPortfolio((prev) => ({
        ...prev,
        links: [...prev.links, response.data], // response.data = { id, url }
      }));

      event.target.reset(); // очищаем форму
    } catch (error) {
      console.error("Ошибка добавления ссылки:", error);
      alert("Не удалось добавить ссылку.");
    }
  };


  const handleSectionChange = (section) => {
    setActiveSection(section);
  };


  const handleDeleteLink = async (id) => {
    try {
      await api.delete(`/links/${id}/`, { headers });
      setPortfolio((prev) => ({
        ...prev,
        links: prev.links.filter((link) => link.id !== id),
      }));
    } catch (error) {
      console.error("Ошибка при удалении ссылки:", error);
    }
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
              <form onSubmit={handleSubmit}>
                <input type="text" name="surname" className="input-field" placeholder="Фамилия" defaultValue={user.surname} />
                <input type="text" name="name" className="input-field" placeholder="Имя" defaultValue={user.name} />
                <input type="text" name="patronimyc" className="input-field" placeholder="Отчество" defaultValue={user.patronimyc} />
                <input type="date" name="birthdate" className="input-field" defaultValue={user.birthdate} />
                <button type="submit" className="save-button">Сохранить изменения</button>
              </form>
            </div>
          )}

          {activeSection === "Портфолио" && (
            <div className="portfolio-section">
              <div className="portfolio-grid">
                {/* Левая колонка — ссылки */}

                <div className="portfolio-links">
                  <h2>Добавьте ссылки на работы и соцсети</h2>
                  <form onSubmit={handleAddLink}>
                    <input type="text" name="link" placeholder="Вставьте ссылку" className="input-field" />
                    <button type="submit" className="save-button">Добавить</button>
                  </form>
                  <ul>
                    {portfolio.links.map((link) => (
                      <li key={link.id} className="link-item">
                        <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                        <button onClick={() => handleDeleteLink(link.id)} className="delete-button">Удалить</button>
                      </li>
                    ))}
                  </ul>


                </div>

                {/* Правая колонка — загруженные файлы */}
                <div className="portfolio-files">

                  <h2>Загруженные дипломы</h2>
                  <label className="custom-file-upload">
                    <input type="file" onChange={handleFileUpload} style={{ display: "none" }} />
                    Выберите файл
                  </label>
                  <ul>
                    {portfolio.certificates.map((file) => {
                      const fileName = decodeURIComponent(file.file.split("/").pop());
                      return (
                        <li key={file.id} className="certificate-item">
                          <a href={`http://127.0.0.1:8000${file.file}`} target="_blank" rel="noopener noreferrer">
                            {fileName.length > 30 ? fileName.slice(0, 27) + "..." : fileName}
                          </a>
                          <button onClick={() => handleDeleteFile(file.id)} className="delete-button">Удалить</button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

              </div>
            </div>
          )}


          {activeSection === "Образование" && <div>Содержимое раздела Образование</div>}
          {activeSection === "Навыки" && <div>Содержимое раздела Навыки</div>}
          {activeSection === "Маршрутная карта" && <div>Содержимое раздела Маршрутная карта</div>}
        </main>
      </div>
    </div>
  );
}
