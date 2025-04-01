import React, { useState } from "react";
import "./style.scss";

const NewsModal = ({ isOpen, onClose, newsItem }) => {
  const [showComments, setShowComments] = useState(false);

  if (!isOpen || !newsItem) return null;

   
  if (Array.isArray(newsItem)) {
    return (
      <div className="news-modal-overlay" onClick={onClose}>
        <div className="news-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
          <h2 className="modal-title">Результаты поиска:</h2>
          <div className="document-cards">
            {newsItem.map((item, index) => (
              <div key={index} className="document-card">
                <p>
                  <strong>Источник: </strong>
                  {item.source?.name ? item.source.name : "Нет данных"}
                </p>
                <p className="news-date">
                  <strong>Дата: </strong>
                  {item.publicationDate ? item.publicationDate : "Нет данных"}
                </p>
                <p className="news-url">{item.url}</p>

                <p>{item.mainText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

   
  return (
    <div className="news-modal-overlay" onClick={onClose}>
      <div className="news-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2 className="modal-title">{newsItem.title}</h2>

        <div className="modal-meta">
          <p>
            <strong>Дата:</strong>{" "}
            {newsItem.publicationDate
              ? new Date(newsItem.publicationDate).toLocaleDateString()
              : "Неизвестно"}
          </p>
          <p>
            <strong>Источник:</strong> {newsItem.source?.name || newsItem.source || "Неизвестно"}
          </p>
          {newsItem.source?.link && (
            <a
              href={newsItem.source.link}
              target="_blank"
              rel="noopener noreferrer"
              className="source-link"
            >
              {newsItem.source.link}
            </a>
          )}
        </div>

        {newsItem.image_url && (
          <img
            src={newsItem.image_url}
            alt={newsItem.title}
            className="modal-image"
          />
        )}

        <div className="modal-text">
          <p>{newsItem.mainText || "Текст отсутствует"}</p>
        </div>

        { }
        {newsItem.comments?.length > 0 && (
          <div className="comments-toggle">
            <button onClick={() => setShowComments(!showComments)}>
              {showComments
                ? "Скрыть комментарии"
                : `Показать комментарии (${newsItem.comments.length})`}
            </button>
          </div>
        )}

        { }
        {showComments && newsItem.comments?.length > 0 && (
          <div className="comments-section">
            <h3>Комментарии:</h3>
            <ul className="comments-list">
              {newsItem.comments.map((comment, index) => (
                <li key={index} className="comment-item">
                  <p className="comment-author">
                    <strong>{comment.author}</strong>
                  </p>
                  <p className="comment-text">{comment.content}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsModal;
