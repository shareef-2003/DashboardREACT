import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getRequestsGrowth } from "../../services/statsRequestsService";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

export default function StatsServiceRequestsGrowthPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    request_type: "",
    service_category_id: "",
  });

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getRequestsGrowth(filters);
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    loadStats();
  };

  const chartData = {
    labels: stats.map((item) => item.month),
    datasets: [
      {
        label: "عدد الطلبات",
        data: stats.map((item) => item.count),
        borderColor: "#1cc88a",
        backgroundColor: "rgba(28,200,138,0.2)",
        tension: 0.3,
      },
    ],
  };

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>إحصائيات نمو الطلبات</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          العودة
        </Button>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <input
            type="number"
            placeholder="السنة (مثال: 2026)"
            onChange={(e) => updateFilter("year", e.target.value)}
            style={{ padding: "10px", minWidth: "200px" }}
          />

          <select
            onChange={(e) => updateFilter("request_type", e.target.value)}
            style={{ padding: "10px" }}
          >
            <option value="">نوع الطلب</option>
            <option value="specific_fault">أعطال محددة</option>
            <option value="unspecified_fault">أعطال غير محددة</option>
          </select>

          <select
            onChange={(e) =>
              updateFilter("service_category_id", e.target.value)
            }
            style={{ padding: "10px" }}
          >
            <option value="">نوع العطل</option>
            <option value="1">كهرباء</option>
            <option value="2">سباكة</option>
            <option value="3">نجارة</option>
            {/* لاحقًا نربطها مع API حقيقي */}
          </select>

          <Button onClick={applyFilters}>بحث</Button>
        </div>
      </Card>

      {/* Chart */}
      <Card style={{ marginBottom: "20px", padding: "20px" }}>
        <h3 style={{ marginBottom: "20px" }}>الرسم البياني</h3>
        <Line data={chartData} height={100} />
      </Card>

      {/* Table */}
      <Card>
        <h3 style={{ marginBottom: "20px" }}>الجدول الشهري</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                الشهر
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                عدد الطلبات
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {item.month}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {item.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}
