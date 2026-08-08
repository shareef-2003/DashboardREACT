import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { getProviderDistribution } from "../../services/areasService";

export default function ProviderDistributionPage() {
  const [areas, setAreas] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getProviderDistribution(page);
      setAreas(data.data);
      setMeta(data.meta);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  if (loading) return <Loader />;

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>توزيع مقدمي الخدمة حسب المناطق</h2>

      <Card style={{ padding: "20px" }}>
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
                عدد مقدمي الخدمة
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                التفصيل حسب الفئات
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
                  {area.total_providers}
                </td>

                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {area.breakdown.map((b, index) => (
                      <li key={index}>
                        {b.category_name}: {b.count}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {meta && (
          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <Button
              variant="outline"
              disabled={!meta.links.prev}
              onClick={() => setPage(page - 1)}
            >
              السابق
            </Button>

            <Button
              variant="outline"
              disabled={!meta.links.next}
              onClick={() => setPage(page + 1)}
            >
              التالي
            </Button>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
