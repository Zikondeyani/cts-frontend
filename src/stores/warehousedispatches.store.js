import { defineStore } from "pinia";
import warehouseDispatchesService from "../services/api/warehousedispatches.service";
const WarehouseDispatchesService = new warehouseDispatchesService();

export const useWarehouseDispatchesStore = defineStore({
  id: 'warehouseDispatches',
  state: () => ({
    warehouseDispatches: [],
  }),
  getters: {

  },
  actions: {




    async get() {
      return await WarehouseDispatchesService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseLoad() {
      return await WarehouseDispatchesService.getWarehouseLoad().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getWarehouseRequisitionsPending() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsPending().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsDispatchesStats() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsDispatchesStats().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsDispatchesReminders() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsDispatchesReminders().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsNoReceipts() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsNoReceipts().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsUnapproved() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsUnapproved().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsNoDispatches() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsNoDispatches().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getWarehouseRequisitionsDispatchesRemindersSendMail() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsDispatchesRemindersSendMail().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsDispatchesById(id) {
      return await WarehouseDispatchesService.getWarehouseRequisitionsDispatchesById(id).then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    

    async getDataSummaryAll() {
      return await WarehouseDispatchesService.getDataSummaryAll().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseRequisitionsSummary() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsSummary().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsSummaryPrepo() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsSummaryPrepo().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsPrepo(){
      return await WarehouseDispatchesService.getWarehouseRequisitionsPrepo().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },
    
    async getWarehouseRequisitionsSummaryEMR() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsSummaryEMR().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsByATC() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsByATC().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getWarehouseRequisitionsDataSummary() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsDataSummary().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },




    async getWarehouseRequisitionsSummaryByCommodity() {
      return await WarehouseDispatchesService.getWarehouseRequisitionsSummaryByCommodity().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getByReference(data) {
      return await WarehouseDispatchesService.getByReference(data).then((result => {
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
      return await WarehouseDispatchesService
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
      return await WarehouseDispatchesService
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
      return await WarehouseDispatchesService
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
      return await WarehouseDispatchesService
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
      return await WarehouseDispatchesService
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
      return await WarehouseDispatchesService
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
      return await WarehouseDispatchesService
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
      return await WarehouseDispatchesService
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
      return await WarehouseDispatchesService
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
