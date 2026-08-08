import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { getGeographicGrowth } from "../../services/areasService";
import {
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function GeographicGrowthPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getGeographicGrowth();
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loader />;

  const months = rows.map((r) => r.month);
  const areas = rows.map((r) => r.new_areas_count);
  const providers = rows.map((r) => r.new_providers_count);
  const requests = rows.map((r) => r.new_requests_count);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "المناطق الجديدة",
        data: areas,
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
      },
      {
        label: "مقدمو الخدمة الجدد",
        data: providers,
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.2)",
      },
      {
        label: "الطلبات الجديدة",
        data: requests,
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.2)",
      },
    ],
  };

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>إحصائية النمو الجغرافي</h2>

      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "15px" }}>الرسم البياني للنمو الجغرافي</h3>
        <Line data={chartData} />
      </Card>

      <Card style={{ padding: "20px" }}>
        <h3 style={{ marginBottom: "15px" }}>البيانات الشهرية</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>الشهر</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>مناطق جديدة</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>مقدمو خدمة جدد</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>طلبات جديدة</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.month}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.month}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.new_areas_count}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.new_providers_count}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.new_requests_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}
