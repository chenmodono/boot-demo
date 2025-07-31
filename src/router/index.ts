import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import CustomizeView from '../views/CustomizeView.vue'

// 管理后台组件
import AdminLayout from '../components/AdminLayout.vue'
import AdminLoginView from '../views/admin/AdminLoginView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminProductsView from '../views/admin/AdminProductsView.vue'

// 路由守卫：检查管理员登录状态
const requireAdminAuth = (to: any, from: any, next: any) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    next()
  } else {
    next('/admin/login')
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetailView
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView
    },
    {
      path: '/customize',
      name: 'customize',
      component: CustomizeView
    },
    // 管理后台路由
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView
    },
    {
      path: '/admin',
      component: AdminLayout,
      beforeEnter: requireAdminAuth,
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: AdminDashboardView
        },
        {
          path: 'products',
          name: 'admin-products',
          component: AdminProductsView
        },
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('../views/admin/AdminCategoriesView.vue')
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('../views/admin/AdminOrdersView.vue')
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../views/admin/AdminUsersView.vue')
        },
        {
          path: 'reviews',
          name: 'admin-reviews',
          component: () => import('../views/admin/AdminReviewsView.vue')
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('../views/admin/AdminSettingsView.vue')
        }
      ]
    }
  ],
})

export default router
