import { createWebHistory, createRouter } from 'vue-router'
import Register from '@/components/Home/Register'
import InfoPage from "@/components/Home/InfoPage"
import HomePage from "@/components/Home/HomePage"
import Login from "@/components/Home/Login"
import AppPage from "@/components/Home/AppPage"
import LoginPaje from "@/components/Home/LoginPaje"
import StudentPage from "@/components/Views/Student/StudentPage"
import Admin from "@/components/Views/Admin/Admin"

const routes = [
    {
        path: "/",
        component: HomePage,
    },
    {
        path: "/InfoPage",
        component: InfoPage
    },
    {
        path: "/Register",
        component: Register
    },
    {
        path: "/HomePage",
        component: HomePage
    }
    ,
    {
        path: "/Login",
        component: Login
    },
    {
        path: "/AppPage",
        component: AppPage
    } ,
    {
        path: "/LoginPaje",
        component: LoginPaje
    },
    {
        path: "/student",
        component: StudentPage
    },
    {
        path: "/admin",
        component: Admin
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;