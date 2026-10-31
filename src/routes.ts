import type { RouteRecordRaw } from 'vue-router'

export const systemInfoRoutes: RouteRecordRaw[] = [
  {
    path: 'system-info',
    name: 'admin-system-info',
    component: () => import('./views/SystemInfoView.vue'),
  },
]
