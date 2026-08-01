export const categoriesMock = [
  {
    id: 1,
    name: "تنظيف المنازل",
    services: 24,
    status: "نشط",
    subcategories: [
      { id: 11, name: "تنظيف شقق" },
      { id: 12, name: "تنظيف فلل" },
    ],
  },
  {
    id: 2,
    name: "الصيانة العامة",
    services: 18,
    status: "نشط",
    subcategories: [
      { id: 21, name: "إصلاح سباكة" },
      { id: 22, name: "إصلاح كهرباء" },
    ],
  },
  {
    id: 3,
    name: "الدهانات",
    services: 12,
    status: "غير نشط",
    subcategories: [{ id: 31, name: "دهانات داخلية" }],
  },
  {
    id: 4,
    name: "نقل الأثاث",
    services: 9,
    status: "نشط",
    subcategories: [{ id: 41, name: "نقل مفروشات" }],
  },
];
