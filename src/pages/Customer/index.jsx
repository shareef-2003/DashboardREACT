import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getCustomers } from "../../services/customerService";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import { deleteCustomer, blockCustomer } from "../../services/customerService";
import { getCitiesDropdown } from "../../services/areasService";

export default function CustomersPage() {
  const [filters, setFilters] = useState({
    city: "",
    joined_from: "",
    joined_to: "",
  });

  const [cities, setCities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [blockModal, setBlockModal] = useState({
    open: false,
    customer: null,
    reason: "",
    duration: "",
  });

  const [apply, setApply] = useState(false);

  // تحميل المدن
  const loadCities = async () => {
    try {
      const data = await getCitiesDropdown();
      setCities(data);
    } catch (err) {
      console.error(err);
    }
  };

  // تحميل الزبائن
  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers(filters);

      // فلترة حسب المدينة داخل الواجهة
      const filtered = filters.city
        ? data.filter((c) => c.area?.city === filters.city)
        : data;

      setCustomers(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
    loadCustomers();
  }, [apply]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setApply((prev) => !prev);
  };

  const openBlockModal = (customer) => {
    setBlockModal({
      open: true,
      customer,
      reason: "",
      duration: "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الزبون؟")) return;

    try {
      await deleteCustomer(id);
      alert("تم حذف الزبون بنجاح.");
      loadCustomers();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "حدث خطأ أثناء حذف الزبون";
      alert(backendMessage);
    }
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
      {/* نافذة الحظر */}
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

      {/* العنوان والأزرار */}
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

      {/* الفلاتر */}
      <Card style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <select
            value={filters.city} // ← مهم جداً
            onChange={(e) => updateFilter("city", e.target.value)}
            style={{ padding: "10px", minWidth: "200px" }}
          >
            <option value="">كل المدن</option>

            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
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

      {/* الجدول */}
      <Table columns={columns} data={customers} />
    </DashboardLayout>
  );
}
