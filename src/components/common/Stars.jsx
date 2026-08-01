import React from "react";

export default function Stars({ rating }) {
  return (
    <div style={{ color: "#fbbf24", fontSize: "16px" }}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );
}
