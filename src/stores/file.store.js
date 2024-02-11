import { defineStore } from 'pinia'
import FileService from "../services/api/file.service";
const fileService = new FileService();

export const useFileStore = defineStore({
    id: 'file',
    state: () => ({
       files: [],
    }),
    getters: {

    },
    actions: {
        async get() {
            return await fileService.get().then((result => {
                if (result) {
                   
                    var response = result
                    return response
                }
            })).catch(error => {
                switch (error.statusCode) {
                    default:
                        throw error.message
                }
            });
        },
        async getOne(id) {
            return await fileService.get(id).then((result => {
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
        async getByReference(data) {
            return await fileService.getByReference(data).then((result => {
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

        async create(data) {
            return await fileService.create(data).then((result => {
                if (result) {
                    return result;
                }
            })).catch(error => {
                switch (error.statusCode) {
                    default:
                        throw error.message
                }

            });
        },
        async upload(data) {
            return await fileService.upload(data).then((result => {
                if (result) {
                    return result;
                }
            })).catch(error => {
                switch (error.statusCode) {
                    default:
                        throw error.message
                }

            });
        },
        async update(data) {
            return await fileService.update(data).then((result => {
                if (result) {
                    return result;
                }
            })).catch(error => {
                switch (error.statusCode) {
                  
                    default:
                        throw error.message
                }
            });
        },

        async remove(id) {
            return await fileService.remove(id).then((result => {
                if (result) {
                    return result;
                }
            })).catch(error => {
                switch (error.statusCode) {
                    default:
                        throw error.message
                }
            });
        },

        async count() {
            return await fileService.count().then((result => {
                if (result) {
                    return result;
                }
            })).catch(error => {
                switch (error.statusCode) {
                    default:
                        throw error.message
                }
            });
        },
    }
})
