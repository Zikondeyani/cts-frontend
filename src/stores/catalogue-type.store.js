import { defineStore } from "pinia";
import ListingTypeService from "../services/api/catalogue-type.service";
const catalogueTypeService = new ListingTypeService();

export const useListingTypeStore = defineStore({
  id: 'catalogueTypes',
  state: () => ({
    catalogueTypes: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await catalogueTypeService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getVehicles(skip) {

      return await catalogueTypeService.getVehicles(skip).then((result) => {

        if (result) {
          var response = result;
          return response
        }
      });
    },
    
    async getPrinting(skip) {
      return await catalogueTypeService.getPrinting(skip).then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },
    
    async getAmenities() {
      return await catalogueTypeService.getAmenities().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

 
    async getOne(id) {
      return await catalogueTypeService
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
      return await catalogueTypeService
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
      return await catalogueTypeService
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
      return await catalogueTypeService
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
      return await catalogueTypeService
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
