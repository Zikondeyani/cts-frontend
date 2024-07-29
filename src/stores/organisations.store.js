import { defineStore } from "pinia";
import OrganisationsService from "../services/api/organisations.service";
const organisationService = new OrganisationsService();

export const useorganisationstore = defineStore({
  id: 'organisations',
  state: () => ({
    organisations: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await organisationService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getorganisationsPending() {
      return await organisationService.getorganisationsPending().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getorganisationsSummary() {
      return await organisationService.getorganisationsSummary().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getorganisationsSummaryByCommodity() {
      return await organisationService.getorganisationsSummaryByCommodity().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },



    async getByReference(data) {
      return await organisationService.getByReference(data).then((result => {
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
      return await organisationService
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
      return await organisationService
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
      return await organisationService
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
      return await organisationService
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
      return await organisationService
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
      return await organisationService
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
      return await organisationService
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
