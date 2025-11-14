import axios from "axios";

const API_URL = "http://nani:9000/auth"; // cambia el puerto según tu microservicio

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password, role });
    return response.data;
  } catch (error) {
    console.error("Error al registrar:", error.response?.data || error.message);
    throw error;
  }
};