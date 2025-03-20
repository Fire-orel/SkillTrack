import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Добро пожаловать в SkillTrack</h1>
      <p className="text-lg text-gray-600 mb-6">Платформа для управления навыками и карьерным ростом.</p>
      <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Войти
      </Link>
    </div>
  );
}
