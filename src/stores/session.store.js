import { defineStore } from "pinia";
import UserService from "../services/api/user.service";

const userService = new UserService();

export const useSessionStore = defineStore({
  id: "session",
  state: () => ({
    token: null,
    user: null,
    role: null,
  }),
  getters: {
    getToken: (state) => {
      if (state.token != null) {
        return state.token;
      } else {
        return sessionStorage.getItem("JWT");
      }
    },
    getUser: (state) => {
      if (state.user != null) {
        return state.user;
      } else {
        return JSON.parse(sessionStorage.getItem("USR"));
      }
    },
    getRole: (state) => {
      if (state.role != null) {
        return state.role;
      } else {
        return JSON.parse(sessionStorage.getItem("RLE"));
      }
    },
  },
  actions: {
    async signIn(credentials) {
      return await userService
        .signin(credentials)
        .then((result) => {
          if (result) {
            //store
            this.token = result.token.id;
            this.role = result.user.role;
            delete result.user.role;
            this.user = result.user;
            //session
            sessionStorage.setItem("JWT", this.token);
            sessionStorage.setItem("RLE", JSON.stringify(this.role));
            sessionStorage.setItem("USR", JSON.stringify(this.user));

            sessionStorage.setItem("FILE", JSON.stringify(this.file));

            return { session: sessionStorage, role: this.role.name };
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 401:
              throw new Error("you entered an invalid password or email");
              break;
            default:
              throw error.message;
          }
        });
    },
    async signUp(data) {
      return await userService
        .signup(data)
        .then((result) => {
          if (result) {
            //store
            return result;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 401:
              throw new Error("you entered an invalid password or email");
              break;
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
    async signOut() {
      sessionStorage.clear();
      sessionStorage.removeItem("JWT");
      sessionStorage.removeItem("RLE");
      sessionStorage.removeItem("USR");

      return sessionStorage;
    },
    async check() {
      return await userService
        .ping()
        .then((result) => {
          if (result) {
            this.role = result.role;
            delete result.role;
            this.user = result;
            //session
            sessionStorage.setItem("RLE", JSON.stringify(this.role));
            sessionStorage.setItem("USR", JSON.stringify(this.user));
            //store
            return this.role.name;
          }
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 401:
              throw new Error(
                "invalid session token please sign in to refresh your session"
              );
              break;
            default:
              throw error.message;
          }
        });
    },
  },
});
