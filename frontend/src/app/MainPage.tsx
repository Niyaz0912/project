// src/app/MainPage.tsx
import React from "react";
import UserSection from "../features/users/UserSection";
import WikiSection from "../features/wiki/WikiSection";
import { useNavigate } from "react-router-dom";

type SectionType = "docs" | "profile" | "users" | "admin";

const MainPage = ({
  token,
  userRole,
  user,
  handleLogout
}: {
  token: string;
  userRole: string | null;
  user: {
    firstName: string;
    lastName: string;
    department: { id: number; name: string } | null;
  } | null;
  handleLogout: () => void;
}) => {
  const [section, setSection] = React.useState<SectionType>("docs");
  const navigate = useNavigate();

  const goToDepartment = () => {
    if (user?.department?.id) {
      navigate(`/department/${user.department.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 mb-4 flex items-center">
        <div className="flex gap-4">
          {/* Кнопка Документы видна всем */}
          <button
            onClick={() => setSection("docs")}
            className={`px-3 py-2 rounded ${
              section === "docs" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            }`}
          >
            Документы
          </button>

          {/* Кнопка Пользователи видна только админу */}
          {userRole === "admin" && (
            <button
              onClick={() => setSection("users")}
              className={`px-3 py-2 rounded ${
                section === "users" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`}
            >
              Пользователи
            </button>
          )}

          <button
            onClick={() => setSection("profile")}
            className={`px-3 py-2 rounded ${
              section === "profile" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            }`}
          >
            Профиль
          </button>

          {/* Кнопка Админ-панель видна только админу */}
          {userRole === "admin" && (
            <button
              onClick={() => setSection("admin")}
              className={`px-3 py-2 rounded ${
                section === "admin" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`}
            >
              Админ-панель
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
          {user && (
            <>
              <div className="font-semibold">
                {user.firstName} {user.lastName}
              </div>
              {user.department ? (
                <button
                  onClick={goToDepartment}
                  className="text-blue-600 underline hover:text-blue-800"
                  title={`Перейти в отдел: ${user.department.name}`}
                >
                  {user.department.name}
                </button>
              ) : (
                <div className="text-gray-500 italic">Без отдела</div>
              )}
            </>
          )}

          <button
            onClick={handleLogout}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
          >
            Выйти
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        {section === "docs" && <WikiSection />}

        {section === "profile" && <UserSection type="profile" token={token} />}

        {/* Показываем "Пользователи" ТОЛЬКО если админ */}
        {section === "users" && userRole === "admin" && (
          <UserSection type="userList" token={token} />
        )}

        {/* Показываем админ-панель ТОЛЬКО если админ */}
        {section === "admin" && userRole === "admin" && (
          <UserSection type="admin" token={token} />
        )}
      </div>
    </div>
  );
};

export default MainPage;

