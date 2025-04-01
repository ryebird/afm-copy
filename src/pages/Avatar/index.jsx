import React, { useState } from "react";
import "./style.scss";
import { FaCheckCircle, FaPlay } from "react-icons/fa";
import { MdSettingsVoice } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import axiosInstance from "../../services/axiosInstance";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("kz");
  const [tab, setTab] = useState("text"); 
  const [file, setFile] = useState(null);
  const maxLength = 1200;
  const [fileUploaded, setFileUploaded] = useState(false); 

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".pdf,.docx",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setFileUploaded(true);
        toast.success(`Файл загружен: ${acceptedFiles[0].name}`);
      }
    },
  });
  const handlePlay = async () => {
    if (tab === "text" && !text.trim()) {
      toast.error("Введите текст для озвучивания!");
      return;
    }
    if (tab === "file" && !file) {
      toast.error("Загрузите файл для озвучивания!");
      return;
    }

    const formData = new FormData();
    formData.append("language", selectedVoice);

    if (tab === "text") {
      formData.append("text", text);
    } else {
      formData.append("file", file);
    }

    try {
      toast.info("Запрос отправляется...");
      // axiosInstance.post("/predict", {
      //   tag: message,
      // }
      const response = await axiosInstance.post(
        "/generateVideo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Ответ сервера:", response.data);
      toast.success("Озвучивание успешно запущено!");
    } catch (error) {
      console.error("Ошибка запроса:", error);
      toast.error("Ошибка при отправке запроса!");
    }
  };

  return (
    <div className="tts-container">
      <h1>
        Голос, доступный каждому: точное и естественное озвучивание текстов для
        государственных сервисов и граждан!
      </h1>
      <p className="subheading">
        Современные технологии синтеза речи для удобства и доступности
        информации
      </p>

      <div className="tabs">
        <button
          className={tab === "text" ? "active" : ""}
          onClick={() => setTab("text")}
        >
          Текст в речь
        </button>
        <button
          className={tab === "file" ? "active" : ""}
          onClick={() => setTab("file")}
        >
          Файл в речь
        </button>
      </div>

      {tab === "text" ? (
        <div className="input-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите текст для озвучивания..."
            maxLength={maxLength}
          />
        </div>
      ) : (
        <div
          className={`file-dropzone ${file ? "file-uploaded" : ""}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />

          {file ? (
            <div className="uploaded-file-container">
              <p>
                <FaCheckCircle className="success-icon" /> Файл загружен:{" "}
                {file.name}
              </p>
              <button
                className="remove-file-btn"
                onClick={(e) => {
                  e.stopPropagation(); 
                  setFile(null);
                }}
              >
                Удалить файл
              </button>
            </div>
          ) : isDragActive ? (
            <p>Отпустите файл здесь...</p>
          ) : (
            <p>Перетащите или кликните для загрузки файла (PDF, DOCX)</p>
          )}
        </div>
      )}
      <div className="controls">
        {/* Селектор голосов */}
        <div className="voice-select">
          <MdSettingsVoice />
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            <option value="kz">Казахский</option>
            <option value="ru">Русский</option>
          </select>
        </div>

        <span className="char-count">{text.length}/1200</span>

        <button className="play-btn" onClick={handlePlay}>
          <FaPlay />
          <span>Получить видео</span>
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;
