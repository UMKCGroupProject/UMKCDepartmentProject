import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// All paths lowercase. The old router defined '/AppPage' but HomePage.vue
// pushed '/Register' against a route registered as '/register'.
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

  // The old guard tested `store.state.user === null`, but the default state
  // was `{}` — so it never fired and every protected route was reachable
  // while logged out.
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

// Page titles live in route meta rather than in <title> tags illegally
// embedded in component templates.
router.afterEach((to) => {
  const title = to.meta.title;
  document.title = typeof title === 'string' ? title : 'GTA Portal';
});

export default router;
