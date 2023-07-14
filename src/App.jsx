import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./app.css";

const App = () => {
  const [emojis, setEmojis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    group: "",
    category: "",
  });
  const [filteredEmojis, setFilteredEmojis] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [emojis, filter]);

  useEffect(() => {
    extractFilterOptions();
  }, [emojis]);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://emojihub.yurace.pro/api/all");
      const data = response.data;
      setEmojis(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching emojis:", error);
    }
  };

  const applyFilter = () => {
    let filteredData = emojis;

    if (filter.group) {
      filteredData = filteredData.filter(
        (emoji) => emoji.group === filter.group
      );
    }

    if (filter.category) {
      filteredData = filteredData.filter(
        (emoji) => emoji.category === filter.category
      );
    }

    setFilteredEmojis(filteredData);
  };

  const extractFilterOptions = () => {
    const groups = [...new Set(emojis.map((emoji) => emoji.group))];
    const categories = [...new Set(emojis.map((emoji) => emoji.category))];
    setAvailableGroups(groups);
    setAvailableCategories(categories);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    applyFilter();
  };

  const memoizedEmojis = useMemo(() => filteredEmojis, [filteredEmojis]);

  return (
    <>
      <h1>Emoji Application</h1>
      <div className="navbar">
        <form onSubmit={handleFilterSubmit}>
          <label htmlFor="groupFilter">Group:</label>
          <select
            id="groupFilter"
            name="group"
            value={filter.group}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            {availableGroups.map((group) => (
              <option value={group} key={group}>
                {group}
              </option>
            ))}
          </select>

          <label htmlFor="categoryFilter">Category:</label>
          <select
            id="categoryFilter"
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            {availableCategories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>

          <button type="submit">Filter</button>
        </form>
      </div>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : memoizedEmojis.length > 0 ? (
          <>
            <p>{`${memoizedEmojis.length} emojis filtered`}</p>
            <div className="emoji-container">
              {memoizedEmojis.map((emoji) => (
                <div className="emoji-card" key={emoji.name + emoji.category}>
                  <span
                    className="emoji"
                    role="img"
                    aria-label={emoji.name}
                    dangerouslySetInnerHTML={{ __html: emoji.htmlCode[0] }}
                  />
                  <div className="emoji-details">
                    <p>Name: {emoji.name}</p>
                    <p>Category: {emoji.category}</p>
                    <p>Group: {emoji.group}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No emojis found.</p>
        )}
      </div>
    </>
  );
};

export default App;
