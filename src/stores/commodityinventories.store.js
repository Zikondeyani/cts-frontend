import { defineStore } from "pinia";
import ActivitiesService from "../services/api/commodityinventories.service";
const commodityinventoriesService = new ActivitiesService();

export const usecommodityinventoriestore = defineStore({
  id: 'commodityinventories',
  state: () => ({
     commodityinventories: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await commodityinventoriesService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


 

    
    async getByReference(data) {
      return await commodityinventoriesService.getByReference(data).then((result => {
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
      return await commodityinventoriesService
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
      return await commodityinventoriesService
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
      return await commodityinventoriesService
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
      return await commodityinventoriesService
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
      return await commodityinventoriesService
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
