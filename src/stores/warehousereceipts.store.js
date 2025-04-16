import { defineStore } from "pinia";
import WarehouseReciptssService from "../services/api/warehousereceipts.service";
const warehowseReciptssService = new WarehouseReciptssService();

export const usewarehouseReceiptsStore = defineStore({
  id: 'warehouseReceipts',
  state: () => ({
    warehouseReceipts: [],
  }),
  getters: {

  },
  actions: {




    async get() {
      return await warehowseReciptssService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseLoad() {
      return await warehowseReciptssService.getWarehouseLoad().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getWarehouseRequisitionsPending() {
      return await warehowseReciptssService.getWarehouseRequisitionsPending().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsDispatchesStats() {
      return await warehowseReciptssService.getWarehouseRequisitionsDispatchesStats().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsDispatchesReminders() {
      return await warehowseReciptssService.getWarehouseRequisitionsDispatchesReminders().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsNoReceipts() {
      return await warehowseReciptssService.getWarehouseRequisitionsNoReceipts().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsUnapproved() {
      return await warehowseReciptssService.getWarehouseRequisitionsUnapproved().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsNoDispatches() {
      return await warehowseReciptssService.getWarehouseRequisitionsNoDispatches().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getWarehouseRequisitionsDispatchesRemindersSendMail() {
      return await warehowseReciptssService.getWarehouseRequisitionsDispatchesRemindersSendMail().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsDispatchesById(id) {
      return await warehowseReciptssService.getWarehouseRequisitionsDispatchesById(id).then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    

    async getDataSummaryAll() {
      return await warehowseReciptssService.getDataSummaryAll().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsSummary() {
      return await warehowseReciptssService.getWarehouseRequisitionsSummary().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsSummaryPrepo() {
      return await warehowseReciptssService.getWarehouseRequisitionsSummaryPrepo().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsPrepo(){
      return await warehowseReciptssService.getWarehouseRequisitionsPrepo().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },
    
    async getWarehouseRequisitionsSummaryEMR() {
      return await warehowseReciptssService.getWarehouseRequisitionsSummaryEMR().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsByATC() {
      return await warehowseReciptssService.getWarehouseRequisitionsByATC().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsDataSummary() {
      return await warehowseReciptssService.getWarehouseRequisitionsDataSummary().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },




    async getWarehouseRequisitionsSummaryByCommodity() {
      return await warehowseReciptssService.getWarehouseRequisitionsSummaryByCommodity().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getByReference(data) {
      return await warehowseReciptssService.getByReference(data).then((result => {
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
      return await warehowseReciptssService
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
      return await warehowseReciptssService
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

    async createWarehouseLoad(data) {
      return await warehowseReciptssService
        .createWarehouseLoad(data)
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

    async createWarehouseRequisitions(data) {
      return await warehowseReciptssService
        .createWarehouseRequisitions(data)
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
      return await warehowseReciptssService
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

    async updateWarehouseRequisitions(data) {
      return await warehowseReciptssService
        .updateWarehouseRequisitions(data)
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
      return await warehowseReciptssService
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
      return await warehowseReciptssService
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



    async removeWithComments(data) {
      return await warehowseReciptssService
        .removeWithComments(data)
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {

          throw error.message;

        });
    },

  },
});
