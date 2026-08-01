import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/common/Table";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Card from "../../components/common/Card";
import { ordersMock } from "../../mocks/orders";
import { useOrdersStore } from "../../store/ordersStore";

export default function OrdersPage() {
  const { search, statusFilter, setSearch, setStatusFilter } =
    useOrdersStore();

  const filteredOrders = ordersMock.filter((order) => {
    const matchesSearch =
      order.service.includes(search) ||
      order.customer.includes(search) ||
      order.provider.includes(search);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: "id", title: "رقم الطلب" },
    { key: "service", title: "الخدمة" },
    { key: "customer", title: "العميل" },
    { key: "provider", title: "مقدم الخدمة" },
    { key: "date", title: "التاريخ" },
    { key: "status", title: "الحالة" },
  ];

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>إدارة الطلبات</h2>

      {/* Filters */}
      <Card style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <Input
            label="بحث"
            placeholder="ابحث باسم الخدمة أو العميل"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            label="الحالة"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "all", label: "الكل" },
              { value: "قيد الانتظار", label: "قيد الانتظار" },
              { value: "قيد التنفيذ", label: "قيد التنفيذ" },
              { value: "مكتملة", label: "مكتملة" },
              { value: "ملغاة", label: "ملغاة" },
            ]}
          />
        </div>
      </Card>

      {/* Orders Table */}
      <Table columns={columns} data={filteredOrders} />
    </DashboardLayout>
  );
}
