import axios from 'axios';
const resource = process.env.VUE_APP_ROOT_API + "/files";

export default class FileService {
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

    upload(data) {
        let formData = new FormData();
        //Needs Work
        formData.append('file', data.attachment);
        formData.append('referenceId', data.referenceId);
        formData.append('type', data.type);
        formData.append('name', data.name);

        formData.append('subcategory', data.subcategory);
        formData.append('metadata', JSON.stringify(data.metadata));
        return axios
            .post(resource + '/upload', formData, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "multipart/form-data",
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

    getByReference(data) {
        return axios
            .get(
                resource + `?filter={"where":{"referenceId":"${data.id}","type":"${data.type}"}}`,
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