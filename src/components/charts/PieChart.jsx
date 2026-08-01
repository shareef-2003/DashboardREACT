import React from "react";
import Chart from "react-apexcharts";

export default function PieChart({ labels, values }) {
  const options = {
    labels,
    legend: { position: "bottom" },
  };

  return (
    <Chart
      options={options}
      series={values}
      type="pie"
      height={280}
    />
  );
}
