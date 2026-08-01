import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/common/Table";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Card from "../../components/common/Card";
import Stars from "../../components/common/Stars";
import { reviewsMock } from "../../mocks/reviews";
import { useReviewsStore } from "../../store/reviewsStore";

export default function ReviewsPage() {
  const { search, ratingFilter, setSearch, setRatingFilter } =
    useReviewsStore();

  const filteredReviews = reviewsMock.filter((review) => {
    const matchesSearch =
      review.customer.includes(search) ||
      review.provider.includes(search) ||
      review.comment.includes(search);

    const matchesRating =
      ratingFilter === "all" || review.rating === Number(ratingFilter);

    return matchesSearch && matchesRating;
  });

  const columns = [
    { key: "customer", title: "العميل" },
    { key: "provider", title: "مقدم الخدمة" },
    {
      key: "rating",
      title: "التقييم",
      render: (value) => <Stars rating={value} />,
    },
    { key: "comment", title: "التعليق" },
    { key: "date", title: "التاريخ" },
  ];

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>المراجعات والتقييمات</h2>

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
            placeholder="ابحث بالعميل أو مقدم الخدمة أو التعليق"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            label="التقييم"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            options={[
              { value: "all", label: "الكل" },
              { value: "5", label: "5 نجوم" },
              { value: "4", label: "4 نجوم" },
              { value: "3", label: "3 نجوم" },
              { value: "2", label: "2 نجوم" },
              { value: "1", label: "1 نجمة" },
            ]}
          />
        </div>
      </Card>

      {/* Reviews Table */}
      <Table
        columns={columns}
        data={filteredReviews.map((r) => ({
          ...r,
          rating: <Stars rating={r.rating} />,
        }))}
      />
    </DashboardLayout>
  );
}
