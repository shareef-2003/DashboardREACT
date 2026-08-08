import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import {
  getServiceCategories,
  addServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  getProviderDistributionStats,
  getMostRequestedCategories,
} from "../../services/categoriesService";

export default function ServiceCategoriesPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [stats, setStats] = useState([]);
  const [showStats, setShowStats] = useState(false);

  const [mostRequested, setMostRequested] = useState([]);
  const [showMostRequestedModal, setShowMostRequestedModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");

  const [areas, setAreas] = useState([]);

  useEffect(() => {
    loadData();
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const data = await getAreas();
      setAreas(data);
    } catch (error) {
      console.error("Error loading areas:", error);
    }
  };

  const loadMostRequested = async () => {
    try {
      const data = await getMostRequestedCategories(selectedArea || null);
      setMostRequested(data);
      setShowMostRequestedModal(true);
    } catch (error) {
      alert(error.response?.data?.message || "حدث خطأ أثناء جلب الإحصائيات");
    }
  };

  const loadStats = async () => {
    try {
      const data = await getProviderDistributionStats();
      setStats(data);
      setShowStats(true);
    } catch (error) {
      alert(error.response?.data?.message || "حدث خطأ أثناء جلب الإحصائيات");
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setShowEditModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا النوع؟")) return;

    try {
      await deleteServiceCategory(id);
      loadData(); // إعادة تحميل البيانات بعد الحذف
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "حدث خطأ أثناء الحذف";

      alert(backendMessage);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const payload = {
        name: editItem.name,
        description: editItem.description,
        image: editItem.image,
      };

      await updateServiceCategory(editItem.id, payload);

      setShowEditModal(false);
      loadData();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleAddCategory = async () => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("description", newDescription);
    if (newImage) formData.append("image", newImage);

    try {
      await addServiceCategory(formData);
      setShowAddModal(false);
      loadData(); // إعادة تحميل الأنواع
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getServiceCategories(search, sortBy);
      setRows(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []); // لا تتحدث إلا عند الضغط على تحديث

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      {showStats && (
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
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "600px",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>
              توزيع مقدمي الخدمة حسب الأنواع
            </h3>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f1f1" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    الترتيب
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    النوع
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    عدد مقدمي الخدمة
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    النسبة
                  </th>
                </tr>
              </thead>

              <tbody>
                {stats.map((item) => (
                  <tr key={item.category_id}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {item.rank}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {item.category_name}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {item.providers_count}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {item.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <Button variant="outline" onClick={() => setShowStats(false)}>
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editItem && (
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
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "450px",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>تعديل نوع الخدمة</h3>

            <div style={{ marginBottom: "10px" }}>
              <label>الاسم</label>
              <input
                type="text"
                value={editItem.name}
                onChange={(e) =>
                  setEditItem({ ...editItem, name: e.target.value })
                }
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>الوصف</label>
              <textarea
                value={editItem.description || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, description: e.target.value })
                }
                style={{ width: "100%", padding: "8px", height: "80px" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>الصورة الجديدة (اختياري)</label>
              <input
                type="file"
                onChange={(e) =>
                  setEditItem({ ...editItem, image: e.target.files[0] })
                }
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <Button variant="primary" onClick={handleUpdateCategory}>
                حفظ التعديلات
              </Button>

              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
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
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "450px",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>إضافة نوع خدمة جديد</h3>

            <div style={{ marginBottom: "10px" }}>
              <label>الاسم</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>الوصف</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                style={{ width: "100%", padding: "8px", height: "80px" }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>الصورة</label>
              <input
                type="file"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <Button variant="primary" onClick={handleAddCategory}>
                إضافة
              </Button>

              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}

      {showMostRequestedModal && (
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
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "600px",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>
              أكثر أنواع الخدمات طلباً{" "}
              {selectedArea ? `(المنطقة ${selectedArea})` : ""}
            </h3>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f1f1f1" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    الترتيب
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    النوع
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    عدد الطلبات
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    النسبة
                  </th>
                </tr>
              </thead>

              <tbody>
                {mostRequested.map((item) => (
                  <tr key={item.category_id}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {item.rank}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {item.category_name}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {item.requests_count}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {item.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <Button
                variant="outline"
                onClick={() => setShowMostRequestedModal(false)}
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: "20px" }}>عرض أنواع الأعطال ومعلوماتها</h2>
      <Button
        variant="primary"
        onClick={() => setShowAddModal(true)}
        style={{ marginBottom: "20px" }}
      >
        إضافة نوع خدمة جديد
      </Button>
      <Button
        variant="primary"
        onClick={() => loadStats()}
        style={{ marginBottom: "20px", marginLeft: "10px" }}
      >
        عرض إحصائيات توزيع مقدمي الخدمة
      </Button>

      <Button
        variant="primary"
        onClick={loadMostRequested}
        style={{ marginBottom: "20px", marginLeft: "10px" }}
      >
        عرض أكثر الأنواع طلباً
      </Button>

      <Card style={{ marginBottom: "20px", padding: "20px" }}>
        <h3>خيارات الفلترة</h3>

        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <div>
            <label>بحث</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن نوع خدمة..."
              style={{ width: "200px", padding: "8px" }}
            />
          </div>

          <div>
            <label>الترتيب حسب</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: "200px", padding: "8px" }}
            >
              <option value="">بدون ترتيب</option>
              <option value="name">الاسم</option>
              <option value="providers_count">عدد مقدمي الخدمة</option>
              <option value="requests_count">عدد الطلبات</option>
            </select>
          </div>

          <Button variant="primary" onClick={loadData}>
            تحديث
          </Button>
        </div>
      </Card>

      <Card style={{ padding: "20px" }}>
        <h3 style={{ marginBottom: "15px" }}>الأنواع المتاحة</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                الاسم
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                الوصف
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                عدد مقدمي الخدمة
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                عدد الطلبات
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.description}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.providers_count}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.requests_count}
                </td>

                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                      variant="outline"
                      onClick={() => openEditModal(row)}
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteCategory(row.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      حذف
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}
