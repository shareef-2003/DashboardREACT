import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isLoggedIn, token, user } = useAuthStore();

  if (!isLoggedIn || !token) return <Navigate to="/login" replace state={{ from: location }} />;

  if (user?.must_change_password && location.pathname !== "/settings") {
    return <Navigate to="/settings" replace />;
  }

  return children;
}
