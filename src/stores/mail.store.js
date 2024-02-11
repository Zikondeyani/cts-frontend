import { defineStore } from 'pinia'
import MailService from "../services/api/mail.service";

const mailService = new MailService();

export const useMailStore = defineStore({
    id: 'mail',
    state: () => ({
        mails: [],
    }),
    getters: {

    },
    actions: {
        async send_mail(data) {
            return await mailService.send_mail(data).then((result => {
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
