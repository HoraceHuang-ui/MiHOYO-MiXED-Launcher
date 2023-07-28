import * as VueRouter from "vue-router";
import MainPage from "./pages/MainPage.vue";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    {
      name: "mainpage",
      path: "/",
      component: MainPage,
    },
  ],
});

export default router;
