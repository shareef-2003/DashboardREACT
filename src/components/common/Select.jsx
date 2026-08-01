import React from "react";

export default function Select({ label, options = [], ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label style={{ fontSize: "14px", color: "var(--text)" }}>
          {label}
        </label>
      )}
      <select
        {...props}
        style={{
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid var(--input-border)",
          background: "var(--input-bg)",
          color: "var(--text)",
          fontSize: "14px",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
