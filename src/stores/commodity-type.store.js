import { defineStore } from "pinia";
import CommoditytypesService from "../services/api/commoditytypes.service";
const commoditytypesService = new CommoditytypesService();

export const usecommoditytypestore = defineStore({
  id: 'commoditytypes',
  state: () => ({
     commoditytypes: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await commoditytypesService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


 

    
    async getByReference(data) {
      return await commoditytypesService.getByReference(data).then((result => {
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
      return await commoditytypesService
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
      return await commoditytypesService
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
      return await commoditytypesService
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
      return await commoditytypesService
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
      return await commoditytypesService
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
