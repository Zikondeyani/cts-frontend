import { defineStore } from "pinia";
import InstructedDispatchesService from "../services/api/instructedDispatches.service";
const instructedDispatchesService = new InstructedDispatchesService();

export const useInstructedDispatchesStore = defineStore({
  id: 'InstructedDispatches',
  state: () => ({
    InstructedDispatches: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await instructedDispatchesService.get().then((result) => {
        if (result) {
          this.InstructedDispatches = result;
          return this.InstructedDispatches
        }
      });
    },





    async getByReference(data) {
      return await instructedDispatchesService.getByReference(data).then((result => {
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
      return await instructedDispatchesService
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
      return await instructedDispatchesService
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
      return await instructedDispatchesService
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
      return await instructedDispatchesService
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
      return await instructedDispatchesService
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
