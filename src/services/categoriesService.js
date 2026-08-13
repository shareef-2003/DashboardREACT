import { api } from "./api";
import { endpoints } from "./endpoints";

export const getServiceCategories = async (search = "", sortBy = "") => {
  const params = {};

  if (search.trim() !== "") params.search = search;
  if (sortBy.trim() !== "") params.sort_by = sortBy;

  const response = await api.get("/api/admin/service-categories", { params });

  return response.data?.data;
};

export const addServiceCategory = async (formData) => {
  const response = await api.post("/api/admin/service-categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.data;
};

export const updateServiceCategory = async (id, data) => {
  // إذا كانت هناك صورة → استخدم FormData مع _method=PATCH
  if (data.image instanceof File) {
    const formData = new FormData();

    formData.append("_method", "PATCH"); // مهم جداً

    if (data.name && data.name.trim() !== "") {
      formData.append("name", data.name);
    }

    if (data.description && data.description.trim() !== "") {
      formData.append("description", data.description);
    }

    formData.append("image", data.image);

    const response = await api.post(
      `/api/admin/service-categories/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data?.data;
  }

  // إذا لم تكن هناك صورة → استخدم PATCH عادي
  const jsonPayload = {};

  if (data.name && data.name.trim() !== "") {
    jsonPayload.name = data.name;
  }

  if (data.description && data.description.trim() !== "") {
    jsonPayload.description = data.description;
  }

  const response = await api.patch(
    `/api/admin/service-categories/${id}`,
    jsonPayload,
  );

  return response.data?.data;
};

export const deleteServiceCategory = async (id) => {
  const response = await api.delete(`/api/admin/service-categories/${id}`);
  return response.data;
};

export const getProviderDistributionStats = async () => {
  const response = await api.get(
    "/api/admin/service-categories/stats/provider-distribution",
  );
  return response.data?.data;
};

export const getMostRequestedCategories = async (areaId = null) => {
  const params = {};

  if (areaId) params.area_id = areaId;

  const response = await api.get(
    "/api/admin/service-categories/stats/most-requested",
    { params },
  );

  return response.data?.data;
};

export const getAreas = async () => {
  const response = await api.get("/api/admin/cities");

  // الوصول إلى: data → data → [0] → areas
  const cities = response.data?.data?.data || [];

  // دمج كل المناطق من كل المدن (لو كان لديك أكثر من مدينة لاحقاً)
  const allAreas = cities.flatMap((city) => city.areas);

  return allAreas;
};
