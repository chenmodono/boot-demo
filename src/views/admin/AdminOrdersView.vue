<template>
  <div class="admin-orders">
    <div class="page-header">
      <h1>{{ $t('admin.orders.title') }}</h1>
      <div class="header-actions">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('admin.orders.searchPlaceholder')"
            @input="handleSearch"
          />
        </div>
        <select v-model="statusFilter" @change="handleFilter" class="status-filter">
          <option value="">{{ $t('admin.orders.allStatuses') }}</option>
          <option value="pending">{{ $t('admin.orders.pending') }}</option>
          <option value="processing">{{ $t('admin.orders.processing') }}</option>
          <option value="shipped">{{ $t('admin.orders.shipped') }}</option>
          <option value="delivered">{{ $t('admin.orders.delivered') }}</option>
          <option value="cancelled">{{ $t('admin.orders.cancelled') }}</option>
        </select>
      </div>
    </div>

    <!-- 订单统计 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon pending">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ orderStats.pending }}</h3>
          <p>{{ $t('admin.orders.pendingOrders') }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon processing">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ orderStats.processing }}</h3>
          <p>{{ $t('admin.orders.processingOrders') }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon shipped">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ orderStats.shipped }}</h3>
          <p>{{ $t('admin.orders.shippedOrders') }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon revenue">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>¥{{ orderStats.totalRevenue.toLocaleString() }}</h3>
          <p>{{ $t('admin.orders.totalRevenue') }}</p>
        </div>
      </div>
    </div>

    <!-- 订单列表 -->
    <div v-if="loading" class="loading">
      {{ $t('admin.orders.loading') }}
    </div>
    
    <div v-else-if="filteredOrders.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
      </svg>
      <h3>{{ $t('admin.orders.noOrders') }}</h3>
      <p>{{ $t('admin.orders.noOrdersDesc') }}</p>
    </div>
    
    <div v-else class="orders-table">
      <table>
        <thead>
          <tr>
            <th>{{ $t('admin.orders.orderId') }}</th>
            <th>{{ $t('admin.orders.customer') }}</th>
            <th>{{ $t('admin.orders.products') }}</th>
            <th>{{ $t('admin.orders.total') }}</th>
            <th>{{ $t('admin.orders.status') }}</th>
            <th>{{ $t('admin.orders.date') }}</th>
            <th>{{ $t('admin.orders.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id" class="order-row">
            <td class="order-id">
              <span class="id-text">#{{ order.id }}</span>
            </td>
            <td class="customer-info">
              <div class="customer-details">
                <strong>{{ order.customerName }}</strong>
                <span class="customer-email">{{ order.customerEmail }}</span>
              </div>
            </td>
            <td class="products-info">
              <div class="product-count">{{ order.items.length }} {{ $t('admin.orders.items') }}</div>
              <div class="product-preview">
                <span v-for="(item, index) in order.items.slice(0, 2)" :key="index" class="product-name">
                  {{ item.name }}
                </span>
                <span v-if="order.items.length > 2" class="more-items">
                  +{{ order.items.length - 2 }} {{ $t('admin.orders.more') }}
                </span>
              </div>
            </td>
            <td class="order-total">
              <strong>¥{{ order.total.toLocaleString() }}</strong>
            </td>
            <td class="order-status">
              <span :class="['status-badge', order.status]">
                {{ $t(`admin.orders.${order.status}`) }}
              </span>
            </td>
            <td class="order-date">
              {{ formatDate(order.createdAt) }}
            </td>
            <td class="order-actions">
              <button @click="viewOrder(order)" class="view-btn" :title="$t('admin.orders.view')">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
              <select @change="updateOrderStatus(order, $event)" :value="order.status" class="status-select">
                <option value="pending">{{ $t('admin.orders.pending') }}</option>
                <option value="processing">{{ $t('admin.orders.processing') }}</option>
                <option value="shipped">{{ $t('admin.orders.shipped') }}</option>
                <option value="delivered">{{ $t('admin.orders.delivered') }}</option>
                <option value="cancelled">{{ $t('admin.orders.cancelled') }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="currentPage = 1" 
        :disabled="currentPage === 1"
        class="page-btn"
      >
        {{ $t('admin.orders.first') }}
      </button>
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="page-btn"
      >
        {{ $t('admin.orders.previous') }}
      </button>
      
      <span class="page-info">
        {{ $t('admin.orders.pageInfo', { current: currentPage, total: totalPages }) }}
      </span>
      
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        {{ $t('admin.orders.next') }}
      </button>
      <button 
        @click="currentPage = totalPages" 
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        {{ $t('admin.orders.last') }}
      </button>
    </div>

    <!-- 订单详情模态框 -->
    <div v-if="showOrderModal" class="modal-overlay" @click="closeOrderModal">
      <div class="modal order-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ $t('admin.orders.orderDetails') }} #{{ selectedOrder.id }}</h2>
          <button @click="closeOrderModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <div class="order-info-grid">
            <div class="info-section">
              <h3>{{ $t('admin.orders.customerInfo') }}</h3>
              <p><strong>{{ $t('admin.orders.name') }}:</strong> {{ selectedOrder.customerName }}</p>
              <p><strong>{{ $t('admin.orders.email') }}:</strong> {{ selectedOrder.customerEmail }}</p>
              <p><strong>{{ $t('admin.orders.phone') }}:</strong> {{ selectedOrder.customerPhone }}</p>
            </div>
            
            <div class="info-section">
              <h3>{{ $t('admin.orders.shippingInfo') }}</h3>
              <p><strong>{{ $t('admin.orders.address') }}:</strong> {{ selectedOrder.shippingAddress }}</p>
              <p><strong>{{ $t('admin.orders.status') }}:</strong> 
                <span :class="['status-badge', selectedOrder.status]">
                  {{ $t(`admin.orders.${selectedOrder.status}`) }}
                </span>
              </p>
              <p><strong>{{ $t('admin.orders.orderDate') }}:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
            </div>
          </div>
          
          <div class="order-items">
            <h3>{{ $t('admin.orders.orderItems') }}</h3>
            <div class="items-list">
              <div v-for="item in selectedOrder.items" :key="item.id" class="item-row">
                <img :src="item.image" :alt="item.name" class="item-image" />
                <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <p class="item-variant">{{ item.variant }}</p>
                  <p class="item-price">¥{{ item.price }} × {{ item.quantity }}</p>
                </div>
                <div class="item-total">
                  ¥{{ (item.price * item.quantity).toLocaleString() }}
                </div>
              </div>
            </div>
            
            <div class="order-summary">
              <div class="summary-row">
                <span>{{ $t('admin.orders.subtotal') }}:</span>
                <span>¥{{ selectedOrder.subtotal.toLocaleString() }}</span>
              </div>
              <div class="summary-row">
                <span>{{ $t('admin.orders.shipping') }}:</span>
                <span>¥{{ selectedOrder.shipping.toLocaleString() }}</span>
              </div>
              <div class="summary-row total">
                <span>{{ $t('admin.orders.total') }}:</span>
                <span>¥{{ selectedOrder.total.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const loading = ref(true)
const orders = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showOrderModal = ref(false)
const selectedOrder = ref(null)

// 订单统计
const orderStats = computed(() => {
  const stats = {
    pending: 0,
    processing: 0,
    shipped: 0,
    totalRevenue: 0
  }
  
  orders.value.forEach(order => {
    if (order.status === 'pending') stats.pending++
    else if (order.status === 'processing') stats.processing++
    else if (order.status === 'shipped') stats.shipped++
    
    if (order.status !== 'cancelled') {
      stats.totalRevenue += order.total
    }
  })
  
  return stats
})

// 过滤订单
const filteredOrders = computed(() => {
  let filtered = orders.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerEmail.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }
  
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// 分页订单
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredOrders.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage)
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 筛选处理
const handleFilter = () => {
  currentPage.value = 1
}

// 查看订单详情
const viewOrder = (order) => {
  selectedOrder.value = order
  showOrderModal.value = true
}

// 关闭订单详情模态框
const closeOrderModal = () => {
  showOrderModal.value = false
  selectedOrder.value = null
}

// 更新订单状态
const updateOrderStatus = (order, event) => {
  const newStatus = event.target.value
  const orderIndex = orders.value.findIndex(o => o.id === order.id)
  if (orderIndex > -1) {
    orders.value[orderIndex].status = newStatus
    console.log(`订单 ${order.id} 状态更新为: ${newStatus}`)
  }
}

// 生成模拟订单数据
const generateMockOrders = () => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const customers = [
    { name: '张三', email: 'zhangsan@example.com', phone: '13800138001' },
    { name: '李四', email: 'lisi@example.com', phone: '13800138002' },
    { name: '王五', email: 'wangwu@example.com', phone: '13800138003' },
    { name: '赵六', email: 'zhaoliu@example.com', phone: '13800138004' },
    { name: '钱七', email: 'qianqi@example.com', phone: '13800138005' }
  ]
  
  const products = [
    { name: '情趣内衣套装', price: 299, image: '/images/product1.jpg' },
    { name: '按摩棒', price: 199, image: '/images/product2.jpg' },
    { name: '润滑剂', price: 89, image: '/images/product3.jpg' },
    { name: '情趣玩具', price: 399, image: '/images/product4.jpg' }
  ]
  
  const mockOrders = []
  
  for (let i = 1; i <= 50; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const itemCount = Math.floor(Math.random() * 3) + 1
    const items = []
    let subtotal = 0
    
    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      const item = {
        id: `item-${i}-${j}`,
        name: product.name,
        price: product.price,
        quantity: quantity,
        variant: '默认款式',
        image: product.image
      }
      items.push(item)
      subtotal += product.price * quantity
    }
    
    const shipping = 20
    const total = subtotal + shipping
    
    mockOrders.push({
      id: `ORD${String(i).padStart(6, '0')}`,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: `北京市朝阳区某某街道${i}号`,
      status: status,
      items: items,
      subtotal: subtotal,
      shipping: shipping,
      total: total,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return mockOrders
}

// 加载订单数据
const loadOrders = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    orders.value = generateMockOrders()
  } catch (error) {
    console.error('加载订单失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.admin-orders {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.page-header h1 {
  color: #333;
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: #666;
  z-index: 1;
}

.search-box input {
  padding: 10px 12px 10px 40px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  width: 250px;
  transition: border-color 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
}

.status-filter {
  padding: 10px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.stat-icon.pending {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.stat-icon.processing {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.stat-icon.shipped {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-content h3 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 20px;
}

.empty-state p {
  color: #666;
  margin: 0;
}

.orders-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.orders-table table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  background: #f8f9fa;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e1e5e9;
  font-size: 14px;
}

.orders-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: top;
}

.order-row:hover {
  background: #f8f9fa;
}

.order-id .id-text {
  font-family: monospace;
  font-weight: 600;
  color: #667eea;
}

.customer-details strong {
  display: block;
  color: #333;
  margin-bottom: 4px;
}

.customer-email {
  color: #666;
  font-size: 13px;
}

.product-count {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.product-preview {
  font-size: 13px;
  color: #666;
}

.product-name {
  display: block;
  margin-bottom: 2px;
}

.more-items {
  color: #667eea;
  font-style: italic;
}

.order-total strong {
  color: #333;
  font-size: 16px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.shipped {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.delivered {
  background: #dcfce7;
  color: #166534;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.order-date {
  color: #666;
  font-size: 13px;
}

.order-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.view-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #e2e8f0;
  color: #4a5568;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.view-btn:hover {
  background: #cbd5e0;
}

.view-btn svg {
  width: 16px;
  height: 16px;
}

.status-select {
  padding: 4px 8px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  font-size: 12px;
  background: white;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.page-btn {
  padding: 8px 16px;
  border: 2px solid #e1e5e9;
  background: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.order-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e9ecef;
}

.close-btn svg {
  width: 18px;
  height: 18px;
  color: #666;
}

.modal-content {
  padding: 0 24px 24px 24px;
}

.order-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.info-section h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.info-section p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.order-items h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.items-list {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.item-row {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f1f3f4;
}

.item-row:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.item-variant {
  margin: 0 0 4px 0;
  color: #666;
  font-size: 12px;
}

.item-price {
  margin: 0;
  color: #666;
  font-size: 13px;
}

.item-total {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.order-summary {
  border-top: 2px solid #e1e5e9;
  padding-top: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.summary-row.total {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  border-top: 1px solid #e1e5e9;
  padding-top: 8px;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .admin-orders {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .orders-table {
    overflow-x: auto;
  }
  
  .orders-table table {
    min-width: 800px;
  }
  
  .order-info-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    margin: 0;
    border-radius: 0;
    height: 100vh;
    max-height: none;
  }
}
</style>