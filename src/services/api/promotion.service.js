import axios from "axios";
const resource = process.env.VUE_APP_ROOT_API + "/promotions";

export default class ListingService {
  get(id) {
    if (id == null) {
      return axios
        .get(
          resource +
            `?filter={"where":{"status":true},"include": ["file", "user"]}`,
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
        .get(
          resource +
            `/` +
            id +
            `?filter={"include": ["file", "user"]}`,
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
  }

  getpromotionClean(id) {
    if (id == null) {
      return axios
        .get(
          resource +
            `?filter={"limit": 6,
          "order": "created","include": ["file", "user"]}`,
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
        .get(
          resource +
            `/` +
            id +
            `?filter={"include": ["user"]}`,
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
  }

  getpromotion(id) {
    if (id == null) {
      return axios
        .get(
          resource +
            `?filter={
          "order": "created","include": ["file", "user"]}`,
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
        .get(
          resource +
            `/` +
            id +
            `?filter={"include": ["file", "user"]}`,
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

  getLatest() {
    return axios
      .get(
        resource +
          `?filter={
            "limit": 10,
            "order": "created",
            "where": {"status":true},
            "include": [
              {
                "relation": "file",
                "scope": {
                  "limit": 1,
                  "order": ["created DESC"]
                }
              },
              "user"
            ]
          }`,
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

  getPaginated(skip) {
    return axios
      .get(
        resource +
          `?filter={"include": ["file", "user"],
            "limit": 6,
            "skip":` +
          skip +
          `
          }`,
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
