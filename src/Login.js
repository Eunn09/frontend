import React, { useState } from "react";
import "./Styles/login.css";
import { login } from "./api/loginApi.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Por favor ingresa usuario y contraseña.");
      return;
    }

    try {
      const data = await login(email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (remember) {
          localStorage.setItem("user", JSON.stringify({ email }));
        }

        setMessage("Inicio de sesión exitoso");

        setTimeout(() => {
          switch (data.role) {
            case 1:
              navigate("/admin");
              break;
            case 2:
              navigate("/profesor");
              break;
            case 3:
              navigate("/alumno");
              break;
            case 4:
              navigate("/coordinador");
              break;
            default:
              navigate("/dashboard");
          }
        }, 1000);
      } else {
        setError(data.message || "Error al iniciar sesión.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor o credenciales inválidas.");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-wrap">
        <div className="avatar">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="32" />
            <path
              d="M32 36c6.6 0 12-5.4 12-12S38.6 12 32 12s-12 5.4-12 12 5.4 12 12 12zm0 6c-10.7 0-20 5.5-20 12v4h40v-4c0-6.5-9.3-12-20-12z"
              fill="currentColor"
            />
          </svg>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Usuario */}
          <div className="field">
            <span className="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5z" />
              </svg>
            </span>
            <input
              id="login-username"
              type="text"
              placeholder="Usuario"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Contraseña */}
          <div className="field">
            <span className="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm3 8H9V7a3 3 0 0 1 6 0v3z" />
              </svg>
            </span>
            <input
              id="login-password"
              type="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Recordarme y link */}
          <div className="meta">
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Recuérdame</span>
            </label>
            <a className="forgot" href="#forgot">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Mensajes */}
          {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
          {message && <div style={{ color: "green", marginBottom: 12 }}>{message}</div>}

          <button className="btn-login" type="submit">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
