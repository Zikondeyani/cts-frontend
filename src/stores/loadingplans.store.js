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
    async get() {
      return await loadingplansService.get().then((result) => {
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


    async getloadingplansSummary() {
      return await loadingplansService.getloadingplansSummary().then((result) => {
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
  },
});
