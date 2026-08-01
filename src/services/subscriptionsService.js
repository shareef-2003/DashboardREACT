import { api } from "./api";
import { endpoints } from "./endpoints";

export const getSubscriptions = async () => {
  const res = await api.get(endpoints.subscriptions);
  return res.data;
};
