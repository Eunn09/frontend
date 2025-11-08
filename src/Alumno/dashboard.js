import React, { useMemo } from "react";
import "./Styles/dashboard.css";
import { logout } from "../api/Logout"; // ✅ Importar el logout

const now = () => new Date();

export default function DashboardTab({ sessions }) {
  const { upcoming, past } = useMemo(() => {
    const u = [], p = [];
    sessions
      .slice()
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
      .forEach(s => (new Date(s.datetime) >= now() ? u : p).push(s));
    return { upcoming: u, past: p.reverse() };
  }, [sessions]);

  return (
    <section className="dash">
      {/* ✅ Botón de cerrar sesión */}
      <div className="logout-bar">
        <button className="logout-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <div className="cards">
        <div className="card stat">
          <span className="stat-label">Próximas</span>
          <span className="stat-value">{upcoming.length}</span>
        </div>
        <div className="card stat">
          <span className="stat-label">Realizadas</span>
          <span className="stat-value">{past.length}</span>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <h3>Asesorías próximas</h3>
          <List items={upcoming} empty="No tienes asesorías próximas." />
        </div>
        <div className="card">
          <h3>Asesorías pasadas</h3>
          <List items={past} empty="Aún no has tenido asesorías." />
        </div>
      </div>
    </section>
  );
}

function List({ items, empty }) {
  if (!items.length) return <p className="muted">{empty}</p>;
  return (
    <ul className="session-list">
      {items.map(s => (
        <li key={s.id}>
          <div>
            <strong>{fmtDate(s.datetime)}</strong>
            <div className="muted">{s.topic || "Asesoría"}</div>
          </div>
          <span className="badge">{s.teacher || "Docente asignado"}</span>
        </li>
      ))}
    </ul>
  );
}

function fmtDate(dt) {
  const d = new Date(dt);
  return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}
