import axios from "axios";
const resource = process.env.VUE_APP_ROOT_API + "/dispatches";

export default class DispatcherService {
  get(id) {
    if (id == null) {
      return axios
        .get(
          resource +
            `?filter={"include": [
          {
            "relation": "loadingPlan",
            "scope": {
              "include": [
                {
                    "relation": "district"
                 },
                 {
                  "relation": "transporter"
               },
  
               {
                "relation": "warehouse"
             }
             
           ,  {"relation":"commodity","scope":{"include":[{"relation":"commodityType"}]}},
  
           {
            "relation": "activity"
         },
  
         {
          "relation": "user"
       }
              ]
            }
          }
          , "Dispatcher"]}`,
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
            `?filter={"include": [
          {
            "relation": "loadingPlan",
            "scope": {
              "include": [
                {
                    "relation": "district"
                 },
                 {
                  "relation": "transporter"
               },
  
               {
                "relation": "warehouse"
             }
             
           ,  {"relation":"commodity","scope":{"include":[{"relation":"commodityType"}]}},
  
           {
            "relation": "activity"
         },
  
         {
          "relation": "user"
       }
              ]
            }
          }
          , "Dispatcher"]}`,
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

  getExtendedDispatchSummary(dateFilter) {
    const endpoint = `${resource}/dispatch-summary`;
    return axios
      .get(endpoint, {
        params: dateFilter ? { dateFilter } : {}, // Adds the query parameter if provided
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.response) {
          throw error.response.data.error;
        }
        throw error.message;
      });
  }

  getExtendedDispatchSummaryWFP(dateFilter) {
    const endpoint = `${resource}/filtered-summary`;

    return axios
      .get(endpoint, {
        params: dateFilter ? { dateFilter } : {}, // Adds the query parameter if provided
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.response) {
          throw error.response.data.error;
        }
        throw error.message;
      });
  }

  getExtendedDispatchSummaryDodma(dateFilter) {
    const endpoint = `${resource}/filtered-summary/dodma`;

    return axios
      .get(endpoint, {
        params: dateFilter ? { dateFilter } : {}, // Adds the query parameter if provided
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${sessionStorage.getItem("JWT")}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.response) {
          throw error.response.data.error;
        }
        throw error.message;
      });
  }

  getExtendedDispatchSummary2(id) {
    if (id == null) {
      return axios
        .get(resource + "/dispatch-summary2", {
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
    } else if (id != null) {
      return axios
        .get(resource + `/` + id, {
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

  getExtendedDispatchSummaryWFP2(id) {
    if (id == null) {
      return axios
        .get(resource + "/filtered-summary2", {
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
    } else if (id != null) {
      return axios
        .get(resource + `/` + id, {
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

  getExtendedDispatchSummaryDodma2(id) {
    if (id == null) {
      return axios
        .get(resource + "/filtered-summary/dodma2", {
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
    } else if (id != null) {
      return axios
        .get(resource + `/` + id, {
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

  getdispatchSummary(id) {
    if (id == null) {
      return axios
        .get(
          resource +
            "/summary" +
            `?filter={"include": [
        {
          "relation": "loadingPlan",
          "scope": {
            "include": [
              {
                  "relation": "district"
               },
               {
                "relation": "transporter"
             },

             {
              "relation": "warehouse"
           }
           
         ,  {"relation":"commodity","scope":{"include":[{"relation":"commodityType"}]}},

         {
          "relation": "activity"
       },

       {
        "relation": "user"
     }
            ]
          }
        }
        , "Dispatcher"]}`,
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
            `?filter={"include":  ["loadingPlan", "Dispatcher"]}`,
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

  getdispatchPerfomance() {
    return axios
      .get(resource + "/performance-stats", {
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

  getdispatchSummaryTime() {
    return axios
      .get(resource + "/dispatch-summary-time", {
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

  getdispatchUserSummary() {
    return axios
      .get(resource + "/user-dispatch-summary", {
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

  getdispatchDamageSummary() {
    return axios
      .get(
        resource +
          "/damaged-summary" +
          `?filter={"include": [
        {
          "relation": "loadingPlan",
          "scope": {
            "include": [
              {
                  "relation": "district"
               },
               {
                "relation": "transporter"
             },

             {
              "relation": "warehouse"
           }
           ,

           {
            "relation": "commodity"
         },

         {
          "relation": "activity"
       },

       {
        "relation": "user"
     }
            ]
          }
        }
        , "Dispatcher"]}`,
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

  expected(districtname) {
    return axios
      .get(
        resource +
          `/expected-by-district/` +
          districtname +
          `?filter={"include": [
        {
          "relation": "loadingPlan",
          "scope": {
            "include": [
              {
                  "relation": "district"
               },
               {
                "relation": "transporter"
             },

             {
              "relation": "dispatch"
           },

             {
              "relation": "warehouse"
           }
           ,

           {
            "relation": "commodity"
         },

         {
          "relation": "activity"
       },

       {
        "relation": "user"
     }
            ]
          }
        }
        , "Dispatcher"]}`,
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
      .get(resource + `/count` + `?filter={"where": {},"include": []} `, {
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

  ping() {
    return axios
      .get(resource + `/ping`, {
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

  async removeWithComments(data) {
    return await axios
      .post(resource + "/" + data.id + `/delete`, data, {
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
