import { defineStore } from 'pinia'
import LogService from "../services/api/log.service";

const logService = new LogService();

export const useLogStore = defineStore({
    id: 'log',
    state: () => ({
        logs: [],
    }),
    getters: {

    },
    actions: {
        async get(email) {
            return await logService.get(email).then((result => {
                if (result) {
                    return  result;
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
