import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthSection from "../features/auth/AuthSection";
import MainPage from "./MainPage";
import DepartmentPortal from '../features/departments/DepartmentPortal';

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken"));
  const [userRole, setUserRole] = useState<string | null>(() => localStorage.getItem("userRole"));
  
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    department: { id: number; name: string } | null;
  } | null>(null);

  const handleLogin = useCallback((token: string, responseData: any) => {
    if (!token || !responseData?.user?.role) {
      console.error('Invalid login response');
      return;
    }

    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", responseData.user.role);
    setToken(token);
    setUserRole(responseData.user.role);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setToken(null);
    setUserRole(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users/me", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) throw new Error('Auth check failed');

        const data = await response.json();

        if (!isMounted) return;

        if (data.role && data.role !== userRole) {
          setUserRole(data.role);
          localStorage.setItem("userRole", data.role);
        }

        setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          department: data.department || null,
        });
      } catch (error) {
        handleLogout();
      }
    };

    checkAuth();

    return () => { isMounted = false; };
  }, [token, userRole, handleLogout]);

  if (!token) {
    return <AuthSection onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              token={token}
              userRole={userRole}
              user={user}
              handleLogout={handleLogout}
            />
          }
        />
        <Route path="/department/:departmentId" element={<DepartmentPortal />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


