import { api } from "./api";

export const getCustomersGrowth = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.year) params.append("year", filters.year);
  if (filters.date_from) params.append("date_from", filters.date_from);
  if (filters.date_to) params.append("date_to", filters.date_to);

  const url = `/api/admin/stats-customers-growth?${params.toString()}`;

  const response = await api.get(url);
  return response.data?.data || [];
};
