import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatBox from "../../components/common/StatBox";
import Card from "../../components/common/Card";
import LineChart from "../../components/charts/LineChart";
import PieChart from "../../components/charts/PieChart";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { colors } from "../../utils/colors";
import { FiUsers, FiClock, FiCreditCard } from "react-icons/fi";
import { getDashboardSummary } from "../../services/dashboardService";
import { getRequestsGrowth } from "../../services/statsRequestsService";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const icons = [<FiUsers />, <FiClock />, <FiCreditCard />];

  // الفلاتر الافتراضية
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    request_type: "unspecified_fault",
    service_category_id: "",
  });

  const [requestsGrowth, setRequestsGrowth] = useState([]);

  // دالة تحميل مخطط الطلبات
  const loadRequestsGrowth = async () => {
    try {
      const data = await getRequestsGrowth(filters);
      setRequestsGrowth(data);
    } catch (err) {
      console.error(err);
    }
  };

  // دالة تحميل ملخص لوحة التحكم
  const loadSummary = async () => {
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "فشل تحميل ملخص لوحة التحكم."
      );
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات عند تغيير الفلاتر
  useEffect(() => {
    loadSummary();
    loadRequestsGrowth();
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const realLineChartData = {
    labels: requestsGrowth.map((item) => item.month),
    datasets: [
      {
        label: "عدد الطلبات",
        data: requestsGrowth.map((item) => item.count),
        borderColor: colors.primary,
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.3,
      },
    ],
  };

  if (loading) return <Loader />;

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

      {/* الإحصائيات العلوية */}
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

      {/* الفلاتر + المخطط */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <Card style={{ padding: "20px" }}>
          <h3 style={{ marginBottom: "20px" }}>نشاط الطلبات</h3>

          {/* الفلاتر */}
     <div
  style={{
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  }}
>
  {/* السنة */}
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ marginBottom: "5px", fontWeight: "bold" }}>السنة</label>
    <input
      type="number"
      value={filters.year}
      onChange={(e) => updateFilter("year", e.target.value)}
      placeholder="مثال: 2026"
      style={{ padding: "10px", minWidth: "150px" }}
    />
  </div>

  {/* نوع الطلب */}
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ marginBottom: "5px", fontWeight: "bold" }}>نوع الطلب</label>
    <select
      value={filters.request_type}
      onChange={(e) => updateFilter("request_type", e.target.value)}
      style={{ padding: "10px", minWidth: "180px" }}
    >
      <option value="">كل الطلبات</option>
      <option value="specific_fault">أعطال محددة</option>
      <option value="unspecified_fault">أعطال غير محددة</option>
    </select>
  </div>

  {/* نوع العطل */}
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label style={{ marginBottom: "5px", fontWeight: "bold" }}>نوع العطل</label>
    <select
      value={filters.service_category_id}
      onChange={(e) => updateFilter("service_category_id", e.target.value)}
      style={{ padding: "10px", minWidth: "180px" }}
    >
      <option value="">كل الأعطال</option>
      <option value="1">كهرباء</option>
      <option value="2">سباكة</option>
      <option value="3">نجارة</option>
    </select>
  </div>



</div>


          <LineChart data={realLineChartData} />
        </Card>

        <Card>
          <h3>حالة مزودي الخدمة</h3>
          <PieChart labels={pieData.labels} values={pieData.values} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
