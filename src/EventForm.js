// src/EventForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./eventStyles.css";

const baseUrl = "http://localhost:5000";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function EventForm({ selectedDate , onComplete }) {
  const formateddate = formatDate(selectedDate); // Format date to
  // const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !selectedDate) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/content/generate/custom?platform=instagram&date=${formateddate}&name=${name}&description=${description}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      console.log("Fetched data: ", data);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
        <button
          onClick={() => {
            setResult(null);
             if (onComplete) onComplete(); // Call the callback if provided
            navigate("/");
          }}
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

        <h2>{result.name}</h2>
        <img
          src={baseUrl + result.content.imageUrl}
          alt="Generated"
          style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
        />
        <p style={{ fontSize: "16px", marginTop: "10px" }}>
          {result.content.text}
        </p>
      </div>
    );
  }

  return (
    <div className="event-form-container"
     >
      <h2>Create Custom Content</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="date"
          value={formateddate}
          readOnly
          // onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description for AI"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>
      </form>
    </div>
  );
}

export default EventForm;
