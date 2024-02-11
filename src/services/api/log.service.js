import axios from 'axios';
const resource = process.env.VUE_APP_ROOT_API + "/logs";

export default class LogService {
    get(id) {
        return axios
            .get(
                resource +
                '?filter={"where":{"user.id":"' + id + '"},"order":["created DESC"]}',
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("JWT")}`
                    }
                }
            )
            .then(response => {
                var result = response.data;
                return result;
            })
            .catch(error => {
                if (error.response) {
                    throw error.response.data.error;
                }
            });

    };

    create(data) {
        return axios
            .post(resource, data, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("JWT")}`
                }
            })
            .then(response => {
                var result = response.data;
                return result;
            })
            .catch(error => {
                if (error.response) {
                    throw error.response.data.error;
                }
            });
    };

    count() {
        return axios
            .get(
                resource + `/count` +
                `?filter={"where": {},"include": []}`,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("JWT")}`
                    }
                }
            )
            .then(response => {
                var result = response.data;
                return result;
            })
            .catch(error => {
                if (error.response) {
                    throw error.response.data.error;
                }
            });
    };

}