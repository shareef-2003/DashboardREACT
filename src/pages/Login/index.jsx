import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { useAuthStore } from "../../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("session") === "expired";
  const {
    user_name,
    password,
    loading,
    error,
    setField,
    login,
    isLoggedIn,
    user,
  } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(user?.must_change_password ? "/settings" : "/dashboard", {
        replace: true,
      });
    }
  }, [isLoggedIn, navigate, user?.must_change_password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login();

    if (success) {
      const mustChangePassword =
        useAuthStore.getState().user?.must_change_password;
      navigate(mustChangePassword ? "/settings" : "/dashboard", {
        replace: true,
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.34, ease: "easeOut" }}
          style={{ width: "380px", maxWidth: "calc(100vw - 32px)" }}
        >
          <Card>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              تسجيل الدخول
            </h2>

            {sessionExpired && (
              <div
                style={{
                  color: "var(--danger)",
                  fontSize: "13px",
                  textAlign: "center",
                  marginBottom: "16px",
                }}
              >
                انتهت جلسة الدخول. يرجى تسجيل الدخول مرة أخرى.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <Input
                label="اسم المستخدم"
                type="text"
                value={user_name}
                onChange={(e) => setField("user_name", e.target.value)}
              />

              <Input
                label="كلمة المرور"
                type="password"
                value={password}
                onChange={(e) => setField("password", e.target.value)}
              />

              {error && (
                <div
                  style={{
                    color: "var(--danger)",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}

              <Button full disabled={loading} type="submit">
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
