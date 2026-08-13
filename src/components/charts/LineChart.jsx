import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

export default function LineChart({ data }) {
  // اكتشاف الوضع الداكن من الـ body
  const isDark = document.body.classList.contains("dark");

  const axisColor = isDark ? "#c7baba" : "#bbacacab"; // لون المحاور
  const gridColor = isDark ? "rgb(255, 255, 255)" : "rgba(104, 98, 98, 0.37)"; // لون الشبكة

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: axisColor,
        },
      },
      tooltip: {
        titleColor: axisColor,
        bodyColor: axisColor,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "الشهر",
          color: axisColor,
        },
        ticks: {
          color: axisColor,
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        title: {
          display: true,
          text: "عدد الطلبات",
          color: axisColor,
        },
        ticks: {
          color: axisColor,
        },
        grid: {
          color: gridColor,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Line data={data} options={options} />
    </div>
  );
}
