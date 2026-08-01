export const reportsStats = [
  { title: "إجمالي الطلبات", value: "25,680" },
  { title: "الاشتراكات المدفوعة", value: "8,420" },
  { title: "المناطق الساخنة", value: "5" },
  { title: "إجمالي الإيرادات", value: "$48,250" },
];

export const monthlyOrders = {
  labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
  values: [3200, 4100, 3800, 4500, 5200, 6100],
};

export const subscriptionsData = {
  labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
  values: [980, 1040, 1180, 1260, 1390, 1520],
};

export const hotZonesData = {
  labels: [
    "الحي الشرقي",
    "الحي الغربي",
    "الحي الجنوبي",
    "الحي الشمالي",
    "وسط المدينة",
  ],
  values: [182, 156, 134, 121, 98],
};

export const defaultReportsData = {
  stats: reportsStats,
  ordersTrend: monthlyOrders,
  subscriptionsTrend: subscriptionsData,
  hotZones: hotZonesData,
};
