import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Table from "../../components/common/Table";
import { supportMock } from "../../mocks/support";
import { useSupportStore } from "../../store/supportStore";

export default function SupportPage() {
  const { search, statusFilter, setSearch, setStatusFilter } =
    useSupportStore();

  const filteredTickets = supportMock.filter((ticket) => {
    const matchesSearch =
      ticket.title.includes(search) ||
      ticket.message.includes(search) ||
      ticket.customer.includes(search);

    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: "customer", title: "العميل" },
    { key: "title", title: "العنوان" },
    { key: "message", title: "الرسالة" },
    { key: "date", title: "التاريخ" },
    { key: "status", title: "الحالة" },
  ];

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>الشكاوى والدعم</h2>

      {/* Filters */}
      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Input
            label="بحث"
            placeholder="ابحث بالعنوان أو الرسالة أو العميل"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            label="الحالة"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "all", label: "الكل" },
              { value: "جديدة", label: "جديدة" },
              { value: "قيد المراجعة", label: "قيد المراجعة" },
              { value: "مغلقة", label: "مغلقة" },
            ]}
          />
        </div>
      </Card>

      {/* Support Table */}
      <Table columns={columns} data={filteredTickets} />
    </DashboardLayout>
  );
}
