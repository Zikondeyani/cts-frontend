import { defineStore } from "pinia";
import TransportersService from "../services/api/districts.service";
const districtsService = new TransportersService();

export const usedistrictstore = defineStore({
  id: 'districts',
  state: () => ({
     districts: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await districtsService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


 

    
    async getByReference(data) {
      return await districtsService.getByReference(data).then((result => {
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
      return await districtsService
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
      return await districtsService
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
      return await districtsService
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
      return await districtsService
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
      return await districtsService
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
