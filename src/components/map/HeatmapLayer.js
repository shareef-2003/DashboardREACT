import { useEffect } from "react";
import h337 from "heatmap.js";

export default function HeatmapLayer({ map, points }) {
  useEffect(() => {
    if (!map || points.length === 0) return;

    const heatmapContainer = document.createElement("div");
    heatmapContainer.style.position = "absolute";
    heatmapContainer.style.top = 0;
    heatmapContainer.style.left = 0;
    heatmapContainer.style.width = "100%";
    heatmapContainer.style.height = "100%";
    heatmapContainer.style.zIndex = 500; // مهم جداً

    // ضع الطبقة فوق الخريطة وليس داخل overlayPane
    map._container.appendChild(heatmapContainer);

    const heatmap = h337.create({
      container: heatmapContainer,
      radius: 45,
      maxOpacity: 0.9,
      minOpacity: 0.2,
      blur: 0.85,
      gradient: {
        0.0: "blue",
        0.5: "yellow",
        0.8: "orange",
        1.0: "red",
      },
    });

    // const updateHeatmap = () => {
    //   const data = {
    //     max: Math.max(...points.map((p) => p.count)),
    //     data: points.map((p) => {
    //       const { x, y } = map.latLngToContainerPoint([p.lat, p.lng]);
    //       return { x, y, value: Math.pow(p.count, 2) * 5 };
    //     }),
    //   };

    //   heatmap.setData(data);
    // };

    const updateHeatmap = () => {
      const data = {
        max: 50, // ثابت لزيادة الوضوح
        data: points.map((p) => {
          const { x, y } = map.latLngToContainerPoint([p.lat, p.lng]);
          return {
            x,
            y,
            value: p.count * 10, // تضخيم القيم
          };
        }),
      };

      heatmap.setData(data);
    };

    updateHeatmap();

    map.on("move", updateHeatmap);
    map.on("zoom", updateHeatmap);
    map.on("resize", updateHeatmap);

    return () => {
      map.off("move", updateHeatmap);
      map.off("zoom", updateHeatmap);
      map.off("resize", updateHeatmap);
      heatmapContainer.remove();
    };
  }, [map, points]);

  return null;
}
