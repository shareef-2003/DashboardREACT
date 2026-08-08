import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/common/Table";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import {
  getBlockedCustomers,
  unblockCustomer,
} from "../../services/customerService";
import { useNavigate } from "react-router-dom";

export default function BlockedCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getBlockedCustomers();
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  };
  const handleUnblock = async (id) => {
    if (!confirm("هل أنت متأكد من فك الحظر عن هذا الزبون؟")) return;

    try {
      await unblockCustomer(id);
      alert("تم فك الحظر عن الزبون بنجاح.");
      loadCustomers(); // إعادة تحميل القائمة بعد فك الحظر
    } catch (error) {
      alert("حدث خطأ أثناء فك الحظر.");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const columns = [
    {
      key: "full_name",
      title: "الاسم",
      render: (row) => row.full_name,
    },
    {
      key: "phone_number",
      title: "رقم الهاتف",
      render: (row) => row.phone_number,
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
      key: "block_reason",
      title: "سبب الحظر",
      render: (row) => row.block_reason,
    },
    {
      key: "blocked_until",
      title: "محظور حتى",
      render: (row) => row.blocked_until,
    },
    {
      key: "remaining_block_days",
      title: "الأيام المتبقية",
      render: (row) => row.remaining_block_days,
    },
    {
      key: "actions",
      title: "إجراءات",
      render: (row) => (
        <Button variant="success" onClick={() => handleUnblock(row.id)}>
          فك الحظر
        </Button>
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
        <h2>الزبائن المحظورين</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          العودة
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={customers} />
      </Card>
    </DashboardLayout>
  );
}
