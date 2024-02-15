import { defineStore } from "pinia";
import TransportersService from "../services/api/commodity.service";
const commodityService = new TransportersService();

export const usecommoditiestore = defineStore({
  id: 'commodities',
  state: () => ({
     commodities: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await commodityService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


 

    
    async getByReference(data) {
      return await commodityService.getByReference(data).then((result => {
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
      return await commodityService
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
      return await commodityService
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
      return await commodityService
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
      return await commodityService
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
      return await commodityService
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
