import { defineStore } from "pinia";
import LoadingPlansService from "../services/api/loadingplans.service";
const loadingplansService = new LoadingPlansService();

export const useloadingplanstore = defineStore({
  id: 'loadingplans',
  state: () => ({
    loadingplans: [],
  }),
  getters: {

  },
  actions: {



    async getLoadings() {
      return await loadingplansService.getLoadings().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async get() {
      return await loadingplansService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getWarehouseLoad() {
      return await loadingplansService.getWarehouseLoad().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getloadingplansPending() {
      return await loadingplansService.getloadingplansPending().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getloadingplansDispatchesStats() {
      return await loadingplansService.getloadingplansDispatchesStats().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getloadingplansDispatchesReminders() {
      return await loadingplansService.getloadingplansDispatchesReminders().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getloadingplansNoReceipts() {
      return await loadingplansService.getloadingplansNoReceipts().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getloadingplansUnapproved() {
      return await loadingplansService.getloadingplansUnapproved().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getloadingplansNoDispatches() {
      return await loadingplansService.getloadingplansNoDispatches().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getloadingplansDispatchesRemindersSendMail() {
      return await loadingplansService.getloadingplansDispatchesRemindersSendMail().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getloadingplansDispatchesById(id) {
      return await loadingplansService.getloadingplansDispatchesById(id).then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getloadingplansSummary() {
      return await loadingplansService.getloadingplansSummary().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getloadingplansSummaryPrepo() {
      return await loadingplansService.getloadingplansSummaryPrepo().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getloadingplansPrepo(){
      return await loadingplansService.getloadingplansPrepo().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },
    
    async getloadingplansSummaryEMR() {
      return await loadingplansService.getloadingplansSummaryEMR().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getloadingplansByATC() {
      return await loadingplansService.getloadingplansByATC().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },

    async getloadingplansDataSummary() {
      return await loadingplansService.getloadingplansDataSummary().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },




    async getloadingplansSummaryByCommodity() {
      return await loadingplansService.getloadingplansSummaryByCommodity().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getByReference(data) {
      return await loadingplansService.getByReference(data).then((result => {
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
      return await loadingplansService
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
      return await loadingplansService
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
      return await loadingplansService
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

    async createLoadingPlans(data) {
      return await loadingplansService
        .createLoadingPlans(data)
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
      return await loadingplansService
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

    async updateLoadingPlans(data) {
      return await loadingplansService
        .updateLoadingPlans(data)
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
      return await loadingplansService
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
      return await loadingplansService
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
      return await loadingplansService
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
