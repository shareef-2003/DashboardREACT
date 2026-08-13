import { api } from "./api";


export const getCitiesDropdown = async () => {
  const response = await api.get("/api/admin/cities/dropdown");
  return response.data?.data || [];
};





  


export const getCitiesWithAreas = async () => {
  const response = await api.get("/api/admin/cities");
  return response.data?.data?.data || [];
};

export const updateCityName = async (cityId, newName) => {
  const response = await api.patch(
    `/api/admin/cities/${cityId}?new_name=${newName}`,
  );
  return response.data;
};

export const deleteCity = async (cityName) => {
  const response = await api.delete(`/api/admin/cities/${cityName}`);
  return response.data;
};

export const addAreasToCity = async (city, areas) => {
  const response = await api.post("/api/admin/areas", {
    city,
    areas,
  });

  return response.data?.data;
};

export const deleteArea = async (areaId) => {
  const response = await api.delete(`/api/admin/areas/${areaId}`);
  return response.data;
};

export const getHotAreas = async (days = 30, limit = 5) => {
  const response = await api.get(`/api/admin/service-areas/stats/hot-areas`, {
    params: {
      days: Number(days) || 30,
      limit: Number(limit) || 5,
    },
  });

  return response.data?.data;
};


export const getDensityMap = async (days = 30, area = "", precision = 1) => {
  const params = { days, precision };

  if (area.trim() !== "") {
    params.area = area;
  }

  const response = await api.get(
    "/api/admin/service-areas/stats/density",
    { params }
  );

  return response.data?.data;
};


export const getComplaintsAreas = async (days = 30) => {
  const response = await api.get(
    "/api/admin/service-areas/stats/complaints",
    {
      params: { days }
    }
  );

  return response.data?.data;
};


export const getProviderDistribution = async (page = 1) => {
  const response = await api.get(
    "/api/admin/service-areas/stats/provider-distribution",
    {
      params: { page }
    }
  );

  return response.data?.data;
};


export const getGeographicGrowth = async () => {
  const response = await api.get(
    "/api/admin/service-areas/stats/geographic-growth"
  );

  return response.data?.data;
};


export const getSupplyDemand = async () => {
  const response = await api.get(
    "/api/admin/service-areas/stats/supply-demand"
  );

  return response.data?.data;
};


export const getPriceTrend = async (serviceCategoryId) => {
  const response = await api.get(
    "/api/admin/service-areas/stats/price-trend",
    {
      params: { service_category_id: serviceCategoryId }
    }
  );

  return response.data?.data;
};


export const getPriceComparison = async (serviceCategoryId, requestType) => {
  const response = await api.get(
    "/api/admin/service-areas/stats/price-comparison",
    {
      params: {
        service_category_id: serviceCategoryId,
        request_type: requestType,
      },
    }
  );

  return response.data?.data;
};

