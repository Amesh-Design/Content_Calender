// // src/ContentScreen.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { format } from "date-fns";

// function ContentScreen({ selectedDate }) {
//   const [loading, setLoading] = useState(true);
//   const [holidayData, setHolidayData] = useState(null);
//   const [error, setError] = useState(null);

//   const baseUrl = "http://192.168.31.26:5000"; // Adjust as needed

//   useEffect(() => {
//     const fetchHoliday = async () => {
//       setLoading(true);
//       setError(null);

//       const formattedDate = format(selectedDate, "yyyy-MM-dd");

//       try {
//         const res = await axios.get(
//           `${baseUrl}/api/content/generate?platform=instagram&date=${formattedDate}`
//         );
//         setHolidayData(res.data);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError("Failed to fetch holiday");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHoliday();
//   }, [selectedDate]);

//   const handleLinkClick = (url) => {
//     window.open(url, "_blank");
//   };

//   if (loading) return <div className="centered">Loading...</div>;
//   if (error) return <div className="centered error">{error}</div>;
//   if (!holidayData) return <div className="centered">No holiday data available</div>;

//   const { name, content, canonicalUrl, country } = holidayData;

//   return (
//     <div style={{ padding: "16px", maxWidth: 700, margin: "auto" }}>
//       <h2 style={{ textAlign: "center", color: "#1976d2" }}>{name}</h2>

//       <img
//         src={`${baseUrl}${content.imageUrl}`}
//         alt="Holiday Banner"
//         style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
//       />

//       <p style={{ marginTop: "12px", fontSize: "16px" }}>{content.text}</p>

//       <p style={{ marginTop: "16px", fontSize: "16px" }}>
//         <strong>Country:</strong> {country.name}
//       </p>

//       <p
//         onClick={() => handleLinkClick(canonicalUrl)}
//         style={{
//           color: "blue",
//           textDecoration: "underline",
//           cursor: "pointer",
//           marginTop: "12px",
//         }}
//       >
//         {canonicalUrl}
//       </p>
//     </div>
//   );
// }

// export default ContentScreen;
