import { api } from "./api";
import { endpoints } from "./endpoints";

export const getCustomers = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.area_id) params.append("area_id", filters.area_id);
  if (filters.search) params.append("search", filters.search);

  const query = params.toString();
  const url = query ? `/api/admin/customers?${query}` : `/api/admin/customers`;

  const response = await api.get(url);
  return response.data?.data?.data || [];
};
