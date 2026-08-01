import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { subscriptionsMock } from "../../mocks/subscriptions";
import { useSubscriptionsStore } from "../../store/subscriptionsStore";

export default function SubscriptionsPage() {
  const { search, planFilter, setSearch, setPlanFilter } =
    useSubscriptionsStore();

  const filteredSubscriptions = subscriptionsMock.filter((sub) => {
    const matchesSearch =
      sub.provider.includes(search) || sub.email.includes(search);

    const matchesPlan =
      planFilter === "all" || sub.plan === planFilter;

    return matchesSearch && matchesPlan;
  });

  const columns = [
    { key: "provider", title: "مقدم الخدمة" },
    { key: "email", title: "البريد الإلكتروني" },
    { key: "plan", title: "الباقة" },
    { key: "expiry", title: "تاريخ الانتهاء" },
    {
      key: "actions",
      title: "إدارة",
      render: () => <Button small>تغيير الباقة</Button>,
    },
  ];

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>إدارة الاشتراكات</h2>

      {/* Filters */}
      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Input
            label="بحث"
            placeholder="ابحث باسم مقدم الخدمة أو البريد"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            label="الباقة"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            options={[
              { value: "all", label: "الكل" },
              { value: "Free", label: "Free" },
              { value: "Plus", label: "Plus" },
            ]}
          />
        </div>
      </Card>

      {/* Subscriptions Table */}
      <Table columns={columns} data={filteredSubscriptions} />
    </DashboardLayout>
  );
}
