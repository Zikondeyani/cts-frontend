import { defineStore } from "pinia";
import ActionRequestorService from "../services/api/action.requestor.service";
const actionRequestorService = new ActionRequestorService();

export const useactionrequestorstore = defineStore({
  id: 'actionrequestors',
  state: () => ({
     actionrequestors: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await actionRequestorService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


 

    
    async getByReference(data) {
      return await actionRequestorService.getByReference(data).then((result => {
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
      return await actionRequestorService
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
      return await actionRequestorService
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
      return await actionRequestorService
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
      return await actionRequestorService
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
      return await actionRequestorService
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
