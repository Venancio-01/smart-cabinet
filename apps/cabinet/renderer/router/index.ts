import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";
import Index from "@/pages/index.vue";
import Login from "@/pages/login.vue";
import Main from "@/pages/main.vue";
import CabinetDoor from "@/pages/cabinet-door.vue";
import ViewCarrier from "@/pages/view-carrier.vue";
import Carrier from "@/pages/carrier.vue";
import User from "@/pages/user.vue";
import Department from "@/pages/department.vue";
import Permission from "@/pages/permission.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/index" },
  {
    path: "/index",
    component: Index,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/main",
    component: Main,
    redirect: "/main/cabinet-door",
    children: [
      {
        path: "cabinet-door",
        name: "cabinetDoor",
        component: CabinetDoor,
      },
      {
        path: "carrier/:state",
        component: Carrier,
        props: true,
        name: "carrier",
      },
      {
        path: "user",
        component: User,
        name: "user",
      },
      {
        path: "department",
        component: Department,
        name: "department",
      },
      {
        path: "permission",
        component: Permission,
        name: "permission",
      },
    ],
  },
  {
    path: "/view-carrier/:state",
    component: ViewCarrier,
    props: true,
  },
  {
    path: "/open/:id",
    component: () => import("@/pages/open.vue"),
    props: true,
  },
  { path: "/result", component: () => import("@/pages/result.vue") },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
