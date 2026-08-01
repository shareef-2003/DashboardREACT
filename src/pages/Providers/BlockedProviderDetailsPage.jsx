import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { getBlockedProviders, unblockProvider } from "../../services/providersService";
import Button from "../../components/common/Button";

export default function BlockedProviderDetailsPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const all = await getBlockedProviders();
      const found = all.find((p) => p.id == providerId);
      setProvider(found || null);
      setLoading(false);
    };

    load();
  }, [providerId]);

  const handleUnblock = async () => {
    try {
      await unblockProvider(providerId);
      navigate("/providers/blocked");
    } catch {
      alert("فشل فك الحظر.");
    }
  };

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
        <h2>تفاصيل المزود المحظور</h2>
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
            <div><strong>المنطقة:</strong> {provider.area}</div>
            <div><strong>سعر المعاينة:</strong> {provider.inspection_price}</div>
            <div><strong>سنوات الخبرة:</strong> {provider.experience_years}</div>
            <div><strong>التقييم:</strong> {provider.rating}</div>
            <div><strong>ساعات العمل:</strong> {provider.working_hours.from} - {provider.working_hours.to}</div>
            <div><strong>الموقع:</strong> {provider.location.latitude}, {provider.location.longitude}</div>
            <div><strong>سبب الحظر:</strong> {provider.block_reason}</div>
            <div><strong>محظور حتى:</strong> {provider.blocked_until}</div>
            <div><strong>المدة المتبقية:</strong> {provider.remaining_block_time}</div>
            <div><strong>تاريخ الانضمام:</strong> {provider.joined_at}</div>

            <Button
              variant="success"
              onClick={handleUnblock}
              style={{ marginTop: "20px" }}
            >
              فك الحظر
            </Button>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
