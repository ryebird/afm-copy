import React, { useState, useEffect, useRef } from "react";
import "./style.scss";
import { FaEquals, FaSearch, FaTimes } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import NewsModal from "../Modals/NewsModal";
import { toast } from "react-toastify";
import { HiCalendarDateRange } from "react-icons/hi2";
import { LuCircleEqual } from "react-icons/lu";
import { MdExpandMore } from "react-icons/md";
import axiosInstance from "../../services/axiosInstance";

const NewsPanel = ({ selectedChannel }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [searchTag, setSearchTag] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isFetching = useRef(false);
  const [searchResult, setSearchResult] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [filters, setFilters] = useState({});
  const [isNegative, setIsNegative] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSpecific, setIsSpecific] = useState(false);
  const [isPositive, setIsPositive] = useState(false);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const newsContainerRef = useRef(null);
  const [similarity, setSimilarity] = useState(25);
  const [tone, setTone] = useState("byTag");

  useEffect(() => {
    if (!loadingFilters) return;
    fetchNews(0, true).finally(() => setLoadingFilters(false));
  }, [selectedChannel]);

  const fetchNews = async (currentPage = 0, clearList = false) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    setError("");

    if (clearList) {
      setNewsList([]);
    }

    try {
      const requestData = {
        filterRequest: {
          source_name: selectedChannel?.name || "allSources",
          neg: isNegative,
          pos: isPositive,
          ...filters,
        },
        tagRequest: searchTag
          ? {
              is_specific: isSpecific,
              tag: searchTag,
              tone: tone,
            }
          : { is_specific: false, tone: tone },
      };

      const params = { page: currentPage, size };

      const response = await axiosInstance.post(
        "/getNewsBySource",
        requestData,
        { params }
      );

      let newsData =
        response.data.newsWithScore?.content?.map((item) => ({
          ...item.news,
          negative: item.documentScore?.negative ?? null,
        })) || [];

      setNewsList((prev) => (clearList ? newsData : [...prev, ...newsData]));
      setHasMore(newsData.length === size);
      setPage(currentPage);
    } catch (error) {
      setError("Ошибка загрузки новостей");
      setNewsList([]);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };

  const handleResetSearch = async () => {
    setSearchTag("");
    setSearchResult(false);

    fetchNews(0, true, "");
  };

  const handleSearch = async () => {
    if (!searchTag.trim()) return;
    setIsSearching(true);
    try {
      setSearchResult(true);
      await fetchNews(0, true);
    } catch (error) {
      toast("Ошибка поиска по тегу");
    } finally {
      setIsSearching(false);
    }
  };

  const handleApplyFilters = () => {
    setFilters({
      from: startDate || null,
      to: endDate || null,
      neg: isNegative,
      pos: isPositive,
      similarity: similarity / 100,
    });
    setIsFilterApplied(true);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilters({});
    setIsFilterApplied(false);
    setIsFilterOpen(false);
    setIsNegative(false);
    setIsPositive(false);
    setSimilarity(25);
  };

  useEffect(() => {
    fetchNews(0, true);
    setTimeout(() => {
      if (newsContainerRef.current) {
        newsContainerRef.current.scrollTop = 0;
      }
    }, 0);
  }, [selectedChannel]);

  useEffect(() => {
    fetchNews(0, true);
  }, [filters]);
  const fetchMoreNews = () => {
    if (loading || !hasMore || isFetching.current) return;
    fetchNews(page + 1, false);
  };
  const toggleNegative = () => {
    if (isNegative) {
      setIsNegative(false);
    } else {
      setIsNegative(true);
      setIsPositive(false);
    }
    setLoadingFilters(true);
  };

  const togglePositive = () => {
    if (isPositive) {
      setIsPositive(false);
    } else {
      setIsPositive(true);
      setIsNegative(false);
    }
    setLoadingFilters(true);
  };
  const handleFilterChange = (event) => {
    const value = event.target.value;

    if (value === "negative") {
      setIsNegative(true);
      setIsPositive(false);
    } else if (value === "positive") {
      setIsPositive(true);
      setIsNegative(false);
    } else {
      setIsNegative(false);
      setIsPositive(false);
    }

    setLoadingFilters(true);
  };

  const handleToneChange = (event) => {
    setTone(event.target.value);
  };

  return (
    <>
      <div className="news-panel">
        <div className="news-header">
          <p>
            {searchResult
              ? `Результаты поиска по тегу: "${searchTag}"`
              : isFilterApplied
              ? "Применён фильтр"
              : !selectedChannel || selectedChannel.name === "allSources"
              ? "Последние новости всех каналов"
              : `Последние новости канала "${selectedChannel.name}"`}
          </p>
          <div className="header-controls">
            {/* <label className="negative-checkbox">
              <input
                type="checkbox"
                checked={isNegative}
                onChange={toggleNegative}
              />
              Негатив
            </label>
            <label className="negative-checkbox">
              <input
                type="checkbox"
                checked={isPositive}
                onChange={togglePositive}
              />
              Позитив
            </label> */}

            <div className="search-container">
              <input
                type="text"
                placeholder="Поиск (не менее 3 символов)"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="search-input"
              />

              <button
                className={`search-btn ${isSpecific ? "active" : ""}`}
                onClick={() => setIsSpecific((prev) => !prev)}
              >
                <FaEquals />
              </button>

              <button
                className="search-btn"
                onClick={() => {
                  if (searchTag.length < 3) return;
                  handleSearch();
                }}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ClipLoader color="#fff" size={15} />
                ) : (
                  <FaSearch />
                )}
              </button>

              <button className="search-btn" onClick={handleResetSearch}>
                <FaTimes />
              </button>
            </div>

            <button
              className="filter-btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <MdExpandMore size={30} />
              {/* <HiCalendarDateRange size={30} /> */}
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div
            className={`filter-dropdown ${
              isNegative || isPositive ? "higher" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filter-header">
              <h3>Дополнительные параметры</h3>
              <button className="reset" onClick={() => setIsFilterOpen(false)}>
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

              <div className="filter-section">
                <label>
                  Новости:
                  <select
                    value={
                      isNegative ? "negative" : isPositive ? "positive" : ""
                    }
                    onChange={handleFilterChange}
                  >
                    <option value="" disabled hidden>
                      Выберите...
                    </option>
                    <option value="negative">Негативные</option>
                    <option value="positive">Позитивные</option>
                  </select>
                </label>
              </div>
              {isNegative || isPositive ? (
                <>
                  <div className="filter-section">
                    <label>
                      Тип новости:
                      <select value={tone} onChange={handleToneChange}>
                        <option value="" disabled hidden>
                          Выберите...
                        </option>
                        <option value="byTag">
                          {`Поиск ${
                            isNegative ? ` негатива ` : ` позитива `
                          } касательно тэга`}
                        </option>
                        <option value="byNews">
                          {`Поиск ${
                            isNegative ? ` негативной ` : ` позитивной `
                          } новости где есть тэг`}
                        </option>
                        <option value="ByNothing">Без тэга</option>
                      </select>
                    </label>
                  </div>
                  <div className="filter-section">
                    <label>
                      Процент
                      {isNegative ? " негативности" : " позитивности"}:{" "}
                      {similarity}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="99"
                      value={similarity}
                      onChange={(e) => setSimilarity(Number(e.target.value))}
                      className="slider"
                    />
                  </div>
                </>
              ) : null}

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
        )}

        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="news-list" ref={newsContainerRef}>
            {loading && newsList.length === 0 ? (
              <div className="loading-container">
                <ClipLoader color="#007bff" size={50} />
                <p>Загружаем новости...</p>
              </div>
            ) : newsList.length > 0 ? (
              newsList.map((item, index) => (
                <div key={item.id || index} className="news-item">
                  <h3>{item.title}</h3>
                  <p className="news-meta">
                    Источник:
                    {item.source?.name ? ` ${item.source.name}` : "Нет данных"}
                  </p>
                  <p className="news-meta">
                    Дата публикации:
                    {item.publicationDate
                      ? ` ${new Date(
                          item.publicationDate
                        ).toLocaleDateString()}`
                      : "Дата неизвестна"}
                  </p>

                  <p>
                    {(() => {
                      const text =
                        item.summary || item.mainText || "Описание отсутствует";
                      const words = text.split(" ");
                      return words.length > 100
                        ? words.slice(0, 100).join(" ") + "..."
                        : text;
                    })()}
                  </p>
                  <button
                    className="more-btn"
                    onClick={() => setSelectedNews(item)}
                  >
                    Подробнее...
                  </button>
                </div>
              ))
            ) : (
              <p className="no-news">Нет новостей</p>
            )}

            {hasMore && !loading && (
              <div className="news-item load-more-container">
                <button className="load-more-btn" onClick={fetchMoreNews}>
                  Загрузить больше новостей
                </button>
              </div>
            )}

            {loading && newsList.length > 0 && (
              <div className="loading-container">
                <ClipLoader color="#007bff" size={40} />
              </div>
            )}
          </div>
        )}

        <NewsModal
          isOpen={!!selectedNews}
          onClose={() => setSelectedNews(null)}
          newsItem={selectedNews}
        />
      </div>
    </>
  );
};

export default NewsPanel;
