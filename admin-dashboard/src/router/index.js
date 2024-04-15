/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */
/* boiler plate version
// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts,
})

router.beforeEach((to, from) => {
  return false
})

export default router

*/

// router/index.ts
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Normalize paths to lower case or perform a specific matching if needed
  const path = to.path.toLowerCase();

  if (path === '/login') {
    if (authStore.isAuthenticated) {
      // Redirect authenticated users trying to access login to home page
      next({ path: '/home' });
    } else {
      // Allow access to login if not authenticated
      next();
    }
  } else {
    // For all other routes, check if authenticated
    if (!authStore.isAuthenticated) {
      // Redirect to login if not authenticated
      next({ path: '/login' });
    } else {
      // Allow access if authenticated
      next();
    }
  }
});

export default router;
