import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css"; // Подключаем стили

import image1 from "../assets/image1.jpeg"; // Главное изображение
import image2 from "../assets/image2.jpeg"; // Второй блок
import image3 from "../assets/image3.jpeg"; // Подвал
import image4 from "../assets/image3.jpeg"; // FAQ секция

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="home-container">
      {/* Навигация */}
      <header className="navbar">
        <div className="logo">Профориентация</div>
        <nav>
          <ul>
            <li>Обучение</li>
            <li>Работа</li>
            <li>Полезные материалы</li>
            <li>Помощь</li>
          </ul>
        </nav>
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate("/profile")}>Личный кабинет</button>
              <button onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>Войти</button>
          )}
        </div>
      </header>

      {/* Первый экран */}
      <section className="hero">
        <div className="hero-text">
          <h1>Ваш путь к успешной карьере начинается здесь</h1>
          <p>
            Добро пожаловать на нашу платформу, где начинающие студенты и
            профессионалы могут исследовать карьерные пути, соответствующие их
            интересам.
          </p>
          <button className="cta-button" onClick={() => navigate("/")}>Начать</button>
        </div>
        <img src={image1} alt="Студенты" className="hero-image" />
      </section>


      <section className="opportunities">
            <h2>Откройте своё будущее с помощью наших возможностей</h2>
            <p>
                Наша платформа предлагает необходимые инструменты для студентов и соискателей.
                От тестов по ориентации в карьере до персонализированной сертификации навыков,
                мы сопровождаем вас на каждом этапе вашего пути.
            </p>
            <div className="opportunity-grid">
                <div className="opportunity">
                    <h3>Откройте для себя идеальный карьерный путь</h3>
                    <p>Получайте индивидуальные рекомендации, основанные на ваших интересах.</p>
                </div>
                <div className="opportunity">
                    <h3>Продемонстрируйте свои навыки и достижения</h3>
                    <p>Управляйте своим портфолио легко и уверенно.</p>
                </div>
                <div className="opportunity">
                    <h3>Подтвердите свои навыки с помощью сертификации</h3>
                    <p>Пройдите тесты, чтобы подтвердить свои способности и знания.</p>
                </div>
            </div>
            <div className="opportunity-buttons">
                <button>Узнать больше</button>
                <button>Регистрация</button>
            </div>
        </section>

      {/* Второй блок */}
      <section className="features">
        <div className="features-text">
          <h2>Раскройте свой карьерный потенциал вместе с нами</h2>
          <p>
            Наша платформа предлагает индивидуальные инструменты планирования
            карьеры, которые помогут вам определить свои сильные стороны и
            интересы. С персонализированными ресурсами повышения квалификации вы
            сможете уверенно продвигаться по своему профессиональному пути.
          </p>
          <button className="cta-button" onClick={() => navigate("/register")}>
            Присоединиться
          </button>
        </div>
        <img src={image2} alt="Студенты в аудитории" className="features-image" />
      </section>

      <section className="cta-section" style={{ backgroundImage: `url(${image3})` }}>
            <div className="cta-overlay"></div>
            <div className="cta-content">
                <h2>Раскрой свой карьерный потенциал</h2>
                <p>
                    Присоединяйтесь к нам сегодня, чтобы изучить свой карьерный путь
                    и получить доступ к эксклюзивным ресурсам, созданным специально для вас.
                </p>
                <div className="cta-buttons">
                    <button className="register">Регистрация</button>
                    <button className="login">Вход</button>
                </div>
            </div>
        </section>

      {/* FAQ */}
      <section className="faq">
            <h2>FAQ</h2>
            <p>Найдите ответы на часто задаваемые вопросы о нашем сайте и его функциях</p>

            <div className="faq-item">
                <h3>Зачем нужен сайт?</h3>
                <p>
                    Этот веб-сайт создан для помощи студентам и абитуриентам в построении карьерных путей.
                    Он предлагает множество функций, включая тесты по профориентации и управление портфолио.
                </p>
            </div>

            <div className="faq-item">
                <h3>Как я могу зарегистрироваться?</h3>
                <p>
                    Чтобы зарегистрироваться, просто нажмите на кнопку "Зарегистрироваться" на главной странице.
                    Заполните необходимую информацию и создайте свою учетную запись.
                </p>
            </div>

            <div className="faq-item">
                <h3>Я могу обновить свой профиль?</h3>
                <p>
                    Да, вы можете обновить свой профиль в любое время.
                    Перейдите в личный кабинет и выберите "Изменить профиль".
                </p>
            </div>

            <div className="faq-item">
                <h3>Что такое геймификация?</h3>
                <p>
                    Геймификация включает игровые элементы в процесс обучения.
                    Пользователи могут получать достижения за выполнение заданий, например, за заполнение портфолио.
                </p>
            </div>

            <div className="faq-item">
                <h3>Как получить доступ к курсам?</h3>
                <p>
                    Доступ к курсам можно получить через раздел "Курсы" на сайте.
                    Выберите интересующий курс и зарегистрируйтесь.
                </p>
            </div>

            <div className="faq-contact">
                <h3>Остались вопросы?</h3>
                <p>Обратитесь за помощью в нашу службу поддержки.</p>
                <button>Контакт</button>
            </div>
        </section>

      {/* Подвал */}
      <section className="newsletter-section" style={{ backgroundImage: `url(${image3})` }}>
            <div className="newsletter-overlay"></div>
            <div className="newsletter-content">
                <h2>Оставайтесь в курсе событий с нашей рассылкой</h2>
                <p>
                    Подпишитесь, чтобы получать последние советы и обновления по карьере,
                    созданные специально для вас.
                </p>
                <div className="newsletter-form">
                    {/* <input
                        type="email"
                        placeholder="Введите свою почту"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="subscribe-button" onClick={handleSubscribe}>
                        Подписаться сейчас
                    </button> */}
                </div>
                <p className="terms">
                    Нажимая "Подписаться сейчас" вы соглашаетесь с нашими Условиями и положениями.
                </p>
            </div>
        </section>
    </div>
  );
}
