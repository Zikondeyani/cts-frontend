import axios from 'axios';
const resource = process.env.VUE_APP_ROOT_API + "/roles";

export default class RoleService {
    get(id) {
        if (id == null) {
            return axios
                .get(
                    resource,
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
        } else if (id != null) {
            return axios
                .get(
                    resource +
                    `/` +
                    id +
                    `?filter={"include": []}`,
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
        }
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

    update(data) {
        return axios
            .patch(resource + `/` + data.id, data, {
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

    remove(id) {
        return axios
            .delete(resource + `/` + id, {
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
}