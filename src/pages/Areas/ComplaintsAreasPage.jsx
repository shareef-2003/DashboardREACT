import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getComplaintsAreas } from "../../services/areasService";

export default function ComplaintsAreasPage() {
  const [days, setDays] = useState(30);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getComplaintsAreas(days);
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
      <h2 style={{ marginBottom: "20px" }}>المناطق الأكثر شكوى</h2>

      <Card style={{ marginBottom: "20px", padding: "20px" }}>
        <h3>خيارات الفلترة</h3>

        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <div>
            <label>آخر عدد أيام</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value) || 1)}
              style={{ width: "120px", padding: "8px" }}
            />
          </div>

          <Button variant="primary" onClick={loadData}>
            تحديث
          </Button>
        </div>
      </Card>

      <Card style={{ padding: "20px" }}>
        <h3 style={{ marginBottom: "15px" }}>إحصائية الشكاوى حسب المناطق</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                الترتيب
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                المدينة
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                المنطقة
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                عدد الشكاوى
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                النسبة %
              </th>
            </tr>
          </thead>

          <tbody>
            {areas.map((area) => (
              <tr key={area.area_id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {area.rank}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {area.city}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {area.area_name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {area.complaints_count}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {area.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}
