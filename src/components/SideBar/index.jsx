import React, { useRef, useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import { FiFilter, FiSearch, FiDownload } from "react-icons/fi";
import { TbWorldWww } from "react-icons/tb";
import { FaTelegram } from "react-icons/fa";
import "./style.scss";
import AddChannelModal from "../Modals/AddChanel";
import FilterModal from "../Modals/Filter";

const Sidebar = ({ onSelectChannel, onApplyFilters }) => {  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterPosition, setFilterPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("allSources");
  const [error, setError] = useState("");
  const filterButtonRef = useRef(null);

  useEffect(() => {
    fetchAllChannels();
  }, []);

  const fetchAllChannels = async () => {
    try {
      setError("");
      const response = await axiosInstance.get("/allSources");
      const allChannels = Array.isArray(response.data) ? response.data : [];

      const allSourcesChannel = {
        name: "allSources",
        nameRus: "Новости из всех источников",
        channelName: "Из всех источников",
        type: "all",
        title: "Показываются новости из всех источников",
      };

      setChannels([allSourcesChannel, ...allChannels]);
    } catch (error) {
      setError("Ошибка загрузки каналов");
      toast.error("Ошибка загрузки каналов");
      setChannels([]);
    }
  };

  const handleToggleFilter = () => {
    if (!isFilterOpen) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      setFilterPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChannel = (channelName) => {
    setSelectedChannel(channelName);
    onSelectChannel({ name: channelName }); 
  };
  

  const handleApplyFilters = (data) => {
    setSelectedChannel(null);
    onApplyFilters(data);  
    setIsFilterOpen(false);
  };

  const handleResetFilters = async () => {
    setIsFilterOpen(false);
    await fetchAllChannels();
  };

  const filteredChannels = Array.isArray(channels)
    ? channels.filter((channel) =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="sidebar">
      <div className="controls">
        <div className="search-bar">
          <FiSearch size={16} />
          <input type="text" placeholder="Поиск" value={searchTerm} onChange={handleSearchChange} />
        </div>
      </div>

      {/* <div className="actions">
        <button className="add-channel" onClick={() => setIsModalOpen(true)}>
          <FiDownload size={16} /> Добавить канал
        </button>
      </div> */}

      <AddChannelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        positionRef={filterPosition}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {filteredChannels.length === 0 && !error ? (
        <div className="no-news-message">Нет новостей по заданным параметрам</div>
      ) : (
        <div className="sidebar-card-list">
          {filteredChannels.map((channel, index) => (
            <div
              key={index}
              className={`card ${channel.name === selectedChannel ? "selected" : ""}`}
              onClick={() => handleSelectChannel(channel.name)}
            >
              <div className="channel-header">
                {channel.type === "telegram" ? (
                  <FaTelegram size={25} />
                ) : channel.type === "all" ? (
                  <TbWorldWww size={25} />
                ) : (
                  <TbWorldWww size={25} />
                )}
                <h3>{channel.name === "allSources" ? "Из всех источников" : channel.name}</h3>
              </div>
              <p className="latest-news">
                {channel.title ? channel.title : "Нет свежих новостей"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
