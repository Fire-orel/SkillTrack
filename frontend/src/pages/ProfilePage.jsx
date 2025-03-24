import { useState, useEffect, use } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css"; // Подключаем CSS
import "../styles/ProfilePageMobile.css";


import image4 from "../assets/image4.png";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("Личные данные");
  const [activeSectionMeny, setActiveSectionMeny] = useState("Личные кабинет");
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState({
    certificates: [],
    achievements: [],
    works: [],
    files: [],
    links: [],
  });
  const [education, setEducation] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEducation, setNewEducation] = useState({
    user: "",
    program: "",
    num: "",
    degree: "",
    year_beginning: "",
    year_ending: "",
    university: "",
  });
  const [category, setCategory] = useState("");




  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [careerInterests, setCareerInterests] = useState([]);
  const [pendingInterests, setPendingInterests] = useState([]);
  const [articles, setArticles] = useState([]);

  const skillOptions = ["JavaScript", "React", "Node.js", "UX-дизайн", "Финансовый анализ", "Маркетинг", "Python", "SQL"];

  const levelLabels = {
    1: "Начальный уровень",
    2: "Базовый уровень",
    3: "Средний уровень",
    4: "Продвинутый уровень",
    5: "Эксперт"
  };

  useEffect(() => {
    api.get("/skills/", { headers })
      .then(response => setSkills(response.data))
      .catch(error => console.error("Ошибка загрузки навыков:", error));
  }, []);

  const addSkill = async () => {
    if (inputValue && !skills.find(s => s.title === inputValue)) {
      try {
        const response = await api.post("/skills/", { title: inputValue, level: "1" }, { headers });
        setSkills([...skills, response.data]);
        setInputValue("");
      } catch (error) {
        console.error("Ошибка добавления навыка:", error);
      }
    }
  };

  const removeSkill = async (skillId) => {
    try {
      await api.delete(`/skills/${skillId}/`, { headers });
      setSkills(skills.filter(s => s.id !== skillId));
    } catch (error) {
      console.error("Ошибка удаления навыка:", error);
    }
  };

  const handleSliderChange = (skillId, level) => {
    setSkills(skills.map(s => (s.id === skillId ? { ...s, level } : s)));
  };

  const updateSkillLevel = async (skillId, level) => {
    try {
      const response = await api.patch(`/skills/${skillId}/`, { level }, { headers });
      setSkills(skills.map(s => (s.id === skillId ? response.data : s)));
    } catch (error) {
      console.error("Ошибка обновления уровня навыка:", error);
    }
  };


  const getRecommendations = async () => {
    try {
      const response = await api.post("/career-recommendations/", {}, { headers });
      console.log("Ответ сервера:", response.data);
      setPendingInterests(response.data.career_paths);
      setModalOpen(true);
    } catch (error) {
      console.error("Ошибка получения рекомендаций:", error);
    }
  };

  const addInterest = (interest) => {
    if (!careerInterests.includes(interest)) {
      setCareerInterests([...careerInterests, interest]);
    }
  };




  useEffect(() => {
    api.get("/sber-parser/", { headers })
      .then(response => setArticles(response.data.articles))


      .catch(error => console.error("Ошибка загрузки статей:", error));
  },
    []);



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

        const [certRes, achRes, worksRes, linksRes, eduRes] = await Promise.all([
          api.get("/certificates/", { headers }),
          api.get("/achievements/", { headers }),
          api.get("/works/", { headers }),
          api.get("/links/", { headers }),  // Загружаем ссылки
          api.get("/education/", { headers }) // Загружаем образование
        ]);

        setUser(response.data);



        setPortfolio((prev) => ({
          ...prev,
          certificates: certRes.data,
          achievements: achRes.data,
          works: worksRes.data,
          links: linksRes.data,  // Сохраняем ссылки в стейт
        }));

        setEducation(eduRes.data); // Обновляем состояние образования
        setNewEducation((prev) => ({ ...prev, user: userId }));

      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      // console.log("User обновлён:", user);
    }
    if (user && user.category) {
      setCategory(user.category); // Устанавливаем начальное значение из user
      // console.log(category)
    }

  }, [user]);

  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    api.get("/hh-parser/", { headers })
      .then(response => setVacancies(response.data.vacancies))
      .catch(error => console.error("Ошибка загрузки вакансий:", error));
  }, []);

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
        category: event.target.category.value,
        city: event.target.city.value
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


  const handleAddEducation = async (event) => {
    event.preventDefault();


    try {
      setNewEducation({ user: user.id });
      const response = await api.post("/education/", newEducation, { headers });


      setEducation((prev) => [...prev, response.data]);
      setIsModalOpen(false);
      setNewEducation({
        user: user.id,
        program: "",
        num: "",
        degree: "",
        year_beginning: "",
        year_ending: "",
        university: "",
      });
    } catch (error) {
      console.error("Ошибка при добавлении образования:", error);
    }
  };
  const handleDeleteEducation = async (id) => {
    try {
      await api.delete(`/education/${id}/`, { headers });
      setEducation((prev) => prev.filter((edu) => edu.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении образования:", error);
    }
  };



  const [works, setWorks] = useState([]);

  useEffect(() => {
    api.get("/works/", { headers })
      .then(response => setWorks(response.data))
      .catch(error => console.error("Ошибка загрузки опыта работы:", error));
  }, []);


  const [isModalOpenOpit, setIsModalOpenOpit] = useState(false);
  const [newWork, setNewWork] = useState({ place: "", profi: "", date_start: "", date_end: "" });

  const handleOpenModal = () => setIsModalOpenOpit(true);
  const handleCloseModal = () => setIsModalOpenOpit(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWork({ ...newWork, [name]: value });
  };

  const handleSubmitOpit = () => {
    api.post("/works/", newWork, { headers })
      .then(() => {
        setIsModalOpenOpit(false);
        setWorks([...works, newWork]);
      })
      .catch(error => console.error("Ошибка добавления опыта работы:", error));
  };
  const handleDeleteWork = (workId) => {
    api.delete(`/works/${workId}/`, { headers })
      .then(() => {
        setWorks(works.filter(work => work.id !== workId));
      })
      .catch(error => console.error("Ошибка удаления опыта работы:", error));
  };


  const calculateMonths = (start, end) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthsDiff = endDate.getMonth() - startDate.getMonth();
    return yearsDiff * 12 + monthsDiff;
  };

  const totalExperience = works.reduce((sum, work) => sum + calculateMonths(work.date_start, work.date_end), 0);


  if (loading) return <p className="loading">Загрузка...</p>;
  if (!user) return <p className="loading">Пользователь не найден.</p>;

  return (
    <div>
      <header className="top-bar">
        <div className="logo-area">
          <span className="logo-text">SkillTrack</span>
        </div>
        <nav className="top-menu">
          <a href="#" onClick={() => setActiveSection("Тестирование")}>Профориентация</a>
          <a href="#" onClick={() => handleSectionChange("Статьи")}>Статьи</a>
          <a href="#" onClick={() => setActiveSectionMeny("Работа")}>Работа</a>
          {/* <a href="#" onClick={() => setActiveSectionMeny("Статьи")}>Статьи</a> */}
          <a href="#" onClick={() => setActiveSectionMeny("Помощь")}>Помощь</a>
        </nav>
        <div className="user-options">
          {/* <a href="#">Личный кабинет</a> */}
          <a href="#" onClick={() => setActiveSectionMeny("Личный кабинет")}>Личный кабинет</a>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </header>
      <div className="profile-container">
        <aside className="sidebar">

          <ul className="menu">
            {activeSectionMeny === "Личный кабинет" && (<>
              <h2 className="sidebar-title">Личный кабинет</h2>
              <li className={`menu-item ${activeSection === "Личные данные" ? "active" : ""}`} onClick={() => handleSectionChange("Личные данные")}>
                Личные данные
              </li>
              {/* <li className={`menu-item ${activeSection === "Тестирование" ? "active" : ""}`} onClick={() => handleSectionChange("Тестирование")}>
                Профориентация
              </li> */}
              <li className={`menu-item ${activeSection === "Портфолио" ? "active" : ""}`} onClick={() => handleSectionChange("Портфолио")}>
                Портфолио
              </li>
              <li className={`menu-item ${activeSection === "Образование" ? "active" : ""}`} onClick={() => handleSectionChange("Образование")}>
                Образование
              </li>
              <li className={`menu-item ${activeSection === "Навыки" ? "active" : ""}`} onClick={() => handleSectionChange("Навыки")}>
                Навыки
              </li></>
            )}
            {activeSectionMeny === "Работа" && (
              <>
                <h2 className="sidebar-title">Работа</h2>
                <li className={`menu-item ${activeSection === "Вакансии" ? "active" : ""}`} onClick={() => handleSectionChange("Вакансии")}>Вакансии</li>
                <li className={`menu-item ${activeSection === "Опыт работы" ? "active" : ""}`} onClick={() => handleSectionChange("Опыт работы")}>Опыт</li>
                {/* <li className="menu-item">Резюме</li>
                <li className="menu-item">Компании</li> */}
              </>
            )}
            {activeSectionMeny === "Обучение" && (
              <>
                <h2 className="sidebar-title">Обучение</h2>
                <li className={`menu-item ${activeSection === "Статьи" ? "active" : ""}`} onClick={() => handleSectionChange("Статьи")}>Статьи</li>

              </>
            )}

            {/* <li className={`menu-item ${activeSection === "Маршрутная карта" ? "active" : ""}`} onClick={() => handleSectionChange("Маршрутная карта")}>
              Маршрутная карта
            </li> */}
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
                <input type="text" name="city" className="input-field" placeholder="Город" defaultValue={user.city} />
                <select
                  name="category"
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  // value={newEducation.degree}
                  // onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  required
                >
                  <option value="" disabled hidden>Категория</option>
                  <option value="Школьник">Школьник</option>
                  {/* <option value="Абитуриент">Абитуриент</option> */}
                  <option value="Студент">Студент</option>
                  <option value="Специалист">Специалист</option>

                </select>
                <button type="submit" className="save-button">Сохранить изменения</button>
              </form>
            </div>
          )}
          {activeSection === "Тестирование" && (
            <div className="test-section">
              <div className="test-image">
                <img src={image4} alt="Профориентационный тест" />
              </div>
              <div className="test-content">
                <h2>Пройдите тест на профориентацию сегодня, чтобы быть уверенным завтра</h2>
                <p>
                  Мы поможем разобраться в ваших интересах, способностях и
                  предпочтениях, чтобы сделать правильный выбор и построить
                  успешную карьеру.
                </p>
                <a href="https://netology.ru/profession-choice" target="_blank" className="test-button">Пройти тест</a>
              </div>
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


          {activeSection === "Образование" && (
            <div className="education-section">
              <h2 className="education-title">Образование</h2>
              <div className="education-list">
                {education.map((edu) => (
                  <div key={edu.id} className="education-item">
                    <h3>{edu.program}</h3>
                    <p>{edu.degree}</p>
                    <p>{edu.university}</p>
                    <p>
                      {new Date(edu.year_beginning).getFullYear()} -{" "}
                      {new Date(edu.year_ending).getFullYear()}
                    </p>
                    <button
                      className="trash-icon"
                      onClick={() => handleDeleteEducation(edu.id)}
                      title="Удалить"
                    >
                      <img src="src/media/trash.png" alt="Удалить" className="trash-img" />

                    </button>
                  </div>
                ))}
                <div className="education-item add-item" onClick={() => setIsModalOpen(true)}>+</div>
              </div>
            </div>
          )}
          {activeSection === "Навыки" && (
            <div className="skills-section">
              <h2 className="skills-title">Ваши интересы</h2>
              <div className="career-interests">
                {careerInterests.map((interest, index) => (
                  <div key={index} className="career-interest">
                    <span className="career-name">{interest.career}</span>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${interest.readiness}%` }}></div>
                      </div>
                      <div
                        className="progress-icon"
                        style={{ left: `calc(${interest.readiness}% - 10px)` }} // Человечек будет двигаться
                      ></div>
                      <span className="progress-label">{interest.readiness}%</span>
                      <span className="progress-text">
                        {interest.readiness < 30
                          ? "Не сдавайтесь!"
                          : interest.readiness < 70
                            ? "Вы на правильном пути!"
                            : "Вы на верном пути!"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="recommendation-btn" onClick={getRecommendations}>Получить рекомендации по карьерной траектории</button>
              <h2 className="skills-title">Ваши навыки</h2>

              <div className="skills-input">
                <input
                  type="text"
                  list="skills-list"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Введите навык"
                  className="input-skill"
                />
                <datalist id="skills-list">
                  {skillOptions.map((skill) => (
                    <option key={skill} value={skill} />
                  ))}
                </datalist>
                <button onClick={addSkill} className="add-skill-btn">Добавить</button>
              </div>

              <div className="skills-list">
                {skills.map((skill) => (
                  <div key={skill.id} className="skill-card">
                    <div className="skill-header">
                      <span className="skill-name">{skill.title}</span>
                      <button className="remove-skill" onClick={() => removeSkill(skill.id)}>✖</button>
                      <a className="retake-test">Пройти заново</a>
                    </div>
                    <p className="skill-level">{levelLabels[skill.level]}</p>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skill.level}
                      onChange={(e) => handleSliderChange(skill.id, e.target.value)}
                      onMouseUp={(e) => updateSkillLevel(skill.id, e.target.value)}
                      onTouchEnd={(e) => updateSkillLevel(skill.id, e.target.value)}
                      className="skill-slider"
                    />
                  </div>
                ))}


              </div>
            </div>




          )}

          {activeSection === "Статьи" && (
            <div className="articles-section">
              <h2>Последние статьи</h2>
              {articles.length === 0 ? (
                <p>Загрузка статей...</p>
              ) : (
                <div className="articles-list">
                  {articles.map((article, index) => (
                    <div key={index} className="article-card">
                      <h3>{article.title}</h3>
                      <p>{article.first_paragraph}</p>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">Читать далее</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "Вакансии" && (
            <div className="vacancies-section">
              <h2>Актуальные вакансии</h2>
              {vacancies.length === 0 ? (
                <p>Загрузка вакансий...</p>
              ) : (
                <div className="vacancies-list">
                  {vacancies.map((vacancy, index) => (
                    <div key={index} className="vacancy-card">
                      <h3>{vacancy.title}</h3>
                      <p dangerouslySetInnerHTML={{ __html: vacancy.description }}></p>
                      <p><strong>Компания:</strong> {vacancy.employer}</p>
                      <a href={vacancy.url} target="_blank" rel="noopener noreferrer">Смотреть вакансию</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "Опыт работы" && (
            <div className="work-experience-section">
              <h2>Опыт работы {totalExperience} месяцев</h2>
              {works.length === 0 ? (
                <div className="no-experience">
                  <h3>Опыт работы 0 месяцев</h3>
                  <p>Начните карьеру прямо сейчас!</p>
                </div>
              ) : (
                <div className="work-experience-list">
                  {works.map((work, index) => {
                    const workMonths = calculateMonths(work.date_start, work.date_end);
                    return (
                      <div key={work.id} className="work-card">
                        <div className="work-card-content">
                          <h3>{work.profi}</h3>
                          <p><strong>Компания:</strong> {work.place}</p>
                          <p><strong>Период:</strong> {work.date_start} - {work.date_end || "Настоящее время"}</p>
                          <p><strong>Продолжительность:</strong> {workMonths} месяцев</p>
                          <p>{work.description}</p>
                        </div>
                        <button className="delete-work-button" onClick={() =>{console.log("Удаляем ID:", work); handleDeleteWork(work.id);}}>Удалить</button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="add-work-card" onClick={handleOpenModal}>
                <span>+</span>
              </div>
            </div>
          )}





          {/* {activeSection === "Маршрутная карта" && <div>Содержимое раздела Маршрутная карта</div>} */}
        </main>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Добавить образование</h2>
            <form onSubmit={handleAddEducation}>
              <select
                className="modal-input"
                value={newEducation.degree}
                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                required
              >
                <option value="" disabled hidden>Выберите степень</option>
                <option value="Основное общее">Основное общее</option>
                <option value="Среднее общее">Среднее общее</option>
                <option value="Среднее профессиональное">Среднее профессиональное</option>
                <option value="Бакалавриат">Бакалавриат</option>
                <option value="Магистратура">Магистратура</option>
                <option value="Аспирантура">Аспирантура</option>
                <option value="Дополнительное профессиональное образование">Дополнительное профессиональное образование</option>
              </select>
              <input type="text" className="modal-input" placeholder="Направление подготовки" value={newEducation.program} onChange={(e) => setNewEducation({ ...newEducation, program: e.target.value })} required />
              <input type="text" className="modal-input" placeholder="Номер" value={newEducation.num} onChange={(e) => setNewEducation({ ...newEducation, num: e.target.value })} required />
              <input type="date" className="modal-input" placeholder="Год начала" value={newEducation.year_beginning} onChange={(e) => setNewEducation({ ...newEducation, year_beginning: e.target.value })} required />
              <input type="date" className="modal-input" placeholder="Год окончания" value={newEducation.year_ending} onChange={(e) => setNewEducation({ ...newEducation, year_ending: e.target.value })} required />
              <input type="text" className="modal-input" placeholder="Учебное заведение" value={newEducation.university} onChange={(e) => setNewEducation({ ...newEducation, university: e.target.value })} required />
              <button type="submit">Добавить</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>Отмена</button>
            </form>
          </div>
        </div>
      )}


      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Рекомендации по карьерной траектории</h2>
            <ul>
              {pendingInterests.map((interest, index) => (
                <li key={index}>
                  {interest.career} - {interest.readiness}% готовность
                  <button onClick={() => addInterest(interest)}>Добавить</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setModalOpen(false)}>Закрыть</button>
          </div>
        </div>
      )}


      {isModalOpenOpit && (
        <div className="opit-modal-overlay" onClick={handleCloseModal}>
          <div className="opit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Добавить опыт работы</h3>
            <input
              type="text"
              name="place"
              className="opit-modal-input"
              placeholder="Место работы"
              value={newWork.place}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="profi"
              className="opit-modal-input"
              placeholder="Должность"
              value={newWork.profi}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="date_start"
              className="opit-modal-input"
              placeholder="Дата начала"
              value={newWork.date_start}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="date_end"
              className="opit-modal-input"
              placeholder="Дата окончания"
              value={newWork.date_end}
              onChange={handleInputChange}
            />
            <div className="opit-modal-buttons">
              <button type="submit" onClick={handleSubmitOpit}>Добавить</button>
              <button type="button" onClick={handleCloseModal}>Отмена</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
