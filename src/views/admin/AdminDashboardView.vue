<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>{{ $t('admin.dashboard.title') }}</h1>
      <p>{{ $t('admin.dashboard.welcome') }}, {{ adminUser?.name }}!</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon products">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalProducts }}</h3>
          <p>{{ $t('admin.dashboard.totalProducts') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orders">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalOrders }}</h3>
          <p>{{ $t('admin.dashboard.totalOrders') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon users">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ stats.totalUsers }}</h3>
          <p>{{ $t('admin.dashboard.totalUsers') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon revenue">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>¥{{ stats.totalRevenue.toLocaleString() }}</h3>
          <p>{{ $t('admin.dashboard.totalRevenue') }}</p>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <h2>{{ $t('admin.dashboard.quickActions') }}</h2>
      <div class="actions-grid">
        <router-link to="/admin/products/add" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          <h3>{{ $t('admin.dashboard.addProduct') }}</h3>
          <p>{{ $t('admin.dashboard.addProductDesc') }}</p>
        </router-link>

        <router-link to="/admin/orders" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <h3>{{ $t('admin.dashboard.manageOrders') }}</h3>
          <p>{{ $t('admin.dashboard.manageOrdersDesc') }}</p>
        </router-link>

        <router-link to="/admin/categories" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h3>{{ $t('admin.dashboard.manageCategories') }}</h3>
          <p>{{ $t('admin.dashboard.manageCategoriesDesc') }}</p>
        </router-link>

        <router-link to="/admin/users" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.01 3.01 0 0 0 17.1 7H16c-.8 0-1.54.37-2.03.97L12 10.5 10.03 7.97A2.99 2.99 0 0 0 8 7H6.9c-1.3 0-2.4.84-2.86 2.37L1.5 16H4v6h2v-6h2.5l1.5-4.5L12 14l2-2.5L15.5 16H18v6h2z"/>
            </svg>
          </div>
          <h3>{{ $t('admin.dashboard.manageUsers') }}</h3>
          <p>{{ $t('admin.dashboard.manageUsersDesc') }}</p>
        </router-link>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity">
      <h2>{{ $t('admin.dashboard.recentActivity') }}</h2>
      <div class="activity-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <div class="activity-icon" :class="activity.type">
            <svg v-if="activity.type === 'order'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1z"/>
            </svg>
            <svg v-else-if="activity.type === 'user'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1z"/>
            </svg>
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.text }}</p>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const adminUser = ref(null)
const stats = reactive({
  totalProducts: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalRevenue: 0
})

const recentActivities = ref([])

// 模拟加载统计数据
const loadStats = async () => {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500))
  
  stats.totalProducts = 156
  stats.totalOrders = 1234
  stats.totalUsers = 5678
  stats.totalRevenue = 123456
}

// 模拟加载最近活动
const loadRecentActivities = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  recentActivities.value = [
    {
      id: 1,
      type: 'order',
      text: '新订单 #12345 已创建',
      time: '5分钟前'
    },
    {
      id: 2,
      type: 'user',
      text: '新用户注册：张***',
      time: '15分钟前'
    },
    {
      id: 3,
      type: 'product',
      text: '商品库存不足：飞机杯倒模名器',
      time: '1小时前'
    },
    {
      id: 4,
      type: 'order',
      text: '订单 #12340 已发货',
      time: '2小时前'
    }
  ]
}

onMounted(async () => {
  // 获取管理员信息
  const userStr = localStorage.getItem('adminUser')
  if (userStr) {
    adminUser.value = JSON.parse(userStr)
  }
  
  // 加载数据
  await Promise.all([
    loadStats(),
    loadRecentActivities()
  ])
})
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h1 {
  color: #333;
  margin: 0 0 5px 0;
  font-size: 28px;
  font-weight: 600;
}

.dashboard-header p {
  color: #666;
  margin: 0;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.stat-icon.products {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.orders {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.users {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-content h3 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.stat-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: block;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  color: inherit;
}

.action-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.action-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.action-card h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.action-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.recent-activity h2 {
  color: #333;
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
}

.activity-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.activity-icon.order {
  background: #667eea;
}

.activity-icon.user {
  background: #4facfe;
}

.activity-icon.product {
  background: #f093fb;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 14px;
}

.activity-time {
  color: #999;
  font-size: 12px;
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 15px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>