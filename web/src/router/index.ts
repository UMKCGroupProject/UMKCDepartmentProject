import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Every route is declared here. `component` uses a dynamic import so each view
// becomes its own bundle, loaded the first time the route is visited.
//
// meta flags drive the guard below:
//   requiresAuth  — must be signed in
//   requiresAdmin — must be signed in as an admin
//   guestOnly     — signed-in users are sent to their dashboard instead
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'GTA Portal' },
  },
  {
    path: '/info',
    name: 'info',
    component: () => import('@/views/InfoView.vue'),
    meta: { title: 'GTA Qualification Information' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Login', guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'Register', guestOnly: true },
  },
  {
    path: '/apply',
    name: 'apply',
    component: () => import('@/views/ApplyView.vue'),
    meta: { title: 'Apply', requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard', requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  // The store must be resolved inside the guard, after Pinia is installed.
  const auth = useAuthStore();

  // Note this is a convenience, not a security boundary: the guard only
  // decides what to render. The API independently rejects any request without
  // a valid token, which is what actually protects the data.
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'dashboard' };
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'dashboard' };
  }
  return true;
});

// A single-page app never reloads, so the document title has to be updated by
// hand on each navigation.
router.afterEach((to) => {
  const title = to.meta.title;
  document.title = typeof title === 'string' ? title : 'GTA Portal';
});

export default router;
