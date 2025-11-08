// src/api/logout.js
export const logout = async () => {
  try {
    const response = await fetch("http://localhost:8767/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // importante para enviar la cookie de sesión
    });

    if (!response.ok) {
      console.error("Error en el cierre de sesión:", response.statusText);
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    localStorage.removeItem("user"); // eliminar datos locales
    window.location.replace("/login"); // redirigir sin poder volver atrás
  }
};
