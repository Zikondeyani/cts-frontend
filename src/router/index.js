import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { saveDataOffline, getDataOffline } from '../services/localbase';

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

      {
        path: "/admin/report-management",
        name: "admin-report-management",
        component: () => import("../pages/admin/reports/index.page.vue"),
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
        path: "/admin/logs",
        name: "admin-logs",
        component: () => import("../pages/admin/logs/index.page.vue"),
      },

      {
        path: "/admin/userroles",
        name: "admin-userroles",
        component: () => import("../pages/admin/usersroles/index.page.vue"),
      },

      {
        path: "/admin/districts",
        name: "admin-districts",
        component: () => import("../pages/admin/districts/index.page.vue"),
      },

      {
        path: "/admin/organisations",
        name: "admin-organisations",
        component: () => import("../pages/admin/organisations/index.page.vue"),
      },

      {
        path: "/admin/stock-management",
        name: "admin-stock-management",
        component: () => import("../pages/admin/stock/index.page.vue"),
      },


      {
        path: "/admin/stock-management/manage/:id",
        name: "admin-manage-stock",
        component: () => import("../pages/admin/stock/manage.page.vue"),
      },


      {
        path: "/admin/warehouse-management",
        name: "admin-warehouse-management",
        component: () => import("../pages/admin/warehouses/index.page.vue"),
      },


      {
        path: "/admin/warehouse-management/manage/:id",
        name: "admin-manage-warehouse",
        component: () => import("../pages/admin/warehouses/manage.page.vue"),
      },



      {
        path: "/admin/commodity-types",
        name: "admin-commodity-types",
        component: () => import("../pages/admin/commoditytypes/index.page.vue"),
      },

      {
        path: "/admin/commodity-types/manage/:id",
        name: "admin-manage-commodity-types",
        component: () => import("../pages/admin/commoditytypes/manage.page.vue"),
      },

      {
        path: "/admin/commodity-management",
        name: "admin-commodity-management",
        component: () => import("../pages/admin/commoditymanagement/index.page.vue"),
      },

      {
        path: "/admin/commodity-management/manage/:id",
        name: "admin-manage-commodity-management",
        component: () => import("../pages/admin/commoditymanagement/manage.page.vue"),
      },


      {
        path: "/admin/activity-management",
        name: "admin-activity-management",
        component: () => import("../pages/admin/activities/index.page.vue"),
      },

      {
        path: "/admin/activity-management/manage/:id",
        name: "admin-manage-activity-management",
        component: () => import("../pages/admin/activities/manage.page.vue"),
      },

      {
        path: "/admin/organisations/manage/:id",
        name: "admin-manage-organisations",
        component: () => import("../pages/admin/organisations/manage.page.vue"),
      },

      {
        path: "/admin/project-management",
        name: "admin-project-management",
        component: () => import("../pages/admin/projects/index.page.vue"),
      },
      {
        path: "/admin/about-system",
        name: "admin-about-system",
        component: () => import("../pages/about/index.page.vue"),
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
        path: "/manager/Lean-season-losses",
        name: "manager-Lean-season-losses",
        component: () => import("../pages/manager/damages/damages.page.vue"),
      },

      {
        path: "/manager/Emergency-season-losses",
        name: "manager-emergency-season-damage-management",
        component: () => import("../pages/manager/damages/er-damages.page.vue"),
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

      {
        path: "/manager/about-system",
        name: "manager-about-system",
        component: () => import("../pages/about/index.page.vue"),
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
        path: "/dispatcher/instruction-management",
        name: "dispatcher-instruction-management",
        component: () => import("../pages/dispatcher/instruction/index.page.vue"),
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
        path: "/dispatcher/donations",
        name: "dispatcher-donation-management",
        component: () => import("../pages/dispatcher/donations/donations.page.vue"),
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
        path: "/dispatcher/receipts/emergency",
        name: "dispatcher-receipts-emergency",
        component: () => import("../pages/dispatcher/receipts/emergency.receipts.page.vue"),
      },

      {
        path: "/dispatcher/receipts/leanseason",
        name: "dispatcher-receipts-leanseason",
        component: () => import("../pages/dispatcher/receipts/leanseason.receipts.page.vue"),
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


      {
        path: "/dispatcher/about-system",
        name: "dispatcher-about-system",
        component: () => import("../pages/about/index.page.vue"),
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






 
  //warehouse
  {
    path: "/warehouse",
    name: "warehouse",
    component: () => import("../components/layouts/warehouse.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "warehouse-home",
        redirect: { name: "warehouse-dashboard" },
      },
      {
        path: "/warehouse/dashboard",
        name: "warehouse-dashboard",
        component: () => import("../pages/warehouse/dashboard/index.page.vue"),
      },
      {
        path: "/warehouse/donations",
        name: "warehouse-donation-management",
        component: () => import("../pages/warehouse/donations/donations.page.vue"),
      },
      //Users
      {
        path: "/warehouse/users",
        name: "warehouse-users",
        component: () => import("../pages/warehouse/users/index.page.vue"),
      },
      {
        path: "/warehouse/users/manage/:id",
        name: "warehouse-manage-user",
        component: () => import("../pages/warehouse/users/manage.page.vue"),
      },
      {
        path: "/warehouse/dispatch-management",
        name: "warehouse-dispatch-management",
        component: () => import("../pages/warehouse/dispatch/index.page.vue"),
      },
      {
        path: "/warehouse/warehouses",
        name: "warehouse-warehouses-management",
        component: () => import("../pages/warehouse/warehouses/index.page.vue"),
      },
      {
        path: "/warehouse/warehouses/manage/:id",
        name: "warehouse-manage-warehouses",
        component: () => import("../pages/warehouse/warehouses/manage.page.vue"),
      },
      {
        path: "/warehouse/dispatches",
        name: "warehouse-dispatches",
        component: () => import("../pages/warehouse/dispatch/dispatches.page.vue"),
      },
      {
        path: "/warehouse/loadingplans",
        name: "warehouse-loadingplans",
        component: () => import("../pages/warehouse/loadingplans/index.page.vue"),
      },
      {
        path: "/warehouse/stock-management",
        name: "warehouse-stock-management",
        component: () => import("../pages/warehouse/stock/index.page.vue"),
      },
      {
        path: "/warehouse/stock-management/manage/:id",
        name: "warehouse-manage-stock",
        component: () => import("../pages/warehouse/stock/manage.page.vue"),
      },
      {
        path: "/warehouse/commodity-tracking",
        name: "warehouse-commodity-tracking",
        component: () => import("../pages/warehouse/commodities/index.page.vue"),
      },
      {
        path: "/warehouse/commodity-tracking/manage/:id",
        name: "warehouse-manage-commodity-tracking",
        component: () => import("../pages/warehouse/commodities/manage.page.vue"),
      },
      {
        path: "/warehouse/receipt-management",
        name: "warehouse-receipt-management",
        component: () => import("../pages/warehouse/receipts/index.page.vue"),
      },


      {
        path: "/warehouse/receipts/emergency",
        name: "warehouse-receipts-emergency",
        component: () => import("../pages/warehouse/receipts/emergency.receipts.page.vue"),
      },

      {
        path: "/warehouse/receipts/leanseason",
        name: "warehouse-receipts-leanseason",
        component: () => import("../pages/warehouse/receipts/leanseason.receipts.page.vue"),
      },
      {
        path: "/warehouse/receipt-management/manage/:id",
        name: "warehouse-manage-receipt-management",
        component: () => import("../pages/warehouse/receipts/manage.page.vue"),
      },
      {
        path: "/warehouse/warehouse-management/",
        name: "warehouse-manage-management",
        component: () => import("../pages/warehouse/warehouse/index.page.vue"),
      },
      {
        path: "/warehouse/warehouse-management/manage/:id",
        name: "warehouse-manage-warehouse-management",
        component: () => import("../pages/warehouse/warehouse/manage.page.vue"),
      },
      {
        path: "/warehouse/requisition-management",
        name: "warehouse-requisition-management",
        component: () => import("../pages/warehouse/requisitions/index.page.vue"),
      },
      {
        path: "/warehouse/receipt-management/manage/:id",
        name: "warehouse-manage-requisition-management",
        component: () => import("../pages/warehouse/requisitions/manage.page.vue"),
      },
      {
        path: "/warehouse/instruction-management",
        name: "warehouse-instruction-management",
        component: () => import("../pages/warehouse/instruction/index.page.vue"),
      },
      {
        path: "/warehouse/instruction-management/manage/:id",
        name: "warehouse-manage-instruction-management",
        component: () => import("../pages/warehouse/instruction/manage.page.vue"),
      },
      {
        path: "/warehouse/system",
        name: "warehouse-system",
        component: () => import("../pages/warehouse/system/index.page.vue"),
      },
      {
        path: "/warehouse/project-management",
        name: "warehouse-project-management",
        component: () => import("../pages/warehouse/projects/index.page.vue"),
      },
      {
        path: "/warehouse/report-management",
        name: "warehouse-report-management",
        component: () => import("../pages/warehouse/reports/index.page.vue"),
      },

      {
        path: "/warehouse/about-system",
        name: "warehouse-about-system",
        component: () => import("../pages/about/index.page.vue"),
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


  //Dodma
  {
    path: "/dodma",
    name: "dodma",
    component: () => import("../components/layouts/dodma.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "dodma-home",
        redirect: { name: "dodma-dashboard" },
      },
      {
        path: "/dodma/dashboard",
        name: "dodma-dashboard",
        component: () => import("../pages/dodma/dashboard/index.page.vue"),
      },
      //Users
      {
        path: "/dodma/users",
        name: "dodma-users",
        component: () => import("../pages/dodma/users/index.page.vue"),
      },
      {
        path: "/dodma/users/manage/:id",
        name: "dodma-manage-user",
        component: () => import("../pages/dodma/users/manage.page.vue"),
      },

      {
        path: "/dodma/dispatch-management",
        name: "dodma-dispatch-management",
        component: () => import("../pages/dodma/dispatch/index.page.vue"),
      },

      {
        path: "/dodma/donations",
        name: "dodma-donation-management",
        component: () => import("../pages/dodma/donations/donations.page.vue"),
      },

      {
        path: "/dodma/Lean-season-losses",
        name: "dodma-lean-season-damage-management",
        component: () => import("../pages/dodma/damages/damages.page.vue"),
      },

      {
        path: "/dodma/Emergency-season-losses",
        name: "dodma-emergency-season-damage-management",
        component: () => import("../pages/dodma/damages/er-damages.page.vue"),
      },

      {
        path: "/dodma/required-leanseason",
        name: "dodma-required-leanseason-management",
        component: () => import("../pages/dodma/requested/requested-commodities.page.vue"),
      },

      {
        path: "/dodma/dispatches",
        name: "dodma-dispatches",
        component: () => import("../pages/dodma/dispatch/dispatches.page.vue"),
      },

      {
        path: "/dodma/loadingplans",
        name: "dodma-loadingplans",
        component: () => import("../pages/dodma/loadingplans/index.page.vue"),
      },
      {
        path: "/dodma/dispatch-management/manage/:id",
        name: "dodma-manage-catalogue",
        component: () => import("../pages/dodma/dispatch/manage.page.vue"),
      },

      {
        path: "/dodma/commodity-tracking",
        name: "dodma-commodity-tracking",
        component: () => import("../pages/dodma/commodities/index.page.vue"),
      },
      {
        path: "/dodma/commodity-tracking/manage/:id",
        name: "dodma-manage-commodity-tracking",
        component: () => import("../pages/dodma/commodities/manage.page.vue"),
      },


      {
        path: "/dodma/receipt-management",
        name: "dodma-receipt-management",
        component: () => import("../pages/dodma/receipts/index.page.vue"),
      },


      {
        path: "/dodma/receipts",
        name: "dodma-receipts",
        component: () => import("../pages/dodma/receipts/receipts.page.vue"),
      },

      {
        path: "/dodma/receipt-management/manage/:id",
        name: "dodma-manage-receipt-management",
        component: () => import("../pages/dodma/receipts/manage.page.vue"),
      },

      {
        path: "/dodma/requisition-management",
        name: "dodma-requisition-management",
        component: () => import("../pages/dodma/requisitions/index.page.vue"),
      },
      {
        path: "/dodma/receipt-management/manage/:id",
        name: "dodma-manage-requisition-management",
        component: () => import("../pages/dodma/requisitions/manage.page.vue"),
      },



      {
        path: "/dodma/system",
        name: "dodma-system",
        component: () => import("../pages/dodma/system/index.page.vue"),
      },


      {
        path: "/dodma/project-management",
        name: "dodma-project-management",
        component: () => import("../pages/dodma/projects/index.page.vue"),
      },

      {
        path: "/dodma/instruction-management",
        name: "dodma-instruction-management",
        component: () => import("../pages/dodma/instruction/index.page.vue"),
      },


      {
        path: "/dodma/rejected-instruction-management",
        name: "dodma-rejected-instruction-management",
        component: () => import("../pages/dodma/instruction/rejected-index.page"),
      },

      {
        path: "/dodma/instruction-management/manage/:id",
        name: "dodma-manage-instruction-management",
        component: () => import("../pages/dodma/instruction/manage.page.vue"),
      },



      {
        path: "/dodma/report-management",
        name: "dodma-report-management",
        component: () => import("../pages/dodma/reports/index.page.vue"),
      },

      {
        path: "/dodma/about-system",
        name: "dodma-about-system",
        component: () => import("../pages/about/index.page.vue"),
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


  //field
  {
    path: "/field",
    name: "field",
    component: () => import("../components/layouts/field.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "field-home",
        redirect: { name: "field-dashboard" },
      },
      {
        path: "/field/dashboard",
        name: "field-dashboard",
        component: () => import("../pages/field/dashboard/index.page.vue"),
      },
      //Users
      {
        path: "/field/users",
        name: "field-users",
        component: () => import("../pages/field/users/index.page.vue"),
      },
      {
        path: "/field/users/manage/:id",
        name: "field-manage-user",
        component: () => import("../pages/field/users/manage.page.vue"),
      },

      {
        path: "/field/dispatch-management",
        name: "field-dispatch-management",
        component: () => import("../pages/field/dispatch/dispatches.page.vue"),
      },

      {
        path: "/field/dispatches/emergency",
        name: "field-emergency-dispatch-management",
        component: () => import("../pages/field/dispatch/emergencydispatches.page.vue"),
      },



      {
        path: "/field/dispatches",
        name: "field-dispatches",
        component: () => import("../pages/field/dispatch/dispatches.page.vue"),
      },

      {
        path: "/field/loadingplans",
        name: "field-loadingplans",
        component: () => import("../pages/field/loadingplans/index.page.vue"),
      },
      {
        path: "/field/dispatch-management/manage/:id",
        name: "field-manage-catalogue",
        component: () => import("../pages/field/dispatch/manage.page.vue"),
      },

      {
        path: "/field/commodity-tracking",
        name: "field-commodity-tracking",
        component: () => import("../pages/field/commodities/index.page.vue"),
      },
      {
        path: "/field/commodity-tracking/manage/:id",
        name: "field-manage-commodity-tracking",
        component: () => import("../pages/field/commodities/manage.page.vue"),
      },


      {
        path: "/field/receipt-management",
        name: "field-receipt-management",
        component: () => import("../pages/field/receipts/index.page.vue"),
      },


      {
        path: "/field/receipts",
        name: "field-receipts",
        component: () => import("../pages/field/receipts/index.page.vue"),
      },

      {
        path: "/field/receipts/emergency",
        name: "field-receipts-emergency",
        component: () => import("../pages/field/receipts/emergency.receipts.page.vue"),
      },

      {
        path: "/field/receipts/leanseason",
        name: "field-receipts-leanseason",
        component: () => import("../pages/field/receipts/leanseason.receipts.page.vue"),
      },

      {
        path: "/field/receipt-management/manage/:id",
        name: "field-manage-receipt-management",
        component: () => import("../pages/field/receipts/manage.page.vue"),
      },

      {
        path: "/field/requisition-management",
        name: "field-requisition-management",
        component: () => import("../pages/field/requisitions/index.page.vue"),
      },


      {
        path: "/field/requisition-management/requisitions",
        name: "field-requisition-management-rq",
        component: () => import("../pages/field/requisitions/manage.page.vue"),
      },

      {
        path: "/field/requisition-management/requisitions/manage/:id",
        name: "field-manage-requisitions-management-id",
        component: () => import("../pages/field/requisitions/edit.page.vue"),
      },

      {
        path: "/field/receipt-management/manage/:id",
        name: "field-manage-requisition-management",
        component: () => import("../pages/field/requisitions/manage.page.vue"),
      },

      {
        path: "/field/emergency-management",
        name: "field-emergency-management",
        component: () => import("../pages/field/emergency/index.page.vue"),
      },

      {
        path: "/field/emergency-management/manage/:id",
        name: "field-manage-emergency-management",
        component: () => import("../pages/field/emergency/manage.page.vue"),
      },





      {
        path: "/field/system",
        name: "field-system",
        component: () => import("../pages/field/system/index.page.vue"),
      },


      {
        path: "/field/project-management",
        name: "field-project-management",
        component: () => import("../pages/field/projects/index.page.vue"),
      },



      {
        path: "/field/report-management",
        name: "field-report-management",
        component: () => import("../pages/field/reports/index.page.vue"),
      },

      {
        path: "/field/about-system",
        name: "field-about-system",
        component: () => import("../pages/about/index.page.vue"),
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

 /*    beforeEnter: async (to, from, next) => {
      // Check sessionStorage for existing session
      let role = JSON.parse(sessionStorage.getItem("RLE"));
      const localSession = await getDataOffline('session');

      if ((localSession[0] && localSession[0].role === "field officer")) {
        // Role found in sessionStorage and it's an admin
        next();
      } else {
        next({ name: 'portal-signin' });

      }
    } */

  },


  //Manager
  {
    path: "/commissioner",
    name: "commissioner",
    component: () => import("../components/layouts/commissioner.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "commissioner-home",
        redirect: { name: "commissioner-dashboard" },
      },
      {
        path: "/commissioner/dashboard",
        name: "commissioner-dashboard",
        component: () => import("../pages/commissioner/dashboard/index.page.vue"),
      },
      //Users
      {
        path: "/commissioner/users",
        name: "commissioner-users",
        component: () => import("../pages/commissioner/users/index.page.vue"),
      },

      {
        path: "/commissioner/Lean-season-losses",
        name: "commissioner-lean-season-damage-management",
        component: () => import("../pages/commissioner/damages/damages.page.vue"),
      },

      {
        path: "/commissioner/Emergency-season-losses",
        name: "commissioner-emergency-season-damage-management",
        component: () => import("../pages/commissioner/damages/er-damages.page.vue"),
      },
      {
        path: "/commissioner/users/manage/:id",
        name: "commissioner-manage-user",
        component: () => import("../pages/commissioner/users/manage.page.vue"),
      },

      {
        path: "/commissioner/dispatch-management",
        name: "commissioner-dispatch-management",
        component: () => import("../pages/commissioner/dispatch/index.page.vue"),
      },

      {
        path: "/commissioner/instruction-management",
        name: "commissioner-instruction-management",
        component: () => import("../pages/commissioner/instruction/index.page.vue"),
      },
      {
        path: "/commissioner/instruction-management/manage/:id",
        name: "commissioner-manage-instruction-management",
        component: () => import("../pages/commissioner/instruction/manage.page.vue"),
      },


      {
        path: "/commissioner/dispatches",
        name: "commissioner-dispatches",
        component: () => import("../pages/commissioner/dispatch/dispatches.page.vue"),
      },

      {
        path: "/commissioner/loadingplans",
        name: "commissioner-loadingplans",
        component: () => import("../pages/commissioner/loadingplans/index.page.vue"),
      },
      {
        path: "/commissioner/dispatch-management/manage/:id",
        name: "commissioner-manage-catalogue",
        component: () => import("../pages/commissioner/dispatch/manage.page.vue"),
      },

      {
        path: "/commissioner/commodity-tracking",
        name: "commissioner-commodity-tracking",
        component: () => import("../pages/commissioner/commodities/index.page.vue"),
      },
      {
        path: "/commissioner/commodity-tracking/manage/:id",
        name: "commissioner-manage-commodity-tracking",
        component: () => import("../pages/commissioner/commodities/manage.page.vue"),
      },


      {
        path: "/commissioner/receipt-management",
        name: "commissioner-receipt-management",
        component: () => import("../pages/commissioner/receipts/index.page.vue"),
      },


      {
        path: "/commissioner/receipts",
        name: "commissioner-receipts",
        component: () => import("../pages/commissioner/receipts/receipts.page.vue"),
      },

      {
        path: "/commissioner/receipt-management/manage/:id",
        name: "commissioner-manage-receipt-management",
        component: () => import("../pages/commissioner/receipts/manage.page.vue"),
      },

      {
        path: "/commissioner/requisition-management",
        name: "commissioner-requisition-management",
        component: () => import("../pages/commissioner/requisitions/index.page.vue"),
      },
      {
        path: "/commissioner/receipt-management/manage/:id",
        name: "commissioner-manage-requisition-management",
        component: () => import("../pages/commissioner/requisitions/manage.page.vue"),
      },



      {
        path: "/commissioner/system",
        name: "commissioner-system",
        component: () => import("../pages/commissioner/system/index.page.vue"),
      },


      {
        path: "/commissioner/project-management",
        name: "commissioner-project-management",
        component: () => import("../pages/commissioner/projects/index.page.vue"),
      },



      {
        path: "/commissioner/report-management",
        name: "commissioner-report-management",
        component: () => import("../pages/commissioner/reports/index.page.vue"),
      },

      {
        path: "/commissioner/about-system",
        name: "commissioner-about-system",
        component: () => import("../pages/about/index.page.vue"),
      },


    ],
    beforeEnter: (to, from, next) => {
      let role = JSON.parse(sessionStorage.getItem("RLE"));
      if (role != null && typeof role.name != "undefined") {
        if (role.name == "commissioner") {
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
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
