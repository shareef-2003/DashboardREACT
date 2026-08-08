import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getDensityMap } from "../../services/areasService";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import HeatmapOverlay from "leaflet-heatmap";

export default function HotAreaMapPage() {
  const [days, setDays] = useState(30);
  const [area, setArea] = useState("");
  const [precision, setPrecision] = useState(2);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDensityMap(days, area, precision);
      setPoints(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;

    const cfg = {
      radius: 25,
      maxOpacity: 0.8,
      scaleRadius: true,
      useLocalExtrema: false,
      latField: "lat",
      lngField: "lng",
      valueField: "count",
    };

    const heatmapLayer = new HeatmapOverlay(cfg);

    heatmapLayer.setData({
      max: 8,
      data: points,
    });

    heatmapLayer.addTo(mapRef.current);
  }, [points]);

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>خريطة المناطق الساخنة</h2>

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

          <div>
            <label>اسم المنطقة (اختياري)</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              style={{ width: "150px", padding: "8px" }}
            />
          </div>

          <div>
            <label>الدقة</label>
            <input
              type="number"
              value={precision}
              onChange={(e) => setPrecision(Number(e.target.value) || 2)}
              style={{ width: "120px", padding: "8px" }}
            />
          </div>

          <Button variant="primary" onClick={loadData}>
            تحديث
          </Button>
        </div>
      </Card>

      <Card style={{ padding: "20px" }}>
        <h3 style={{ marginBottom: "15px" }}>الخريطة الحرارية</h3>

        <MapContainer
          center={[33.5138, 36.2765]} // دمشق
          zoom={13}
          whenCreated={(map) => (mapRef.current = map)}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </Card>
    </DashboardLayout>
  );
}
