import { defineStore } from "pinia";
import ReceivedCommoditiesService from "../services/api/receivedCommodities.service";
const receivedCommoditiesService = new ReceivedCommoditiesService();

export const useReceivedCommoditiesStore = defineStore({
  id: 'ReceivedCommodities',
  state: () => ({
    ReceivedCommodities: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await receivedCommoditiesService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getdispatchDamageSummary() {
      return await receivedCommoditiesService.getdispatchDamageSummary().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getByReference(data) {
      return await receivedCommoditiesService.getByReference(data).then((result => {
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
      return await receivedCommoditiesService
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
      return await receivedCommoditiesService
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
      return await receivedCommoditiesService
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
      return await receivedCommoditiesService
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
      return await receivedCommoditiesService
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
