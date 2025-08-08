import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarStyles.css";
import EventForm from "./EventForm";

// const baseUrl = "http://192.168.31.26:5000";
const baseUrl = "http://localhost:5000";

const holidayMap = {
  "2025-01-01": ["New Year’s Day"],
  "2025-01-14": ["Makar Sankranti"],
  "2025-01-26": ["Republic Day"],
  "2025-03-01": ["Maha Shivaratri"],
  "2025-03-14": ["Holi"],
  "2025-03-30": ["Good Friday"],
  "2025-04-10": ["Eid-ul-Fitr"],
  "2025-04-14": ["Ambedkar Jayanti"],
  "2025-04-17": ["Ram Navami"],
  "2025-05-01": ["Labour Day"],
  "2025-05-12": ["Buddha Purnima"],
  "2025-06-06": ["Bakrid / Eid al-Adha"],
  "2025-07-08": ["Muharram"],
  "2025-08-09": ["Raksha Bandhan"],
  "2025-08-15": ["Independence Day"],
  "2025-08-16": ["Krishna Janmashtami"],
  "2025-08-27": ["Ganesh Chaturthi"],
  "2025-10-02": ["Mahatma Gandhi Jayanti"],
  "2025-10-03": ["Navratri Begins"],
  "2025-10-10": ["Dussehra / Vijayadashami"],
  "2025-10-20": ["Eid-e-Milad"],
  "2025-10-29": ["Diwali"],
  "2025-10-30": ["Govardhan Puja"],
  "2025-10-31": ["Bhai Dooj"],
  "2025-11-01": ["Kannada Rajyotsava"],
  "2025-11-07": ["Chhath Puja"],
  "2025-11-15": ["Guru Nanak Jayanti"],
  "2025-12-25": ["Christmas Day"],
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showContent, setShowContent] = useState(false);
  const [lastTap, setLastTap] = useState(null);
  const [holidayData, setHolidayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);

  const formatted = formatDate(selectedDate);
  const holidays = holidayMap[formatted] || [];

  const handleDateChange = (date) => {
    const now = Date.now();
    const doubleTap = lastTap && now - lastTap < 300;

    setSelectedDate(date);
    setLastTap(now);
    setResult(true);

    if (doubleTap) {
      fetchHoliday(date);
    }
  };

  const fetchHoliday = async (date) => {
    setLoading(true);
    const formattedDate = formatDate(date);

    try {
      const res = await fetch(
        `${baseUrl}/api/content/generate?platform=instagram&date=${formattedDate}`
      );
      const data = await res.json();
      setHolidayData(data);
      setShowContent(true);
    } catch (error) {
      console.error("Failed to fetch holiday:", error);
      alert("Error fetching holiday data");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    const imageUrl = baseUrl + holidayData.content.imageUrl;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `holiday-${formatted}.jpg`; // adjust extension if needed
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download image.");
    }
  };

  if (showContent && holidayData) {
    return (
      <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
        <button
          onClick={() => setShowContent(false)}
          style={{
            marginBottom: "10px",
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ← Back to Calendar
        </button>

        <h2>{holidayData.name}</h2>

        <img
          src={baseUrl + holidayData.content.imageUrl}
          alt="Holiday"
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "contain",
            border: "1px solid #ddd",
          }}
        />

        <div style={{ marginTop: "10px" }}>
          <button
            onClick={downloadImage}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ⬇️ Download Image
          </button>
        </div>

        <p style={{ fontSize: "16px", marginTop: "10px" }}>
          {holidayData.content.text}
        </p>
        <p style={{ fontWeight: "bold" }}>
          Country: {holidayData.country.name}
        </p>
        <a
          href={holidayData.canonical_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {holidayData.canonical_url}
        </a>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <h2
        style={{
          textAlign: "center",
          justifyContent: "center",
          color: "#1976d2",
        }}
      >
        Calendar
      </h2>

      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={({ date }) => {
          const d = formatDate(date);
          return holidayMap[d] ? "highlight" : "";
        }}
      />

      {holidays.length > 0 && (
        <div className="holiday-box">
          {holidays.map((h, idx) => (
            <p key={idx} className="holiday-item">
              🎉 {h}
            </p>
          ))}
        </div>
      )}

      {loading && <p style={{ textAlign: "center" }}>Loading holiday...</p>}

      {result && (
        <EventForm
          selectedDate={selectedDate}
          onComplete={() => setResult(false)}
        />
      )}
    </div>
  );
}

export default App;
