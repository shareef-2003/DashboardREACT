import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import {
  getProviderSubscriptionDetails,
  activateProviderSubscription,
} from "../../services/subscriptionsService";

export default function ProviderSubscriptionDetailsPage() {
  const { id } = useParams();
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDetails = async () => {
    try {
      const data = await getProviderSubscriptionDetails(id);
      setSub(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>
        تفاصيل اشتراك مقدم الخدمة رقم {id}
      </h2>

      <Card style={{ padding: "20px" }}>
        <p>
          <strong>اسم مقدم الخدمة:</strong> {sub.provider_name}
        </p>
        <p>
          <strong>نوع الخطة:</strong> {sub.plan_name}
        </p>
        <p>
          <strong>نوع الخطة (كود):</strong> {sub.plan_type}
        </p>
        <p>
          <strong>تاريخ البدء:</strong> {sub.starts_at}
        </p>
        <p>
          <strong>تاريخ الانتهاء:</strong> {sub.ends_at}
        </p>
        <p>
          <strong>الحالة:</strong> {sub.status}
        </p>
        <p>
          <strong>الطلبات المستخدمة:</strong> {sub.used_requests}
        </p>
        <p>
          <strong>حد الطلبات:</strong> {sub.requests_limit}
        </p>
        <p>
          <strong>المبلغ المدفوع:</strong> {sub.price_paid}
        </p>
        <p>
          <strong>اشتراك مجاني (هدية):</strong>{" "}
          {sub.is_complimentary ? "نعم" : "لا"}
        </p>

        <div style={{ marginTop: "20px" }}>
          <Button variant="outline" onClick={() => window.history.back()}>
            رجوع
          </Button>

          <Button
            variant="primary"
            onClick={async () => {
              try {
                const updated = await activateProviderSubscription(id);
                alert("تم تفعيل الاشتراك بنجاح");
                window.location.href = "/admin/provider-subscriptions"; // العودة للصفحة الرئيسية// تحديث البيانات بعد التفعيل
              } catch (error) {
                alert(error.response?.data?.message || "حدث خطأ أثناء التفعيل");
              }
            }}
          >
            تفعيل الاشتراك
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
