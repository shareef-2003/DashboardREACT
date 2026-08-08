import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getCustomers } from "../../services/customerService";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import { deleteCustomer, blockCustomer } from "../../services/customerService";

export default function CustomersPage() {
  const [filters, setFilters] = useState({
    area_id: "",
    joined_from: "",
    joined_to: "",
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [blockModal, setBlockModal] = useState({
    open: false,
    customer: null,
    reason: "",
    duration: "",
  });
  const openBlockModal = (customer) => {
    setBlockModal({
      open: true,
      customer,
      reason: "",
      duration: "",
    });
  };

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers(filters);
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الزبون؟")) return;

    try {
      await deleteCustomer(id);

      alert("تم حذف الزبون بنجاح.");
      loadCustomers(); // إعادة تحميل القائمة بعد الحذف
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "حدث خطأ أثناء حذف الزبون";

      alert(backendMessage);
    }
  };

  const [apply, setApply] = useState(false);

  const handleBlockCustomer = async () => {
    try {
      await blockCustomer(customerId, reason, duration);
      alert("تم حظر المستخدم بنجاح");
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "حدث خطأ أثناء تنفيذ عملية الحظر";

      alert(backendMessage);
    }
  };

  useEffect(() => {
    loadCustomers(); // تحميل أولي عند فتح الصفحة
  }, [apply]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setApply((prev) => !prev); // تغيير القيمة لتحفيز useEffect
  };

  const columns = [
    { key: "full_name", title: "الاسم", render: (row) => row.full_name },
    {
      key: "phone_number",
      title: "رقم الهاتف",
      render: (row) => row.phone_number,
    },
    {
      key: "area",
      title: "المنطقة",
      render: (row) => (row.area ? `${row.area.city} - ${row.area.area}` : "-"),
    },
    {
      key: "completed_requests",
      title: "الطلبات المكتملة",
      render: (row) => row.completed_requests,
    },
    {
      key: "joined_at",
      title: "تاريخ الانضمام",
      render: (row) => row.joined_at,
    },
    {
      key: "actions",
      title: "إجراءات",
      render: (row) => (
        <div style={{ padding: "5px" }}>
          <Button
            variant="danger"
            disabled={row.status === "blocked"}
            // الزبون محظور؟ اجعل الزر غير فعال
            onClick={() => openBlockModal(row)}
          >
            حظر
          </Button>

          <Button variant="danger" onClick={() => handleDelete(row.id)}>
            حذف
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              navigate(`/admin/blocked-providers-by-customer/${row.id}`)
            }
          >
            مقدمو الخدمة المحظورون
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      {blockModal.open && (
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
            <h3>حظر الزبون</h3>

            <label>سبب الحظر</label>
            <textarea
              style={{ width: "100%", marginBottom: "15px" }}
              value={blockModal.reason}
              onChange={(e) =>
                setBlockModal((prev) => ({ ...prev, reason: e.target.value }))
              }
            />

            <label>مدة الحظر (بالأيام)</label>
            <input
              type="number"
              min="1"
              max="365"
              style={{ width: "100%", marginBottom: "15px" }}
              value={blockModal.duration}
              onChange={(e) =>
                setBlockModal((prev) => ({ ...prev, duration: e.target.value }))
              }
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                variant="danger"
                onClick={async () => {
                  try {
                    await blockCustomer(
                      blockModal.customer.id,
                      blockModal.reason,
                      Number(blockModal.duration),
                    );

                    alert("تم حظر الزبون بنجاح.");

                    setBlockModal({
                      open: false,
                      customer: null,
                      reason: "",
                      duration: "",
                    });

                    loadCustomers();
                  } catch (error) {
                    const backendMessage =
                      error.response?.data?.message ||
                      "حدث خطأ أثناء تنفيذ عملية الحظر";

                    alert(backendMessage);
                  }
                }}
              >
                تنفيذ الحظر
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setBlockModal({
                    open: false,
                    customer: null,
                    reason: "",
                    duration: "",
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
          marginBottom: "20px",
        }}
      >
        <h2>الزبائن</h2>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/customers-blocked")}
        >
          الزبائن المحظورين
        </Button>
        <Button variant="outline" onClick={() => navigate("/admin/reviews")}>
          تقييمات الزبائن
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/stats/customers-growth")}
        >
          إحصائيات نمو الزبائن
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/stats/service-requests-growth")}
        >
          إحصائيات نمو الطلبات
        </Button>

        <Button variant="outline" onClick={() => navigate(-1)}>
          العودة
        </Button>
      </div>

      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <select
            onChange={(e) => updateFilter("area_id", e.target.value)}
            style={{ padding: "10px" }}
          >
            <option value="">اختر المنطقة</option>
            <option value="11">بستان الدور</option>
            <option value="12">القصاع</option>
            <option value="13">مشروع دمر</option>
            <option value="14">الشعلان</option>
            <option value="15">أبو رمانة</option>
          </select>

          <input
            type="date"
            onChange={(e) => updateFilter("joined_from", e.target.value)}
            style={{ padding: "10px" }}
          />

          <input
            type="date"
            onChange={(e) => updateFilter("joined_to", e.target.value)}
            style={{ padding: "10px" }}
          />

          <Button onClick={applyFilters}>بحث</Button>
        </div>
      </Card>

      <Table columns={columns} data={customers} />
    </DashboardLayout>
  );
}
