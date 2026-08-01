import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { getRejectedProviders } from "../../services/providersService";
import Button from "../../components/common/Button";

export default function RejectedProviderDetailsPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const all = await getRejectedProviders();
      const found = all.find((p) => p.id == providerId);
      setProvider(found || null);
      setLoading(false);
    };

    load();
  }, [providerId]);

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
        <h2>تفاصيل المزود المرفوض</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          العودة
        </Button>
      </div>

      {!provider ? (
        <Card>لا توجد بيانات.</Card>
      ) : (
        <Card>
          <div style={{ display: "grid", gap: "12px" }}>
            <div><strong>الاسم:</strong> {provider.full_name}</div>
            <div><strong>رقم الهاتف:</strong> {provider.phone_number}</div>
            <div><strong>التصنيف:</strong> {provider.category}</div>
            <div><strong>سعر المعاينة:</strong> {provider.inspection_price}</div>
            <div><strong>سنوات الخبرة:</strong> {provider.experience_years}</div>
            <div><strong>ساعات العمل:</strong> {provider.working_hours.from} - {provider.working_hours.to}</div>
            <div><strong>المنطقة:</strong> {provider.service_area.city} - {provider.service_area.area}</div>
            <div><strong>الموقع:</strong> {provider.location.latitude}, {provider.location.longitude}</div>
            <div><strong>تاريخ الطلب:</strong> {provider.requested_at}</div>
            <div><strong>سبب الرفض:</strong> {provider.rejection_reason}</div>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
