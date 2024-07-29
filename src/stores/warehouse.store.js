import { defineStore } from "pinia";
import WarehouseService from "../services/api/warehouse.service";
const warehouseService = new WarehouseService();

export const usewarehousestore = defineStore({
  id: 'warehouses',
  state: () => ({
    warehouses: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await warehouseService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async inventorydetails() {
      return await warehouseService.inventorydetails().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    }
    ,
    async getByReference(data) {
      return await warehouseService.getByReference(data).then((result => {
        if (result) {
          return result
        }
      })).catch(error => {
        switch (error.statusCode) {
          default:
            throw error.message
        }
      });
    },

    async getOne(id) {
      return await warehouseService
        .get(id)
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },
    async create(data) {
      return await warehouseService
        .create(data)
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },



    async update(data) {
      return await warehouseService
        .update(data)
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },



    async remove(id) {
      return await warehouseService
        .remove(id)
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },

    async count() {
      return await warehouseService
        .count()
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },
  },
});
