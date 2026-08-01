import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiList,
  FiBell,
  FiStar,
  FiFolder,
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
  FiTag,
  FiLayers,
  FiMap,
} from "react-icons/fi";

export default function Sidebar() {
  const { pathname } = useLocation();
  const sidebarRef = useRef(null);
  useEffect(() => {
    const savedScroll = localStorage.getItem("sidebar-scroll");
    if (savedScroll && sidebarRef.current) {
      sidebarRef.current.scrollTop = parseInt(savedScroll, 10);
    }
  }, []);

  // حفظ موضع Scroll عند الحركة
  const handleScroll = () => {
    if (sidebarRef.current) {
      localStorage.setItem("sidebar-scroll", sidebarRef.current.scrollTop);
    }
  };
  const sections = [
    {
      title: "الرئيسية",
      items: [{ title: "لوحة التحكم", path: "/", icon: <FiHome /> }],
    },
    {
      title: "إدارة المستخدمين",
      items: [
        { title: "الزبائن", path: "/customers", icon: <FiUsers /> },
        { title: "مقدمو الخدمات", path: "/providers", icon: <FiList /> },
        {
          title: "توثيق المقدميين",
          path: "/verification",
          icon: <FiAlertTriangle />,
        },
      ],
    },
    {
      title: "الخدمات",
      items: [
        { title: "الطلبات", path: "/orders", icon: <FiFileText /> },
        { title: "الأنواع", path: "/types", icon: <FiList /> },
      ],
    },
    {
      title: "التفاعل",
      items: [
        { title: "المراجعات", path: "/reviews", icon: <FiStar /> },
        { title: "الشكاوى والدعم", path: "/support", icon: <FiFileText /> },
      ],
    },
    {
      title: "النظام",
      items: [
        {
          title: "الاشتراكات",
          path: "/subscriptions",
          icon: <FiCheckCircle />,
        },
        { title: "التقارير", path: "/reports", icon: <FiBarChart2 /> },
        { title: "الإعدادات", path: "/settings", icon: <FiSettings /> },
        { title: "نطاق المنصة", path: "/platform-scope", icon: <FiMap /> },
      ],
    },
  ];

  return (
    <div
      ref={sidebarRef}
      onScroll={handleScroll}
      style={{
        width: "250px",
        background: "var(--sidebar-bg)",
        color: "var(--sidebar-text)",
        height: "100vh",
        overflowY: "auto",
        padding: "20px",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <a href="/">
        <img
          src="/logoSERVA.png"
          alt="LOGO"
          height={40}
          width={200}
          style={{ marginBottom: "10px" }}
        />
      </a>

      {sections.map((section, index) => (
        <div key={index} style={{ marginBottom: "25px" }}>
          <div
            style={{
              fontSize: "13px",
              opacity: 0.6,
              marginBottom: "10px",
              letterSpacing: "1px",
            }}
          >
            {section.title}
          </div>

          {section.items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "8px",
                textDecoration: "none",
                color: "var(--sidebar-text)",
                background:
                  pathname === item.path
                    ? "var(--sidebar-active-bg)"
                    : "transparent",
                transition: "0.2s",
              }}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
