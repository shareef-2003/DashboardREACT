import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { getSubscriptionPlanDetails } from "../../services/subscriptionsService";

export default function SubscriptionDetailsPage() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDetails = async () => {
    try {
      const data = await getSubscriptionPlanDetails(id);
      setPlan(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  if (loading) return <Loader />;
  if (!plan) return <div>لا توجد بيانات</div>;

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>تفاصيل خطة الاشتراك</h2>

      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "10px" }}>
          {plan.type === "free" ? "خطة مجانية" : "خطة مدفوعة"}
        </h3>

        <p>
          <strong>الوصف:</strong> {plan.description}
        </p>
        <p>
          <strong>السعر:</strong> {plan.price.toLocaleString()} ل.س
        </p>
        <p>
          <strong>عدد الطلبات شهرياً:</strong> {plan.requests_per_month}
        </p>
        <p>
          <strong>المدة:</strong> {plan.duration_in_days} يوم
        </p>
        <p>
          <strong>الحالة:</strong> {plan.is_active ? "فعّالة" : "غير فعّالة"}
        </p>
        <p>
          <strong>مشتركين نشطين:</strong> {plan.active_subscribers_count}
        </p>
        <p>
          <strong>إجمالي المشتركين:</strong> {plan.total_subscribers_count}
        </p>
        <p>
          <strong>تاريخ الإنشاء:</strong> {plan.created_at}
        </p>
      </Card>
    </DashboardLayout>
  );
}
