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
      // Determine the next COUNT number by looking at existing counts
      const existing = await inventoryCountService.get().then((result) => {
        if (result && Array.isArray(result)) {
          // Extract numbers from existing countNumbers like "COUNT 1", "CNT-123"
          const numbers = result
            .map((r) => r.countNumber || r.Notes)
            .filter((n) => n)
            .map((n) => {
              const m = n.match(/(\d+)/);
              return m ? parseInt(m[1], 10) : 0;
            })
            .filter((n) => !isNaN(n));
          return Math.max(...numbers, 0);
        }
        return 0;
      });

      const nextCount = existing + 1;
      const countNumber = `COUNT ${nextCount}`;

      // Prepare the data with the sequential count number
            const base = {
        CreatedOn: new Date().toISOString(),
        UpdatedOn: new Date().toISOString(),
        countNumber,
        Notes: countNumber,
        countedById: String(data.countedById || ''),
        warehouseId: Number(data.warehouseId || 0),
        state: "Draft",
      };
      // Ensure id is never sent when creating a new count
      delete base.id;

      const payload = {
        ...base,
      };

      return await inventoryCountService.create(payload).then((result) => {
        if (result) {
          // Update the local record with the proper countNumber
          result.countNumber = countNumber;
          result.Notes = countNumber;
        }
        return result;
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
