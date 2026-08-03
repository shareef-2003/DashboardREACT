import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  approveProvider,
  rejectProvider,
} from "../../services/providersService";

export default function PendingDetailsPage() {
  const { state: provider } = useLocation();
  const navigate = useNavigate();

  const [rejectModal, setRejectModal] = useState({
    open: false,
    reason: "",
  });

  if (!provider) {
    return (
      <DashboardLayout>
        <p>لا توجد بيانات لعرضها.</p>
      </DashboardLayout>
    );
  }

  const handleApprove = async () => {
    try {
      await approveProvider(provider.id);
      alert("تم قبول مقدم الخدمة.");
      navigate("/providers/pending");
    } catch (err) {
      console.log(err.response);
      alert("فشل قبول مقدم الخدمة.");
    }
  };
  

  const handleReject = async () => {
    try {
      await rejectProvider(provider.id, rejectModal.reason);
      alert("تم رفض مقدم الخدمة.");
      navigate("/providers/pending");
    } catch (err) {
      console.log(err.response);
      alert("فشل رفض مقدم الخدمة.");
    }
  };
  

  return (
    <DashboardLayout>
      <Button variant="outline" onClick={() => navigate(-1)}>
        العودة
      </Button>

      <h2 style={{ margin: "20px 0" }}>تفاصيل طلب مقدم الخدمة</h2>

      <Card>
        <p><strong>الاسم:</strong> {provider.full_name}</p>
        <p><strong>الهاتف:</strong> {provider.phone_number}</p>
        <p><strong>التصنيف:</strong> {provider.category}</p>
        <p><strong>سعر المعاينة:</strong> {provider.inspection_price}</p>
        <p><strong>سنوات الخبرة:</strong> {provider.experience_years}</p>
        <p><strong>المنطقة:</strong> {provider.service_area.city} - {provider.service_area.area}</p>
        <p><strong>تاريخ الطلب:</strong> {provider.requested_at}</p>
      </Card>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <Button variant="success" onClick={handleApprove}>
          قبول
        </Button>

        <Button
          variant="danger"
          onClick={() =>
            setRejectModal({
              open: true,
              reason: "",
            })
          }
        >
          رفض
        </Button>
      </div>

      {rejectModal.open && (
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
            <h3>رفض مقدم الخدمة</h3>

            <label>سبب الرفض</label>
            <textarea
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
              value={rejectModal.reason}
              onChange={(e) =>
                setRejectModal((prev) => ({ ...prev, reason: e.target.value }))
              }
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="danger" onClick={handleReject}>
                تأكيد الرفض
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setRejectModal({
                    open: false,
                    reason: "",
                  })
                }
              >
                إلغاء
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
