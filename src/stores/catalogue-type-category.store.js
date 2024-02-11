import { defineStore } from "pinia";
import ListingTypeCategoryService from "../services/api/catalogue-type-category.service";
const catalogueTypesCategoryService = new ListingTypeCategoryService();

export const useListingTypeCategoryStore = defineStore({
  id: 'catalogueTypesCategory',
  state: () => ({
    catalogueTypesCategory: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await catalogueTypesCategoryService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


 
    async getOne(id) {
      return await catalogueTypesCategoryService
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
      return await catalogueTypesCategoryService
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
      return await catalogueTypesCategoryService
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
      return await catalogueTypesCategoryService
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
      return await catalogueTypesCategoryService
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
