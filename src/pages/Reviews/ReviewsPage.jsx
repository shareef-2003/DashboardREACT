import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/common/Table";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getReviews } from "../../services/reviewService";
import { useNavigate } from "react-router-dom";

export default function ReviewsPage() {
  const [filters, setFilters] = useState({
    provider_search: "",
    category_id: "",
    sort_by: "",
    per_page: 15,
  });

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews(filters);
      setReviews(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    loadReviews();
  };

  const columns = [
    { key: "provider_name", title: "مقدم الخدمة", render: (row) => row.provider_name },
    { key: "customer_name", title: "الزبون", render: (row) => row.customer_name },
    { key: "rating", title: "التقييم", render: (row) => row.rating },
    { key: "comment", title: "التعليق", render: (row) => row.comment || "-" },
    { key: "category", title: "نوع العطل", render: (row) => row.category?.name || "-" },
    { key: "created_at", title: "تاريخ التقييم", render: (row) => row.created_at },
  ];

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>تقييمات الزبائن</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>العودة</Button>
      </div>

      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          
          <input
            type="text"
            placeholder="بحث باسم مقدم الخدمة"
            onChange={(e) => updateFilter("provider_search", e.target.value)}
            style={{ padding: "10px", minWidth: "200px" }}
          />

          <select
            onChange={(e) => updateFilter("category_id", e.target.value)}
            style={{ padding: "10px" }}
          >
            <option value="">نوع العطل</option>
            <option value="1">كهرباء</option>
            <option value="2">سباكة</option>
            <option value="3">نجارة</option>
            {/* لاحقًا نربطها مع API حقيقي */}
          </select>

          <select
            onChange={(e) => updateFilter("sort_by", e.target.value)}
            style={{ padding: "10px" }}
          >
            <option value="">ترتيب</option>
            <option value="latest">الأحدث</option>
            <option value="highest_rated">الأعلى تقييمًا</option>
          </select>

          <select
            onChange={(e) => updateFilter("per_page", e.target.value)}
            style={{ padding: "10px" }}
          >
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>

          <Button onClick={applyFilters}>بحث</Button>
        </div>
      </Card>

      <Table columns={columns} data={reviews} />
    </DashboardLayout>
  );
}
