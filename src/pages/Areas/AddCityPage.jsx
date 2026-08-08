import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { addCityWithAreas } from "../../services/citiesService";
import { useNavigate } from "react-router-dom";

export default function AddCityPage() {
  const [city, setCity] = useState("");
  const [areas, setAreas] = useState([""]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const addAreaField = () => {
    setAreas((prev) => [...prev, ""]);
  };

  const updateArea = (index, value) => {
    setAreas((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const submitForm = async () => {
    if (!city.trim()) {
      alert("يرجى إدخال اسم المدينة");
      return;
    }

    const filteredAreas = areas.filter((a) => a.trim() !== "");

    if (filteredAreas.length === 0) {
      alert("يرجى إدخال منطقة واحدة على الأقل");
      return;
    }

    try {
      setLoading(true);
      const result = await addCityWithAreas(city, filteredAreas);
      alert("تم إنشاء المدينة والمناطق بنجاح");

      setCity("");
      setAreas([""]);
    } catch (err) {
      alert("فشل إنشاء المدينة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>إضافة مدينة ومناطقها</h2>
        <Button onClick={() => navigate(-1)} variant="outline">
          العودة
        </Button>
      </div>

      <Card style={{ padding: "20px", maxWidth: "600px" }}>
        <label>اسم المدينة</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ width: "100%", marginBottom: "20px" }}
        />

        <label>المناطق</label>

        {areas.map((area, index) => (
          <input
            key={index}
            type="text"
            value={area}
            onChange={(e) => updateArea(index, e.target.value)}
            placeholder={`المنطقة رقم ${index + 1}`}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        ))}

        <Button variant="outline" onClick={addAreaField}>
          إضافة منطقة جديدة
        </Button>

        <div style={{ marginTop: "20px" }}>
          <Button variant="primary" onClick={submitForm} disabled={loading}>
            {loading ? "جاري الإرسال..." : "إنشاء المدينة"}
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
