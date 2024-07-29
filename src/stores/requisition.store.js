import { defineStore } from "pinia";
import RequisitionService from "../services/api/requisitions.service";
const requisitionsService = new RequisitionService();

export const userequisitionstore = defineStore({
  id: 'requisitions',
  state: () => ({
     requisitions: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await requisitionsService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getCommodityDistributionSummary(data) {
      return await requisitionsService.getCommodityDistributionSummary().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    }
,
    
    async getByReference(data) {
      return await requisitionsService.getByReference(data).then((result => {
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
      return await requisitionsService
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
      return await requisitionsService
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
      return await requisitionsService
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
      return await requisitionsService
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
      return await requisitionsService
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
