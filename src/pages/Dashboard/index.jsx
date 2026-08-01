import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatBox from "../../components/common/StatBox";
import Card from "../../components/common/Card";
import LineChart from "../../components/charts/LineChart";
import PieChart from "../../components/charts/PieChart";
import Loader from "../../components/common/Loader";
import { lineChartData } from "../../mocks/dashboard";
import { colors } from "../../utils/colors";
import { FiUsers, FiClock, FiCreditCard } from "react-icons/fi";
import { getDashboardSummary } from "../../services/dashboardService";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const icons = [<FiUsers />, <FiClock />, <FiCreditCard />];

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "فشل تحميل ملخص لوحة التحكم.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const stats = summary?.stats ?? [];
  const pieData = {
    labels: ["معتمدون", "بانتظار التوثيق"],
    values: [
      summary?.approvedProviders?.length ?? 0,
      summary?.pendingProviders?.length ?? 0,
    ],
  };

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>لوحة إدارة SERVA</h2>

      {error && (
        <Card style={{ marginBottom: "20px", color: "var(--danger)" }}>
          {error}
        </Card>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {stats.map((item, i) => (
          <StatBox
            key={item.title}
            title={item.title}
            value={item.value}
            icon={icons[i % icons.length]}
            color={colors.primary}
          />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <Card>
          <h3>نشاط تجريبي للطلبات</h3>
          <LineChart data={lineChartData} />
        </Card>

        <Card>
          <h3>حالة مزودي الخدمة</h3>
          <PieChart labels={pieData.labels} values={pieData.values} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
