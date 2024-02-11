import { defineStore } from "pinia";
import ProvidertypesService from "../services/api/provider-types.service";
const providertypesService = new ProvidertypesService();


export const useProviderTypeStore = defineStore({
  id: "providertype",
  state: () => ({
    providertypes: [],
  }),
  getters: {},
  actions: {
    async get() {
      return await providertypesService
        .get()
        .then((result) => {

          return result
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },



    async getOne(id) {
      return await providertypesService
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
      return await providertypesService
        .create(data)
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 409:
              throw new Error(
                "this email is already in use , please enter another one "
              );
              break;
            default:
              throw error.message;
          }
        });
    },
    async update(data) {
      return await providertypesService
        .update(data)
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 409:
              throw new Error(
                "this email is already in use , please enter another one "
              );
              break;
            default:
              throw error.message;
          }
        });
    },



    async remove(id) {
      return await providertypesService
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
      return await providertypesService
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
