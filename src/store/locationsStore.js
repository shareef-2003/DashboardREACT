import { create } from "zustand";
import { citiesMock } from "../mocks/locations";

export const useLocationsStore = create((set) => ({
  cities: citiesMock,

  addCity: (name) =>
    set((state) => ({
      cities: [
        ...state.cities,
        { id: Date.now(), name, lat: 33.5, lng: 36.3, areas: [] },
      ],
    })),

  deleteCity: (id) =>
    set((state) => ({
      cities: state.cities.filter((c) => c.id !== id),
    })),

  addArea: (cityId, areaName) =>
    set((state) => ({
      cities: state.cities.map((city) =>
        city.id === cityId
          ? {
              ...city,
              areas: [
                ...city.areas,
                {
                  id: Date.now(),
                  name: areaName,
                  lat: city.lat,
                  lng: city.lng,
                  orders: 0,
                  providers: 0,
                },
              ],
            }
          : city,
      ),
    })),

  deleteArea: (cityId, areaId) =>
    set((state) => ({
      cities: state.cities.map((city) =>
        city.id === cityId
          ? {
              ...city,
              areas: city.areas.filter((a) => a.id !== areaId),
            }
          : city,
      ),
    })),
}));
