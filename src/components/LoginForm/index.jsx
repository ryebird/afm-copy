import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.scss";

const LoginForm = ({ onLogin, loading }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ iin: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setForm({ iin: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onLogin(form);
  };

  return (
    <>
      <ToastContainer />
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">{t("login.email")}</label>
          <input
            id="iin"
            name="iin"
            value={form.iin}
            onChange={handleChange}
            placeholder={t("login.emailPlaceholder")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{t("login.password")}</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t("login.passwordPlaceholder")}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Вход..." : t("login.submit")}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            {t("login.clear")}
          </button>
        </div>
        <div className="form-footer">
          <a href="/forgot-password" className="forgot-password-link">
            {t("login.forgotPassword")}
          </a>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
