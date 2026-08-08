import { api } from "./api";

export const getBlockedProvidersByCustomer = async (customerId) => {
  const response = await api.get(
    `/api/admin/blocked-providers-by-customers?customer_id=${customerId}`
  );

  return response.data?.data?.data || [];
};
