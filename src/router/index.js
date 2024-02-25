import { createRouter, createWebHistory } from "vue-router";

const routes = [
  //Landing
  /*   {
      path: "/",
      component: () => import("../components/layouts/main.layout.vue"),
      children: [
        {
          path: "",
          name: "landing",
          redirect: { name: "home" },
        },
        {
          path: "/home",
          name: "home",
          component: () => import("../pages/index.page.vue"),
        },
  
        // {
        //   path: "",
        //   name: 'landing',
        //   redirect: { name: 'home' },
        // },
        // {
        //   name: 'home',
        //   path: "/home",
        //   component: () => import('../pages/index.page.vue'),
        // },
      ],
    }, */
  //Portal



  {
    path: "/",
    component: () => import("../components/layouts/plain.layout.vue"),
    children: [
      {
        path: "",
        name: "portal-home",
        redirect: { name: "portal-signin" },
      },
      {
        name: "portal-signin",
        path: "/portal/signin",
        component: () => import("../pages/portal/signin.page.vue"),
      },

      {
        name: "portal-forgot-password",
        path: "/portal/forgot-password",
        component: () => import("../pages/portal/forgot-password.page.vue"),
      },
    ],
  },


  //Admin
  {
    path: "/admin",
    name: "admin",
    component: () => import("../components/layouts/admin.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "admin-home",
        redirect: { name: "admin-dashboard" },
      },
      {
        path: "/admin/dashboard",
        name: "admin-dashboard",
        component: () => import("../pages/admin/dashboard/index.page.vue"),
      },
      //Users
      {
        path: "/admin/users",
        name: "admin-users",
        component: () => import("../pages/admin/users/index.page.vue"),
      },
      {
        path: "/admin/users/manage/:id",
        name: "admin-manage-user",
        component: () => import("../pages/admin/users/manage.page.vue"),
      },

      {
        path: "/admin/dispatch-management",
        name: "admin-dispatch-management",
        component: () => import("../pages/admin/dispatch/index.page.vue"),
      },

      {
        path: "/admin/dispatches",
        name: "admin-dispatches",
        component: () => import("../pages/admin/dispatch/dispatches.page.vue"),
      },

      {
        path: "/admin/loadingplans",
        name: "admin-loadingplans",
        component: () => import("../pages/admin/loadingplans/index.page.vue"),
      },
      {
        path: "/admin/dispatch-management/manage/:id",
        name: "admin-manage-catalogue",
        component: () => import("../pages/admin/dispatch/manage.page.vue"),
      },

      {
        path: "/admin/commodity-tracking",
        name: "admin-commodity-tracking",
        component: () => import("../pages/admin/commodities/index.page.vue"),
      },
      {
        path: "/admin/commodity-tracking/manage/:id",
        name: "admin-manage-commodity-tracking",
        component: () => import("../pages/admin/commodities/manage.page.vue"),
      },


      {
        path: "/admin/receipt-management",
        name: "admin-receipt-management",
        component: () => import("../pages/admin/receipts/index.page.vue"),
      },


      {
        path: "/admin/receipts",
        name: "admin-receipts",
        component: () => import("../pages/admin/receipts/receipts.page.vue"),
      },

      {
        path: "/admin/receipt-management/manage/:id",
        name: "admin-manage-receipt-management",
        component: () => import("../pages/admin/receipts/manage.page.vue"),
      },

      {
        path: "/admin/requisition-management",
        name: "admin-requisition-management",
        component: () => import("../pages/admin/requisitions/index.page.vue"),
      },
      {
        path: "/admin/receipt-management/manage/:id",
        name: "admin-manage-requisition-management",
        component: () => import("../pages/admin/requisitions/manage.page.vue"),
      },



      {
        path: "/admin/system",
        name: "admin-system",
        component: () => import("../pages/admin/system/index.page.vue"),
      },


      {
        path: "/admin/project-management",
        name: "admin-project-management",
        component: () => import("../pages/admin/projects/index.page.vue"),
      },



    ],
    beforeEnter: (to, from, next) => {
      let role = JSON.parse(sessionStorage.getItem("RLE"));
      if (role != null && typeof role.name != "undefined") {
        if (role.name == "admin") {
          next();
        } else {
          next({ name: "portal-signin" });
        }
      } else {
        next({ name: "portal-signin" });
      }
    },
  },



   //Manager
   {
    path: "/manager",
    name: "manager",
    component: () => import("../components/layouts/manager.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "manager-home",
        redirect: { name: "manager-dashboard" },
      },
      {
        path: "/manager/dashboard",
        name: "manager-dashboard",
        component: () => import("../pages/manager/dashboard/index.page.vue"),
      },
      //Users
      {
        path: "/manager/users",
        name: "manager-users",
        component: () => import("../pages/manager/users/index.page.vue"),
      },
      {
        path: "/manager/users/manage/:id",
        name: "manager-manage-user",
        component: () => import("../pages/manager/users/manage.page.vue"),
      },

      {
        path: "/manager/dispatch-management",
        name: "manager-dispatch-management",
        component: () => import("../pages/manager/dispatch/index.page.vue"),
      },

      {
        path: "/manager/dispatches",
        name: "manager-dispatches",
        component: () => import("../pages/manager/dispatch/dispatches.page.vue"),
      },

      {
        path: "/manager/loadingplans",
        name: "manager-loadingplans",
        component: () => import("../pages/manager/loadingplans/index.page.vue"),
      },
      {
        path: "/manager/dispatch-management/manage/:id",
        name: "manager-manage-catalogue",
        component: () => import("../pages/manager/dispatch/manage.page.vue"),
      },

      {
        path: "/manager/commodity-tracking",
        name: "manager-commodity-tracking",
        component: () => import("../pages/manager/commodities/index.page.vue"),
      },
      {
        path: "/manager/commodity-tracking/manage/:id",
        name: "manager-manage-commodity-tracking",
        component: () => import("../pages/manager/commodities/manage.page.vue"),
      },


      {
        path: "/manager/receipt-management",
        name: "manager-receipt-management",
        component: () => import("../pages/manager/receipts/index.page.vue"),
      },


      {
        path: "/manager/receipts",
        name: "manager-receipts",
        component: () => import("../pages/manager/receipts/receipts.page.vue"),
      },

      {
        path: "/manager/receipt-management/manage/:id",
        name: "manager-manage-receipt-management",
        component: () => import("../pages/manager/receipts/manage.page.vue"),
      },

      {
        path: "/manager/requisition-management",
        name: "manager-requisition-management",
        component: () => import("../pages/manager/requisitions/index.page.vue"),
      },
      {
        path: "/manager/receipt-management/manage/:id",
        name: "manager-manage-requisition-management",
        component: () => import("../pages/manager/requisitions/manage.page.vue"),
      },



      {
        path: "/manager/system",
        name: "manager-system",
        component: () => import("../pages/manager/system/index.page.vue"),
      },


      {
        path: "/manager/project-management",
        name: "manager-project-management",
        component: () => import("../pages/manager/projects/index.page.vue"),
      },


      
      {
        path: "/manager/report-management",
        name: "manager-report-management",
        component: () => import("../pages/manager/reports/index.page.vue"),
      },


    ],
    beforeEnter: (to, from, next) => {
      let role = JSON.parse(sessionStorage.getItem("RLE"));
      if (role != null && typeof role.name != "undefined") {
        if (role.name == "manager") {
          next();
        } else {
          next({ name: "portal-signin" });
        }
      } else {
        next({ name: "portal-signin" });
      }
    },
  },


  //Dispatcher
  {
    path: "/dispatcher",
    name: "dispatcher",
    component: () => import("../components/layouts/dispatcher.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "dispatcher-home",
        redirect: { name: "dispatcher-dashboard" },
      },
      {
        path: "/dispatcher/dashboard",
        name: "dispatcher-dashboard",
        component: () => import("../pages/dispatcher/dashboard/index.page.vue"),
      },
      //Users
      {
        path: "/dispatcher/users",
        name: "dispatcher-users",
        component: () => import("../pages/dispatcher/users/index.page.vue"),
      },
      {
        path: "/dispatcher/users/manage/:id",
        name: "dispatcher-manage-user",
        component: () => import("../pages/dispatcher/users/manage.page.vue"),
      },

      {
        path: "/dispatcher/dispatch-management",
        name: "dispatcher-dispatch-management",
        component: () => import("../pages/dispatcher/dispatch/index.page.vue"),
      },
      {
        path: "/dispatcher/dispatch-management/manage/:id",
        name: "dispatcher-manage-catalogue",
        component: () => import("../pages/dispatcher/dispatch/manage.page.vue"),
      },

      {
        path: "/dispatcher/commodity-tracking",
        name: "dispatcher-commodity-tracking",
        component: () => import("../pages/dispatcher/commodities/index.page.vue"),
      },
      {
        path: "/dispatcher/commodity-tracking/manage/:id",
        name: "dispatcher-manage-commodity-tracking",
        component: () => import("../pages/dispatcher/commodities/manage.page.vue"),
      },


      {
        path: "/dispatcher/receipt-management",
        name: "dispatcher-receipt-management",
        component: () => import("../pages/dispatcher/receipts/index.page.vue"),
      },
      {
        path: "/dispatcher/receipt-management/manage/:id",
        name: "dispatcher-manage-receipt-management",
        component: () => import("../pages/dispatcher/receipts/manage.page.vue"),
      },

      {
        path: "/dispatcher/requisition-management",
        name: "dispatcher-requisition-management",
        component: () => import("../pages/dispatcher/requisitions/index.page.vue"),
      },
      {
        path: "/dispatcher/receipt-management/manage/:id",
        name: "dispatcher-manage-requisition-management",
        component: () => import("../pages/dispatcher/requisitions/manage.page.vue"),
      },



      {
        path: "/dispatcher/system",
        name: "dispatcher-system",
        component: () => import("../pages/dispatcher/system/index.page.vue"),
      },


      {
        path: "/dispatcher/project-management",
        name: "dispatcher-project-management",
        component: () => import("../pages/dispatcher/projects/index.page.vue"),
      },



      {
        path: "/dispatcher/report-management",
        name: "dispatcher-report-management",
        component: () => import("../pages/dispatcher/reports/index.page.vue"),
      },


      
      {
        path: "/dispatcher/loadingplans",
        name: "dispatcher-loadingplans",
        component: () => import("../pages/dispatcher/loadingplans/index.page.vue"),
      },


         
      {
        path: "/dispatcher/dispatches",
        name: "dispatcher-dispatches",
        component: () => import("../pages/dispatcher/dispatch/dispatches.page.vue"),
      },


    ],
    beforeEnter: (to, from, next) => {
      let role = JSON.parse(sessionStorage.getItem("RLE"));
      if (role != null && typeof role.name != "undefined") {
        if (role.name == "dispatcher") {
          next();
        } else {
          next({ name: "portal-signin" });
        }
      } else {
        next({ name: "portal-signin" });
      }
    },
  },



  //Planner
  {
    path: "/planner",
    name: "planner",
    component: () => import("../components/layouts/planner.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "planner-home",
        redirect: { name: "planner-dashboard" },
      },
      {
        path: "/planner/dashboard",
        name: "planner-dashboard",
        component: () => import("../pages/planner/dashboard/index.page.vue"),
      },
      //Users
      {
        path: "/planner/users",
        name: "planner-users",
        component: () => import("../pages/planner/users/index.page.vue"),
      },
      {
        path: "/planner/users/manage/:id",
        name: "planner-manage-user",
        component: () => import("../pages/planner/users/manage.page.vue"),
      },

      {
        path: "/planner/dispatch-management",
        name: "planner-dispatch-management",
        component: () => import("../pages/planner/dispatch/index.page.vue"),
      },
      {
        path: "/planner/dispatch-management/manage/:id",
        name: "planner-manage-catalogue",
        component: () => import("../pages/planner/dispatch/manage.page.vue"),
      },

      

      {
        path: "/planner/dispatches",
        name: "planner-dispatches",
        component: () => import("../pages/planner/dispatch/dispatches.page.vue"),
      },

      {
        path: "/planner/loadingplans",
        name: "planner-loadingplans",
        component: () => import("../pages/planner/loadingplans/index.page.vue"),
      },

      {
        path: "/planner/commodity-tracking",
        name: "planner-commodity-tracking",
        component: () => import("../pages/planner/commodities/index.page.vue"),
      },
      {
        path: "/planner/commodity-tracking/manage/:id",
        name: "planner-manage-comodity-tracking",
        component: () => import("../pages/planner/commodities/manage.page.vue"),
      },


      {
        path: "/planner/receipt-management",
        name: "planner-receipt-management",
        component: () => import("../pages/planner/receipts/index.page.vue"),
      },
      {
        path: "/planner/receipt-management/manage/:id",
        name: "planner-manage-receipt-management",
        component: () => import("../pages/planner/receipts/manage.page.vue"),
      },

      {
        path: "/planner/requisition-management",
        name: "planner-requisition-management",
        component: () => import("../pages/planner/requisitions/index.page.vue"),
      },
      {
        path: "/planner/receipt-management/manage/:id",
        name: "planner-manage-requisition-management",
        component: () => import("../pages/planner/requisitions/manage.page.vue"),
      },



      {
        path: "/planner/system",
        name: "planner-system",
        component: () => import("../pages/planner/system/index.page.vue"),
      },



      {
        path: "/planner/receipts",
        name: "planner-system",
        component: () => import("../pages/planner/receipts/receipts.page.vue"),
      },

      {
        path: "/planner/project-management",
        name: "planner-project-management",
        component: () => import("../pages/planner/projects/index.page.vue"),
      },



    ],
    beforeEnter: (to, from, next) => {
      let role = JSON.parse(sessionStorage.getItem("RLE"));
      if (role != null && typeof role.name != "undefined") {
        if (role.name == "planner") {
          next();
        } else {
          next({ name: "portal-signin" });
        }
      } else {
        next({ name: "portal-signin" });
      }
    },
  },



  //Recipient
  {
    path: "/recipient",
    name: "recipient",
    component: () => import("../components/layouts/recipient.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "recipient-home",
        redirect: { name: "recipient-dashboard" },
      },
      {
        path: "/recipient/dashboard",
        name: "recipient-dashboard",
        component: () => import("../pages/recipient/dashboard/index.page.vue"),
      },
      //Users
      {
        path: "/recipient/users",
        name: "recipient-users",
        component: () => import("../pages/recipient/users/index.page.vue"),
      },
      {
        path: "/recipient/users/manage/:id",
        name: "recipient-manage-user",
        component: () => import("../pages/recipient/users/manage.page.vue"),
      },

      {
        path: "/recipient/dispatch-management",
        name: "recipient-dispatch-management",
        component: () => import("../pages/recipient/dispatch/index.page.vue"),
      },
      {
        path: "/recipient/dispatch-management/manage/:id",
        name: "recipient-manage-catalogue",
        component: () => import("../pages/recipient/dispatch/manage.page.vue"),
      },

      {
        path: "/recipient/commodity-tracking",
        name: "recipient-commodity-tracking",
        component: () => import("../pages/recipient/commodities/index.page.vue"),
      },
      {
        path: "/recipient/commodity-tracking/manage/:id",
        name: "recipient-manage-commodity-tracking",
        component: () => import("../pages/recipient/commodities/manage.page.vue"),
      },


      {
        path: "/recipient/receipt-management",
        name: "recipient-receipt-management",
        component: () => import("../pages/recipient/receipts/index.page.vue"),
      },
      {
        path: "/recipient/receipt-management/manage/:id",
        name: "recipient-manage-receipt-management",
        component: () => import("../pages/recipient/receipts/manage.page.vue"),
      },

      {
        path: "/recipient/requisition-management",
        name: "recipient-requisition-management",
        component: () => import("../pages/recipient/requisitions/index.page.vue"),
      },
      {
        path: "/recipient/receipt-management/manage/:id",
        name: "recipient-manage-requisition-management",
        component: () => import("../pages/recipient/requisitions/manage.page.vue"),
      },



      {
        path: "/recipient/system",
        name: "recipient-system",
        component: () => import("../pages/recipient/system/index.page.vue"),
      },




      {
        path: "/recipient/receipts",
        name: "recipient-system",
        component: () => import("../pages/recipient/receipts/receipts.page.vue"),
      },


      {
        path: "/recipient/project-management",
        name: "recipient-project-management",
        component: () => import("../pages/recipient/projects/index.page.vue"),
      },



    ],
    beforeEnter: (to, from, next) => {
      let role = JSON.parse(sessionStorage.getItem("RLE"));
      if (role != null && typeof role.name != "undefined") {
        if (role.name == "recipient") {
          next();
        } else {
          next({ name: "portal-signin" });
        }
      } else {
        next({ name: "portal-signin" });
      }
    },
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("../pages/Errors/404.error.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
