import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "../../services/subscriptionsService";
import { Link } from "react-router-dom";
import { div } from "motion/react-client";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPlans = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getSubscriptionPlans(filters);
      setPlans(data);
    } finally {
      setLoading(false);
    }
  };

  const [createModal, setCreateModal] = useState({
    open: false,
    type: "paid",
    requests_per_month: "",
    price: "",
    duration_in_days: "",
    description: "",
    is_active: false,
  });

  const [editModal, setEditModal] = useState({
    open: false,
    plan: null,
  });

  useEffect(() => {
    loadPlans(); // تحميل كل الخطط عند فتح الصفحة
  }, []);

  const columns = [
    {
      key: "type",
      title: "النوع",
      render: (row) => (row.type === "free" ? "مجانية" : "مدفوعة"),
    },
    { key: "requests_per_month", title: "عدد الطلبات شهرياً" },
    {
      key: "price",
      title: "السعر",
      render: (row) => `${row.price.toLocaleString()} ل.س`,
    },
    { key: "duration_in_days", title: "المدة (يوم)" },
    { key: "description", title: "الوصف" },
    { key: "active_subscribers_count", title: "مشتركين نشطين" },
    { key: "total_subscribers_count", title: "إجمالي المشتركين" },
    {
      key: "actions",
      title: "الإجراءات",
      render: (row) => (
        <div
          style={{
            padding: "5px",
          }}
        >
          <Button
            variant="primary"
            onClick={() => {
              window.location.href = `/admin/subscription-plans/${row.id}`;
            }}
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            عرض التفاصيل
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              setEditModal({
                open: true,
                plan: { ...row },
              })
            }
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            تعديل
          </Button>
          <Button
            style={{ padding: "6px 12px", fontSize: "13px" }}
            variant="danger"
            // style={{ padding: "6px 12px", fontSize: "13px" }}
            onClick={async () => {
              if (!window.confirm("هل أنت متأكد من حذف هذه الخطة؟")) return;

              try {
                await deleteSubscriptionPlan(row.id);
                alert("تم حذف خطة الاشتراك بنجاح");
                loadPlans(); // تحديث الجدول بعد الحذف
              } catch (error) {
                alert(
                  error.response?.data?.message || "حدث خطأ أثناء حذف الخطة",
                );
              }
            }}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      {editModal.open && (
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
          <Card style={{ width: "450px", padding: "20px" }}>
            <h3 style={{ marginBottom: "15px" }}>تعديل خطة الاشتراك</h3>

            <label>نوع الخطة</label>
            <select
              value={editModal.plan.type}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  plan: { ...prev.plan, type: e.target.value },
                }))
              }
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            >
              <option value="free">مجانية</option>
              <option value="paid">مدفوعة</option>
            </select>

            <label>عدد الطلبات شهرياً</label>
            <input
              type="number"
              value={editModal.plan.requests_per_month}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  plan: { ...prev.plan, requests_per_month: e.target.value },
                }))
              }
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            />

            <label>السعر (ل.س)</label>
            <input
              type="number"
              value={editModal.plan.price}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  plan: { ...prev.plan, price: e.target.value },
                }))
              }
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            />

            <label>المدة (يوم)</label>
            <input
              type="number"
              value={editModal.plan.duration_in_days}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  plan: { ...prev.plan, duration_in_days: e.target.value },
                }))
              }
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            />

            <label>الوصف</label>
            <textarea
              value={editModal.plan.description}
              onChange={(e) =>
                setEditModal((prev) => ({
                  ...prev,
                  plan: { ...prev.plan, description: e.target.value },
                }))
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                height: "100px",
              }}
            />

            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <input
                type="checkbox"
                checked={editModal.plan.is_active}
                onChange={(e) =>
                  setEditModal((prev) => ({
                    ...prev,
                    plan: { ...prev.plan, is_active: e.target.checked },
                  }))
                }
              />
              فعّالة؟
            </label>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    await updateSubscriptionPlan(editModal.plan.id, {
                      type: editModal.plan.type,
                      price: editModal.plan.price,
                      requests_per_month: editModal.plan.requests_per_month,
                      duration_in_days: editModal.plan.duration_in_days,
                      description: editModal.plan.description,
                      is_active: editModal.plan.is_active,
                    });

                    alert("تم تعديل الخطة بنجاح");

                    setEditModal({ open: false, plan: null });
                    loadPlans(); // تحديث الجدول
                  } catch (error) {
                    alert(
                      error.response?.data?.message ||
                        "حدث خطأ أثناء تعديل الخطة",
                    );
                  }
                }}
              >
                حفظ التعديلات
              </Button>

              <Button
                variant="outline"
                onClick={() => setEditModal({ open: false, plan: null })}
              >
                إلغاء
              </Button>
            </div>
          </Card>
        </div>
      )}

      {createModal.open && (
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
          <Card style={{ width: "450px", padding: "20px" }}>
            <h3 style={{ marginBottom: "15px" }}>إضافة خطة اشتراك جديدة</h3>

            <label>نوع الخطة</label>
            <select
              value={createModal.type}
              onChange={(e) =>
                setCreateModal((prev) => ({ ...prev, type: e.target.value }))
              }
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            >
              <option value="free">مجانية</option>
              <option value="paid">مدفوعة</option>
            </select>

            <label>عدد الطلبات شهرياً</label>
            <input
              type="number"
              value={createModal.requests_per_month}
              onChange={(e) =>
                setCreateModal((prev) => ({
                  ...prev,
                  requests_per_month: e.target.value,
                }))
              }
              style={{ width: "100%", marginBottom: "15px" }}
            />

            <label>السعر (ل.س)</label>
            <input
              type="number"
              value={createModal.price}
              onChange={(e) =>
                setCreateModal((prev) => ({ ...prev, price: e.target.value }))
              }
              style={{ width: "100%", marginBottom: "15px" }}
            />

            <label>المدة (يوم)</label>
            <input
              type="number"
              value={createModal.duration_in_days}
              onChange={(e) =>
                setCreateModal((prev) => ({
                  ...prev,
                  duration_in_days: e.target.value,
                }))
              }
              style={{ width: "100%", marginBottom: "15px" }}
            />

            <label>الوصف</label>
            <textarea
              value={createModal.description}
              onChange={(e) =>
                setCreateModal((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              style={{
                width: "100%",
                marginBottom: "15px",
                height: "100px",
              }}
            />

            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <input
                type="checkbox"
                checked={createModal.is_active}
                onChange={(e) =>
                  setCreateModal((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
              />
              فعّالة؟
            </label>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    await createSubscriptionPlan({
                      type: createModal.type,
                      requests_per_month: createModal.requests_per_month,
                      price: createModal.price,
                      duration_in_days: createModal.duration_in_days,
                      description: createModal.description,
                      is_active: createModal.is_active,
                    });

                    alert("تم إنشاء الخطة بنجاح");

                    setCreateModal({ open: false });
                    loadPlans(); // تحديث الجدول
                  } catch (error) {
                    alert(
                      error.response?.data?.message ||
                        "حدث خطأ أثناء إنشاء الخطة",
                    );
                  }
                }}
              >
                إنشاء الخطة
              </Button>

              <Button
                variant="outline"
                onClick={() => setCreateModal({ open: false })}
              >
                إلغاء
              </Button>
            </div>
          </Card>
        </div>
      )}

      <h2 style={{ marginBottom: "20px" }}>خطط الاشتراك</h2>

      {/* الفلاتر */}
      <div style={{ marginBottom: "20px" }}>
        <Card style={{ padding: "20px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              variant="primary"
              onClick={() =>
                setCreateModal({
                  open: true,
                  type: "paid",
                  requests_per_month: "",
                  price: "",
                  duration_in_days: "",
                  description: "",
                  is_active: false,
                })
              }
            >
              إضافة خطة جديدة
            </Button>
            <Button variant="primary" onClick={() => loadPlans()}>
              كل الخطط
            </Button>

            <Button
              variant="primary"
              onClick={() => loadPlans({ type: "paid" })}
            >
              الخطط المدفوعة
            </Button>

            <Button
              variant="primary"
              onClick={() => loadPlans({ is_active: 1 })}
            >
              الخطط الفعّالة
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                (window.location.href = "/admin/provider-subscriptions")
              }
            >
              اشتراكات مقدمي الخدمة
            </Button>

            <Button
              variant="primary"
              onClick={() =>
                (window.location.href = "/admin/stats/subscriptions-revenue")
              }
            >
              إحصائيات الإيرادات
            </Button>
          </div>
        </Card>
      </div>

      {/* الجدول */}
      <Card style={{ padding: "20px" }}>
        <Table columns={columns} data={plans} />
      </Card>
    </DashboardLayout>
  );
}
