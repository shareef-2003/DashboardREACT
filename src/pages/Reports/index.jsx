import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import StatBox from "../../components/common/StatBox";
import Input from "../../components/common/Input";
import LineChart from "../../components/charts/LineChart";
import BarChart from "../../components/charts/BarChart";
import { useReportsStore } from "../../store/reportsStore";
import { colors } from "../../utils/colors";
import { getReports } from "../../services/reportsService";
import { FiBarChart2, FiDollarSign, FiTrendingUp } from "react-icons/fi";

export default function ReportsPage() {
  const { dateFrom, dateTo, setDateFrom, setDateTo } = useReportsStore();
  const [reports, setReports] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      const data = await getReports({ dateFrom, dateTo });
      setReports(data);
    };

    loadReports();
  }, [dateFrom, dateTo]);

  const stats = reports?.stats ?? [];
  const ordersTrend = reports?.ordersTrend ?? { labels: [], values: [] };
  const subscriptionsTrend = reports?.subscriptionsTrend ?? {
    labels: [],
    values: [],
  };
  const hotZones = reports?.hotZones ?? { labels: [], values: [] };

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>التقارير والإحصائيات</h2>

      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Input
            label="من تاريخ"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            label="إلى تاريخ"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "20px",
        }}
      >
        {stats.map((item, i) => (
          <StatBox
            key={i}
            title={item.title}
            value={item.value}
            icon={i === 3 ? <FiDollarSign /> : <FiBarChart2 />}
            color={colors.primary}
          />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <Card>
          <h3>عدد الطلبات خلال الفترة</h3>
          <LineChart data={ordersTrend} seriesName="الطلبات" />
        </Card>

        <Card>
          <h3>الاشتراكات المدفوعة خلال الفترة</h3>
          <BarChart
            data={subscriptionsTrend}
            seriesName="الاشتراكات المدفوعة"
          />
        </Card>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <FiTrendingUp />
            <h3 style={{ margin: 0 }}>المناطق الأكثر طلبًا</h3>
          </div>
          <BarChart data={hotZones} seriesName="عدد الطلبات" />
        </Card>
      </div>
    </DashboardLayout>
  );
}
