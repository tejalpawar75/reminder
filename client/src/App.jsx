import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [dates, setDates] = useState([]);

  // Fetch logs from server when component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/dates")
      .then((res) => res.json())
      .then((data) => setDates(data));
  }, []);

  // Add current date
  const addDate = async () => {
    const now = new Date().toLocaleString();
    setDates((prev) => [...prev, now]);

    await fetch("http://localhost:5000/api/dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ datetime: now }),
    });
  };

  // Delete all dates
  const deleteAll = async () => {
    setDates([]); // Clear frontend state immediately
    await fetch("http://localhost:5000/api/dates", {
      method: "DELETE",
    });
  };

  return (
    <div className="app-container">
      <h1>Date & Time Logs</h1>
      <button onClick={addDate}>Add Current Date & Time</button>
      <button onClick={deleteAll} className="delete-btn">Delete All</button>
      <ul>
        {dates.map((date, index) => (
          <li key={index}>{date}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
