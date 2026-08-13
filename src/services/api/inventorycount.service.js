import axios from "axios";
const resource = process.env.VUE_APP_ROOT_API + "/inventorycounts";
const includeFilter = `?filter={"include":["warehouse","countedBy"]}`;

export default class InventoryCountService {
  get(id) {
    if (id == null) {
      return axios
        .get(resource + includeFilter , {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
          },
        })
        .then((response) => response.data)
        .catch((error) => {
          if (error.response) throw error.response.data.error;
        });
    }

    return axios
      .get(resource + `/${id}` + includeFilter , {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.response) throw error.response.data.error;
      });
  }

  create(data) {
    return axios
      .post(resource, data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.response) throw error.response.data.error;
      });
  }

  update(data) {
    return axios
      .patch(resource + `/${data.id}`, data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.response) throw error.response.data.error;
      });
  }

  createItem(id, item) {
    return axios
      .post(`${resource}/${id}/items`, item, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.response) throw error.response.data.error;
      });
  }

  remove(id) {
    return axios
      .delete(resource + `/${id}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.response) throw error.response.data.error;
      });
  }
}
