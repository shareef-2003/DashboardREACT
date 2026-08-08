import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getPriceComparison } from "../../services/areasService";

export default function PriceComparisonPage() {
  const [categoryId, setCategoryId] = useState(2);
  const [requestType, setRequestType] = useState("specific_fault");
  const [rows, setRows] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPriceComparison(categoryId, requestType);
      setRows(data.rows);
      setInsights(data.insights);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loader />;

  const getRowColor = (price) => {
    if (!price) return "white";
    if (price >= insights.most_expensive.average_price) return "#f8d7da"; // أحمر فاتح
    if (price <= insights.cheapest.average_price) return "#d4edda"; // أخضر فاتح
    return "white";
  };

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>مقارنة الأسعار حسب المناطق</h2>

      {/* Filters */}
      <Card style={{ marginBottom: "20px", padding: "20px" }}>
        <h3>خيارات الفلترة</h3>

        <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
          <div>
            <label>فئة الخدمة</label>
            <input
              type="number"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value) || 1)}
              style={{ width: "120px", padding: "8px" }}
            />
          </div>

          <div>
            <label>نوع الطلب</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              style={{ width: "180px", padding: "8px" }}
            >
              <option value="specific_fault">عطل محدد</option>
              <option value="general_service">خدمة عامة</option>
            </select>
          </div>

          <Button variant="primary" onClick={loadData}>
            تحديث
          </Button>
        </div>
      </Card>

      {/* Main Table */}
      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "15px" }}>الأسعار حسب المناطق</h3>

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
                متوسط السعر
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                أقل سعر
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                أعلى سعر
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                الوسيط
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                عدد الطلبات
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                العروض المقبولة
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                style={{ background: getRowColor(row.average_price) }}
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.city}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.area_name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.average_price}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.min_price}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.max_price}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.median_price}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.requests_count}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {row.accepted_offers_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Insights */}
      {insights && (
        <Card style={{ padding: "20px" }}>
          <h3 style={{ marginBottom: "15px" }}>التحليلات</h3>

          <p>
            <strong>المتوسط العام:</strong> {insights.overall_weighted_average}
          </p>

          <p>
            <strong>نسبة التفاوت:</strong> {insights.price_variance_percentage}%
          </p>

          {/* الأغلى */}
          {insights.most_expensive && (
            <>
              <h4 style={{ marginTop: "15px" }}>الأغلى</h4>
              <p>
                {insights.most_expensive.area_name} —{" "}
                {insights.most_expensive.average_price} ل.س
              </p>
            </>
          )}

          {/* الأرخص */}
          {insights.cheapest && (
            <>
              <h4 style={{ marginTop: "15px" }}>الأرخص</h4>
              <p>
                {insights.cheapest.area_name} —{" "}
                {insights.cheapest.average_price} ل.س
              </p>
            </>
          )}

          {/* الترتيب */}
          {insights.ranking && insights.ranking.length > 0 && (
            <>
              <h4 style={{ marginTop: "15px" }}>الترتيب حسب السعر</h4>
              <ul>
                {insights.ranking.map((r) => (
                  <li key={r.area_id}>
                    {r.rank}. {r.area_name} — {r.average_price} ل.س
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      )}
    </DashboardLayout>
  );
}
