import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { getRejectedProviders } from "../../services/providersService";
import Button from "../../components/common/Button";
import { reconsiderProvider } from "../../services/providersService";

export default function RejectedProviderDetailsPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reconsiderModal, setReconsiderModal] = useState({
    open: false,
    reason: provider?.rejection_reason || "",
  });

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
      {reconsiderModal.open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Card style={{ width: "400px", padding: "20px" }}>
            <h3>إعادة النظر في الطلب</h3>

            <label>سبب الرفض (اختياري)</label>
            <textarea
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
              value={reconsiderModal.reason}
              onChange={(e) =>
                setReconsiderModal((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                variant="success"
                onClick={async () => {
                  await reconsiderProvider(provider.id, "approved", null);
                  alert("تم قبول مقدم الخدمة بعد إعادة النظر.");
                  navigate("/providers/rejected");
                }}
              >
                قبول بعد إعادة النظر
              </Button>

              <Button
                variant="danger"
                onClick={async () => {
                  await reconsiderProvider(
                    provider.id,
                    "rejected",
                    reconsiderModal.reason,
                  );
                  alert("تم تحديث سبب الرفض.");
                  navigate("/providers/rejected");
                }}
              >
                حفظ سبب الرفض
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setReconsiderModal({
                    open: false,
                    reason: provider.rejection_reason,
                  })
                }
              >
                إلغاء
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            <div>
              <strong>الاسم:</strong> {provider.full_name}
            </div>
            <div>
              <strong>رقم الهاتف:</strong> {provider.phone_number}
            </div>
            <div>
              <strong>التصنيف:</strong> {provider.category}
            </div>
            <div>
              <strong>سعر المعاينة:</strong> {provider.inspection_price}
            </div>
            <div>
              <strong>سنوات الخبرة:</strong> {provider.experience_years}
            </div>
            <div>
              <strong>ساعات العمل:</strong> {provider.working_hours.from} -{" "}
              {provider.working_hours.to}
            </div>
            <div>
              <strong>المنطقة:</strong> {provider.service_area.city} -{" "}
              {provider.service_area.area}
            </div>
            <div>
              <strong>الموقع:</strong> {provider.location.latitude},{" "}
              {provider.location.longitude}
            </div>
            <div>
              <strong>تاريخ الطلب:</strong> {provider.requested_at}
            </div>
            <div>
              <strong>سبب الرفض:</strong> {provider.rejection_reason}
            </div>
          </div>
          <Button
            variant="success"
            onClick={() =>
              setReconsiderModal({
                open: true,
                reason: provider.rejection_reason || "",
              })
            }
          >
            إعادة النظر
          </Button>
        </Card>
      )}
    </DashboardLayout>
  );
}
