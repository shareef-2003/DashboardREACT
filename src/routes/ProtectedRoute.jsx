import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // اجلب القيم بشكل ثابت
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // غير مسجل دخول
  if (!isLoggedIn || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // يجب تغيير كلمة المرور
  if (user?.must_change_password && location.pathname !== "/settings") {
    return <Navigate to="/settings" replace />;
  }

  return children;
}
