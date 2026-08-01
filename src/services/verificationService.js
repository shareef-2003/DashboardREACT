import { api } from "./api";
import { endpoints } from "./endpoints";

export const getVerificationRequests = async () => {
  const res = await api.get(endpoints.verification);
  return res.data;
};
