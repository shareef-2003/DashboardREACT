import { api } from "./api";
import { endpoints } from "./endpoints";

export const getSupportTickets = async () => {
  const res = await api.get(endpoints.support);
  return res.data;
};
