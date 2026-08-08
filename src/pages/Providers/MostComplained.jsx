import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { endpoints } from "../../services/endpoints";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

export default function MostComplainedPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(endpoints.mostComplained);
        setProviders(response.data.data || []);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "فشل جلب الأكثر شكاوى.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div style={{ color: "var(--danger)", textAlign: "center" }}>{error}</div>
    );

  return (
    <Card>
      <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}>
                <h2 style={{ marginBottom: "20px" }}>الأكثر شكاوى</h2>
                <Button variant="outline" onClick={() => navigate(-1)}>
          العودة
        </Button>
        </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الجوال</th>
            <th>الفئة</th>
            <th>المدينة</th>
            <th>المنطقة</th>
            <th>سنوات الخبرة</th>
            <th>التقييم</th>
            <th>عدد الشكاوى</th>
          </tr>
        </thead>

        <tbody>
          {providers.map((p) => (
            <tr key={p.id}>
              <td>{p.full_name}</td>
              <td>{p.phone_number}</td>
              <td>{p.category}</td>
              <td>{p.service_area?.city}</td>
              <td>{p.service_area?.area}</td>
              <td>{p.experience_years}</td>
              <td>{p.rating}</td>
              <td>{p.complaints_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
