import { api } from "./api";
import { endpoints } from "./endpoints";

export const getOffers = async () => {
  const res = await api.get(endpoints.offers);
  return res.data;
};
