import { defineStore } from "pinia";
import ListingService from "../services/api/promotion.service";
const promotionService = new ListingService();

export const usePromotionStore = defineStore({
  id: 'promotion',
  state: () => ({
     promotion: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await promotionService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getLatest() {
      return await promotionService
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
      return await promotionService
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

    async getpromotionClean() {
      return await promotionService
        .getpromotionClean()
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


    
    async getpromotion() {
      return await promotionService
        .getpromotion()
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
      return await promotionService
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
      return await promotionService
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
      return await promotionService
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
      return await promotionService
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
      return await promotionService
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
