import axios from "axios";
const resource = process.env.VUE_APP_ROOT_API + "/bookings";

export default class BookingService {
  get(id) {
    if (id == null) {
      return axios
        .get(
          resource +
          `?filter={"include": [
              "listings", "user"
            ]}`,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "Application/json",
              Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
            },
          }
        )
        .then((response) => {
          var result = response.data;

          return result;
        })
        .catch((error) => {
          if (error.response) {
            throw error.response.data.error;
          }
        });
    } else if (id != null) {
      return axios
        .get(resource + `/` + id + `?filter={"include": [
          "listings", "user"
        ]}`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
          },
        })
        .then((response) => {
          var result = response.data;
          return result;
        })
        .catch((error) => {
          if (error.response) {
            throw error.response.data.error;
          }
        });
    }
  }

  getbookingsClean(id) {
    if (id == null) {
      return axios
        .get(
          resource +
          `?filter={"include": [
          "listings", "user"
        ]}`,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-type": "Application/json",
              Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
            },
          }
        )
        .then((response) => {
          var result = response.data;

          return result;
        })
        .catch((error) => {
          if (error.response) {
            throw error.response.data.error;
          }
        });
    } else if (id != null) {
      return axios
        .get(resource + `/` + id + `?filter={"include": [
          "listings", "user"
        }`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
          },
        })
        .then((response) => {
          var result = response.data;
          return result;
        })
        .catch((error) => {
          if (error.response) {
            throw error.response.data.error;
          }
        });
    }
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
      .then((response) => {
        var result = response.data;
        return result;
      })
      .catch((error) => {
        if (error.response) {
          throw error.response.data.error;
        }
      });
  }

  count() {
    return axios
      .get(resource + `/count` + `?filter={"where": {},"include": []}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => {
        var result = response.data;
        return result;
      })
      .catch((error) => {
        if (error.response) {
          throw error.response.data.error;
        }
      });
  }

  update(data) {
    return axios
      .patch(resource + `/` + data.id, data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => {
        var result = response.data;
        return result;
      })
      .catch((error) => {
        if (error.response) {
          throw error.response.data.error;
        }
      });
  }



  updateChecklist(data) {
    return axios
      .patch(resource + `/` + data.id + '/checklists', data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => {
        var result = response.data;
        return result;
      })
      .catch((error) => {
        if (error.response) {
          throw error.response.data.error;
        }
      });
  }


  createChecklist(data) {
    return axios
      .patch(resource + `/` + data.id + '/checklists', data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => {
        var result = response.data;
        return result;
      })
      .catch((error) => {
        if (error.response) {
          throw error.response.data.error;
        }
      });
  }



  getByReference(data) {
    return axios
      .get(
        resource +
        `?filter={"where":{"listingsId":"${data.id}"},"include": [
              "listings", "user"
            ]}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
          },
        }
      )
      .then((response) => {
        var result = response.data;
        return result;
      })
      .catch((error) => {
        if (error.response) {
          throw error.response.data.error;
        }
      });
  }
  remove(id) {
    return axios
      .delete(resource + `/` + id, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => {
        var result = response.data;
        return result;
      })
      .catch((error) => {
        if (error.response) {
          throw error.response.data.error;
        }
      });
  }
}
