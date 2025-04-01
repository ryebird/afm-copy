import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import "./style.scss";
import axiosInstance from "../../../services/axiosInstance";

const AddChannelModal = ({ isOpen, onClose }) => {
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const [type] = useState("telegram");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setMessage(null);
      setMessageType(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  
  const isValidUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/;
    return urlPattern.test(url);
  };

  
  const isValidName = (name) => {
    const namePattern = /^[A-Za-z\s]+$/;
    return namePattern.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    const iin = localStorage.getItem("username");

    if (!iin) {
      setMessage("Ошибка: IIN не найден в LocalStorage!");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!isValidUrl(link)) {
      setMessage("Ошибка: Некорректная ссылка!");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!isValidName(name)) {
      setMessage("Ошибка: Название должно содержать только латинские буквы!");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/addRequest", {
        request: {
          link,
          name,
          type,
        },
        iin,
      });

      setMessage(
        "Ваша заявка на рассмотрении, в ближайшее время мы добавим его в список источников!"
      );
      setMessageType("success");
      setLink("");
      setName("");
    } catch (err) {
      console.error("Ошибка при отправке:", err);
      setMessage("Ошибка при добавлении источника!");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Добавить источник</h3>
          <button className="reset-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>URL канала или сайта</label>
          <input
            type="text"
            placeholder="Ссылка"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
            disabled={loading}
          />

          <label>Название (только латиница)</label>
          <input
            type="text"
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />

          <label>Тип</label>
          <select value={type} disabled>
            <option value="telegram">Telegram</option>
          </select>

          {message && (
            <div className={`message-box ${messageType}`}>
              {messageType === "success" ? (
                <FaCheckCircle size={90} className="icon success" />
              ) : (
                <FaTimesCircle className="icon error" />
              )}
              <span>{message}</span>
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : "Сохранить"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChannelModal;
