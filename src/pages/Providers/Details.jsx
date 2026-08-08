import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import {
  getProviderDetails,
  giveComplimentaryMonth,
} from "../../services/providersService";

const statusLabels = {
  active: "نشط",
  blocked: "محظور",
  pending: "بانتظار",
  rejected: "مرفوض",
};

export default function ProviderDetailsPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const data = await getProviderDetails(providerId);
        setProvider(data);
      } catch (err) {
        console.error(err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "فشل جلب تفاصيل مقدم الخدمة.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (!providerId || isNaN(providerId)) {
      setError("معرّف المزود غير صالح.");
      setLoading(false);
      return;
    }

    loadProvider();
  }, [providerId]);

  const handleComplimentaryMonth = async (providerId) => {
    if (!confirm("هل تريد منح هذا المزود شهراً مجانياً؟")) return;

    try {
      const res = await giveComplimentaryMonth(providerId);
      alert("تم منح شهر مجاني بنجاح");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء منح الشهر المجاني");
    }
  };

  const providerName = useMemo(() => {
    if (!provider) return "---";
    return [provider.first_name, provider.last_name].filter(Boolean).join(" ");
  }, [provider]);

  if (loading) {
    return <Loader />;
  }

  return (
    <DashboardLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 style={{ marginBottom: "8px" }}>تفاصيل مقدم الخدمة</h2>
          <p style={{ color: "var(--muted)" }}>{providerName}</p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline">
          العودة
        </Button>
      </div>

      {error && (
        <Card style={{ marginBottom: "20px", color: "var(--danger)" }}>
          {error}
        </Card>
      )}

      {provider ? (
        <div style={{ display: "grid", gap: "20px" }}>
          <Card>
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <strong>الاسم:</strong> {providerName || "-"}
              </div>
              <div>
                <strong>رقم الهاتف:</strong> {provider.phone_number || "-"}
              </div>
              <div>
                <strong>التصنيف:</strong> {provider.service_category || "-"}
              </div>
              <div>
                <strong>المنطقة:</strong>{" "}
                {provider.service_area
                  ? `${provider.service_area.city} - ${provider.service_area.area}`
                  : "-"}
              </div>
              <div>
                <strong>سعر المعاينة:</strong>{" "}
                {provider.inspection_price || "-"}
              </div>
              <div>
                <strong>سنوات الخبرة:</strong>{" "}
                {provider.experience_years || "-"}
              </div>
              <div>
                <strong>ساعات العمل:</strong>{" "}
                {provider.working_hours?.from || "-"} -{" "}
                {provider.working_hours?.to || "-"}
              </div>
              <div>
                <strong>الحالة:</strong>{" "}
                {statusLabels[provider.account_status] ||
                  provider.account_status ||
                  "-"}
              </div>
              <div>
                <strong>حالة التوفر:</strong>{" "}
                {provider.availability_status || "-"}
              </div>
              <div>
                <strong>التقييم:</strong> {provider.rating || "-"}
              </div>
              <div>
                <strong>الاشتراك:</strong>{" "}
                {provider.subscription
                  ? provider.subscription.type
                  : "بدون اشتراك"}
              </div>
              {provider.subscription && (
                <>
                  <div>
                    <strong>طلبات الشهر:</strong>{" "}
                    {provider.subscription.requests_per_month || "-"}
                  </div>
                  <div>
                    <strong>الطلبات المستخدمة:</strong>{" "}
                    {provider.subscription.used_requests || "-"}
                  </div>
                  <div>
                    <strong>تبدأ من:</strong>{" "}
                    {provider.subscription.starts_at || "-"}
                  </div>
                  <div>
                    <strong>تنتهي في:</strong>{" "}
                    {provider.subscription.ends_at || "-"}
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card>
            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <strong>السيرة الذاتية:</strong>
                <p style={{ margin: "8px 0 0" }}>{provider.bio || "-"}</p>
              </div>
              <div>
                <strong>الموقع:</strong>
                <p style={{ margin: "8px 0 0" }}>
                  {provider.location?.latitude && provider.location?.longitude
                    ? `${provider.location.latitude}, ${provider.location.longitude}`
                    : "-"}
                </p>
              </div>
              <div>
                <strong>الوثائق:</strong>
                {provider.documents?.length ? (
                  <ul style={{ margin: "8px 0 0", paddingLeft: "18px" }}>
                    {provider.documents.map((document, index) => (
                      <li key={index}>{document}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: "8px 0 0" }}>لا توجد وثائق</p>
                )}
              </div>
              <div>
                <strong>صورة الملف الشخصي:</strong>
                <p style={{ margin: "8px 0 0" }}>
                  {provider.profile_image || "لا توجد صورة"}
                </p>
              </div>
              <Button
                variant="success"
                onClick={() => handleComplimentaryMonth(provider.id)}
              >
                منح شهر مجاني
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <Card>لا توجد بيانات لعرضها.</Card>
      )}
    </DashboardLayout>
  );
}
