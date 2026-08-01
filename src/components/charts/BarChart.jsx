import React from "react";
import Chart from "react-apexcharts";

export default function BarChart({ data, seriesName = "القيم" }) {
  const categories = data?.labels ?? [];
  const normalizedSeries = Array.isArray(data?.series)
    ? data.series
    : [{ name: seriesName, data: data?.values ?? [] }];

  const options = {
    chart: {
      toolbar: { show: false },
      fontFamily: "Tajawal, sans-serif",
    },
    xaxis: { categories },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
    colors: ["#4338ca"],
    tooltip: { theme: "light" },
  };

  return (
    <Chart
      options={options}
      series={normalizedSeries}
      type="bar"
      height={300}
    />
  );
}
