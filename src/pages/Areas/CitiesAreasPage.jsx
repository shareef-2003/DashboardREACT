import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import {
  addAreasToCity,
  deleteArea,
  deleteCity,
  getCitiesWithAreas,
  updateCityName,
} from "../../services/areasService";
import { useNavigate } from "react-router-dom";

export default function CitiesAreasPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [addAreaModal, setAddAreaModal] = useState({
    open: false,
    cityName: "",
    areas: [""],
  });

  const [editModal, setEditModal] = useState({
    open: false,
    cityId: null,
    currentName: "",
    newName: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    cityName: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCitiesWithAreas();
      setCities(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      {addAreaModal.open && (
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
            <h3>إضافة مناطق لمدينة {addAreaModal.cityName}</h3>

            {addAreaModal.areas.map((area, index) => (
              <input
                key={index}
                type="text"
                value={area}
                placeholder={`المنطقة رقم ${index + 1}`}
                onChange={(e) =>
                  setAddAreaModal((prev) => {
                    const updated = [...prev.areas];
                    updated[index] = e.target.value;
                    return { ...prev, areas: updated };
                  })
                }
                style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
              />
            ))}

            <Button
              variant="outline"
              onClick={() =>
                setAddAreaModal((prev) => ({
                  ...prev,
                  areas: [...prev.areas, ""],
                }))
              }
              style={{ marginBottom: "15px" }}
            >
              إضافة حقل منطقة جديدة
            </Button>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    const filtered = addAreaModal.areas.filter(
                      (a) => a.trim() !== "",
                    );

                    if (filtered.length === 0) {
                      alert("يرجى إدخال منطقة واحدة على الأقل");
                      return;
                    }

                    await addAreasToCity(addAreaModal.cityName, filtered);

                    alert("تم إضافة المناطق بنجاح");

                    setAddAreaModal({
                      open: false,
                      cityName: "",
                      areas: [""],
                    });

                    loadData(); // تحديث القائمة
                  } catch {
                    alert("فشل إضافة المناطق");
                  }
                }}
              >
                حفظ المناطق
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setAddAreaModal({
                    open: false,
                    cityName: "",
                    areas: [""],
                  })
                }
              >
                إلغاء
              </Button>
            </div>
          </Card>
        </div>
      )}

      {deleteModal.open && (
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
            <h3>حذف المدينة</h3>

            <p style={{ marginBottom: "20px" }}>
              هل أنت متأكد أنك تريد حذف مدينة{" "}
              <strong>{deleteModal.cityName}</strong> وجميع مناطقها؟
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                variant="danger"
                onClick={async () => {
                  try {
                    await deleteCity(deleteModal.cityName);

                    alert("تم حذف المدينة بنجاح");

                    setDeleteModal({
                      open: false,
                      cityName: "",
                    });

                    loadData(); // تحديث القائمة
                  } catch {
                    alert("فشل حذف المدينة");
                  }
                }}
              >
                تأكيد الحذف
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    cityName: "",
                  })
                }
              >
                إلغاء
              </Button>
            </div>
          </Card>
        </div>
      )}

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
          <Card style={{ width: "400px", padding: "20px" }}>
            <h3>تعديل اسم المدينة</h3>

            <label>الاسم الجديد</label>
            <input
              type="text"
              value={editModal.newName}
              onChange={(e) =>
                setEditModal((prev) => ({ ...prev, newName: e.target.value }))
              }
              style={{ width: "100%", marginBottom: "15px" }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    await updateCityName(editModal.cityId, editModal.newName);

                    alert("تم تعديل اسم المدينة بنجاح");

                    setEditModal({
                      open: false,
                      cityId: null,
                      currentName: "",
                      newName: "",
                    });

                    loadData(); // تحديث القائمة
                  } catch {
                    alert("فشل تعديل اسم المدينة");
                  }
                }}
              >
                حفظ التعديل
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setEditModal({
                    open: false,
                    cityId: null,
                    currentName: "",
                    newName: "",
                  })
                }
              >
                إلغاء
              </Button>
            </div>
          </Card>
        </div>
      )}

      <h2 style={{ marginBottom: "20px" }}>المدن والمناطق</h2>
     < div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>


      <Button
        variant="outline"
        onClick={() => navigate("/admin/cities/add")}
        style={{ marginBottom: "20px" }}
      >
        إضافة مدينة جديدة
      </Button>
      <Button
  variant="primary"
  onClick={() => navigate("/admin/hot-areas")}
  style={{ marginBottom: "20px" }}
>
  عرض المناطق الساخنة
</Button>

 <Button
    variant="danger"
    onClick={() => navigate("/admin/complaints-areas")}
      style={{ marginBottom: "20px" }}
  >
    عرض المناطق الأكثر شكوى
  </Button>

  <Button
  variant="secondary"
  onClick={() => navigate("/admin/provider-distribution")}
   style={{ marginBottom: "20px" }}
>
  توزيع مقدمي الخدمة حسب المناطق
</Button>
<Button
  variant="secondary"
  onClick={() => navigate("/admin/geographic-growth")}
     style={{ marginBottom: "20px" }}

>
  النمو الجغرافي
</Button>

<Button
  variant="secondary"
  onClick={() => navigate("/admin/supply-demand")}
       style={{ marginBottom: "20px" }}

>
  حالة العرض والطلب
</Button>

<Button
  variant="secondary"
  onClick={() => navigate("/admin/price-trend")}
         style={{ marginBottom: "20px" }}

>
  اتجاه الأسعار الشهري
</Button>

<Button
  variant="secondary"
  onClick={() => navigate("/admin/price-comparison")}
           style={{ marginBottom: "20px" }}

>
  مقارنة الأسعار
</Button>




     </div>



      {cities.map((city, index) => (
        <Card key={index} style={{ marginBottom: "20px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outline"
              onClick={() =>
                setAddAreaModal({
                  open: true,
                  cityName: city.city,
                  areas: [""],
                })
              }
              style={{ marginBottom: "15px" }}
            >
              إضافة مناطق جديدة
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setEditModal({
                  open: true,
                  cityId: city.city_id ?? city.id, // حسب الـ API
                  currentName: city.city,
                  newName: city.city,
                })
              }
              style={{ marginBottom: "15px" }}
            >
              تعديل اسم المدينة
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                setDeleteModal({
                  open: true,
                  cityName: city.city,
                })
              }
              style={{ marginBottom: "15px" }}
            >
              حذف المدينة
            </Button>
          </div>

          <h3 style={{ marginBottom: "15px" }}>{city.city}</h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f1f1" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  المنطقة
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  عدد المزودين
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  عدد الطلبات
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  عدد الزبائن
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  أنواع الخدمات
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  إجراءات
                </th>
              </tr>
            </thead>

            <tbody>
              {city.areas.map((area) => (
                <tr key={area.id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {area.area_name}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {area.providers_count}
                  </td>

                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {area.requests_count}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {area.customers_count}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {area.service_types_count}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <Button
                      variant="danger"
                      onClick={async () => {
                        try {
                          await deleteArea(area.id);
                          alert("تم حذف المنطقة بنجاح");
                          loadData();
                        } catch {
                          alert("فشل حذف المنطقة");
                        }
                      }}
                    >
                      حذف
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ))}
    </DashboardLayout>
  );
}
