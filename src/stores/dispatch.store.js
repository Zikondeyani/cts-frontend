import { defineStore } from "pinia";
import DispatcherService from "../services/api/dispatch.service";
import { useSessionStore } from "./session.store";
const dispatcherService = new DispatcherService();

export const useDispatcherStore = defineStore({
  id: "dispatcher",
  state: () => ({
    dispatchers: [],
    
    performanceData: null,
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



    async getdispatchUserSummary() {
      return await dispatcherService
        .getdispatchUserSummary()
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

  
    async getdispatchDamageSummary() {
      return await dispatcherService
        .getdispatchDamageSummary()
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

    async getdispatchSummaryTime() {
      return await dispatcherService
        .getdispatchSummaryTime()
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

    async getdispatchPerfomance() {
      return await dispatcherService
        .getdispatchPerfomance()
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

    async getExtendedDispatchSummary(filter) {
      return await dispatcherService
        .getExtendedDispatchSummary(filter)
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


    async getExtendedDispatchSummaryWFP(filter) {
      return await dispatcherService
        .getExtendedDispatchSummaryWFP(filter)
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

    async getExtendedDispatchSummaryWFP2() {
      return await dispatcherService
        .getExtendedDispatchSummaryWFP2()
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


    async getExtendedDispatchSummaryDodma(filter) {
      return await dispatcherService
        .getExtendedDispatchSummaryDodma(filter)
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

 
     async getExtendedDispatchSummaryDodma2() {
      return await dispatcherService
        .getExtendedDispatchSummaryDodma2()
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


    async getdispatchSummary() {
      return await dispatcherService
        .getdispatchSummary()
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


    async getdispatchSummary2() {
      return await dispatcherService
        .getExtendedDispatchSummary2()
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


    async expected(districtname) {

      return await dispatcherService
        .expected(districtname)
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

    async create(data) {
      return await dispatcherService
        .create(data)
        .then((result) => {
          if (result) {
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

 
    async removeWithComments(data) {
      return await dispatcherService
        .removeWithComments(data)
        .then((result) => {
          if (result) {
            return result;
          }
        })
        .catch((error) => {

          throw error.message;

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
