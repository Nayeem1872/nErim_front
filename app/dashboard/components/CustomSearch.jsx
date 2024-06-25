import React, { useState } from 'react'

const CustomSearch = ({ placeholder, onSearch }) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
  
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        onSearch(inputValue);
      }
    };
  
    const handleClear = () => {
      setInputValue("");
      onSearch("");
    };
  
    return (
      <div style={{ display: "flex", alignItems: "center", width: "400px" }}>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          style={{
            flex: 1,
            padding: "10px 20px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            fontSize: "16px",
            outline: "none",
            transition: "border-color 0.3s",
          }}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            style={{
              marginLeft: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: "#999",
            }}
          >
            ✖
          </button>
        )}
      </div>
    );
}

export default CustomSearch