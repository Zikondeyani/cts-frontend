import { defineStore } from "pinia";
import commoditytransfersReceiptsService from "../services/api/commoditytransfersreceipts.service";
const commodityTransfersReceiptsService = new commoditytransfersReceiptsService();

export const usecommoditytransfersreceiptsservice = defineStore({
  id: 'commoditytransfersreceipts',
  state: () => ({
     commoditytransfers: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await commodityTransfersReceiptsService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    
    async getByReference(data) {
      return await commodityTransfersReceiptsService.getByReference(data).then((result => {
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
      return await commodityTransfersReceiptsService
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
      return await commodityTransfersReceiptsService
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
      return await commodityTransfersReceiptsService
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
      return await commodityTransfersReceiptsService
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
      return await commodityTransfersReceiptsService
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
