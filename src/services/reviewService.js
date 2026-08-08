import { api } from "./api";

export const getReviews = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.provider_search) params.append("provider_search", filters.provider_search);
  if (filters.category_id) params.append("category_id", Number(filters.category_id));
  if (filters.sort_by) params.append("sort_by", filters.sort_by);
  if (filters.per_page) params.append("per_page", Number(filters.per_page));

  const query = params.toString();
  const url = query
    ? `/api/admin/reviews?${query}`
    : `/api/admin/reviews`;

  const response = await api.get(url);
  return response.data?.data?.data || [];
};
