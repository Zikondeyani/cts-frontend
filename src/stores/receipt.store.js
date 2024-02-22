import { defineStore } from "pinia";
import ReceiptsService from "../services/api/receipts.service";
const receiptsService = new ReceiptsService();

export const usereceiptstore = defineStore({
  id: 'receipts',
  state: () => ({
    receipts: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await receiptsService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async countbydistrict(districtname) {
      return await receiptsService
        .countbydistrict(districtname)
        .then((result) => {
          if (result) {
            return result
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },




    async quantitybydistrict(districtname) {
      return await receiptsService
        .quantitybydistrict(districtname)
        .then((result) => {
          if (result) {
            return result
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },

    async getByReference(data) {
      return await receiptsService.getByReference(data).then((result => {
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
      return await receiptsService
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
      return await receiptsService
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
      return await receiptsService
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
      return await receiptsService
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
      return await receiptsService
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
