import React from "react";

export default function Card({ children, style }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "var(--card-shadow)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
