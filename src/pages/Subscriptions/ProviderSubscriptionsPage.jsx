import { useEffect, useState } from "react";
import { getProviderSubscriptions } from "../../services/subscriptionsService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function ProviderSubscriptionsPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadSubs = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getProviderSubscriptions(filters);
      setSubs(data.data); // لأن الـ API يعيد data.data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubs();
  }, []);

  const columns = [
    { key: "provider_name", title: "اسم مقدم الخدمة" },
    { key: "plan_name", title: "نوع الخطة" },
    { key: "starts_at", title: "تاريخ البدء" },
    { key: "ends_at", title: "تاريخ الانتهاء" },
    { key: "status", title: "الحالة" },
    { key: "used_requests", title: "الطلبات المستخدمة" },
    { key: "requests_limit", title: "حد الطلبات" },
    {
      key: "actions",
      title: "الإجراءات",
      render: (row) => (
        <Button
          variant="primary"
          onClick={() =>
            (window.location.href = `/admin/provider-subscriptions/${row.id}`)
          }
        >
          عرض التفاصيل
        </Button>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>اشتراكات مقدمي الخدمة</h2>

      {/* Filters */}
      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Button variant="primary" onClick={() => loadSubs({})}>
            كل الاشتراكات
          </Button>

          <Button
            variant="primary"
            onClick={() => loadSubs({ status: "pending_payment" })}
          >
            بانتظار الدفع
          </Button>

          <Button
            variant="primary"
            onClick={() => loadSubs({ status: "active" })}
          >
            فعّالة
          </Button>

          <Button
            variant="primary"
            onClick={() => loadSubs({ status: "cancelled" })}
          >
            ملغاة
          </Button>

          <Button
            variant="primary"
            onClick={() => loadSubs({ subscription_id: 2 })}
          >
            خطة رقم 2
          </Button>

          <input
            type="text"
            placeholder="بحث باسم مقدم الخدمة"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "10px", width: "200px" }}
          />

          <Button
            variant="outline"
            onClick={() => loadSubs({ provider_search: search })}
          >
            بحث
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: "20px" }}>
        <Table columns={columns} data={subs} />
      </Card>
    </DashboardLayout>
  );
}
