import axios from "axios";
const resource = process.env.VUE_APP_ROOT_API + "/receipts";

export default class ReceiptsService {
  get(id) {
    if (id == null) {
      return axios
        .get(
          resource +
            `?filter={
              "include": [
                "Recipient",
                {
                  "relation": "dispatch",
                  "scope": {
                    "include": [
                      {
                        "relation": "loadingPlan",
                        "scope": {
                          "include": [
                            {
                              "relation": "district"
                            },
                            {
                              "relation": "commodity"
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
`,
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
            `?filter={
          "include": [
            "Recipient",
            {
              "relation": "dispatch",
              "scope": {
                "include": [
                  {
                    "relation": "loadingPlan",
                    "scope": {
                      "include": [
                        {
                          "relation": "district"
                        },
                            {
                              "relation": "commodity"
                            }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
`,
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

  countbydistrict(districtname) {
    return axios
      .get(resource + `/count-by-district/` + districtname, {
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

  quantitybydistrict(districtname) {
    return axios
      .get(resource + `/count-and-quantity-by-district/` + districtname, {
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

  groupedbydeliverynote() {
    return axios
      .get(resource + `/grouped-by-deliverynote`, {
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

  check(physicalDeliveryNote) {
    const myresource = resource + `/exists?physicalDeliveryNote=${encodeURIComponent(
      physicalDeliveryNote
    )}`;

    console.log(myresource, "dddd")

    return axios
      .get(myresource, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => {

        console.log(response, "dsdksdk")
        return response.data; // `true` or `false` based on the endpoint response
      })
      .catch((error) => {
        if (error.response) {
          throw error.response.data.error; // Throw the error message from the server
        } else {
          throw new Error(
            "An error occurred while checking the PhysicalDeliveryNote."
          );
        }
      });
  }

  count() {
    return axios
      .get(
        resource + `/count` + `?filter={"include": ["Recipient", "dispatch" ]}`,
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

  getByReference(data) {
    return axios
      .get(resource + `?filter={"include": ["Recipient", "dispatch" ]}`, {
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
