import React, { useState } from "react";
import "./style.scss";
import Sidebar from "../../components/SideBar";
import NewsPanel from "../../components/NewsPanel";

const Home = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [expandedPanel, setExpandedPanel] = useState("news");
  const [filteredNews, setFilteredNews] = useState([]);  

  const handleFilterApply = (filteredData) => {
    setFilteredNews(filteredData);  
  };

  return (
    <div className="container">
      <Sidebar 
        className="sidebar" 
        onSelectChannel={setSelectedChannel} 
        onApplyFilters={handleFilterApply} 
      />
      <div className="main-content">
        <NewsPanel
          className="news-panel"
          selectedChannel={selectedChannel}
          isExpanded={expandedPanel === "news"}
          // onToggleExpand={() =>
          //   setExpandedPanel(expandedPanel === "news" ? null : "news")
          // }
          newsData={filteredNews}  
        />
        {/* <ChatGPT
          className="chat-panel"
          isExpanded={expandedPanel === "chat"}
          onToggleExpand={() =>
            setExpandedPanel(expandedPanel === "chat" ? null : "chat")
          }
        /> */}
      </div>
    </div>
  );
};

export default Home;
