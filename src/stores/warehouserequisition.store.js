import { defineStore } from "pinia";
import warehouseRequisitionsService from "../services/api/warehouserequisitions.service";
const WarehouseRequisitionsService = new warehouseRequisitionsService();

export const useWarehouseRequisitionsStore = defineStore({
  id: 'WarehouseRequisitions',
  state: () => ({
    WarehouseRequisitions: [],
  }),
  getters: {

  },
  actions: {



    async getLoadings() {
      return await WarehouseRequisitionsService.getLoadings().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async get() {
      return await WarehouseRequisitionsService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseLoad() {
      return await WarehouseRequisitionsService.getWarehouseLoad().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getWarehouseRequisitionsPending() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsPending().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsDispatchesStats() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsDispatchesStats().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsDispatchesReminders() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsDispatchesReminders().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsNoReceipts() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsNoReceipts().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsUnapproved() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsUnapproved().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsNoDispatches() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsNoDispatches().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getWarehouseRequisitionsDispatchesRemindersSendMail() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsDispatchesRemindersSendMail().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsDispatchesById(id) {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsDispatchesById(id).then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    

    async getDataSummaryAll() {
      return await WarehouseRequisitionsService.getDataSummaryAll().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsSummary() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsSummary().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsSummaryPrepo() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsSummaryPrepo().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsPrepo(){
      return await WarehouseRequisitionsService.getWarehouseRequisitionsPrepo().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },
    
    async getWarehouseRequisitionsSummaryEMR() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsSummaryEMR().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsByATC() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsByATC().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsDataSummary() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsDataSummary().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },




    async getWarehouseRequisitionsSummaryByCommodity() {
      return await WarehouseRequisitionsService.getWarehouseRequisitionsSummaryByCommodity().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getByReference(data) {
      return await WarehouseRequisitionsService.getByReference(data).then((result => {
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
      return await WarehouseRequisitionsService
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
      return await WarehouseRequisitionsService
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
      return await WarehouseRequisitionsService
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
      return await WarehouseRequisitionsService
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
      return await WarehouseRequisitionsService
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
      return await WarehouseRequisitionsService
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
      return await WarehouseRequisitionsService
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
      return await WarehouseRequisitionsService
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
      return await WarehouseRequisitionsService
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
