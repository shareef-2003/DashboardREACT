import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import { useTypesStore } from "../../store/typesStore";

export default function TypesPage() {
  const { types, addType, deleteType, updateType } = useTypesStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editType, setEditType] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>إدارة الأنواع</h2>

      {/* إضافة نوع */}
      <Card style={{ marginBottom: "20px" }}>
        <h3>إضافة نوع جديد</h3>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Input
            placeholder="اسم النوع"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="الوصف"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            onClick={() => {
              addType(name, description);
              setName("");
              setDescription("");
            }}
          >
            إضافة
          </Button>
        </div>
      </Card>

      {/* عرض الأنواع */}
      <Card>
        <h3>الأنواع</h3>

        <Table
          columns={[
            { key: "name", title: "النوع" },
            { key: "description", title: "الوصف" },
            {
              key: "actions",
              title: "الإجراءات",
              render: (row) => (
                <>
                  <Button
                    small
                    onClick={() => {
                      setEditType(row);
                      setEditName(row.name);
                      setEditDescription(row.description);
                      setEditModalOpen(true);
                    }}
                  >
                    تعديل
                  </Button>

                  <Button
                    variant="danger"
                    small
                    style={{ marginLeft: "10px" }}
                    onClick={() => deleteType(type.id)}
                  >
                    حذف
                  </Button>
                </>
              ),
            },
          ]}
          data={types}
        />
      </Card>
      {editModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "450px",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>تعديل النوع</h3>

            <Input
              label="اسم النوع"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <Input
              label="الوصف"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              style={{ marginTop: "10px" }}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <Button
                onClick={() => {
                  updateType(editType.id, editName, editDescription);
                  setEditModalOpen(false);
                }}
              >
                حفظ
              </Button>

              <Button variant="danger" onClick={() => setEditModalOpen(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
