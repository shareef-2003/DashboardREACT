import { api } from "./api";
import { endpoints } from "./endpoints";

export const getCategories = async () => {
  const res = await api.get(endpoints.categories);
  return res.data;
};
