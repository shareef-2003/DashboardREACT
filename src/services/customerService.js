import { api } from "./api";

export const getCustomers = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.area_id) params.append("area_id", filters.area_id);
  if (filters.search) params.append("search", filters.search);

  const response = await api.get(`/admin/customers?${params.toString()}`);

  return response.data?.data?.data || []; // لأن البيانات داخل data.data
};
