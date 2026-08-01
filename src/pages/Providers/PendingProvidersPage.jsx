import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { getPendingProviders } from "../../services/providersService";

export default function PendingProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
   const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPendingProviders();
        setProviders(data);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "فشل جلب مقدمي الخدمة بانتظار الموافقة.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);
const handleApprove = async (id) => {
  try {
    await approveProvider(id);

    // إزالة المزود من القائمة بعد قبوله
    setProviders((prev) => prev.filter((p) => p.id !== id));
  } catch (err) {
    alert("فشل قبول مقدم الخدمة.");
  }
};

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      return (
        p.full_name?.includes(search) ||
        p.category?.includes(search) ||
        p.service_area?.city?.includes(search) ||
        p.service_area?.area?.includes(search)
      );
    });
  }, [providers, search]);

  const columns = [
    {
      key: "full_name",
      title: "الاسم",
      render: (row) => row.full_name,
    },
    {
      key: "category",
      title: "التصنيف",
      render: (row) => row.category,
    },
    {
      key: "service_area",
      title: "المنطقة",
      render: (row) => `${row.service_area.city} - ${row.service_area.area}`,
    },
    {
      key: "inspection_price",
      title: "سعر المعاينة",
    },
    {
      key: "experience_years",
      title: "سنوات الخبرة",
    },
    {
      key: "requested_at",
      title: "تاريخ الطلب",
    },
   {
  key: "actions",
  title: "الإجراءات",
  render: (row) => (
    <div style={{ display: "flex", gap: "10px" }}>
      <Button
        small
        variant="primary"
        onClick={() => navigate(`/providers/pending/${row.id}`)}
      >
        عرض الطلب
      </Button>

      <Button
        small
        variant="success"
        onClick={() => handleApprove(row.id)}
      >
        قبول
      </Button>
    </div>
  ),
}

  ];

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
         <h2 style={{ marginBottom: "20px" }}>طلبات مقدمي الخدمة</h2>
<Button onClick={() => navigate(-1)} variant="outline">
        العودة
      </Button>
</div>
 
      <Card style={{ marginBottom: "20px" }}>
        <Input
          label="بحث"
          placeholder="ابحث بالاسم أو التصنيف أو المنطقة"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {error && (
        <Card style={{ color: "var(--danger)", marginBottom: "20px" }}>
          {error}
        </Card>
      )}

      <Table columns={columns} data={filteredProviders} />
    </DashboardLayout>
  );
}
