import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";

class AuthService {
   
  static async login(iin, password) {
    try {
      const response = await axiosInstance.post("/login", { iin, password });

      console.log("Ответ от сервера:", response.data);

      if (response.data.access && response.data.refresh) {
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("username", response.data.iin);
        localStorage.setItem("fio", response.data.fio);
        localStorage.setItem("role", response.data.role);
 
      } else {
        throw new Error("Токены не получены");
      }

      return response.data;
    } catch (error) {
      console.error("Ошибка авторизации:", error.response?.data || error.message);
      throw error;
    }
  }

   
  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

   
  static async getToken() {
    let token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      console.log("🔄 Access-токен истек, обновляем...");
      return await this.refreshAccessToken();
    }

    return token;
  }

   
  static async refreshAccessToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("Нет refresh-токена");

      const response = await axiosInstance.post("/refresh", { refreshToken });

      const newAccessToken = response.data.access;
      localStorage.setItem("token", newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("❌ Ошибка обновления токена:", error);
      this.logout();
      return null;
    }
  }

   
  static getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

   
  static isAuthenticated() {
    return !!localStorage.getItem("token");
  }

   
  static getUserInfo(token) {
    try {
      const decoded = jwtDecode(token);
      return {
        name: decoded.name,
        surname: decoded.surname,
        fathername: decoded.fathername,
        roles: decoded.roles,
      };
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
      return null;
    }
  }
}

export default AuthService;
