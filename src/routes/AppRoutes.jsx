import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthStore } from "../store/authStore";
import Dashboard from "../pages/Dashboard";
import UsersPage from "../pages/Customer";
import ProvidersPage from "../pages/Providers";
import ProviderDetailsPage from "../pages/Providers/Details";
import SettingsPage from "../pages/Settings";
import SubscriptionsReport from "../pages/Providers/SubscriptionsReport";
import MostActiveProviders from "../pages/Providers/MostActive";
import PendingProvidersPage from "../pages/Providers/PendingProvidersPage";
import RejectedProvidersPage from "../pages/Providers/RejectedProvidersPage";
import RejectedProviderDetailsPage from "../pages/Providers/RejectedProviderDetailsPage";
import BlockedProvidersPage from "../pages/Providers/BlockedProvidersPage";
import BlockedProviderDetailsPage from "../pages/Providers/BlockedProviderDetailsPage";
import MostComplainedPage from "../pages/Providers/MostComplained";
import CustomersPage from "../pages/Customer";
import PendingDetailsPage from "../pages/Providers/ProvidersPendingDetailsPage";
import BlockedCustomersPage from "../pages/Customer/BlockedCustomersPage";
import ReviewsPage from "../pages/Reviews/ReviewsPage";
import BlockedProvidersByCustomerPage from "../pages/Customer/BlockedProvidersByCustomerPage";
import StatsCustomersGrowthPage from "../pages/Stats/StatsCustomersGrowthPage";
import StatsServiceRequestsGrowthPage from "../pages/Stats/StatsServiceRequestsGrowthPage";
import CitiesAreasPage from "../pages/Areas/CitiesAreasPage";
import AddCityPage from "../pages/Areas/AddCityPage";
import HotAreasPage from "../pages/Areas/HotAreasPage";
import HotAreaMapPage from "../pages/Areas/HotAreaMapPage";
import ComplaintsAreasPage from "../pages/Areas/ComplaintsAreasPage";
import ProviderDistributionPage from "../pages/Areas/ProviderDistributionPage";
import GeographicGrowthPage from "../pages/Areas/GeographicGrowthPage";
import SupplyDemandPage from "../pages/Areas/SupplyDemandPage";
import PriceTrendPage from "../pages/Areas/PriceTrendPage";
import PriceComparisonPage from "../pages/Areas/PriceComparisonPage";
import ServiceCategoriesPage from "../pages/Categories/ServiceCategoriesPage";
import SubscriptionsPage from "../pages/Subscriptions/SubscriptionsPage";
import SubscriptionDetailsPage from "../pages/subscriptions/SubscriptionDetailsPage";
import ProviderSubscriptionsPage from "../pages/Subscriptions/ProviderSubscriptionsPage";
import ProviderSubscriptionDetailsPage from "../pages/Subscriptions/ProviderSubscriptionDetailsPage";
import PlatformRevenueStatsPage from "../pages/stats/PlatformRevenueStatsPage";

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
        path="/admin/customers-blocked"
        element={
          <ProtectedRoute>
            <BlockedCustomersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute>
            <ReviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stats/customers-growth"
        element={
          <ProtectedRoute>
            <StatsCustomersGrowthPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stats/service-requests-growth"
        element={
          <ProtectedRoute>
            <StatsServiceRequestsGrowthPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/blocked-providers-by-customer/:customerId"
        element={
          <ProtectedRoute>
            <BlockedProvidersByCustomerPage />
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
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<FallbackRedirect />} />
      <Route
        path="/admin/cities-areas"
        element={
          <ProtectedRoute>
            <CitiesAreasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cities/add"
        element={
          <ProtectedRoute>
            <AddCityPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/hot-areas"
        element={
          <ProtectedRoute>
            <HotAreasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/complaints-areas"
        element={
          <ProtectedRoute>
            <ComplaintsAreasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/provider-distribution"
        element={
          <ProtectedRoute>
            <ProviderDistributionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/geographic-growth"
        element={
          <ProtectedRoute>
            <GeographicGrowthPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/supply-demand"
        element={
          <ProtectedRoute>
            <SupplyDemandPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/hot-area-map"
        element={
          <ProtectedRoute>
            <HotAreaMapPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/price-trend"
        element={
          <ProtectedRoute>
            <PriceTrendPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/price-comparison"
        element={
          <ProtectedRoute>
            <PriceComparisonPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/service-categories"
        element={
          <ProtectedRoute>
            <ServiceCategoriesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/subscription-plans"
        element={
          <ProtectedRoute>
            <SubscriptionsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/subscription-plans/:id"
        element={
          <ProtectedRoute>
            <SubscriptionDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/provider-subscriptions"
        element={
          <ProtectedRoute>
            <ProviderSubscriptionsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/provider-subscriptions/:id"
        element={
          <ProtectedRoute>
            <ProviderSubscriptionDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stats/subscriptions-revenue"
        element={
          <ProtectedRoute>
            <PlatformRevenueStatsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
