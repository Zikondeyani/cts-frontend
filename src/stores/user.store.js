import { defineStore } from "pinia";
import UserService from "../services/api/user.service";
import { useSessionStore } from "./session.store";
const userService = new UserService();

const sessionStore = useSessionStore();
export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    users: [],
  }),
  getters: {},
  actions: {
    async get() {
      return await userService
        .get()
        .then((result) => {
          if (result) {
            var response = result.filter((item) => {
              return item.id != sessionStore.getUser.id;
            });
            response = response.filter((item) => {
              return item.name !== "administrator";
            });
            return response;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            default:
              throw error.message;
          }
        });
    },

    async getProviders() {
      return await userService
        .getProviders()
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
      return await userService
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
      return await userService
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
      return await userService
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

    async changepass(data) {
      return await userService
        .changepassword(data)
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 409:
              throw new Error("password change failed ");
              break;
            default:
              throw error.message;
          }
        });
    },

    async remove(id) {
      return await userService
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
      return await userService
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
