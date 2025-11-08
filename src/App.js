import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";
import AdminModule from "./Admin/index";       // pestañas de Administrador
import StudentModule from "./Alumno/index";   // pestañas de Alumno (EPIC02)

// 👉 Importamos la función que cierra sesión en el backend
import { logoutRequest } from "./api/Logout";

function Main({ user, onLogout }) {
  // Vista por rol
  let content = (
    <p>
      Bienvenido, <strong>{user.role}</strong>. No tienes un módulo asignado todavía.
    </p>
  );

  if (user.role === "Administrador") {
    content = <AdminModule />; // Users / Roles / Logs / Settings
  } else if (user.role === "Usuario" || user.role === "Alumno") {
    content = <StudentModule onLogout={onLogout} />; // Dashboard / Agendar / Mis asesorías / Ajustes
  }

  return (
    <div style={{ padding: 20 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>Panel principal</h1>
        <div>
          <span style={{ marginRight: 12 }}>Hola, {user.email}</span>
          <button onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      <section style={{ marginTop: 24 }}>{content}</section>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Restaurar sesión si existe
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch (err) {
      console.warn("Error leyendo sesión", err);
    }
  }, []);

  async function handleLogout() {
    // Confirmación opcional
    if (!window.confirm("¿Deseas cerrar sesión?")) return;

    try {
      await logoutRequest(); // Llama al backend para invalidar la sesión
    } catch (err) {
      console.error("Error al cerrar sesión en el servidor:", err);
    } finally {
      // Limpieza local
      setUser(null);
      try {
        localStorage.removeItem("user");
      } catch (err) {
        console.warn("No se pudo limpiar localStorage", err);
      }
      // Redirección opcional
      window.location.href = "/login";
    }
  }

  function handleLogin(u) {
    setUser(u);
  }

  // Si no hay usuario -> login
  if (!user) return <Login onLogin={handleLogin} />;

  // Si hay usuario -> panel principal por rol
  return <Main user={user} onLogout={handleLogout} />;
}

export default App;
