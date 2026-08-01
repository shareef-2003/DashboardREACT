import React, { useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Table from "../../components/common/Table";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { categoriesMock } from "../../mocks/categories";
import { useCategoriesStore } from "../../store/categoriesStore";

export default function CategoriesPage() {
  const { search, statusFilter, setSearch, setStatusFilter } =
    useCategoriesStore();
  const [categories, setCategories] = useState(categoriesMock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState([""]);
  const [formError, setFormError] = useState("");

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch = cat.name.includes(search);
      const matchesStatus =
        statusFilter === "all" || cat.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const openModal = () => {
    setFormError("");
    setNewCategoryName("");
    setSubcategories([""]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
    setNewCategoryName("");
    setSubcategories([""]);
  };

  // const handleSubcategoryChange = (index, value) => {
  //   const updated = [...subcategories];
  //   updated[index] = value;
  //   setSubcategories(updated);
  // };

  // const addSubcategory = () => {
  //   setSubcategories([...subcategories, ""]);
  // };

  // const removeSubcategory = (index) => {
  //   if (subcategories.length === 1) {
  //     setSubcategories([""]);
  //     return;
  //   }

  //   const updated = subcategories.filter((_, itemIndex) => itemIndex !== index);
  //   setSubcategories(updated);
  // };

  const handleSave = () => {
    const trimmedName = newCategoryName.trim();
    const normalizedSubcategories = subcategories
      .map((item) => item.trim())
      .filter(Boolean);

    if (!trimmedName || normalizedSubcategories.length === 0) {
      setFormError("يرجى إدخال اسم الفئة وإضافة خدمة فرعية واحدة على الأقل.");
      return;
    }

    const newCategory = {
      id: Date.now(),
      name: trimmedName,
      services: normalizedSubcategories.length,
      status: "نشط",
      subcategories: normalizedSubcategories.map((subName, index) => ({
        id: Date.now() + index,
        name: subName,
      })),
    };

    setCategories((prev) => [newCategory, ...prev]);
    closeModal();
  };

  const columns = [
    {
      key: "name",
      title: "اسم الفئة",
      render: (value, row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontWeight: 600, color: "var(--text)" }}>{value}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {row.subcategories && row.subcategories.length > 0 ? (
              row.subcategories.map((sub) => (
                <span
                  key={sub.id}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "var(--surface-strong)",
                    color: "var(--muted)",
                    fontSize: "12px",
                  }}
                >
                  {sub.name}
                </span>
              ))
            ) : (
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                لا توجد تصنيفات فرعية
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "services",
      title: "عدد الخدمات",
      render: (value, row) => row.subcategories?.length || value,
    },
    { key: "status", title: "الحالة" },
  ];

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>إدارة الفئات</h2>

      <Card style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Input
              label="بحث"
              placeholder="ابحث باسم الفئة"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select
              label="الحالة"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "all", label: "الكل" },
                { value: "نشط", label: "نشط" },
                { value: "غير نشط", label: "غير نشط" },
              ]}
            />
          </div>

          <Button onClick={openModal}>+ إضافة فئة جديدة</Button>
        </div>
      </Card>

      <Table columns={columns} data={filteredCategories} />

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <Card style={{ width: "100%", maxWidth: "620px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0 }}>إضافة فئة جديدة</h3>
              <Button variant="outline" small onClick={closeModal}>
                إغلاق
              </Button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <Input
                label="اسم الفئة"
                placeholder="مثال: خدمات الكهرباء"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>
                    الخدمات الفرعية
                  </span>
                  <Button variant="outline" small onClick={addSubcategory}>
                    + إضافة خدمة فرعية
                  </Button>
                </div>

                {subcategories.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "8px",
                      alignItems: "flex-end",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Input
                        label={index === 0 ? "اسم الخدمة الفرعية" : ""}
                        placeholder="مثال: تركيب مراوح"
                        value={item}
                        onChange={(e) =>
                          handleSubcategoryChange(index, e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="outline"
                      small
                      onClick={() => removeSubcategory(index)}
                      style={{ minWidth: "90px" }}
                    >
                      حذف
                    </Button>
                  </div>
                ))}
              </div>

              {formError && (
                <div style={{ color: "var(--danger)", fontSize: "13px" }}>
                  {formError}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Button variant="outline" onClick={closeModal}>
                  إلغاء
                </Button>
                <Button onClick={handleSave}>حفظ</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
