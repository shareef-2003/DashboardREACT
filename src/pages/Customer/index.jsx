import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/common/Table";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { getCustomers } from "../../services/customerService";

export default function CustomersPage() {
  const [filters, setFilters] = useState({
    area_id: "",
    search: "",
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers(filters);
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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
      key: "area",
      title: "المنطقة",
      render: (row) =>
        row.area ? `${row.area.city} - ${row.area.area}` : "-",
    },
    {
      key: "completed_requests",
      title: "الطلبات المكتملة",
      render: (row) => row.completed_requests,
    },
    {
      key: "joined_at",
      title: "تاريخ الانضمام",
      render: (row) => row.joined_at,
    },
  ];

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>الزبائن</h2>

      {/* Filters */}
      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <select
            onChange={(e) => updateFilter("area_id", e.target.value)}
            style={{ padding: "10px" }}
          >
            <option value="">اختر المنطقة</option>
            <option value="11">بستان الدور</option>
            <option value="12">القصاع</option>
            <option value="13">مشروع دمر</option>
            <option value="14">الشعلان</option>
            <option value="15">أبو رمانة</option>
          </select>

          <input
            type="text"
            placeholder="ابحث بالاسم أو الرقم"
            onChange={(e) => updateFilter("search", e.target.value)}
            style={{ padding: "10px", minWidth: "200px" }}
          />
        </div>
      </Card>

      {/* Table */}
      <Table columns={columns} data={customers} />
    </DashboardLayout>
  );
}
