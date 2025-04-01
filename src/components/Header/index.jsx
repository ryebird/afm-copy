import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "driver.js/dist/driver.css";
import AuthService from "../../services/AuthService";
import notificationService from "../../services/NotificationService";
import "./style.scss";
import logo from "../../assets/images/LogoConcept1.png";
import { startTutorial } from "../../utils/driver/tutorialDriver";
import { FaBell } from "react-icons/fa";
import NewsModal from "../Modals/NewsModal";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAdminMenuOpen, setAdminMenuOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const dropdownRef = useRef(null);
  const adminMenuRef = useRef(null);
  const role = localStorage.getItem("role");

  
  useEffect(() => {
    notificationService.connect();
  
    const handleNewNotification = (data) => {
      if (!data?.id || !data?.title) return;
  
      const notification = {
        id: data.id,
        title: data.title.replace(/\n/g, " "),
        source: data.source?.name || "Неизвестный источник",
        url: data.url || "#",
        publicationDate: new Date(...data.publicationDate),
        mainText: data.mainText || "",
      };
  
      setNotifications((prev) => [...prev, notification]);
      toast.info(`🔔 Новое уведомление: ${notification.title}`);
    };
  
    notificationService.addListener(handleNewNotification);
  
    return () => {
      notificationService.removeListener(handleNewNotification);
    };
  }, []);
  

  const handleLogout = () => {
    AuthService.logout();
    toast.success("Вы успешно вышли!");
    navigate("/login");
  };

  const handleBellClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setDropdownOpen(false);
  };

  const handleShowDetails = (newsItem) => {
    setSelectedNews(newsItem);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hiddenPaths = ["/login"];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Link to="/" aria-label="Go to homepage">
              <img src={logo} alt="MyApp Logo" />
            </Link>
          </div>

          <nav className="nav">
            <button onClick={() => navigate("/avatar")} className="nav-button">
              3D Аватар
            </button>

            {}
            <div className="notification-container" ref={dropdownRef}>
              <div className="notification-icon" onClick={handleBellClick}>
                <FaBell className="bell-icon" />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </div>

              {isDropdownOpen && (
                <div className="notification-dropdown">
                  <h4>Уведомления</h4>
                  <ul>
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <li key={notif.id}>
                          <strong>{notif.title}</strong>
                          {/* <p>Источник: {notif.source}</p>
                          <p>Дата: {notif.publicationDate.toLocaleString()}</p> */}
                          <button className="noti-btn" onClick={() => handleShowDetails(notif)}>
                            Подробнее...
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>Нет новых уведомлений</li>
                    )}
                  </ul>
                  <button className="clear-btn" onClick={handleClearNotifications}>
                    Очистить
                  </button>
                </div>
              )}
            </div>

            {}
            {role === "admin" && (
              <div
                className="admin-menu-container"
                ref={adminMenuRef}
                onMouseEnter={() => setAdminMenuOpen(true)}
                onMouseLeave={() => setAdminMenuOpen(false)}
              >
                <button className="nav-button">Админ панель</button>
                {isAdminMenuOpen && (
                  <div className="admin-dropdown">
                    <ul>
                      <li onClick={() => navigate("/suggestions")}>Предложения</li>
                      <li onClick={() => navigate("/admin/logs")}>Журнал запросов</li>
                      <li onClick={() => navigate("/profile")}>Личный кабинет</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => startTutorial()} className="nav-button">
              Обучение
            </button>

            <button onClick={handleLogout} className="nav-button">
              Выйти
            </button>
          </nav>
        </div>
      </header>

      <NewsModal isOpen={!!selectedNews} onClose={() => setSelectedNews(null)} newsItem={selectedNews} />
    </>
  );
};

export default Header;
