import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import { BiArrowToBottom, BiMoon, BiSun } from "react-icons/bi";

export default function Navbar() {
  const { logout, user } = useAuthStore();
  const theme = useSettingsStore((state) => state.theme);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <div
      style={{
        height: "60px",
        background: "var(--navbar-bg)",
        borderBottom: "1px solid var(--border)",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        position: "fixed",
        top: 0,
        left: 300,
        right: 50,
        zIndex: 1000,
      }}
    >
      <img src="/logoSERVA.png" alt="SERVA" height={60} width={500} />

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text)",
            padding: "10px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {theme === "light" ? <BiMoon /> : <BiSun />}
          {theme === "light" ? "وضع داكن" : "وضع فاتح"}
        </button>

        <div style={{ position: "relative" }}>
          <div
            onClick={() => setOpen(!open)}
            style={{
              cursor: "pointer",
              background: "var(--text)",
              color: "var(--surface)",
              padding: "10px 15px",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            {user?.user_name || "الأدمن"} <BiArrowToBottom />
          </div>

          {open && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "45px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                width: "160px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                الملف الشخصي
              </div>

              <div
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                الإعدادات
              </div>

              <div
                onClick={handleLogout}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  color: "var(--danger)",
                  fontWeight: "bold",
                }}
              >
                تسجيل الخروج
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
