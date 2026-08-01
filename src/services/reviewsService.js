import { api } from "./api";
import { endpoints } from "./endpoints";

export const getReviews = async () => {
  const res = await api.get(endpoints.reviews);
  return res.data;
};
