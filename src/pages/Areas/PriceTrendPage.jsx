import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getPriceTrend } from "../../services/areasService";

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

export default function PriceTrendPage() {
  const [categoryId, setCategoryId] = useState(1);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPriceTrend(categoryId);
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryId]);

  if (loading) return <Loader />;

  const months = rows.map((r) => r.month);
  const avgPrices = rows.map((r) => r.average_price);
  const acceptedOffers = rows.map((r) => r.accepted_offers_count);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "متوسط السعر",
        data: avgPrices,
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
      },
      {
        label: "عدد العروض المقبولة",
        data: acceptedOffers,
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.2)",
      },
    ],
  };

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>اتجاه الأسعار الشهري</h2>

      <Card style={{ marginBottom: "20px", padding: "20px" }}>
        <h3>خيارات الفلترة</h3>

        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <div>
            <label>فئة الخدمة</label>
            <input
              type="number"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value) || 1)}
              style={{ width: "120px", padding: "8px" }}
            />
          </div>

          <Button variant="primary" onClick={loadData}>
            تحديث
          </Button>
        </div>
      </Card>

      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "15px" }}>الرسم البياني لاتجاه الأسعار</h3>
        <Line data={chartData} />
      </Card>

      <Card style={{ padding: "20px" }}>
        <h3 style={{ marginBottom: "15px" }}>البيانات الشهرية</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>الشهر</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>متوسط السعر</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>العروض المقبولة</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.month}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.month}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.average_price}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.accepted_offers_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}
