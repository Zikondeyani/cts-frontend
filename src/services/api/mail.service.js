import axios from 'axios';
const resource = process.env.VUE_APP_MAIL_API + "/mail";

export default class MailService {
  
    async send_mail(data) {
        try {
            const response = await axios
                .post(resource, data, {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json"
                    }
                });
            var result = response.data;
            return result;
        } catch (error) {
            if (error.response) {
                throw error.response.data.error;
            }
        }
    };

  
}