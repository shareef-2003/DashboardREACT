import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import { getMostActiveProviders } from "../../services/providersService";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

export default function MostActiveProviders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const result = await getMostActiveProviders();
      setData(result);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Loader />;

  const columns = [
    { key: "full_name", title: "الاسم", render: (row) => row.full_name },
    {
      key: "phone_number",
      title: "رقم الهاتف",
      render: (row) => row.phone_number,
    },
    { key: "category", title: "التصنيف", render: (row) => row.category },
    {
      key: "experience_years",
      title: "سنوات الخبرة",
      render: (row) => row.experience_years,
    },
    { key: "rating", title: "التقييم", render: (row) => row.rating },
    {
      key: "working_hours",
      title: "ساعات العمل",
      render: (row) => `${row.working_hours.from} - ${row.working_hours.to}`,
    },
    {
      key: "completed_requests_this_month",
      title: "طلبات هذا الشهر",
      render: (row) => row.completed_requests_this_month,
    },
    {
      key: "joined_at",
      title: "تاريخ الانضمام",
      render: (row) => row.joined_at,
    },
  ];

  return (
    <DashboardLayout>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
             <h2 style={{ marginBottom: "20px" }}>الأكثر نشاطًا هذا الشهر</h2>
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
