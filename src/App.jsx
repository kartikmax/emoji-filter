import React, { useState, useEffect } from "react";
import axios from "axios";
import "./app.css";

const App = () => {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://emojihub.yurace.pro/api/all");
      const data = response.data;
      setEmojis(data);
    } catch (error) {
      console.error("Error fetching emojis:", error);
    }
  };

  const convertEmoji = (unicode) => {
    const codePoint = unicode.substring(2); // Remove the "U+" prefix
    const parsedCodePoint = parseInt(codePoint, 16);

    if (
      isNaN(parsedCodePoint) ||
      parsedCodePoint < 0x0 ||
      parsedCodePoint > 0x10ffff
    ) {
      return ""; // Return an empty string for invalid code points
    }

    const convertedEmoji = String.fromCodePoint(parsedCodePoint);
    return convertedEmoji;
  };

  return (
    <div className="emoji-container">
      {emojis.map((emoji) => (
        <div className="emoji-card" key={emoji.name + emoji.category}>
          <span className="emoji" role="img" aria-label={emoji.name}>
            {convertEmoji(emoji.htmlCode[0])}
          </span>
          <div className="emoji-details">
            <p>Name: {emoji.name}</p>
            <p>Category: {emoji.category}</p>
            <p>Group: {emoji.group}</p>
            <p>Emoji: {convertEmoji(emoji.htmlCode[0])}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
