import React, { useState } from "react";
import { colors } from "../../utils/colors";

export default function Button({
  children,
  onClick,
  variant = "primary",
  small = false,
  full = false,
  disabled = false,
  style,
  ...props
}) {
  const [isHover, setIsHover] = useState(false);

  const glowColor =
    variant === "danger"
      ? "rgba(235, 87, 87, 0.28)"
      : "rgba(67, 56, 202, 0.24)";

  const baseStyle = {
    padding: small ? "8px 14px" : "10px 16px",
    borderRadius: "10px",
    fontSize: small ? "13px" : "14px",
    fontWeight: 600,
    cursor: disabled ? "default" : "pointer",
    width: full ? "100%" : "auto",
    opacity: disabled ? 0.6 : 1,
    border: "none",
    outline: "none",
    transform: isHover ? "translateY(-1px)" : "translateY(0)",
    boxShadow: isHover ? `0 0 24px 0 ${glowColor}` : "0 0 0 0 transparent",
    transition:
      "transform 180ms ease, box-shadow 220ms ease, background-color 220ms ease, border-color 220ms ease",
  };

  const variants = {
    primary: {
      background: colors.primary,
      color: "#fff",
    },
    outline: {
      background: "transparent",
      color: "var(--text)",
      border: `1px solid var(--border)`,
    },
    danger: {
      background: "var(--danger)",
      color: "#fff",
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsHover(true)}
      onBlur={() => setIsHover(false)}
      style={{
        ...baseStyle,
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
