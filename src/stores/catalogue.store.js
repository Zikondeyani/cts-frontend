import { defineStore } from "pinia";
import ListingService from "../services/api/catalogue.service";
const catalogueService = new ListingService();

export const useListingStore = defineStore({
  id: 'catalogue',
  state: () => ({
     catalogue: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await catalogueService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getLatest() {
      return await catalogueService
        .getLatest()
        .then((result) => {
          if (result) {
            var response = result;
            return response;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },


    async getPaginated(skip) {
      return await catalogueService
        .getPaginated(skip)
        .then((result) => {
          if (result) {
            var response = result;
            return response;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },

    async getCatalogueClean() {
      return await catalogueService
        .getCatalogueClean()
        .then((result) => {
          if (result) {
            var response = result;
            return response;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },


    
    async getCatalogue() {
      return await catalogueService
        .getCatalogue()
        .then((result) => {
          if (result) {
            var response = result;
            return response;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },
    async getOne(id) {
      return await catalogueService
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
      return await catalogueService
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
      return await catalogueService
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
      return await catalogueService
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
      return await catalogueService
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
