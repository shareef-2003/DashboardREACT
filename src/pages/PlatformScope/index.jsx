import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useLocationsStore } from "../../store/locationsStore";
import PlatformMap from "../../components/map/PlatformMap";
import SelectLocationMap from "../../components/map/SelectLocationMap";

export default function PlatformScopePage() {
  const { cities, addCity, deleteCity, addArea, deleteArea } =
    useLocationsStore();

  const [showMap, setShowMap] = useState(false);
  const [selectedLat, setSelectedLat] = useState("");
  const [selectedLng, setSelectedLng] = useState("");

  const [cityName, setCityName] = useState("");
  const [areaName, setAreaName] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  // 🔥 استخراج المناطق الساخنة
  const hotZones = cities
    .flatMap((city) =>
      city.areas.map((area) => ({
        city: city.name,
        name: area.name,
        orders: area.orders,
      })),
    )
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);

  // 🔥 استخراج الإحصائيات لكل منطقة
  const areasStats = cities.flatMap((city) =>
    city.areas.map((area) => ({
      city: city.name,
      name: area.name,
      orders: area.orders,
      providers: area.providers,
    })),
  );

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>إدارة نطاق المنصة</h2>
      <Card style={{ marginBottom: "20px" }}>
        <h3>الخريطة التفاعلية لنطاق المنصة</h3>
        <PlatformMap cities={cities} />
      </Card>

      {/* إدارة المدن */}
      <Card style={{ marginBottom: "20px" }}>
        <h3>إدارة المدن</h3>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Input
            placeholder="اسم المدينة"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
          />
          <Button
            onClick={() => {
              addCity(cityName);
              setCityName("");
            }}
          >
            إضافة مدينة
          </Button>
          <Button onClick={() => setShowMap(true)}>
            تحديد الإحداثيات من الخريطة
          </Button>
        </div>
        {/* الـ Modal الخاص بالخريطة */}
        {showMap && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                width: "600px",
              }}
            >
              <h3>اختر موقع المدينة على الخريطة</h3>

              <SelectLocationMap
                onSelect={(pos) => {
                  setSelectedLat(pos.lat);
                  setSelectedLng(pos.lng);
                  setShowMap(false);
                }}
              />

              <Button
                onClick={() => setShowMap(false)}
                style={{
                  marginTop: "10px",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                }}
              >
                إغلاق
              </Button>
            </div>
          </div>
        )}

        <ul style={{ marginTop: "15px" }}>
          {cities.map((city) => (
            <li key={city.id} style={{ marginBottom: "10px" }}>
              {city.name}
              <Button
                variant="danger"
                small
                style={{
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  marginLeft: "10px",
                }}
                onClick={() => deleteCity(city.id)}
              >
                حذف
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {/* إدارة المناطق */}
      <Card style={{ marginBottom: "20px" }}>
        <h3>إدارة المناطق داخل مدينة</h3>

        <select
          style={{ padding: "10px", marginTop: "10px" }}
          onChange={(e) => setSelectedCity(Number(e.target.value))}
        >
          <option>اختر مدينة</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

        {selectedCity && (
          <>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <Input
                placeholder="اسم المنطقة"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
              />
              <Button
                onClick={() => {
                  addArea(selectedCity, areaName);
                  setAreaName("");
                }}
              >
                إضافة منطقة
              </Button>
            </div>

            <ul style={{ marginTop: "15px" }}>
              {cities
                .find((c) => c.id === selectedCity)
                ?.areas.map((area) => (
                  <li key={area.id} style={{ marginBottom: "10px" }}>
                    {area.name}
                    <Button
                      danger
                      small
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#e74c3c",
                        color: "#fff",
                      }}
                      onClick={() => deleteArea(selectedCity, area.id)}
                    >
                      حذف
                    </Button>
                  </li>
                ))}
            </ul>
          </>
        )}
      </Card>

      {/* المناطق الساخنة */}
      <Card style={{ marginBottom: "20px" }}>
        <h3>المناطق الأكثر طلبًا (المناطق الساخنة)</h3>

        <Table
          columns={[
            { key: "city", title: "المدينة" },
            { key: "name", title: "المنطقة" },
            { key: "orders", title: "عدد الطلبات" },
          ]}
          data={hotZones}
        />
      </Card>

      {/* إحصائيات المناطق */}
      <Card>
        <h3>إحصائيات المناطق</h3>

        <Table
          columns={[
            { key: "city", title: "المدينة" },
            { key: "name", title: "المنطقة" },
            { key: "orders", title: "عدد الطلبات" },
            { key: "providers", title: "عدد مقدمي الخدمة" },
          ]}
          data={areasStats}
        />
      </Card>
    </DashboardLayout>
  );
}
