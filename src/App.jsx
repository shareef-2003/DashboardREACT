import React, { useEffect } from "react";
import { setAuthToken } from "./services/api";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useSettingsStore } from "./store/settingsStore";
import Loader from "./components/common/Loader";
import { useAuthStore } from "./store/authStore";
import "./index.css";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, []);
  const theme = useSettingsStore((state) => state.theme);
  const setField = useSettingsStore((state) => state.setField);
  const token = localStorage.getItem("serva_token");
  if (token) {
    setAuthToken(token);
  }
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setField("theme", storedTheme);
    }
  }, [setField]);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  const { initialLoading } = useAuthStore();
  if (initialLoading) {
    return <Loader />;
  }
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
