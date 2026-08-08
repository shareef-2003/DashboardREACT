import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getBlockedProvidersByCustomer } from "../../services/blockedProvidersService";

export default function BlockedProvidersByCustomerPage() {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getBlockedProvidersByCustomer(customerId);
      setProviders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [customerId]);

  const columns = [
    { key: "provider_name", title: "مقدم الخدمة", render: (row) => row.provider_name },
    {
      key: "provider_image",
      title: "الصورة",
      render: (row) =>
        row.provider_image ? (
          <img src={row.provider_image} alt="" style={{ width: "50px", borderRadius: "8px" }} />
        ) : (
          "لا يوجد"
        ),
    },
    { key: "blocked_at", title: "تاريخ الحظر", render: (row) => row.blocked_at },
    {
      key: "previous_requests",
      title: "آخر طلب بينهم",
      render: (row) =>
        row.has_previous_requests ? (
          <div>
            <div>عدد الطلبات: {row.previous_requests.count}</div>
            <div>آخر طلب: {row.previous_requests.last_request_id}</div>
            <div>الحالة: {row.previous_requests.last_request_status}</div>
            <div>التاريخ: {row.previous_requests.last_request_date}</div>
          </div>
        ) : (
          "لا يوجد طلبات سابقة"
        ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>مقدمو الخدمة المحظورون من الزبون رقم {customerId}</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          العودة
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={providers} />
      </Card>
    </DashboardLayout>
  );
}
