import { defineStore } from "pinia";
import SubcategoryService from "../services/api/subcategory.service";
const subcategoryService = new SubcategoryService();

export const usesubcategory = defineStore({
  id: 'subcategories',
  state: () => ({
    subcategories: [],
  }),
  getters: {

  },
  actions: {
    async get() {
      return await subcategoryService.get().then((result) => {
        if (result) {
          var response = result;
          return response
        }
      });
    },


    async getsubcategoryClean() {
      return await subcategoryService
        .getsubcategoriesClean()
        .then((result) => {
          if (result) {
            var response = result;
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



    async getByReference(data) {
      return await subcategoryService.getByReference(data).then((result => {
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
      return await subcategoryService
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
      return await subcategoryService
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


    async createsubcategory(data) {
      return await subcategoryService
        .createsubcategories(data)
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
      return await subcategoryService
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

    async updatesubcategory(data) {
      return await subcategoryService
        .updatesubcategories(data)
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
      return await subcategoryService
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
      return await subcategoryService
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
