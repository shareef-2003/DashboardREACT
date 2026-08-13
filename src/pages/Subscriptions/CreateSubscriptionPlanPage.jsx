import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { createSubscriptionPlan } from "../../services/subscriptionsService";
import { useNavigate } from "react-router-dom";

export default function CreateSubscriptionPlanPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "paid",
    requests_per_month: "",
    price: "",
    duration_in_days: "",
    description: "",
    is_active: false,
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      await createSubscriptionPlan(form);
      navigate("/admin/subscription-plans");
    } catch (error) {
      console.log(error.response?.data);
      alert("حدث خطأ أثناء إنشاء الخطة");
    }
  };

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>إضافة خطة اشتراك جديدة</h2>

      <Card style={{ padding: "20px", maxWidth: "600px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>نوع الخطة</label>
          <select
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          >
            <option value="free">مجانية</option>
            <option value="paid">مدفوعة</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>عدد الطلبات شهرياً</label>
          <input
            type="number"
            value={form.requests_per_month}
            onChange={(e) => handleChange("requests_per_month", e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>السعر (ل.س)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>المدة (يوم)</label>
          <input
            type="number"
            value={form.duration_in_days}
            onChange={(e) => handleChange("duration_in_days", e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>الوصف</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "5px", height: "120px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange("is_active", e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            فعّالة؟
          </label>
        </div>

        <Button variant="primary" onClick={handleSubmit}>
          إنشاء الخطة
        </Button>
      </Card>
    </DashboardLayout>
  );
}
