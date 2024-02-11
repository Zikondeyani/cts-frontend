import { defineStore } from "pinia";
import ProvidertypesService from "../services/api/provider-subtypes.service";
const providertypesubcategoriesService = new ProvidertypesService();


export const useProvidertypesubcategoriesStore = defineStore({
  id: "providertypesubcategories",
  state: () => ({
    providertypesubcategories: [],
  }),
  getters: {},
  actions: {
    async get() {
      return await providertypesubcategoriesService
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
      return await providertypesubcategoriesService
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
      return await providertypesubcategoriesService
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
      return await providertypesubcategoriesService
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
      return await providertypesubcategoriesService
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
      return await providertypesubcategoriesService
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
