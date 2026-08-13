import { defineStore } from "pinia";
import InventoryCountService from "../services/api/inventorycount.service";
const inventoryCountService = new InventoryCountService();

export const useinventorycountstore = defineStore({
  id: "inventorycounts",
  state: () => ({
    inventoryCounts: [],
  }),
  actions: {
    async get() {
      return await inventoryCountService.get().then((result) => {
        if (result) return result;
      });
    },

    async getOne(id) {
      return await inventoryCountService.get(id).then((result) => {
        if (result) return result;
      });
    },

    async create(data) {
      return await inventoryCountService.create(data).then((result) => {
        if (result) return result;
      });
    },

    async update(data) {
      return await inventoryCountService.update(data).then((result) => {
        if (result) return result;
      });
    },

    async createItem(id, item) {
      return await inventoryCountService.createItem(id, item).then((result) => {
        if (result) return result;
      });
    },

    async remove(id) {
      return await inventoryCountService.remove(id).then((result) => {
        if (result) return result;
      });
    },
  },
});
