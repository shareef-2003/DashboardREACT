import { api } from "./api";
import { endpoints } from "./endpoints";

export const getModerationLogs = async () => {
  const res = await api.get(endpoints.moderation);
  return res.data;
};
