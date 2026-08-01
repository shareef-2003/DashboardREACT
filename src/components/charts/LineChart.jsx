import React from "react";
import Chart from "react-apexcharts";

export default function LineChart({ data, seriesName = "القيم" }) {
  const categories = data?.labels ?? [];
  const normalizedSeries = Array.isArray(data?.series)
    ? data.series
    : [{ name: seriesName, data: data?.values ?? [] }];

  const options = {
    chart: {
      id: "line-chart",
      toolbar: { show: false },
      fontFamily: "Tajawal, sans-serif",
    },
    xaxis: { categories },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#4338ca"],
    tooltip: { theme: "light" },
  };

  return (
    <Chart
      options={options}
      series={normalizedSeries}
      type="line"
      height={280}
    />
  );
}
