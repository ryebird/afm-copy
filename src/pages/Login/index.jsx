import React, { useEffect, useRef, useState } from "react";
import LoginForm from "../../components/LoginForm/index";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthService from "../../services/AuthService"; 
import * as THREE from "three";
import globe from "vanta/src/vanta.globe";
import "./style.scss";

const LoginPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!vantaRef.current) return;

    vantaEffect.current = globe({
      el: vantaRef.current,
      THREE,
      color: 0x3fc8ff,
      points: 13.0,
      spacing: 17.0,
    });

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const handleLogin = async (form) => {
    setLoading(true);
    try {
      console.log("Отправка запроса на сервер с данными:", form);
      
      const data = await AuthService.login(form.iin, form.password); 
      
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
  
      console.log("Сохраненные токены:", { token, refreshToken });
  
      if (token && refreshToken) {
        toast.success("Вы успешно вошли!", { position: "top-right" });
        setTimeout(() => navigate("/"), 1000);
      } else {
        throw new Error("Токены не записаны в localStorage");
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      toast.error("Ошибка входа. Проверьте данные.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div ref={vantaRef} className={`login-page ${theme}`}>
      <div className="login-form-container">
        <h1 className="login-title">ИнфоПоток</h1>
        <LoginForm onLogin={handleLogin} loading={loading} />
      </div>
    </div>
  );
};

export default LoginPage;
