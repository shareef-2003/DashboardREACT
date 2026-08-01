import { api } from "./api";
import { endpoints } from "./endpoints";

export const getNotifications = async () => {
  const res = await api.get(endpoints.notifications);
  return res.data;
};
