<template>
  <div class="admin-reviews">
    <div class="page-header">
      <h1>{{ $t('admin.reviews.title') }}</h1>
      <div class="header-actions">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="$t('admin.reviews.searchPlaceholder')"
            class="search-input"
          >
        </div>
        <select v-model="statusFilter" class="filter-select">
          <option value="">{{ $t('admin.reviews.allStatuses') }}</option>
          <option value="pending">{{ $t('admin.reviews.pending') }}</option>
          <option value="approved">{{ $t('admin.reviews.approved') }}</option>
          <option value="rejected">{{ $t('admin.reviews.rejected') }}</option>
        </select>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon pending">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.pending }}</div>
          <div class="stat-label">{{ $t('admin.reviews.pendingReviews') }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon approved">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.approved }}</div>
          <div class="stat-label">{{ $t('admin.reviews.approvedReviews') }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon rejected">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.rejected }}</div>
          <div class="stat-label">{{ $t('admin.reviews.rejectedReviews') }}</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon rating">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.averageRating }}</div>
          <div class="stat-label">{{ $t('admin.reviews.averageRating') }}</div>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="reviews-table">
      <div class="table-header">
        <div class="table-row">
          <div class="table-cell">{{ $t('admin.reviews.product') }}</div>
          <div class="table-cell">{{ $t('admin.reviews.customer') }}</div>
          <div class="table-cell">{{ $t('admin.reviews.rating') }}</div>
          <div class="table-cell">{{ $t('admin.reviews.content') }}</div>
          <div class="table-cell">{{ $t('admin.reviews.date') }}</div>
          <div class="table-cell">{{ $t('admin.reviews.status') }}</div>
          <div class="table-cell">{{ $t('admin.reviews.actions') }}</div>
        </div>
      </div>
      
      <div class="table-body">
        <div v-for="review in paginatedReviews" :key="review.id" class="table-row">
          <div class="table-cell">
            <div class="product-info">
              <img :src="review.productImage" :alt="review.productName" class="product-image">
              <span>{{ review.productName }}</span>
            </div>
          </div>
          <div class="table-cell">
            <div class="customer-info">
              <div class="customer-name">{{ review.customerName }}</div>
              <div class="customer-email">{{ review.customerEmail }}</div>
            </div>
          </div>
          <div class="table-cell">
            <div class="rating">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">
                ★
              </span>
              <span class="rating-number">({{ review.rating }})</span>
            </div>
          </div>
          <div class="table-cell">
            <div class="review-content">{{ review.content }}</div>
          </div>
          <div class="table-cell">{{ formatDate(review.date) }}</div>
          <div class="table-cell">
            <span class="status-badge" :class="review.status">{{ $t(`admin.reviews.${review.status}`) }}</span>
          </div>
          <div class="table-cell">
            <div class="action-buttons">
              <button 
                v-if="review.status === 'pending'" 
                @click="approveReview(review.id)" 
                class="btn btn-success"
                :title="$t('admin.reviews.approve')"
              >
                ✓
              </button>
              <button 
                v-if="review.status === 'pending'" 
                @click="rejectReview(review.id)" 
                class="btn btn-danger"
                :title="$t('admin.reviews.reject')"
              >
                ✗
              </button>
              <button 
                @click="viewReview(review)" 
                class="btn btn-info"
                :title="$t('admin.reviews.viewDetails')"
              >
                👁
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        {{ $t('admin.reviews.previous') }}
      </button>
      
      <span class="pagination-info">
        {{ $t('admin.reviews.pageInfo', { current: currentPage, total: totalPages }) }}
      </span>
      
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        {{ $t('admin.reviews.next') }}
      </button>
    </div>

    <!-- 评论详情模态框 -->
    <div v-if="selectedReview" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ $t('admin.reviews.reviewDetails') }}</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="review-detail">
            <div class="detail-section">
              <h4>{{ $t('admin.reviews.productInfo') }}</h4>
              <div class="product-detail">
                <img :src="selectedReview.productImage" :alt="selectedReview.productName" class="product-image-large">
                <div>
                  <div class="product-name">{{ selectedReview.productName }}</div>
                  <div class="product-id">ID: {{ selectedReview.productId }}</div>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>{{ $t('admin.reviews.customerInfo') }}</h4>
              <div class="customer-detail">
                <div>{{ $t('admin.reviews.name') }}: {{ selectedReview.customerName }}</div>
                <div>{{ $t('admin.reviews.email') }}: {{ selectedReview.customerEmail }}</div>
                <div>{{ $t('admin.reviews.date') }}: {{ formatDate(selectedReview.date) }}</div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>{{ $t('admin.reviews.reviewContent') }}</h4>
              <div class="rating-detail">
                <span v-for="i in 5" :key="i" class="star large" :class="{ filled: i <= selectedReview.rating }">
                  ★
                </span>
                <span class="rating-number">({{ selectedReview.rating }}/5)</span>
              </div>
              <div class="content-detail">{{ selectedReview.content }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            v-if="selectedReview.status === 'pending'" 
            @click="approveReview(selectedReview.id)" 
            class="btn btn-success"
          >
            {{ $t('admin.reviews.approve') }}
          </button>
          <button 
            v-if="selectedReview.status === 'pending'" 
            @click="rejectReview(selectedReview.id)" 
            class="btn btn-danger"
          >
            {{ $t('admin.reviews.reject') }}
          </button>
          <button @click="closeModal" class="btn btn-secondary">
            {{ $t('admin.reviews.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

interface Review {
  id: number
  productId: number
  productName: string
  productImage: string
  customerName: string
  customerEmail: string
  rating: number
  content: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
}

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedReview = ref<Review | null>(null)

const reviews = ref<Review[]>([])
const stats = ref({
  pending: 0,
  approved: 0,
  rejected: 0,
  averageRating: 0
})

// 生成模拟数据
const generateMockReviews = (): Review[] => {
  const mockReviews: Review[] = []
  const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'rejected']
  const products = [
    { id: 1, name: '高级震动棒', image: '/images/product1.jpg' },
    { id: 2, name: '情趣内衣套装', image: '/images/product2.jpg' },
    { id: 3, name: '按摩精油', image: '/images/product3.jpg' },
    { id: 4, name: '情侣玩具', image: '/images/product4.jpg' }
  ]
  
  for (let i = 1; i <= 50; i++) {
    const product = products[Math.floor(Math.random() * products.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const rating = Math.floor(Math.random() * 5) + 1
    
    mockReviews.push({
      id: i,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      customerName: `用户${i}`,
      customerEmail: `user${i}@example.com`,
      rating,
      content: `这是第${i}条评论内容，用户对产品的评价...`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status
    })
  }
  
  return mockReviews
}

// 计算统计数据
const calculateStats = () => {
  const pending = reviews.value.filter(r => r.status === 'pending').length
  const approved = reviews.value.filter(r => r.status === 'approved').length
  const rejected = reviews.value.filter(r => r.status === 'rejected').length
  const totalRating = reviews.value.reduce((sum, r) => sum + r.rating, 0)
  const averageRating = reviews.value.length > 0 ? (totalRating / reviews.value.length).toFixed(1) : '0'
  
  stats.value = {
    pending,
    approved,
    rejected,
    averageRating: parseFloat(averageRating)
  }
}

// 过滤后的评论
const filteredReviews = computed(() => {
  return reviews.value.filter(review => {
    const matchesSearch = !searchQuery.value || 
      review.productName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || review.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

// 分页后的评论
const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredReviews.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredReviews.value.length / itemsPerPage)
})

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 审核通过
const approveReview = (id: number) => {
  const review = reviews.value.find(r => r.id === id)
  if (review) {
    review.status = 'approved'
    calculateStats()
    if (selectedReview.value && selectedReview.value.id === id) {
      selectedReview.value.status = 'approved'
    }
  }
}

// 拒绝评论
const rejectReview = (id: number) => {
  const review = reviews.value.find(r => r.id === id)
  if (review) {
    review.status = 'rejected'
    calculateStats()
    if (selectedReview.value && selectedReview.value.id === id) {
      selectedReview.value.status = 'rejected'
    }
  }
}

// 查看评论详情
const viewReview = (review: Review) => {
  selectedReview.value = review
}

// 关闭模态框
const closeModal = () => {
  selectedReview.value = null
}

onMounted(() => {
  reviews.value = generateMockReviews()
  calculateStats()
})
</script>

<style scoped>
.admin-reviews {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  color: #1a1a1a;
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
}

.search-input {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 300px;
  font-size: 14px;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  color: white;
}

.stat-icon.pending {
  background: #f59e0b;
}

.stat-icon.approved {
  background: #10b981;
}

.stat-icon.rejected {
  background: #ef4444;
}

.stat-icon.rating {
  background: #8b5cf6;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.reviews-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
}

.table-header {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 2fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
  align-items: center;
}

.table-header .table-row {
  font-weight: 600;
  color: #374151;
}

.table-body .table-row {
  border-bottom: 1px solid #f1f5f9;
}

.table-body .table-row:last-child {
  border-bottom: none;
}

.table-body .table-row:hover {
  background: #f8fafc;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-name {
  font-weight: 500;
  color: #1a1a1a;
}

.customer-email {
  font-size: 12px;
  color: #6b7280;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  color: #d1d5db;
  font-size: 16px;
}

.star.filled {
  color: #fbbf24;
}

.star.large {
  font-size: 20px;
}

.rating-number {
  font-size: 12px;
  color: #6b7280;
  margin-left: 4px;
}

.review-content {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: #374151;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-info {
  background: #3b82f6;
  color: white;
}

.btn-info:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
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
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 20px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.product-detail {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-image-large {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.product-name {
  font-weight: 500;
  font-size: 16px;
  color: #1a1a1a;
}

.product-id {
  font-size: 14px;
  color: #6b7280;
}

.customer-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.rating-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.content-detail {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  line-height: 1.6;
  color: #374151;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .admin-reviews {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .table-cell:before {
    content: attr(data-label);
    font-weight: 600;
    color: #374151;
  }
  
  .modal {
    width: 95%;
    margin: 20px;
  }
}
</style>