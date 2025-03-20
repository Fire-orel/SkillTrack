import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth.jsx";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
      navigate("/"); // Перенаправление после успешного входа
    } catch (err) {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Вход</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="input-field"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Войти</button>
        </form>
      </div>
    </div>
  );
}
