import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {
  const location = useLocation();

  return (
    <div
      style={{
        marginLeft: "250px",
        padding: "25px",
        minHeight: "100vh",
        overflowY: "auto",
        background: "var(--bg)",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.99 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ marginTop: "20px" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
