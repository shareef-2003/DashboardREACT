import React from "react";
import Card from "./Card";

export default function StatBox({ title, value, icon, color }) {
  return (
    <Card
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          background: color,
          width: "48px",
          height: "48px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "20px",
        }}
      >
        {icon}
      </div>

      <div>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: "14px" }}>
          {title}
        </p>
        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
          {value}
        </h3>
      </div>
    </Card>
  );
}
