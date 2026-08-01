import React, { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { getBlockedProviders, unblockProvider } from "../../services/providersService";
import { useNavigate } from "react-router-dom";

export default function BlockedProvidersPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBlockedProviders();
        setProviders(data);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "فشل جلب مقدمي الخدمة المحظورين.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleUnblock = async (id) => {
    try {
      await unblockProvider(id);
      setProviders((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("فشل فك الحظر.");
    }
  };

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      return (
        p.full_name?.includes(search) ||
        p.category?.includes(search) ||
        p.area?.includes(search)
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
      key: "area",
      title: "المنطقة",
      render: (row) => row.area,
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
      key: "block_reason",
      title: "سبب الحظر",
      render: (row) => row.block_reason,
    },
    {
      key: "remaining_block_time",
      title: "المدة المتبقية",
      render: (row) => row.remaining_block_time,
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
            maxWidth: "200px",
          }}
        >
          <Button
            small
            variant="primary"
            onClick={() => navigate(`/providers/blocked/${row.id}`)}
          >
            عرض التفاصيل
          </Button>

          <Button
            small
            variant="success"
            onClick={() => handleUnblock(row.id)}
          >
            فك الحظر
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>المزودون المحظورون</h2>
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
