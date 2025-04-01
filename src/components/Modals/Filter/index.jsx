import React, { useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import "./style.scss";
import { toast } from "react-toastify";

const FilterModal = ({ isOpen, onClose, onApplyFilters, source }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) return null;

  const handleApplyFilters = async () => {
    const filters = {
      source_name: source,
      from: startDate || null,
      to: endDate || null,
    };

    await onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = async () => {
    setStartDate("");
    setEndDate("");
    await onApplyFilters({});
    onClose();
  };

  return (
    <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="filter-header">
        <h3>Выбрать период</h3>
        <button className="reset" onClick={onClose}>
          ✖
        </button>
      </div>

      <div className="filter-form">
        <div className="filter-section">
          <div className="filter-dates">
            <div className="date-container">
              <label>Начало</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
            </div>
            <div className="date-container">
              <label>Конец</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </div>
          </div>
        </div>
        <div className="filter-actions">
          <button className="reset-btn" onClick={handleResetFilters}>
            Очистить
          </button>
          <button className="apply-btn" onClick={handleApplyFilters}>
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
