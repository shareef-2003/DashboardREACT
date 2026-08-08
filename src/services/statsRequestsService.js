import { api } from "./api";

export const getRequestsGrowth = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.year) params.append("year", filters.year);
  if (filters.request_type) params.append("request_type", filters.request_type);
  if (filters.service_category_id) params.append("service_category_id", filters.service_category_id);

  const url = `/api/admin/stats-service-requests-growth?${params.toString()}`;

  const response = await api.get(url);
  return response.data?.data || [];
};
