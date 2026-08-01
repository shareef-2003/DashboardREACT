import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import { useVerificationStore } from "../../store/verificationStore";
import { getPendingProviders } from "../../services/providersService";

export default function VerificationPage() {
  const { search, statusFilter, setSearch, setStatusFilter } =
    useVerificationStore();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProviders = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getPendingProviders();
        setProviders(data);
      } catch (err) {
        console.error(err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "فشل جلب طلبات مزودي الخدمة المعلقة من الخادم.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, []);

  const filteredProviders = useMemo(
    () =>
      providers.filter((provider) => {
        const normalizedSearch = search.trim();
        const matchesSearch =
          !normalizedSearch ||
          provider.full_name?.includes(normalizedSearch) ||
          provider.phone_number?.includes(normalizedSearch) ||
          provider.category?.includes(normalizedSearch);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "pending" &&
            (provider.account_status === "pending" ||
              provider.account_status === undefined));

        return matchesSearch && matchesStatus;
      }),
    [providers, search, statusFilter],
  );

  const columns = [
    { key: "full_name", title: "مقدم الخدمة" },
    { key: "phone_number", title: "رقم الهاتف" },
    { key: "category", title: "التصنيف" },
    {
      key: "documents",
      title: "الوثائق",
      render: (row) => {
        const docs = row.documents;

        if (!docs || docs.length === 0) return "لا يوجد وثائق";

        return docs.map((item, index) => (
          <span key={item.id || item.url || index}>
            {item.url || item}
            {index < docs.length - 1 ? " - " : ""}
          </span>
        ));
      },
    },
    {
      key: "service_area",
      title: "المنطقة",
      render: (row) =>
        row.service_area
          ? `${row.service_area.city} - ${row.service_area.area}`
          : "-",
    },
    { key: "inspection_price", title: "سعر المعاينة" },
    { key: "requested_at", title: "تاريخ الطلب" },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>توثيق مقدمي الخدمات</h2>

      <Card style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Input
            label="بحث"
            placeholder="ابحث بالاسم أو رقم الهاتف أو التصنيف"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            label="الحالة"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "all", label: "الكل" },
              { value: "pending", label: "بانتظار التوثيق" },
            ]}
          />
        </div>
      </Card>

      <Card style={{ marginBottom: "20px", color: "var(--muted)" }}>
        تعرض هذه الصفحة طلبات التوثيق المعلقة فقط. الباك الحالي لا يوفر بعد
        نقاط قبول أو رفض، لذلك لا يتم إرسال أي طلب غير مدعوم.
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
