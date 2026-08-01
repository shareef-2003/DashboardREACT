import { api } from "./api";
import { endpoints } from "./endpoints";

export const getSubscriptionsBreakdown = async () => {
  const response = await api.get(
    "api/admin/service-providers-subscriptions-breakdown",
  );
  return response.data?.data || [];
};

export const getMostActiveProviders = async () => {
  const response = await api.get("api/admin/most-active");
  return response.data?.data || [];
};

export const approveProvider = async (providerId) => {
  const body = qs.stringify({
    status: "approved",
  });

  const response = await api.patch(`api/admin/approval/${providerId}`, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

// export const rejectProvider = async (providerId, reason) => {
//   const body = qs.stringify({
//     status: "rejected",
//     reason,
//   });

//   const response = await api.patch(`/admin/approval/${providerId}`, body, {
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   });

//   return response.data;
// };

export const getApprovedProviders = async () => {
  const response = await api.get(endpoints.providers);
  return response.data?.data || [];
};

export const reconsiderProvider = async (providerId) => {
  const body = qs.stringify({});

  const response = await api.patch(
    `admin/reconsideration/${providerId}`,
    body,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
};

export const deleteProvider = async (providerId) => {
  const response = await api.delete(
    `api/admin/delete-service-provider/${providerId}`,
  );
  return response.data;
};

import qs from "qs";

export const blockProvider = async (providerId, reason, duration) => {
  const body = qs.stringify({
    reason,
    duration_in_days: duration,
  });

  const response = await api.patch(`admin/block/${providerId}`, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

export const unblockProvider = async (providerId) => {
  const body = qs.stringify({});

  const response = await api.patch(`/admin/unblock/${providerId}`, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};
export const getMostComplainedProviders = async () => {
  const response = await api.get("api/admin/most-complained");
  return response.data?.data || [];
};

export const getBlockedProviders = async () => {
  const response = await api.get("/api/admin/service-providers-blocked");
  return response.data?.data || [];
};

export const getRejectedProviders = async () => {
  const response = await api.get("api/admin/service-providers-rejected");
  return response.data?.data || [];
};

export const getProviderDetails = async (providerId) => {
  const response = await api.get(`${endpoints.providerDetails}/${providerId}`);
  return response.data?.data || null;
};

export const getPendingProviders = async () => {
  const response = await api.get(endpoints.pendingProviders);
  return response.data?.data || [];
};
export const getFilteredProviders = async (filters = {}) => {
  const params = new URLSearchParams();

  // إضافة الفلاتر إذا كانت موجودة
  if (filters.area_id) params.append("area_id", filters.area_id);
  if (filters.category_id) params.append("category_id", filters.category_id);
  if (filters.subscription_id)
    params.append("subscription_id", filters.subscription_id);
  if (filters.search) params.append("search", filters.search);

  // إضافة الترتيب إذا كان موجودًا
  if (filters.sort_by) params.append("sort_by", filters.sort_by);
  if (filters.sort_direction)
    params.append("sort_direction", filters.sort_direction);

  const response = await api.get(
    `api/admin/service-providers-filter?${params.toString()}`,
  );

  return response.data?.data || [];
};
export const giveComplimentaryMonth = async (
  providerId,
  subscriptionId = 2,
) => {
  const response = await api.patch(
    `api/admin/service-providers-complimentary-month/${providerId}?subscription_id=${subscriptionId}`,
  );
  return response.data;
};
