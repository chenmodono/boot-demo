<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span v-if="!sidebarCollapsed">{{ $t('admin.layout.title') }}</span>
        </div>
        <button @click="toggleSidebar" class="toggle-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          <span v-if="!sidebarCollapsed">{{ $t('admin.layout.dashboard') }}</span>
        </router-link>
        
        <router-link to="/admin/products" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
          </svg>
          <span v-if="!sidebarCollapsed">{{ $t('admin.layout.products') }}</span>
        </router-link>
        
        <router-link to="/admin/categories" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span v-if="!sidebarCollapsed">{{ $t('admin.layout.categories') }}</span>
        </router-link>
        
        <router-link to="/admin/orders" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          <span v-if="!sidebarCollapsed">{{ $t('admin.layout.orders') }}</span>
        </router-link>
        
        <router-link to="/admin/users" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span v-if="!sidebarCollapsed">{{ $t('admin.layout.users') }}</span>
        </router-link>
        
        <router-link to="/admin/reviews" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <span v-if="!sidebarCollapsed">{{ $t('admin.layout.reviews') }}</span>
        </router-link>
        
        <router-link to="/admin/settings" class="nav-item" active-class="active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
          </svg>
          <span v-if="!sidebarCollapsed">{{ $t('admin.layout.settings') }}</span>
        </router-link>
      </nav>
      
      <div class="sidebar-footer">
        <router-link to="/" class="nav-item">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span v-if="!sidebarCollapsed">{{ $t('admin.layout.backToSite') }}</span>
        </router-link>
      </div>
    </aside>
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部栏 -->
      <header class="topbar">
        <div class="topbar-left">
          <button @click="toggleSidebar" class="mobile-menu-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <h2>{{ pageTitle }}</h2>
        </div>
        
        <div class="topbar-right">
          <!-- 语言切换 -->
          <div class="language-switcher">
            <button @click="toggleLanguage" class="lang-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
              </svg>
              {{ currentLanguage.toUpperCase() }}
            </button>
          </div>
          
          <!-- 用户菜单 -->
          <div class="user-menu" @click="toggleUserMenu" v-click-outside="closeUserMenu">
            <div class="user-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span class="user-name">{{ adminUser?.name }}</span>
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
            
            <div v-if="showUserMenu" class="user-dropdown">
              <a href="#" @click.prevent="viewProfile">{{ $t('admin.layout.profile') }}</a>
              <a href="#" @click.prevent="logout">{{ $t('admin.layout.logout') }}</a>
            </div>
          </div>
        </div>
      </header>
      
      <!-- 页面内容 -->
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t: $t, locale } = useI18n()
const router = useRouter()
const route = useRoute()

const sidebarCollapsed = ref(false)
const showUserMenu = ref(false)
const adminUser = ref(null)

const currentLanguage = computed(() => locale.value)

const pageTitle = computed(() => {
  const routeName = route.name
  switch (routeName) {
    case 'admin-dashboard':
      return $t('admin.layout.dashboard')
    case 'admin-products':
      return $t('admin.layout.products')
    case 'admin-categories':
      return $t('admin.layout.categories')
    case 'admin-orders':
      return $t('admin.layout.orders')
    case 'admin-users':
      return $t('admin.layout.users')
    case 'admin-reviews':
      return $t('admin.layout.reviews')
    case 'admin-settings':
      return $t('admin.layout.settings')
    default:
      return $t('admin.layout.title')
  }
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  localStorage.setItem('language', locale.value)
}

const viewProfile = () => {
  router.push('/admin/profile')
  closeUserMenu()
}

const logout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  router.push('/admin/login')
}

// 点击外部关闭菜单的指令
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

onMounted(() => {
  // 获取管理员信息
  const userStr = localStorage.getItem('adminUser')
  if (userStr) {
    adminUser.value = JSON.parse(userStr)
  }
  
  // 检查屏幕尺寸，移动端默认收起侧边栏
  if (window.innerWidth <= 768) {
    sidebarCollapsed.value = true
  }
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

.sidebar {
  width: 260px;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #667eea;
  font-weight: 600;
  font-size: 18px;
}

.logo svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.toggle-btn:hover {
  background: #e9ecef;
}

.toggle-btn svg {
  width: 18px;
  height: 18px;
  color: #666;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s ease;
  margin: 0 10px;
  border-radius: 8px;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #333;
  text-decoration: none;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-item svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar.collapsed .nav-item span {
  display: none;
}

.sidebar-footer {
  padding: 20px 0;
  border-top: 1px solid #e1e5e9;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed + .main-content {
  margin-left: 70px;
}

.topbar {
  background: white;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

.mobile-menu-btn svg {
  width: 20px;
  height: 20px;
  color: #666;
}

.topbar-left h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.language-switcher .lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s ease;
}

.language-switcher .lang-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.language-switcher .lang-btn svg {
  width: 16px;
  height: 16px;
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-menu:hover {
  background: #f8f9fa;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar svg {
  width: 18px;
  height: 18px;
  color: white;
}

.user-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: #666;
  transition: transform 0.2s ease;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 150px;
  z-index: 1000;
}

.user-dropdown a {
  display: block;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.user-dropdown a:hover {
  background: #f8f9fa;
  text-decoration: none;
}

.page-content {
  flex: 1;
  padding: 0;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 260px;
  }
  
  .sidebar.collapsed {
    transform: translateX(0);
    width: 260px;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .sidebar.collapsed + .main-content {
    margin-left: 0;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .topbar {
    padding: 0 16px;
  }
}
</style>