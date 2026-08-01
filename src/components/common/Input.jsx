import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Input({ label, type = "text", ...props }) {
  const [show, setShow] = useState(false);

  const isPassword = type === "password";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && <label>{label}</label>}

      <div style={{ position: "relative" }}>
        <input
          {...props}
          type={isPassword ? (show ? "text" : "password") : type}
          style={{
            width: "100%",
            padding: "10px 0px 10px 12px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        />

        {isPassword && (
          <span
            onClick={() => setShow(!show)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "var(--muted)",
              fontSize: "18px",
            }}
          >
            {show ? <FiEyeOff /> : <FiEye />}
          </span>
        )}
      </div>
    </div>
  );
}
