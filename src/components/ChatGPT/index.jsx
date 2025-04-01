import React, { useState } from "react";
import "./style.scss";
import axiosInstance from "../../services/axiosInstance";
import { IoMdSend } from "react-icons/io";
import { AiFillOpenAI } from "react-icons/ai";
import { FaExpandArrowsAlt } from "react-icons/fa";
import NewsModal from "../Modals/NewsModal";

const ChatGPT = ({ isExpanded, onToggleExpand }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      const newMessages = [...messages, { text: message, sender: "user" }];
      setMessages(newMessages);
      setMessage("");
  
      if (!isExpanded) {
        onToggleExpand();
      }
  
      try {
        setLoading(true);
  
 
        const response = await axiosInstance.post("/predict", {
          tag: message,
        });
  
 
        if (response.data && response.data.tag) {
          const predictedData = response.data;
  
 
          const botMessage = `Результаты анализа: Негатив: ${predictedData.negative}%, Позитив: ${predictedData.positive}%, Общий: ${predictedData.overall}, Тег: ${predictedData.tag}`;
          
 
          setMessages((prev) => [
            ...prev,
            { text: botMessage, sender: "bot", predictedData },
          ]);
        } else {
 
          console.error("Ответ от сервера не соответствует ожидаемому формату:", response);
          setMessages((prev) => [
            ...prev,
            { text: "Не удалось обработать ответ от сервера.", sender: "bot" },
          ]);
        }
      } catch (error) {
 
        console.error("Ошибка при обращении к бэкенду:", error.response || error);
        setMessages((prev) => [
          ...prev,
          { text: "Ошибка при получении ответа от бэкенда.", sender: "bot" },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleDetailsClick = async (predictedData) => {
    try {
      setLoading(true);
      
      const response = await axiosInstance.post("/allPredictedAnswers", {
        tag: predictedData.tag,
      });

 

      setSelectedNews(detailedData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Ошибка при получении подробной информации:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chatgpt ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="chat-container">
        <div className="chat-header">
          <p>АФМ Ассистент</p>
          <FaExpandArrowsAlt
            className="toggle-icon"
            onClick={onToggleExpand}
            title={isExpanded ? "Уменьшить" : "Увеличить"}
          />
        </div>

        {isExpanded && messages.length > 0 && (
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                <p className="message-text">{msg.text}</p>
                {msg.sender === "bot" && msg.predictedData && (
                  <button
                    className="details-btn"
                    onClick={() => handleDetailsClick(msg.predictedData)}
                  >
                    Подробнее
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-message bot-message">Печатает...</div>
            )}
          </div>
        )}

        <div className="chat-input">
          <AiFillOpenAI className="icon" />
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Введите сообщение..."
            disabled={loading}
          />
          <button onClick={handleSendMessage} disabled={loading}>
            <IoMdSend style={{ fontSize: "27px" }} />
          </button>
        </div>
      </div>

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newsItem={selectedNews} 
      />
    </div>
  );
};

export default ChatGPT;
