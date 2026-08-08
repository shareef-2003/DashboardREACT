import { api } from "./api";
import { endpoints } from "./endpoints";

export const getCustomers = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.area_id) params.append("area_id", Number(filters.area_id));
  if (filters.joined_from) params.append("joined_from", filters.joined_from);
  if (filters.joined_to) params.append("joined_to", filters.joined_to);

  const query = params.toString();
  const url = query ? `${endpoints.customers}?${query}` : endpoints.customers;

  const response = await api.get(url);
  return response.data?.data?.data || [];
};

export const deleteCustomer = async (customerId) => {
  const response = await api.delete(`/api/admin/delete-customer/${customerId}`);
  return response.data;
};

export const blockCustomer = async (customerId, reason, duration) => {
  const body = {
    reason,
    duration_in_days: duration,
  };

  const response = await api.patch(
    `/api/admin/block-customer/${customerId}`,
    body,
  );
  return response.data;
};

export const unblockCustomer = async (customerId) => {
  const response = await api.patch(`/api/admin/unblock-customer/${customerId}`);
  return response.data;
};

export const getBlockedCustomers = async () => {
  const response = await api.get("/api/admin/customers-blocked");
  return response.data?.data?.data || [];
};



