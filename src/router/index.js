import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import JoinView from '../views/JoinView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import AdminPanel from '@/components/AdminPanel.vue';
import NoPermission from '@/components/NoPermission.vue';
import CreatePage from '@/components/CreatePage.vue';
import RaidsPage from '@/components/RaidsPage.vue';
import { useAuthStore } from '../stores/auth.js';

const requireAdmin = (to, from, next) => {
  const auth = useAuthStore();
  if (auth.profile?.tier !== undefined && auth.profile.tier !== null && auth.profile.tier <= 1){
    next();
  } else {
    next('/');
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/rejected',
      name: 'no-permission',
      component: NoPermission,
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePage,
      meta: { requiresNoAuth: false },
    },
    {
      path: '/raids',
      name: 'raids',
      component: RaidsPage,
      meta: { requiresNoAuth: false },
    },
    {
      path: '/join',
      name: 'join',
      component: JoinView,
      children: [
        {
          path: 'register',
          name: 'register',
          component: RegisterView,
          meta: { requiresNoAuth: true },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/admin',
      name: 'adminpanel',
      component: AdminPanel,
      beforeEnter: requireAdmin,
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  if(auth.loading){
    await auth.fetchUser();
  }
  if(to.meta.requiresNoAuth && auth.user){
    return next('/');
  }
  next();
});



export default router
