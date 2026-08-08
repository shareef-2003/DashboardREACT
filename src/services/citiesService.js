import { api } from "./api";

export const addCityWithAreas = async (city, areas) => {
  const formData = new FormData();

  formData.append("city", city);

  areas.forEach((area, index) => {
    formData.append(`areas[${index}]`, area);
  });

  const response = await api.post("/api/admin/cities", formData);
  return response.data?.data;
};
