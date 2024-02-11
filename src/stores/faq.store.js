import { defineStore } from "pinia";
import FaqService from "../services/api/faq.service";
const faqService = new FaqService();

export const usefaqstore = defineStore({
  id: 'faqs',
  state: () => ({
    faqs: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await faqService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async geFaqsClean() {
      return await faqService
        .geFaqsClean()
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
      return await faqService
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
      return await faqService
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
      return await faqService
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
      return await faqService
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
      return await faqService
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
