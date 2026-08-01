import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import { getSubscriptionsBreakdown } from "../../services/providersService";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

export default function SubscriptionsReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const result = await getSubscriptionsBreakdown();
      setData(result);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const columns = [
    { key: "full_name", title: "اسم المزود", render: (row) => row.full_name },
    {
      key: "total_subscriptions",
      title: "عدد الاشتراكات",
      render: (row) => row.total_subscriptions,
    },
    {
      key: "subscriptions_breakdown",
      title: "تفاصيل الاشتراكات",
      render: (row) =>
        row.subscriptions_breakdown.length === 0
          ? "لا يوجد"
          : row.subscriptions_breakdown
              .map(
                (item) =>
                  `${item.subscription_name} (${item.times_subscribed} مرة)`,
              )
              .join("، "),
    },
  ];

  return (
    <DashboardLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>تقرير الاشتراكات</h2>
        <Button onClick={() => navigate(-1)} variant="outline">
          العودة
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={data} />
      </Card>
    </DashboardLayout>
  );
}
