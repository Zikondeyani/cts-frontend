import { defineStore } from "pinia";
import SubscriptionService from "../services/api/subscription.service";
const subscriptionService = new SubscriptionService();

export const usesubscriptionstore = defineStore({
  id: 'subscriptions',
  state: () => ({
     subscriptions: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await subscriptionService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getOne(id) {
      return await subscriptionService
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
      return await subscriptionService
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
      return await subscriptionService
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
      return await subscriptionService
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
      return await subscriptionService
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
