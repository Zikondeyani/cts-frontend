import { defineStore } from "pinia";
import DispatcherService from "../services/api/dispatch.service";
import { useSessionStore } from "./session.store";
const dispatcherService = new DispatcherService();

export const useDispatcherStore = defineStore({
  id: "dispatcher",
  state: () => ({
    dispatchers: [],
  }),
  getters: {},
  actions: {
    async get() {
      return await dispatcherService
        .get()
        .then((result) => {
         
            return result;
          
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },

    async getOne(id) {
      return await dispatcherService
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
      return await dispatcherService
        .create(data)
        .then((result) => {
          if (result) {

            console.log(result, "over herer")
            return result;
          }
        })
        .catch((error) => {

          throw error.message;

        });
    },
    async update(data) {
      return await dispatcherService
        .update(data)
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {

          throw error.message;

        });
    },

    async changepass(data) {
      return await dispatcherService
        .changepassword(data)
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {

          throw error.message;

        });
    },

    async remove(id) {
      return await dispatcherService
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
      return await dispatcherService
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
