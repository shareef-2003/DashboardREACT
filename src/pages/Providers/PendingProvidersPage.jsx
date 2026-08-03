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
  const [rejectModal, setRejectModal] = useState({
    open: false,
    providerId: null,
    reason: "",
  });

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
        <div style={{ display: "flex" }}>
<Button
  small
  variant="primary"
  onClick={() => navigate(`/providers/pending/${row.id}`, { state: row })}
>
  عرض الطلب
</Button>



      
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      {rejectModal.open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Card style={{ width: "400px", padding: "20px" }}>
            <h3 style={{ marginBottom: "15px" }}>رفض مقدم الخدمة</h3>

            <label>سبب الرفض</label>
            <textarea
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
              value={rejectModal.reason}
              onChange={(e) =>
                setRejectModal((prev) => ({ ...prev, reason: e.target.value }))
              }
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                variant="danger"
                onClick={async () => {
                  try {
                    await rejectProvider(
                      rejectModal.providerId,
                      rejectModal.reason,
                    );

                    setProviders((prev) =>
                      prev.filter((p) => p.id !== rejectModal.providerId),
                    );

                    setRejectModal({
                      open: false,
                      providerId: null,
                      reason: "",
                    });
                  } catch {
                    alert("فشل رفض مقدم الخدمة.");
                  }
                }}
              >
                تأكيد الرفض
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setRejectModal({
                    open: false,
                    providerId: null,
                    reason: "",
                  })
                }
              >
                إلغاء
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
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
