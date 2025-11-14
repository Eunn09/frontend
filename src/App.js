import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import AdminModule from "./Admin/index";
import StudentModule from "./Alumno/index";
import TeacherModule from "./Docentes/index";
import CoordinatorModule from "./Coordinador/index";
import { logout } from "./api/Logout";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = async () => {
    if (!window.confirm("¿Deseas cerrar sesión?")) return;

    try {
      await logout(); 
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      // Limpiar datos locales
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Redirigir
      window.location.href = "/login";
    }
  };

  const ProtectedRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = parseInt(localStorage.getItem("role"));

    if (!token) return <Navigate to="/" replace />;
    if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

    return element;
  };

  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={<AdminModule onLogout={handleLogout} />}
              allowedRoles={[1]}
            />
          }
        />

        {/* PROFESOR */}
        <Route
          path="/profesor"
          element={
            <ProtectedRoute
              element={<TeacherModule onLogout={handleLogout} />}
              allowedRoles={[2]}
            />
          }
        />

        {/* ALUMNO */}
        <Route
          path="/alumno"
          element={
            <ProtectedRoute
              element={<StudentModule onLogout={handleLogout} />}
              allowedRoles={[3]}
            />
          }
        />

        {/* COORDINADOR */}
        <Route
          path="/coordinador"
          element={
            <ProtectedRoute
              element={<CoordinatorModule onLogout={handleLogout} />}
              allowedRoles={[4]}
            />
          }
        />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
