import { createWebHistory, createRouter } from 'vue-router'
import Register from '@/components/Views/Register/Register.vue'
import InfoPage from "@/components/Views/Info/InfoPage.vue"
import HomePage from "@/components/Views/Home/HomePage.vue"
import AppPage from "@/components/Views/Application/AppPage.vue"
import LoginPage from "@/components/Views/Login/LoginPage.vue"
// import StudentPage from "@/components/Views/Student/StudentPage.vue"
// import Admin from "@/components/Views/Admin/Admin.vue"
import Landing from "@/components/Views/Landing/Landing.vue";
import store from "@/store/store.js"
const routes = [
    {
        path: "/",
        name: "home",
        component: HomePage,
    },
    {
        path: "/info",
        name: "info",
        component: InfoPage
    },
    {
        path: "/register",
        name: "register",
        component: Register
    },
    {
        path: "/login",
        name: "login",
        component: LoginPage
    },
    {
        path: "/AppPage",
        name: "apppage",
        component: AppPage,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path:"/landing",
        name: "landing",
        component: Landing,
        meta: {
            requiresAuth: true,
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((route) => route.meta.requiresAuth) && store.state.user === null) {
        next({name: 'login'});
        return;
    }
    next();
});

export default router;