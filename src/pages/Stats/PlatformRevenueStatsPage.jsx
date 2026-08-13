import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Table from "../../components/common/Table";
import { getPlatformRevenueStats } from "../../services/subscriptionsService";

export default function PlatformRevenueStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const data = await getPlatformRevenueStats();
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <Loader />;

  const monthlyColumns = [
    { key: "month", title: "الشهر" },
    { key: "revenue", title: "الإيرادات" },
    { key: "paid_subscriptions_count", title: "عدد الاشتراكات المدفوعة" },
  ];

  const planColumns = [
    { key: "subscription_id", title: "رقم الخطة" },
    { key: "plan_type", title: "نوع الخطة" },
    { key: "revenue", title: "الإيرادات" },
    { key: "subscribers_count", title: "عدد المشتركين" },
    { key: "percentage", title: "النسبة %" },
  ];

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>إحصائيات إيرادات الاشتراكات</h2>

      {/* Overview */}
      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <h3>نظرة عامة</h3>
        <p><strong>إجمالي الإيرادات:</strong> {stats.overview.total_revenue.toLocaleString()} ل.س</p>
        <p><strong>عدد الاشتراكات المدفوعة:</strong> {stats.overview.paid_subscriptions_count}</p>
        <p><strong>اشتراكات فعّالة:</strong> {stats.overview.active_paid_subscriptions_count}</p>
        <p><strong>اشتراكات ملغاة:</strong> {stats.overview.cancelled_paid_subscriptions_count}</p>
        <p><strong>بانتظار الدفع:</strong> {stats.overview.pending_payment_count}</p>
        <p><strong>متوسط الإيراد لكل اشتراك:</strong> {stats.overview.average_subscription_revenue.toLocaleString()} ل.س</p>

        <h4 style={{ marginTop: "20px" }}>الخطة الأعلى ربحًا</h4>
        <p><strong>رقم الخطة:</strong> {stats.overview.top_plan_by_revenue.subscription_id}</p>
        <p><strong>نوع الخطة:</strong> {stats.overview.top_plan_by_revenue.plan_type}</p>
        <p><strong>الإيرادات:</strong> {stats.overview.top_plan_by_revenue.revenue.toLocaleString()} ل.س</p>
        <p><strong>عدد المشتركين:</strong> {stats.overview.top_plan_by_revenue.subscribers_count}</p>
        <p><strong>النسبة:</strong> {stats.overview.top_plan_by_revenue.percentage}%</p>

        <h4 style={{ marginTop: "20px" }}>الشهر الأعلى ربحًا</h4>
        <p><strong>الشهر:</strong> {stats.overview.top_month_by_revenue.month}</p>
        <p><strong>الإيرادات:</strong> {stats.overview.top_month_by_revenue.revenue.toLocaleString()} ل.س</p>
        <p><strong>عدد الاشتراكات المدفوعة:</strong> {stats.overview.top_month_by_revenue.paid_subscriptions_count}</p>
      </Card>

      {/* Monthly Trend */}
      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <h3>اتجاه الإيرادات شهريًا</h3>
        <Table columns={monthlyColumns} data={stats.monthly_trend} />
      </Card>

      {/* Revenue by Plan */}
      <Card style={{ padding: "20px" }}>
        <h3>الإيرادات حسب الخطة</h3>
        <Table columns={planColumns} data={stats.revenue_by_plan} />
      </Card>
    </DashboardLayout>
  );
}
