import React, { useState, useEffect } from "react";
import "./style.scss";
import axiosInstance from "../../services/axiosInstance";

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [declineText, setDeclineText] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const endpoint = role === "admin" ? "/allRequests" : "/myRequests";

    const iin = role !== "admin" ? localStorage.getItem("username") : null;

    axiosInstance
      .get(endpoint, {
        params: role !== "admin" ? { iin } : {},
      })
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Ошибка загрузки запросов:", error);
      });
  }, [role]);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.put("/decision", {
        status: "ACCEPTED",
        requestId: id,
        reason: "Запрос на добавление источника был одобрен",
      });

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? { ...req, status: "ACCEPTED", declineReason: "" }
            : req
        )
      );
    } catch (error) {
      console.error("Ошибка при подтверждении:", error);
    }
  };

  const handleOpenDeclineModal = (request) => {
    setSelectedRequest(request);
    setDeclineText(request.declineReason || "");
    setModalOpen(true);
  };

  const handleDecline = async () => {
    if (!selectedRequest) return;

    try {
      await axiosInstance.put("/decision", {
        status: "DECLINED",
        requestId: selectedRequest.id,
        reason: declineText || "No specific reason provided.",
      });

      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, status: "DECLINED", declineReason: declineText }
            : req
        )
      );
      setModalOpen(false);
    } catch (error) {
      console.error("Ошибка при отклонении:", error);
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {role === "admin" && (
              <>
                <th>ФИО</th>
                <th>ИИН</th>
              </>
            )}

            <th>Название канала</th>
            <th>Ссылка</th>
            <th>Сообщение</th>
            <th>Статус</th>
            {role === "admin" && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              {role === "admin" && (
                <>
              <td>{req.fio}</td>
              <td>{req.iin}</td>
                </>
              )}
              <td>{req.name}</td>
              <td>
                <a href={req.link} target="_blank" rel="noopener noreferrer">
                  {req.link}
                </a>
              </td>
              <td>{req.declineReason ? req.declineReason : req.reason}</td>
              <td className={`status ${req.status}`}>
                {req.status === "ACCEPTED"
                  ? "✅ Принято"
                  : req.status === "DECLINED"
                  ? `❌ Отклонено`
                  : "⏳ В ожидании"}
              </td>
              {role === "admin" && (
                <td>
                  {req.status === "PENDING" && (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(req.id)}
                      >
                        Принять
                      </button>
                      <button
                        className="decline-btn"
                        onClick={() => handleOpenDeclineModal(req)}
                      >
                        Отклонить
                      </button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="reason-modal">
          <div className="reason-modal-content">
            <h3>Причина отказа</h3>
            <textarea
              value={declineText}
              onChange={(e) => setDeclineText(e.target.value)}
              placeholder="Введите причину отказа..."
            />
            <div className="modal-buttons">
              <button className="back-btn" onClick={() => setModalOpen(false)}>
                Отмена
              </button>
              <button className="decline-btn" onClick={handleDecline}>
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
