import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/common/Table";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { useProvidersStore } from "../../store/providersStore";

import {
  deleteProvider,
  getFilteredProviders,
  blockProvider,
  unblockProvider,
} from "../../services/providersService";

const statusLabels = {
  active: "نشط",
  blocked: "محظور",
  pending: "بانتظار",
  rejected: "مرفوض",
};

export default function ProvidersPage() {
  const navigate = useNavigate();
  const { search, statusFilter, setSearch, setStatusFilter } =
    useProvidersStore();

  // -------------------- فلترة المزودين --------------------
  const [filters, setFilters] = useState({
    area_id: "",
    category_id: "",
    subscription_id: "",
    search: "",
    sort_by: "",
    sort_direction: "",
  });

  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFiltered = async () => {
    try {
      const data = await getFilteredProviders(filters);
      setFilteredProviders(data);
    } catch (err) {
      console.error(err);
      setError("فشل جلب البيانات من الخادم.");
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    loadFiltered();
  }, [filters]);
  // ---------------------------------------------------------

  // -------------------- الإحصائيات --------------------
  const totalProviders = filteredProviders.length;
  const activeProvidersCount = filteredProviders.filter(
    (p) => p.account_status === "active",
  ).length;
  const subscribedProvidersCount = filteredProviders.filter(
    (p) => p.subscription,
  ).length;
  // ---------------------------------------------------------

  const columns = [
    {
      key: "name",
      title: "الاسم",
      render: (row) => row.name || "-",
    },
    {
      key: "category",
      title: "التصنيف",
      render: (row) => row.category || "-",
    },
    {
      key: "service_area",
      title: "المنطقة",
      render: (row) =>
        row.service_area
          ? `${row.service_area.city} - ${row.service_area.area}`
          : "-",
    },
    {
      key: "account_status",
      title: "الحالة",
      render: (row) => statusLabels[row.account_status] || row.account_status,
    },
    {
      key: "subscription",
      title: "الاشتراك",
      render: (row) => row.subscription || "بدون",
    },
    {
      key: "joined_at",
      title: "تاريخ الانضمام",
      render: (row) => row.joined_at || "-",
    },
    {
      key: "actions",
      title: "الإجراءات",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button
            small
            variant="primary"
            onClick={() => navigate(`/providers/${row.id}`)}
          >
            عرض التفاصيل
          </Button>

          {row.account_status === "active" && (
            <Button small variant="danger" onClick={() => handleBlock(row.id)}>
              حظر
            </Button>
          )}

          {row.account_status === "blocked" && (
            <Button
              small
              variant="success"
              onClick={() => handleUnblock(row.id)}
            >
              فك الحظر
            </Button>
          )}

          <Button
            small
            variant="outline-danger"
            onClick={() => handleDelete(row.id)}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المزود؟")) return;

    try {
      await deleteProvider(id);
      setFilteredProviders((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("فشل حذف المزود.");
    }
  };

  const handleBlock = async (id) => {
    try {
      await blockProvider(id);
      setFilteredProviders((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, account_status: "blocked" } : p,
        ),
      );
    } catch {
      alert("فشل حظر المزود.");
    }
  };

  const handleUnblock = async (id) => {
    try {
      await unblockProvider(id);
      setFilteredProviders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, account_status: "active" } : p)),
      );
    } catch {
      alert("فشل فك الحظر.");
    }
  };

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>مقدمو الخدمات</h2>

      {/* أزرار الصفحات */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Button
          variant="outline"
          onClick={() => navigate("/providers/pending")}
        >
          طلبات بانتظار الموافقة
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/providers/rejected")}
        >
          المزودون المرفوضون
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/providers/blocked")}
        >
          المزودون المحظورون
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/providers/subscriptions-report")}
        >
          تقرير الاشتراكات
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/providers/most-active")}
        >
          الأكثر نشاطًا هذا الشهر
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/providers/most-complained")}
        >
          الأكثر شكاوى
        </Button>
      </div>

      {/* الإحصائيات */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Card>
          <h4>إجمالي مقدمي الخدمة</h4>
          <p>{totalProviders}</p>
        </Card>

        <Card>
          <h4>المزودون النشطون</h4>
          <p>{activeProvidersCount}</p>
        </Card>

        <Card>
          <h4>المزودون المشتركين</h4>
          <p>{subscribedProvidersCount}</p>
        </Card>
      </div>

      {/* الفلاتر */}
      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <select onChange={(e) => updateFilter("area_id", e.target.value)}>
            <option value="">اختر المنطقة</option>
            <option value="1">المزة</option>
            <option value="2">كفرسوسة</option>
            <option value="3">المالكي</option>
          </select>

          <select onChange={(e) => updateFilter("category_id", e.target.value)}>
            <option value="">اختر التصنيف</option>
            <option value="6">النظافة الشاملة</option>
            <option value="7">النجارة</option>
          </select>

          <select
            onChange={(e) => updateFilter("subscription_id", e.target.value)}
          >
            <option value="">نوع الاشتراك</option>
            <option value="1">مجاني</option>
            <option value="2">مدفوع</option>
          </select>

          <input
            type="text"
            placeholder="ابحث بالاسم"
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>
      </Card>

      {error && (
        <Card style={{ marginBottom: "20px", color: "var(--danger)" }}>
          {error}
        </Card>
      )}

      <Table columns={columns} data={filteredProviders} />
    </DashboardLayout>
  );
}
