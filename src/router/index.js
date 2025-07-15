import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { saveDataOffline, getDataOffline } from "../services/localbase";

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

      {
        name: "portal-reset-password",
        path: "/portal/reset-password/:email",
        component: () => import("../pages/portal/reset-password.page.vue"),
      },
    ],
  },

    {
    path: "/fdpmanager",
    name: "fdpmanager",
    component: () => import("../components/layouts/fdpmanager.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "fdpmanager-home",
        redirect: { name: "fdpmanager-dashboard" },
      },

      {
        path: "/fdpmanager/reversals",
        name: "fdpmanager-reversals",
        component: () =>
          import("../pages/fdpmanager/receipts/reversal.receipts.page.vue"),
      },

      {
        path: "/fdpmanager/dashboard",
        name: "fdpmanager-dashboard",
        component: () => import("../pages/fdpmanager/dashboard/index.page.vue"),
      },

      {
        path: "/fdpmanager/report-management",
        name: "fdpmanager-report-management",
        component: () => import("../pages/fdpmanager/reports/index.page.vue"),
      },
      //Users
      {
        path: "/fdpmanager/users",
        name: "fdpmanager-users",
        component: () => import("../pages/fdpmanager/users/index.page.vue"),
      },

      {
        path: "/fdpmanager/mailinggroups",
        name: "fdpmanager-mailinggroups",
        component: () => import("../pages/fdpmanager/mailinggroups/index.page.vue"),
      },

      {
        path: "/fdpmanager/mailinggroups/manage/:id",
        name: "fdpmanager-manage-mailinggroups",
        component: () => import("../pages/fdpmanager/mailinggroups/manage.page.vue"),
      },

      {
        path: "/fdpmanager/users/manage/:id",
        name: "fdpmanager-manage-user",
        component: () => import("../pages/fdpmanager/users/manage.page.vue"),
      },

      {
        path: "/fdpmanager/dispatch-management",
        name: "fdpmanager-dispatch-management",
        component: () => import("../pages/fdpmanager/dispatch/index.page.vue"),
      },

      {
        path: "/fdpmanager/dispatches",
        name: "fdpmanager-dispatches",
        component: () => import("../pages/fdpmanager/dispatch/dispatches.page.vue"),
      },

      {
        path: "/fdpmanager/loadingplans",
        name: "fdpmanager-loadingplans",
        component: () => import("../pages/fdpmanager/loadingplans/index.page.vue"),
      },
      {
        path: "/fdpmanager/dispatch-management/manage/:id",
        name: "fdpmanager-manage-catalogue",
        component: () => import("../pages/fdpmanager/dispatch/manage.page.vue"),
      },

      {
        path: "/fdpmanager/commodity-tracking",
        name: "fdpmanager-commodity-tracking",
        component: () => import("../pages/fdpmanager/commodities/index.page.vue"),
      },
      {
        path: "/fdpmanager/commodity-tracking/manage/:id",
        name: "fdpmanager-manage-commodity-tracking",
        component: () => import("../pages/fdpmanager/commodities/manage.page.vue"),
      },

      {
        path: "/fdpmanager/receipt-management",
        name: "fdpmanager-receipt-management",
        component: () => import("../pages/fdpmanager/receipts/index.page.vue"),
      },

      {
        path: "/fdpmanager/receipts",
        name: "fdpmanager-receipts",
        component: () => import("../pages/fdpmanager/receipts/index.page.vue"),
      },

      {
        path: "/fdpmanager/receipts/emergency",
        name: "fdpmanager-receipts-emergency",
        component: () =>
          import("../pages/fdpmanager/receipts/emergency.receipts.page.vue"),
      },

      {
        path: "/fdpmanager/receipts/leanseason",
        name: "fdpmanager-receipts-leanseason",
        component: () =>
          import("../pages/fdpmanager/receipts/leanseason.receipts.page.vue"),
      },
      {
        path: "/fdpmanager/change-password",
        name: "fdpmanager-change-password",
        component: () =>
          import("../components/pages/users/change.password.vue"),
      },
      {
        path: "/fdpmanager/receipt-management/manage/:id",
        name: "fdpmanager-manage-receipt-management",
        component: () => import("../pages/fdpmanager/receipts/manage.page.vue"),
      },

      {
        path: "/fdpmanager/requisition-management",
        name: "fdpmanager-requisition-management",
        component: () => import("../pages/fdpmanager/requisitions/index.page.vue"),
      },
      {
        path: "/fdpmanager/receipt-management/manage/:id",
        name: "fdpmanager-manage-requisition-management",
        component: () => import("../pages/fdpmanager/requisitions/manage.page.vue"),
      },

      {
        path: "/fdpmanager/system",
        name: "fdpmanager-system",
        component: () => import("../pages/fdpmanager/system/index.page.vue"),
      },

      {
        path: "/fdpmanager/feedback",
        name: "fdpmanager-feedback",
        component: () => import("../pages/fdpmanager/feedback/index.page.vue"),
      },

      {
        path: "/fdpmanager/user-dispatches",
        name: "fdpmanager-user-dispatches",
        component: () => import("../pages/fdpmanager/users/dispatches.page.vue"),
      },

      {
        path: "/fdpmanager/logs",
        name: "fdpmanager-logs",
        component: () => import("../pages/fdpmanager/logs/index.page.vue"),
      },

      {
        path: "/fdpmanager/userroles",
        name: "fdpmanager-userroles",
        component: () => import("../pages/fdpmanager/usersroles/index.page.vue"),
      },

      {
        path: "/fdpmanager/districts",
        name: "fdpmanager-districts",
        component: () => import("../pages/fdpmanager/districts/index.page.vue"),
      },

      {
        path: "/fdpmanager/fdps",
        name: "fdpmanager-fdps",
        component: () => import("../pages/fdpmanager/fdps/index.page.vue"),
      },

         {
        path: "/fdpmanager/fdps/manage/:id",
        name: "fdpmanager-manage-user",
        component: () => import("../pages/fdpmanager/fdps/manage.page.vue"),
      },

      {
        path: "/fdpmanager/organisations",
        name: "fdpmanager-organisations",
        component: () => import("../pages/fdpmanager/organisations/index.page.vue"),
      },

      {
        path: "/fdpmanager/stock-management",
        name: "fdpmanager-stock-management",
        component: () => import("../pages/fdpmanager/stock/index.page.vue"),
      },

      {
        path: "/fdpmanager/stock-management/manage/:id",
        name: "fdpmanager-manage-stock",
        component: () => import("../pages/fdpmanager/stock/manage.page.vue"),
      },

      {
        path: "/fdpmanager/warehouse-management",
        name: "fdpmanager-warehouse-management",
        component: () => import("../pages/fdpmanager/warehouses/index.page.vue"),
      },

      {
        path: "/fdpmanager/warehouse-management/manage/:id",
        name: "fdpmanager-manage-warehouse",
        component: () => import("../pages/fdpmanager/warehouses/manage.page.vue"),
      },

      {
        path: "/fdpmanager/transporter-management",
        name: "fdpmanager-transporter-management",
        component: () => import("../pages/fdpmanager/transporters/index.page.vue"),
      },

      {
        path: "/fdpmanager/transporter-management/manage/:id",
        name: "fdpmanager-manage-transporter",
        component: () => import("../pages/fdpmanager/transporters/manage.page.vue"),
      },

      {
        path: "/fdpmanager/commodity-types",
        name: "fdpmanager-commodity-types",
        component: () => import("../pages/fdpmanager/commoditytypes/index.page.vue"),
      },

      {
        path: "/fdpmanager/requestors",
        name: "fdpmanager-requestors",
        component: () => import("../pages/fdpmanager/requestors/index.page.vue"),
      },

      {
        path: "/fdpmanager/commodity-types/manage/:id",
        name: "fdpmanager-manage-commodity-types",
        component: () =>
          import("../pages/fdpmanager/commoditytypes/manage.page.vue"),
      },

      {
        path: "/fdpmanager/commodity-management",
        name: "fdpmanager-commodity-management",
        component: () =>
          import("../pages/fdpmanager/commoditymanagement/index.page.vue"),
      },

      {
        path: "/fdpmanager/commodity-management/manage/:id",
        name: "fdpmanager-manage-commodity-management",
        component: () =>
          import("../pages/fdpmanager/commoditymanagement/manage.page.vue"),
      },

      {
        path: "/fdpmanager/activity-management",
        name: "fdpmanager-activity-management",
        component: () => import("../pages/fdpmanager/activities/index.page.vue"),
      },

      {
        path: "/fdpmanager/activity-management/manage/:id",
        name: "fdpmanager-manage-activity-management",
        component: () => import("../pages/fdpmanager/activities/manage.page.vue"),
      },

      {
        path: "/fdpmanager/organisations/manage/:id",
        name: "fdpmanager-manage-organisations",
        component: () => import("../pages/fdpmanager/organisations/manage.page.vue"),
      },

      {
        path: "/fdpmanager/project-management",
        name: "fdpmanager-project-management",
        component: () => import("../pages/fdpmanager/projects/index.page.vue"),
      },
      {
        path: "/fdpmanager/about-system",
        name: "fdpmanager-about-system",
        component: () => import("../pages/about/index.page.vue"),
      },
      {
        path: "/fdpmanager/reminders",
        name: "fdpmanager-reminders",
        component: () => import("../pages/fdpmanager/reminders/reminders.page.vue"),
      },
      {
        path: "/fdpmanager/performance-stats",
        name: "fdpmanager-performance-stats",
        component: () => import("../pages/fdpmanager/reports/performance-stats.vue"),
      },

      {
        path: "/fdpmanager/usage-stats",
        name: "fdpmanager-usage-stats",
        component: () => import("../pages/fdpmanager/reports/usage-stats.vue"),
      },
    ],
    beforeEnter: (to, from, next) => {
      let role = JSON.parse(sessionStorage.getItem("RLE"));
      if (role != null && typeof role.name != "undefined") {
        if (role.name == "fdpmanager") {
          next();
        } else {
          next({ name: "portal-signin" });
        }
      } else {
        next({ name: "portal-signin" });
      }
    },
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
        path: "/admin/reversals",
        name: "admin-reversals",
        component: () =>
          import("../pages/admin/receipts/reversal.receipts.page.vue"),
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
        path: "/admin/mailinggroups",
        name: "admin-mailinggroups",
        component: () => import("../pages/admin/mailinggroups/index.page.vue"),
      },

      {
        path: "/admin/mailinggroups/manage/:id",
        name: "admin-manage-mailinggroups",
        component: () => import("../pages/admin/mailinggroups/manage.page.vue"),
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
        component: () => import("../pages/admin/receipts/index.page.vue"),
      },

      {
        path: "/admin/receipts/emergency",
        name: "admin-receipts-emergency",
        component: () =>
          import("../pages/admin/receipts/emergency.receipts.page.vue"),
      },

      {
        path: "/admin/receipts/leanseason",
        name: "admin-receipts-leanseason",
        component: () =>
          import("../pages/admin/receipts/leanseason.receipts.page.vue"),
      },
      {
        path: "/admin/change-password",
        name: "admin-change-password",
        component: () =>
          import("../components/pages/users/change.password.vue"),
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
        path: "/admin/feedback",
        name: "admin-feedback",
        component: () => import("../pages/admin/feedback/index.page.vue"),
      },

      {
        path: "/admin/user-dispatches",
        name: "admin-user-dispatches",
        component: () => import("../pages/admin/users/dispatches.page.vue"),
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
        path: "/admin/fdps",
        name: "admin-fdps",
        component: () => import("../pages/admin/fdps/index.page.vue"),
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
        path: "/admin/transporter-management",
        name: "admin-transporter-management",
        component: () => import("../pages/admin/transporters/index.page.vue"),
      },

      {
        path: "/admin/transporter-management/manage/:id",
        name: "admin-manage-transporter",
        component: () => import("../pages/admin/transporters/manage.page.vue"),
      },

      {
        path: "/admin/commodity-types",
        name: "admin-commodity-types",
        component: () => import("../pages/admin/commoditytypes/index.page.vue"),
      },

      {
        path: "/admin/requestors",
        name: "admin-requestors",
        component: () => import("../pages/admin/requestors/index.page.vue"),
      },

      {
        path: "/admin/commodity-types/manage/:id",
        name: "admin-manage-commodity-types",
        component: () =>
          import("../pages/admin/commoditytypes/manage.page.vue"),
      },

      {
        path: "/admin/commodity-management",
        name: "admin-commodity-management",
        component: () =>
          import("../pages/admin/commoditymanagement/index.page.vue"),
      },

      {
        path: "/admin/commodity-management/manage/:id",
        name: "admin-manage-commodity-management",
        component: () =>
          import("../pages/admin/commoditymanagement/manage.page.vue"),
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
      {
        path: "/admin/reminders",
        name: "admin-reminders",
        component: () => import("../pages/admin/reminders/reminders.page.vue"),
      },
      {
        path: "/admin/performance-stats",
        name: "admin-performance-stats",
        component: () => import("../pages/admin/reports/performance-stats.vue"),
      },

      {
        path: "/admin/usage-stats",
        name: "admin-usage-stats",
        component: () => import("../pages/admin/reports/usage-stats.vue"),
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
        path: "/manager/stock-prepositioning",
        name: "manager-stock-prepositioning",
        component: () =>
          import("../pages/manager/stock-prepositoning/index.page.vue"),
      },

      {
        path: "/manager/Lean-season-losses",
        name: "manager-lean-season-damage-management",
        component: () => import("../pages/manager/damages/damages.page.vue"),
      },

      {
        path: "/manager/Emergency-season-losses",
        name: "manager-emergency-season-damage-management",
        component: () => import("../pages/manager/damages/er-damages.page.vue"),
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
        path: "/manager/instruction-management",
        name: "manager-instruction-management",
        component: () => import("../pages/manager/instruction/index.page.vue"),
      },
      {
        path: "/manager/instruction-management/manage/:id",
        name: "manager-manage-instruction-management",
        component: () => import("../pages/manager/instruction/manage.page.vue"),
      },

      {
        path: "/manager/loadingplans",
        name: "manager-loadingplans",
        component: () => import("../pages/manager/loadingplans/index.page.vue"),
      },

      {
        path: "/manager/dispatches",
        name: "manager-dispatches",
        component: () =>
          import("../pages/manager/dispatch/dispatches.page.vue"),
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
        component: () =>
          import("../pages/manager/requisitions/manage.page.vue"),
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
        path: "/manager/change-password",
        name: "manager-change-password",
        component: () =>
          import("../components/pages/users/change.password.vue"),
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
        path: "/dispatcher/tracker",
        name: "dispatcher-tracker",
        component: () => import("../pages/dispatcher/tracker/tracker.page.vue"),
      },

      {
        path: "/dispatcher/dashboard",
        name: "dispatcher-dashboard",
        component: () => import("../pages/dispatcher/dashboard/index.page.vue"),
      },
      {
        path: "/dispatcher/change-password",
        name: "dispatcher-change-password",
        component: () =>
          import("../components/pages/users/change.password.vue"),
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
        component: () =>
          import("../pages/dispatcher/instruction/index.page.vue"),
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
        component: () =>
          import("../pages/dispatcher/commodities/index.page.vue"),
      },
      {
        path: "/dispatcher/commodity-tracking/manage/:id",
        name: "dispatcher-manage-commodity-tracking",
        component: () =>
          import("../pages/dispatcher/commodities/manage.page.vue"),
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
        component: () =>
          import("../pages/dispatcher/requisitions/index.page.vue"),
      },
      {
        path: "/dispatcher/receipt-management/manage/:id",
        name: "dispatcher-manage-requisition-management",
        component: () =>
          import("../pages/dispatcher/requisitions/manage.page.vue"),
      },

      {
        path: "/dispatcher/donations",
        name: "dispatcher-donation-management",
        component: () =>
          import("../pages/dispatcher/donations/donations.page.vue"),
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
        path: "/dispatcher/receipts/",
        name: "dispatcher-receipts",
        component: () => import("../pages/dispatcher/receipts/index.page.vue"),
      },

      {
        path: "/dispatcher/receipts/emergency",
        name: "dispatcher-receipts-emergency",
        component: () =>
          import("../pages/dispatcher/receipts/emergency.receipts.page.vue"),
      },

      {
        path: "/dispatcher/receipts/leanseason",
        name: "dispatcher-receipts-leanseason",
        component: () =>
          import("../pages/dispatcher/receipts/leanseason.receipts.page.vue"),
      },

      {
        path: "/dispatcher/report-management",
        name: "dispatcher-report-management",
        component: () => import("../pages/dispatcher/reports/index.page.vue"),
      },

      {
        path: "/dispatcher/loadingplans",
        name: "dispatcher-loadingplans",
        component: () =>
          import("../pages/dispatcher/loadingplans/index.page.vue"),
      },

      {
        path: "/dispatcher/dispatches",
        name: "dispatcher-dispatches",
        component: () =>
          import("../pages/dispatcher/dispatch/dispatches.page.vue"),
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
        path: "/warehouse/change-password",
        name: "warehouse-change-password",
        component: () =>
          import("../components/pages/users/change.password.vue"),
      },
      {
        path: "/warehouse/donations",
        name: "warehouse-donation-management",
        component: () =>
          import("../pages/warehouse/donations/donations.page.vue"),
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
        path: "/warehouse/warehouserequisitions",
        name: "warehouse-warehouserequisitions",
        component: () => import("../pages/warehouse/warehouserequisitions/index.page.vue"),
      },

      {
        path: "/warehouse/warehouses/manage/:id",
        name: "warehouse-manage-warehouses",
        component: () =>
          import("../pages/warehouse/warehouses/manage.page.vue"),
      },
      {
        path: "/warehouse/dispatches",
        name: "warehouse-dispatches",
        component: () =>
          import("../pages/warehouse/dispatch/dispatches.page.vue"),
      },
      {
        path: "/warehouse/loadingplans",
        name: "warehouse-loadingplans",
        component: () =>
          import("../pages/warehouse/loadingplans/index.page.vue"),
      },
      {
        path: "/warehouse/stock-management",
        name: "warehouse-stock-management",
        component: () => import("../pages/warehouse/stock/index.page.vue"),
      },

      {
        path: "/warehouse/stock-transfer-management",
        name: "warehouse-stock-transfer-management",
        component: () => import("../pages/warehouse/stock/index-stock-transfers.page.vue"),
      },

      {
        path: "/warehouse/requisition-dispatch-management",
        name: "warehouse-requisition-dispatch-managemen",
        component: () => import("../pages/warehouse/warehouserequisitions/index-requisition.page.vue"),
      },


      {
        path: "/warehouse/outbound-stock-management",
        name: "warehouse-stock-management-all",
        component: () => import("../pages/warehouse/stock/index-outbound.page.vue"),
      },
      {
        path: "/warehouse/stock-management/manage/:id",
        name: "warehouse-manage-stock",
        component: () => import("../pages/warehouse/stock/manage.page.vue"),
      },
      {
        path: "/warehouse/commodity-tracking",
        name: "warehouse-commodity-tracking",
        component: () =>
          import("../pages/warehouse/commodities/index.page.vue"),
      },
      {
        path: "/warehouse/commodity-tracking/manage/:id",
        name: "warehouse-manage-commodity-tracking",
        component: () =>
          import("../pages/warehouse/commodities/manage.page.vue"),
      },
      {
        path: "/warehouse/receipt-management",
        name: "warehouse-receipt-management",
        component: () => import("../pages/warehouse/receipts/index.page.vue"),
      },

      {
        path: "/warehouse/receipts/emergency",
        name: "warehouse-receipts-emergency",
        component: () =>
          import("../pages/warehouse/receipts/emergency.receipts.page.vue"),
      },

      {
        path: "/warehouse/receipts/leanseason",
        name: "warehouse-receipts-leanseason",
        component: () =>
          import("../pages/warehouse/receipts/leanseason.receipts.page.vue"),
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
        component: () =>
          import("../pages/warehouse/requisitions/index.page.vue"),
      },
      {
        path: "/warehouse/receipt-management/manage/:id",
        name: "warehouse-manage-requisition-management",
        component: () =>
          import("../pages/warehouse/requisitions/manage.page.vue"),
      },
      {
        path: "/warehouse/instruction-management",
        name: "warehouse-instruction-management",
        component: () =>
          import("../pages/warehouse/instruction/index.page.vue"),
      },
      {
        path: "/warehouse/instruction-management/manage/:id",
        name: "warehouse-manage-instruction-management",
        component: () =>
          import("../pages/warehouse/instruction/manage.page.vue"),
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
        if (role.name == "warehouse") {
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
        path: "/planner/stats",
        name: "planner-stats",
        component: () =>
          import("../pages/planner/stats/stats.page.vue"),
      },

      {
        path: "/planner/dashboard",
        name: "planner-dashboard",
        component: () => import("../pages/planner/dashboard/index.page.vue"),
      },

      {
        path: "/planner/change-password",
        name: "planner-change-password",
        component: () =>
          import("../components/pages/users/change.password.vue"),
      },

      {
        path: "/planner/user-dispatches",
        name: "planner-user-dispatches",
        component: () => import("../pages/planner/users/dispatches.page.vue"),
      },

      {
        path: "/planner/stock-transfer-management",
        name: "planner-stock-transfer-management",
        component: () => import("../pages/planner/stock/index-stock-transfers.page.vue"),
      },
       {
        path: "/planner/unapprovedtransfers",
        name: "planner-stock-transfer-management-unapproved",
        component: () => import("../pages/planner/warehouserequisitions/index-transfers.page.vue"),
      },
      {
        path: "/planner/stock-management",
        name: "planner-stock-management",
        component: () => import("../pages/planner/stock/index.page.vue"),
      },

      {
        path: "/planner/stock-prepositioning",
        name: "planner-stock-prepositioning",
        component: () =>
          import("../pages/planner/stock-prepositoning/index.page.vue"),
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
        path: "/planner/donations",
        name: "planner-donation-management",
        component: () =>
          import("../pages/planner/donations/donations.page.vue"),
      },

      {
        path: "/planner/Lean-season-losses",
        name: "planner-lean-season-damage-management",
        component: () => import("../pages/planner/damages/damages.page.vue"),
      },

      {
        path: "/planner/tracker",
        name: "planner-tracker",
        component: () => import("../pages/planner/tracker/tracker.page.vue"),
      },

      {
        path: "/planner/Emergency-season-losses",
        name: "planner-emergency-season-damage-management",
        component: () => import("../pages/planner/damages/er-damages.page.vue"),
      },

      {
        path: "/planner/required-leanseason",
        name: "planner-required-leanseason-management",
        component: () =>
          import("../pages/planner/requested/requested-commodities.page.vue"),
      },

      {
        path: "/planner/dispatches",
        name: "planner-dispatches",
        component: () =>
          import("../pages/planner/dispatch/dispatches.page.vue"),
      },

      {
        path: "/planner/loadingplans",
        name: "planner-loadingplans",
        component: () => import("../pages/planner/loadingplans/index.page.vue"),
      },
      {
        path: "/planner/dispatch-management/manage/:id",
        name: "planner-manage-catalogue",
        component: () => import("../pages/planner/dispatch/manage.page.vue"),
      },

      {
        path: "/planner/commodity-tracking",
        name: "planner-commodity-tracking",
        component: () => import("../pages/planner/commodities/index.page.vue"),
      },
      {
        path: "/planner/commodity-tracking/manage/:id",
        name: "planner-manage-commodity-tracking",
        component: () => import("../pages/planner/commodities/manage.page.vue"),
      },

      {
        path: "/planner/receipt-management",
        name: "planner-receipt-management",
        component: () => import("../pages/planner/receipts/index.page.vue"),
      },

      {
        path: "/planner/receipts",
        name: "planner-receipts",
        component: () => import("../pages/planner/receipts/index.page.vue"),
      },

      {
        path: "/planner/receipts/emergency",
        name: "planner-receipts-emergency",
        component: () =>
          import("../pages/planner/receipts/emergency.receipts.page.vue"),
      },

      {
        path: "/planner/receipts/leanseason",
        name: "planner-receipts-leanseason",
        component: () =>
          import("../pages/planner/receipts/leanseason.receipts.page.vue"),
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
        component: () =>
          import("../pages/planner/requisitions/manage.page.vue"),
      },

      {
        path: "/planner/system",
        name: "planner-system",
        component: () => import("../pages/planner/system/index.page.vue"),
      },

      {
        path: "/planner/project-management",
        name: "planner-project-management",
        component: () => import("../pages/planner/projects/index.page.vue"),
      },
      

      {
        path: "/planner/instruction-management",
        name: "planner-instruction-management",
        component: () => import("../pages/planner/instruction/index.page.vue"),
      },

      {
        path: "/planner/warehouserequisitions",
        name: "planner-warehouserequisitions",
        component: () => import("../pages/planner/warehouserequisitions/index.page.vue"),
      },


      {
        path: "/planner/rejected-instruction-management",
        name: "planner-rejected-instruction-management",
        component: () =>
          import("../pages/planner/instruction/rejected-index.page"),
      },

      {
        path: "/planner/instruction-management/manage/:id",
        name: "planner-manage-instruction-management",
        component: () => import("../pages/planner/instruction/manage.page.vue"),
      },

      {
        path: "/planner/report-management",
        name: "planner-report-management",
        component: () => import("../pages/planner/reports/index.page.vue"),
      },

      {
        path: "/planner/about-system",
        name: "planner-about-system",
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

  //receipient
  {
    path: "/receipient",
    name: "receipient",
    component: () => import("../components/layouts/receipient.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "receipient-home",
        redirect: { name: "receipient-dashboard" },
      },
      {
        path: "/receipient/dashboard",
        name: "receipient-dashboard",
        component: () => import("../pages/receipient/dashboard/index.page.vue"),
      },

      {
        path: "/receipient/change-password",
        name: "receipient-change-password",
        component: () =>
          import("../components/pages/users/change.password.vue"),
      },

      //Users
      {
        path: "/receipient/users",
        name: "receipient-users",
        component: () => import("../pages/receipient/users/index.page.vue"),
      },
      {
        path: "/receipient/users/manage/:id",
        name: "receipient-manage-user",
        component: () => import("../pages/receipient/users/manage.page.vue"),
      },

      {
        path: "/receipient/dispatch-management",
        name: "receipient-dispatch-management",
        component: () =>
          import("../pages/receipient/dispatch/dispatches.page.vue"),
      },

      {
        path: "/receipient/dispatches/emergency",
        name: "receipient-emergency-dispatch-management",
        component: () =>
          import("../pages/receipient/dispatch/emergencydispatches.page.vue"),
      },

      {
        path: "/receipient/dispatches",
        name: "receipient-dispatches",
        component: () =>
          import("../pages/receipient/dispatch/dispatches.page.vue"),
      },

      {
        path: "/receipient/loadingplans",
        name: "receipient-loadingplans",
        component: () =>
          import("../pages/receipient/loadingplans/index.page.vue"),
      },
      {
        path: "/receipient/dispatch-management/manage/:id",
        name: "receipient-manage-catalogue",
        component: () => import("../pages/receipient/dispatch/manage.page.vue"),
      },

      {
        path: "/receipient/commodity-tracking",
        name: "receipient-commodity-tracking",
        component: () =>
          import("../pages/receipient/commodities/index.page.vue"),
      },
      {
        path: "/receipient/commodity-tracking/manage/:id",
        name: "receipient-manage-commodity-tracking",
        component: () =>
          import("../pages/receipient/commodities/manage.page.vue"),
      },

      {
        path: "/receipient/receipt-management",
        name: "receipient-receipt-management",
        component: () => import("../pages/receipient/receipts/index.page.vue"),
      },

      {
        path: "/receipient/receipts",
        name: "receipient-receipts",
        component: () => import("../pages/receipient/receipts/index.page.vue"),
      },

      {
        path: "/receipient/receipts/emergency",
        name: "receipient-receipts-emergency",
        component: () =>
          import("../pages/receipient/receipts/emergency.receipts.page.vue"),
      },

      {
        path: "/receipient/receipts/leanseason",
        name: "receipient-receipts-leanseason",
        component: () =>
          import("../pages/receipient/receipts/leanseason.receipts.page.vue"),
      },

      {
        path: "/receipient/receipt-management/manage/:id",
        name: "receipient-manage-receipt-management",
        component: () => import("../pages/receipient/receipts/manage.page.vue"),
      },

      {
        path: "/receipient/requisition-management",
        name: "receipient-requisition-management",
        component: () =>
          import("../pages/receipient/requisitions/index.page.vue"),
      },

      {
        path: "/receipient/requisition-management/requisitions",
        name: "receipient-requisition-management-rq",
        component: () =>
          import("../pages/receipient/requisitions/manage.page.vue"),
      },

      {
        path: "/receipient/requisition-management/requisitions/manage/:id",
        name: "receipient-manage-requisitions-management-id",
        component: () =>
          import("../pages/receipient/requisitions/edit.page.vue"),
      },

      {
        path: "/receipient/receipt-management/manage/:id",
        name: "receipient-manage-requisition-management",
        component: () =>
          import("../pages/receipient/requisitions/manage.page.vue"),
      },

      {
        path: "/receipient/emergency-management",
        name: "receipient-emergency-management",
        component: () => import("../pages/receipient/emergency/index.page.vue"),
      },

      {
        path: "/receipient/emergency-management/manage/:id",
        name: "receipient-manage-emergency-management",
        component: () =>
          import("../pages/receipient/emergency/manage.page.vue"),
      },

      {
        path: "/receipient/system",
        name: "receipient-system",
        component: () => import("../pages/receipient/system/index.page.vue"),
      },

      {
        path: "/receipient/project-management",
        name: "receipient-project-management",
        component: () => import("../pages/receipient/projects/index.page.vue"),
      },

      {
        path: "/receipient/report-management",
        name: "receipient-report-management",
        component: () => import("../pages/receipient/reports/index.page.vue"),
      },

      {
        path: "/receipient/about-system",
        name: "receipient-about-system",
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
   
         if ((localSession[0] && localSession[0].role === "receipient officer")) {
           // Role found in sessionStorage and it's an admin
           next();
         } else {
           next({ name: 'portal-signin' });
   
         }
       } */
  },

  {
    path: "/district",
    name: "district",
    component: () => import("../components/layouts/district.layout.vue"),
    children: [
      //Dashboard
      {
        path: "",
        name: "district-home",
        redirect: { name: "district-dashboard" },
      },
      {
        path: "/district/dashboard",
        name: "district-dashboard",
        component: () => import("../pages/district/dashboard/index.page.vue"),
      },
      //Users
      {
        path: "/district/users",
        name: "district-users",
        component: () => import("../pages/district/users/index.page.vue"),
      },
      {
        path: "/district/users/manage/:id",
        name: "district-manage-user",
        component: () => import("../pages/district/users/manage.page.vue"),
      },

      {
        path: "/district/dispatch-management",
        name: "district-dispatch-management",
        component: () =>
          import("../pages/district/dispatch/dispatches.page.vue"),
      },

      {
        path: "/district/dispatches/emergency",
        name: "district-emergency-dispatch-management",
        component: () =>
          import("../pages/district/dispatch/emergencydispatches.page.vue"),
      },

      {
        path: "/district/dispatches",
        name: "district-dispatches",
        component: () =>
          import("../pages/district/dispatch/dispatches.page.vue"),
      },

      {
        path: "/district/loadingplans",
        name: "district-loadingplans",
        component: () =>
          import("../pages/district/loadingplans/index.page.vue"),
      },
      {
        path: "/district/dispatch-management/manage/:id",
        name: "district-manage-catalogue",
        component: () => import("../pages/district/dispatch/manage.page.vue"),
      },

      {
        path: "/district/commodity-tracking",
        name: "district-commodity-tracking",
        component: () => import("../pages/district/commodities/index.page.vue"),
      },
      {
        path: "/district/commodity-tracking/manage/:id",
        name: "district-manage-commodity-tracking",
        component: () =>
          import("../pages/district/commodities/manage.page.vue"),
      },

      {
        path: "/district/receipt-management",
        name: "district-receipt-management",
        component: () => import("../pages/district/receipts/index.page.vue"),
      },

      {
        path: "/district/receipts",
        name: "district-receipts",
        component: () => import("../pages/district/receipts/index.page.vue"),
      },

      {
        path: "/district/receipts/emergency",
        name: "district-receipts-emergency",
        component: () =>
          import("../pages/district/receipts/emergency.receipts.page.vue"),
      },

      {
        path: "/district/receipts/leanseason",
        name: "district-receipts-leanseason",
        component: () =>
          import("../pages/district/receipts/leanseason.receipts.page.vue"),
      },

      {
        path: "/district/receipt-management/manage/:id",
        name: "district-manage-receipt-management",
        component: () => import("../pages/district/receipts/manage.page.vue"),
      },

      {
        path: "/district/requisition-management",
        name: "district-requisition-management",
        component: () =>
          import("../pages/district/requisitions/index.page.vue"),
      },

      {
        path: "/district/requisition-management/requisitions",
        name: "district-requisition-management-rq",
        component: () =>
          import("../pages/district/requisitions/manage.page.vue"),
      },

      {
        path: "/district/requisition-management/requisitions/manage/:id",
        name: "district-manage-requisitions-management-id",
        component: () => import("../pages/district/requisitions/edit.page.vue"),
      },

      {
        path: "/district/receipt-management/manage/:id",
        name: "district-manage-requisition-management",
        component: () =>
          import("../pages/district/requisitions/manage.page.vue"),
      },

      {
        path: "/district/emergency-management",
        name: "district-emergency-management",
        component: () => import("../pages/district/emergency/index.page.vue"),
      },

      {
        path: "/district/emergency-management/manage/:id",
        name: "district-manage-emergency-management",
        component: () => import("../pages/district/emergency/manage.page.vue"),
      },

      {
        path: "/district/change-password",
        name: "district-change-password",
        component: () =>
          import("../components/pages/users/change.password.vue"),
      },

      {
        path: "/district/system",
        name: "district-system",
        component: () => import("../pages/district/system/index.page.vue"),
      },

      {
        path: "/district/project-management",
        name: "district-project-management",
        component: () => import("../pages/district/projects/index.page.vue"),
      },

      {
        path: "/district/report-management",
        name: "district-report-management",
        component: () => import("../pages/district/reports/index.page.vue"),
      },

      {
        path: "/district/about-system",
        name: "district-about-system",
        component: () => import("../pages/about/index.page.vue"),
      },
    ],

    beforeEnter: (to, from, next) => {
      let role = JSON.parse(sessionStorage.getItem("RLE"));
      if (role != null && typeof role.name != "undefined") {
        if (role.name == "district") {
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
   
         if ((localSession[0] && localSession[0].role === "district officer")) {
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
        component: () =>
          import("../pages/commissioner/dashboard/index.page.vue"),
      },

      {
        path: "/commissioner/tracker",
        name: "commissioner-tracker",
        component: () =>
          import("../pages/commissioner/tracker/tracker.page.vue"),
      },

      {
        path: "/commissioner/stats",
        name: "commissioner-stats",
        component: () =>
          import("../pages/commissioner/stats/stats.page.vue"),
      },


      {
        path: "/commissioner/stock-prepositioning",
        name: "commissioner-stock-prepositioning",
        component: () =>
          import("../pages/commissioner/stock-prepositoning/index.page.vue"),
      },

      {
        path: "/commissioner/change-password",
        name: "commissioner-change-password",
        component: () =>
          import("../components/pages/users/change.password.vue"),
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
        component: () =>
          import("../pages/commissioner/damages/damages.page.vue"),
      },

      {
        path: "/commissioner/Emergency-season-losses",
        name: "commissioner-emergency-season-damage-management",
        component: () =>
          import("../pages/commissioner/damages/er-damages.page.vue"),
      },
      {
        path: "/commissioner/users/manage/:id",
        name: "commissioner-manage-user",
        component: () => import("../pages/commissioner/users/manage.page.vue"),
      },

      {
        path: "/commissioner/dispatch-management",
        name: "commissioner-dispatch-management",
        component: () =>
          import("../pages/commissioner/dispatch/index.page.vue"),
      },

      {
        path: "/commissioner/instruction-management",
        name: "commissioner-instruction-management",
        component: () =>
          import("../pages/commissioner/instruction/index.page.vue"),
      },
      {
        path: "/commissioner/instruction-management/manage/:id",
        name: "commissioner-manage-instruction-management",
        component: () =>
          import("../pages/commissioner/instruction/manage.page.vue"),
      },

      {
        path: "/commissioner/dispatches",
        name: "commissioner-dispatches",
        component: () =>
          import("../pages/commissioner/dispatch/dispatches.page.vue"),
      },

      {
        path: "/commissioner/loadingplans",
        name: "commissioner-loadingplans",
        component: () =>
          import("../pages/commissioner/loadingplans/index.page.vue"),
      },
      {
        path: "/commissioner/dispatch-management/manage/:id",
        name: "commissioner-manage-catalogue",
        component: () =>
          import("../pages/commissioner/dispatch/manage.page.vue"),
      },

      {
        path: "/commissioner/commodity-tracking",
        name: "commissioner-commodity-tracking",
        component: () =>
          import("../pages/commissioner/commodities/index.page.vue"),
      },
      {
        path: "/commissioner/commodity-tracking/manage/:id",
        name: "commissioner-manage-commodity-tracking",
        component: () =>
          import("../pages/commissioner/commodities/manage.page.vue"),
      },

      {
        path: "/commissioner/receipt-management",
        name: "commissioner-receipt-management",
        component: () =>
          import("../pages/commissioner/receipts/index.page.vue"),
      },

      {
        path: "/commissioner/receipts",
        name: "commissioner-receipts",
        component: () =>
          import("../pages/commissioner/receipts/receipts.page.vue"),
      },

      {
        path: "/commissioner/receipt-management/manage/:id",
        name: "commissioner-manage-receipt-management",
        component: () =>
          import("../pages/commissioner/receipts/manage.page.vue"),
      },

      {
        path: "/commissioner/requisition-management",
        name: "commissioner-requisition-management",
        component: () =>
          import("../pages/commissioner/requisitions/index.page.vue"),
      },
      {
        path: "/commissioner/receipt-management/manage/:id",
        name: "commissioner-manage-requisition-management",
        component: () =>
          import("../pages/commissioner/requisitions/manage.page.vue"),
      },

      {
        path: "/commissioner/system",
        name: "commissioner-system",
        component: () => import("../pages/commissioner/system/index.page.vue"),
      },

      {
        path: "/commissioner/project-management",
        name: "commissioner-project-management",
        component: () =>
          import("../pages/commissioner/projects/index.page.vue"),
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
