import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthStore } from "../store/authStore";
import Dashboard from "../pages/Dashboard";
import UsersPage from "../pages/Customer";
import ProvidersPage from "../pages/Providers";
import ProviderDetailsPage from "../pages/Providers/Details";
import OrdersPage from "../pages/Orders";
import ReportsPage from "../pages/Reports";
import SettingsPage from "../pages/Settings";
import TypesPage from "../pages/Types";
import ReviewsPage from "../pages/Reviews";
import SupportPage from "../pages/Support";
import SubscriptionsReport from "../pages/Providers/SubscriptionsReport";
import MostActiveProviders from "../pages/Providers/MostActive";
import VerificationPage from "../pages/Verification";
import PendingProvidersPage from "../pages/Providers/PendingProvidersPage";
import PlatformScopePage from "../pages/PlatformScope";
import RejectedProvidersPage from "../pages/Providers/RejectedProvidersPage";
import RejectedProviderDetailsPage from "../pages/Providers/RejectedProviderDetailsPage";
import BlockedProvidersPage from "../pages/Providers/BlockedProvidersPage";
import BlockedProviderDetailsPage from "../pages/Providers/BlockedProviderDetailsPage";
import MostComplainedPage from "../pages/Providers/MostComplained";
import CustomersPage from "../pages/Customer";
import PendingDetailsPage from "../pages/Providers/ProvidersPendingDetailsPage";
function FallbackRedirect() {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.must_change_password) {
    return <Navigate to="/settings" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/providers"
        element={
          <ProtectedRoute>
            <ProvidersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/providers/pending"
        element={
          <ProtectedRoute>
            <PendingProvidersPage />
          </ProtectedRoute>
        }
      />
      <Route path="/providers/pending/:id" element={<PendingDetailsPage />} />

      <Route
        path="/providers/rejected"
        element={
          <ProtectedRoute>
            <RejectedProvidersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/providers/blocked"
        element={
          <ProtectedRoute>
            <BlockedProvidersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/providers/subscriptions-report"
        element={
          <ProtectedRoute>
            <SubscriptionsReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/providers/blocked/:providerId"
        element={<BlockedProviderDetailsPage />}
      />

      <Route
        path="/providers/rejected/:providerId"
        element={<RejectedProviderDetailsPage />}
      />

      <Route
        path="/providers/:providerId"
        element={
          <ProtectedRoute>
            <ProviderDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/providers/most-active"
        element={
          <ProtectedRoute>
            <MostActiveProviders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/providers/most-complained"
        element={<MostComplainedPage />}
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/types"
        element={
          <ProtectedRoute>
            <TypesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <ReviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <SupportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verification"
        element={
          <ProtectedRoute>
            <VerificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/platform-scope"
        element={
          <ProtectedRoute>
            <PlatformScopePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<FallbackRedirect />} />
    </Routes>
  );
}
