import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getHotAreas } from "../../services/areasService";
import { useNavigate } from "react-router-dom";

export default function HotAreasPage() {
  const [days, setDays] = useState(30);
  const [limit, setLimit] = useState(5);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getHotAreas(days, limit);
      setAreas(data);
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
<h2 style={{ marginBottom: "20px" }}>المناطق الساخنة</h2>

<div
  style={{
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  }}
>
  <Button
    variant="primary"
    onClick={() => navigate("/admin/hot-area-map")}
  >
    خريطة المناطق الساخنة
  </Button>

 

  <Button variant="outline" onClick={() => navigate(-1)}>
    العودة
  </Button>
</div>


      <Card style={{ marginBottom: "20px", padding: "20px" }}>
        <h3>خيارات الفلترة</h3>

        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <div>
            <label>خلال آخر عدد أيام</label>
            <input
              type="number"
              value={days}
              onChange={(e) => {
                const value = Number(e.target.value);
                setDays(value > 0 ? value : 1);
              }}
              style={{ width: "120px", padding: "8px" }}
            />
          </div>

          <div>
            <label>عدد المناطق الساخنة</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => {
                const value = Number(e.target.value);
                setLimit(value > 0 ? value : 1);
              }}
              style={{ width: "120px", padding: "8px" }}
            />
          </div>

          <Button variant="primary" onClick={loadData}>
            تحديث
          </Button>
        </div>
      </Card>

      <Card style={{ padding: "20px" }}>
        <h3 style={{ marginBottom: "15px" }}>أكثر المناطق طلباً</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                المدينة
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                المنطقة
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                عدد الطلبات
              </th>
            </tr>
          </thead>

          <tbody>
            {areas.map((area) => (
              <tr key={area.area_id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {area.city}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {area.area_name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {area.requests_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}
