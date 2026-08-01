import React from "react";

export default function Table({ columns, data }) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        background: "var(--surface)",
        borderRadius: "10px",
        border: "1px solid var(--border)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "14px",
                  background: "var(--surface-strong)",
                  borderBottom: "1px solid var(--border)",
                  textAlign: "left",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "var(--text)",
                  whiteSpace: "nowrap",
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              style={{
                borderBottom: "1px solid var(--border)",
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
    whiteSpace: "normal",
    wordBreak: "break-word",
    lineHeight: "1.6",
    maxWidth: "250px",
  }}
                >
                  {col.render ? col.render(row, row[col.key]) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
