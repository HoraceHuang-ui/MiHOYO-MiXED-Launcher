import * as VueRouter from "vue-router";
import MainPage from "./pages/MainPage.vue";
import StarRailPage from "./pages/StarRailPage.vue";
import GenshinPage from "./pages/GenshinPage.vue";
import tmpGsPage from "./pages/tmpGsPage.vue";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
    {
      name: "mainpage",
      path: "/",
      component: MainPage,
    },
    {
      name: "gspage",
      path: "/gspage",
      component: GenshinPage,
    },
    {
      name: "srpage",
      path: "/srpage",
      component: StarRailPage,
    },
    {
      name: "tempGsPage",
      path: "/tmpgspage",
      component: tmpGsPage,
    },
  ],
});

export default router;
