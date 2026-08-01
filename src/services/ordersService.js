import { api } from "./api";
import { endpoints } from "./endpoints";

export const getOrders = async () => {
  const res = await api.get(endpoints.orders);
  return res.data;
};
