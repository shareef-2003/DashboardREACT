import { create } from "zustand";
import { typesMock } from "../mocks/types";

export const useTypesStore = create((set) => ({
  types: typesMock,

  addType: (name, description) =>
    set((state) => ({
      types: [
        ...state.types,
        { id: Date.now(), name, description },
      ],
    })),

  deleteType: (id) =>
    set((state) => ({
      types: state.types.filter((t) => t.id !== id),
    })),

  updateType: (id, newName, newDescription) =>
    set((state) => ({
      types: state.types.map((t) =>
        t.id === id
          ? { ...t, name: newName, description: newDescription }
          : t
      ),
    })),
}));
