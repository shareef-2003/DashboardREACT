import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { getRejectedProviders } from "../../services/providersService";
import { useNavigate } from "react-router-dom";

export default function RejectedProvidersPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRejectedProviders();
        setProviders(data);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "فشل جلب مقدمي الخدمة المرفوضين.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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
      render: (row) =>
        `${row.service_area.city} - ${row.service_area.area}`,
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
      key: "rejection_reason",
      title: "سبب الرفض",
      render: (row) => row.rejection_reason || "-",
    },
    {
      key: "requested_at",
      title: "تاريخ الطلب",
    },
  {
  key: "actions",
  title: "الإجراءات",
  render: (row) => (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        maxWidth: "180px",
      }}
    >
      <Button
        small
        variant="primary"
        onClick={() => navigate(`/providers/rejected/${row.id}`)}
      >
        عرض التفاصيل
      </Button>

      <Button
        small
        variant="success"
        onClick={() => handleReconsider(row.id)}
      >
        إعادة النظر
      </Button>
    </div>
  ),
}


  ];

  if (loading) return <Loader />;
const handleReconsider = async (id) => {
  try {
    await reconsiderProvider(id);

    // إزالة المزود من القائمة بعد إعادة النظر
    setProviders((prev) => prev.filter((p) => p.id !== id));
  } catch (err) {
    alert("فشل تنفيذ إعادة النظر.");
  }
};

  return (
    <DashboardLayout>
        
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>مقدمو الخدمة المرفوضون</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
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
