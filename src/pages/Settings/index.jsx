import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { useSettingsStore } from "../../store/settingsStore";
import { useAuthStore } from "../../store/authStore";
import { languages, themes } from "../../mocks/settings";

export default function SettingsPage() {
  const {
    name,
    email,
    phone,
    language,
    theme,
    notifications,
    setField: setSettingsField,
  } = useSettingsStore();

  const {
    current_password,
    new_password,
    new_password_confirmation,
    changePassword,
    passwordChangeError,
    passwordChangeSuccess,
    loading,
    user,
    setField: setAuthField,
  } = useAuthStore();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    await changePassword();
  };

  return (
    <DashboardLayout>
      <h2 style={{ marginBottom: "20px" }}>إعدادات النظام</h2>

      {user?.must_change_password && (
        <Card style={{ marginBottom: "20px", color: "var(--danger)" }}>
          يجب تغيير كلمة المرور الافتراضية قبل استخدام بقية واجهات الإدارة.
        </Card>
      )}

      <Card style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "15px" }}>إعدادات الحساب</h3>

        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <Input
            label="الاسم"
            value={name}
            onChange={(e) => setSettingsField("name", e.target.value)}
          />

          <Input
            label="البريد الإلكتروني"
            value={email}
            onChange={(e) => setSettingsField("email", e.target.value)}
          />

          <Input
            label="رقم الهاتف"
            value={phone}
            onChange={(e) => setSettingsField("phone", e.target.value)}
          />
        </div>
      </Card>

      <Card style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "15px" }}>إعدادات النظام</h3>

        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <Select
            label="اللغة"
            value={language}
            onChange={(e) => setSettingsField("language", e.target.value)}
            options={languages}
          />

          <Select
            label="الثيم"
            value={theme}
            onChange={(e) => setSettingsField("theme", e.target.value)}
            options={themes}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) =>
                setSettingsField("notifications", e.target.checked)
              }
            />
            <label>تفعيل الإشعارات</label>
          </div>
        </div>
      </Card>

      <Card>
        <h3 style={{ marginBottom: "15px" }}>إعدادات الأمان</h3>

        <form onSubmit={handlePasswordChange}>
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <Input
              label="كلمة المرور الحالية"
              type="password"
              value={current_password}
              onChange={(e) =>
                setAuthField("current_password", e.target.value)
              }
            />
            <Input
              label="كلمة المرور الجديدة"
              type="password"
              value={new_password}
              onChange={(e) => setAuthField("new_password", e.target.value)}
            />
            <Input
              label="تأكيد كلمة المرور الجديدة"
              type="password"
              value={new_password_confirmation}
              onChange={(e) =>
                setAuthField("new_password_confirmation", e.target.value)
              }
            />
          </div>

          {passwordChangeError && (
            <div
              style={{
                color: "var(--danger)",
                fontSize: "13px",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              {passwordChangeError}
            </div>
          )}

          {passwordChangeSuccess && (
            <div
              style={{
                color: "var(--success)",
                fontSize: "13px",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              {passwordChangeSuccess}
            </div>
          )}

          <Button
            style={{ marginTop: "20px" }}
            disabled={loading}
            type="submit"
          >
            {loading ? "جاري تحديث كلمة المرور..." : "تغيير كلمة المرور"}
          </Button>
        </form>
      </Card>
    </DashboardLayout>
  );
}
