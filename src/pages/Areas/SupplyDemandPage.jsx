import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { getSupplyDemand } from "../../services/areasService";

export default function SupplyDemandPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSupplyDemand();
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loader />;

  const getStatusColor = (status) => {
    switch (status) {
      case "balanced":
        return "#d4edda"; // أخضر فاتح
      case "surplus":
        return "#cce5ff"; // أزرق فاتح
      case "critical_shortage":
        return "#f8d7da"; // أحمر فاتح
      default:
        return "white";
    }
  };

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>حالة العرض والطلب حسب المناطق والفئات</h2>

      <Card style={{ padding: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>المدينة</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>المنطقة</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>الفئة</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>عدد الطلبات</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>عدد مقدمي الخدمة</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>النسبة</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>الحالة</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index} style={{ background: getStatusColor(row.status) }}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.city}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.area_name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.category_name}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.requests_count}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.providers_count}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.ratio !== null ? row.ratio : "—"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.status === "balanced" && "متوازن"}
                  {row.status === "surplus" && "فائض"}
                  {row.status === "critical_shortage" && "نقص حاد"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}
