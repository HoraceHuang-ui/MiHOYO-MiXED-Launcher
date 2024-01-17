import * as VueRouter from "vue-router";
import MainPage from "../pages/MainPage.vue";
import StarRailPage from "../pages/StarRailPage/StarRailPage.vue";
import GenshinPage from "../pages/GenshinPage/GenshinPage.vue";
import Honkai3Page from "../pages/Honkai3Page/Honkai3Page.vue";
import SettingsPage from "../pages/SettingsPage/SettingsPage.vue";
import tmpPage from "../pages/tmpPage.vue";

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
            name: "hipage",
            path: "/hipage",
            component: Honkai3Page,
        },
        {
            name: "settingsPage",
            path: "/settingsPage",
            component: SettingsPage,
        },
        {
            name: "tempPage",
            path: "/tmppage",
            component: tmpPage,
        },
    ],
});

export default router;
