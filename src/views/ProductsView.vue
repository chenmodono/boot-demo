<template>
  <div class="products-page">
    <!-- 像素化背景 -->
    <div class="pixel-bg"></div>
    <div class="pixel-overlay"></div>
    
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-row">
        <button @click="goHome" class="home-btn">
          ← 返回首页
        </button>
        <div class="search-container">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索商品..."
            class="pixel-search"
          >
          <button class="search-btn">🔍</button>
        </div>
      </div>
    </div>
    
    <!-- 筛选区域 -->
    <div class="filter-section">
      
      <div class="category-tags">
        <div 
          v-for="tag in productTags" 
          :key="tag.id" 
          class="product-tag"
          :class="{ active: selectedTags.includes(tag.id) }"
          :style="{ '--tag-color': selectedTags.includes(tag.id) ? '#000' : tag.color }"
          @click="toggleTag(tag.id)"
        >
          {{ tag.name }}
        </div>
      </div>
      
      <div class="filter-actions">
        <div class="sort-options">
          <select v-model="sortBy" class="pixel-select">
            <option value="name">按名称排序</option>
            <option value="price-low">价格：低到高</option>
            <option value="price-high">价格：高到低</option>
            <option value="rating">按评分排序</option>
          </select>
        </div>
        
        <button @click="clearAllCategories" class="clear-btn">
          清除所有标签
        </button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在加载商品...</p>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="error-container">
      <p class="error-text">{{ error }}</p>
      <button @click="loadProducts" class="retry-btn">重试</button>
    </div>
    
    <!-- 商品网格 -->
    <div v-else>
      <!-- 空状态提示 -->
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h3 class="empty-title">暂时没有该产品</h3>
        <p class="empty-description">请尝试调整筛选条件或搜索关键词</p>
        <button @click="clearAllFilters" class="reset-filters-btn">重置筛选条件</button>
      </div>
      
      <!-- 商品列表 -->
      <div v-else class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="product-card"
          @click="viewProductDetail(product.id)"
        >
        <div class="product-image-container">
          <img :src="product.image" :alt="product.name" class="product-image">
          <div class="pixel-image-overlay"></div>
          <div class="product-overlay">
            <div class="overlay-content">
              <button class="quick-view-btn">快速预览</button>
              <button class="add-to-cart-btn">加入购物车</button>
            </div>
          </div>
          <div class="product-badge" v-if="product.isNew">NEW</div>
          <div class="product-discount" v-if="product.discount">-{{ product.discount }}%</div>
        </div>
        
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          
          <div class="product-price">
            <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
            <span class="current-price">¥{{ product.price }}</span>
          </div>
          
          <div class="product-actions">
            <button class="pixel-btn primary">立即购买</button>
            <button class="pixel-btn secondary">收藏</button>
          </div>
        </div>
      </div>
    </div>
    </div>
    
    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        ← 上一页
      </button>
      
      <span class="page-info">
        第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
      </span>
      
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        下一页 →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { productApi } from '../api/productApi.js'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const selectedTags = ref([])
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = 12
const loading = ref(false)
const error = ref('')

// 商品标签
const productTags = ref([])

// 商品数据
const products = ref([])
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 12,
  hasNextPage: false,
  hasPrevPage: false
})

// 原有的硬编码数据作为备用（可选）
const fallbackProducts = ref([
  {
    id: 1,
    name: '男性增强按摩油',
    description: '天然植物精华，提升男性活力',
    price: 199,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
    category: 'male-enhancement',
    rating: 4.8,
    reviews: 156,
    isNew: true,
    discount: 33
  },
  {
    id: 2,
    name: '女性震动按摩棒',
    description: '高端硅胶材质，多频震动体验',
    price: 599,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
    category: 'female-vibrators',
    rating: 4.9,
    reviews: 89,
    isNew: false
  },
  {
    id: 3,
    name: '情侣互动套装',
    description: '夜晚专用，带来梦幻体验',
    price: 399,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    category: 'couple-toys',
    rating: 4.7,
    reviews: 234,
    isNew: false
  },
  {
    id: 4,
    name: '专业玩具清洁剂',
    description: '安全无害，深度清洁',
    price: 49,
    originalPrice: 69,
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=300&h=300&fit=crop',
    category: 'toy-cleaners',
    rating: 4.6,
    reviews: 178,
    isNew: false,
    discount: 29
  },
  {
    id: 5,
    name: '超薄保险套',
    description: '0.01mm超薄设计，真实触感',
    price: 59,
    image: 'https://images.unsplash.com/photo-1518709779052-a4ad6e4d6c9e?w=300&h=300&fit=crop',
    category: 'ultra-thin',
    rating: 4.5,
    reviews: 92,
    isNew: true
  },
  {
    id: 6,
    name: '情趣写真集',
    description: '精美印刷，艺术收藏',
    price: 159,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    category: 'photo-books',
    rating: 4.8,
    reviews: 145,
    isNew: false
  },
  {
    id: 7,
    name: '男性专用玩具',
    description: '仿真设计，极致体验',
    price: 899,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop',
    category: 'male-toys',
    rating: 4.9,
    reviews: 67,
    isNew: true
  },
  {
    id: 8,
    name: '情侣按摩套装',
    description: '唤醒内心深处的渴望',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
    category: 'couple-massage',
    rating: 4.7,
    reviews: 203,
    isNew: false,
    discount: 25
  },
  {
    id: 9,
    name: '高级润滑剂',
    description: '水性配方，安全舒适',
    price: 89,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
    category: 'lubricants',
    rating: 4.4,
    reviews: 312,
    isNew: false
  },
  {
    id: 10,
    name: '纹理型保险套',
    description: '特殊纹理设计，增强快感',
    price: 79,
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=300&h=300&fit=crop',
    category: 'textured',
    rating: 4.6,
    reviews: 189,
    isNew: false
  },
  {
    id: 11,
    name: '女性专用玩具',
    description: '人体工学设计，舒适体验',
    price: 699,
    image: 'https://images.unsplash.com/photo-1518709779052-a4ad6e4d6c9e?w=300&h=300&fit=crop',
    category: 'female-toys',
    rating: 4.8,
    reviews: 124,
    isNew: true
  },
  {
    id: 12,
    name: '情趣桌游套装',
    description: '多种游戏，增进感情',
    price: 199,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    category: 'board-games',
    rating: 4.7,
    reviews: 98,
    isNew: false
  }
])

// 计算属性
const filteredProducts = computed(() => {
  return products.value
})

const totalPages = computed(() => {
  return pagination.value.totalPages
})

// API调用方法
async function loadProducts() {
  try {
    loading.value = true
    error.value = ''
    
    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
      category: selectedTags.value,
      search: searchQuery.value,
      sortBy: sortBy.value
    }
    
    const response = await productApi.getProducts(params)
    
    if (response.success) {
      products.value = response.data.products
      pagination.value = response.data.pagination
    } else {
      error.value = response.message
      console.error('加载商品失败:', response.message)
    }
  } catch (err) {
    error.value = '网络请求失败，请稍后重试'
    console.error('API请求错误:', err)
  } finally {
    loading.value = false
  }
}

// 加载商品分类
async function loadCategories() {
  try {
    const response = await productApi.getCategories()
    if (response.success) {
      productTags.value = response.data
    }
  } catch (err) {
    console.error('加载分类失败:', err)
  }
}

// 方法
function toggleTag(tagId) {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagId)
  }
  currentPage.value = 1
  loadProducts() // 重新加载商品
}

function clearAllCategories() {
  selectedTags.value = []
  currentPage.value = 1
  loadProducts() // 重新加载商品
}

function changePage(page) {
  currentPage.value = page
  loadProducts() // 加载对应页面的商品
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goHome() {
  router.push('/')
}

function viewProductDetail(productId) {
  router.push(`/product/${productId}`)
}

// 搜索方法
function handleSearch() {
  currentPage.value = 1
  loadProducts()
}

// 排序变化处理
function handleSortChange() {
  currentPage.value = 1
  loadProducts()
}

// 监听标签选择变化，重置页码
watch(selectedTags, () => {
  currentPage.value = 1
  loadProducts()
})

// 监听搜索查询变化，重置页码
watch(searchQuery, () => {
  currentPage.value = 1
  // 添加防抖，避免频繁请求
  clearTimeout(searchQuery.timer)
  searchQuery.timer = setTimeout(() => {
    loadProducts()
  }, 500)
})

// 监听排序变化
watch(sortBy, () => {
  handleSortChange()
})

// 重置所有筛选条件
function clearAllFilters() {
  searchQuery.value = ''
  selectedTags.value = []
  sortBy.value = 'name'
  currentPage.value = 1
  loadProducts()
}

onMounted(async () => {
  // 组件挂载时加载数据
  await loadCategories()
  await loadProducts()
})
</script>

<style scoped>
:root {
  --primary-100: #8FBF9F;
  --primary-200: #68a67d;
  --primary-300: #24613b;
  --accent-100: #F18F01;
  --accent-200: #833500;
  --text-100: #353535;
  --text-200: #5f5f5f;
  --bg-100: #F5ECD7;
  --bg-200: #ebe2cd;
  --bg-300: #c2baa6;
}

/* 基础样式 */
.products-page {
  min-height: 100vh;
  background: var(--bg-100);
  color: var(--text-100);
  position: relative;
  padding: 20px;
}

.pixel-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 25% 25%, var(--bg-200) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, var(--bg-300) 0%, transparent 50%),
    linear-gradient(45deg, var(--bg-100) 25%, transparent 25%),
    linear-gradient(-45deg, var(--bg-100) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--bg-200) 75%),
    linear-gradient(-45deg, transparent 75%, var(--bg-200) 75%);
  background-size: 60px 60px, 60px 60px, 20px 20px, 20px 20px, 20px 20px, 20px 20px;
  background-position: 0 0, 40px 40px, 0 0, 0 10px, 10px -10px, -10px 0px;
  z-index: -2;
}

.pixel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(143, 191, 159, 0.03) 2px,
      rgba(143, 191, 159, 0.03) 4px
    ),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(143, 191, 159, 0.03) 2px,
      rgba(143, 191, 159, 0.03) 4px
    );
  z-index: -1;
}

/* 页面标题 */
.page-header {
  margin-bottom: 40px;
  position: relative;
}

.header-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.home-btn {
  background: var(--accent-100);
  border: 3px solid var(--primary-200);
  color: var(--bg-100);
  padding: 12px 24px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(241, 143, 1, 0.4);
  white-space: nowrap;
}

.home-btn:hover {
  background: var(--primary-200);
  border-color: var(--primary-200);
  box-shadow: 0 6px 16px rgba(143, 191, 159, 0.5);
  transform: translateY(-3px);
}

.pixel-title {
  font-size: 3rem;
  color: var(--primary-300);
  text-shadow: 
    2px 2px 0px var(--primary-100),
    0 0 20px var(--primary-200);
  font-family: 'Courier New', monospace;
  margin-bottom: 10px;
  animation: pixelGlow 3s ease-in-out infinite;
}

.pixel-subtitle {
  font-size: 1.2rem;
  color: var(--accent-100);
  font-family: 'Courier New', monospace;
}

/* 筛选区域 */
.filter-section {
  background: transparent;
  border: none;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pixel-search {
  background: var(--bg-100);
  border: 3px solid var(--primary-200);
  color: var(--text-100);
  padding: 12px 18px;
  font-size: 16px;
  font-family: 'Courier New', monospace;
  width: 280px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
  transition: all 0.3s ease;
}

.pixel-search:focus {
  outline: none;
  border-color: var(--accent-100);
  box-shadow: 0 0 15px rgba(241, 143, 1, 0.4);
  transform: translateY(-2px);
}

.search-btn {
  background: var(--accent-100);
  border: 3px solid var(--primary-200);
  color: var(--bg-100);
  padding: 12px 18px;
  cursor: pointer;
  font-size: 18px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  transition: all 0.3s ease;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(241, 143, 1, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.search-btn:hover {
  background: var(--primary-200);
  border-color: var(--primary-200);
  box-shadow: 0 6px 16px rgba(143, 191, 159, 0.5);
  transform: translateY(-3px);
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto 20px auto;
}

.product-tag {
  background: var(--tag-color);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.product-tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.product-tag:hover::before {
  left: 100%;
}

.product-tag:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.product-tag.active {
  background: #000 !important;
  color: white;
  border-color: var(--accent-100);
  box-shadow: 0 6px 20px rgba(241, 143, 1, 0.5);
  transform: translateY(-2px);
}

.product-tag.active:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 10px 25px rgba(241, 143, 1, 0.6);
}

.filter-actions {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.pixel-select {
  background: var(--bg-100);
  border: 3px solid var(--primary-200);
  color: var(--text-100);
  padding: 12px 18px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
}

.pixel-select:focus {
  outline: none;
  border-color: var(--accent-100);
  box-shadow: 0 0 15px rgba(241, 143, 1, 0.4);
  transform: translateY(-2px);
}

.clear-btn {
  background: var(--bg-100);
  border: 3px solid var(--primary-200);
  color: var(--primary-300);
  padding: 12px 24px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
}

.clear-btn:hover {
  background: var(--primary-200);
  color: var(--bg-100);
  box-shadow: 0 6px 16px rgba(143, 191, 159, 0.5);
  transform: translateY(-3px);
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
  /* 确保所有卡片高度一致 */
  align-items: stretch;
}

.product-card {
  background: linear-gradient(135deg, rgba(245, 236, 215, 0.95) 0%, rgba(143, 191, 159, 0.1) 100%);
  border: 4px solid var(--primary-200);
  padding: 25px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(143, 191, 159, 0.25);
  backdrop-filter: blur(5px);
  /* 使用flex布局确保按钮对齐 */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(143, 191, 159, 0.05) 0%, rgba(241, 143, 1, 0.05) 100%);
  border-radius: 12px;
  z-index: -1;
}

.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  margin: 0 0 20px 0;
  border: 4px solid var(--primary-200);
  background: var(--bg-300);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(143, 191, 159, 0.4);
  transform: perspective(1000px) rotateX(5deg);
  transition: all 0.4s ease;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  filter: contrast(1.3) saturate(1.6) brightness(1.1);
  transition: all 0.4s ease;
}

.product-image-container:hover .product-image {
  filter: contrast(1.4) saturate(1.8) brightness(1.2);
  transform: scale(1.05);
}

.product-image-container:hover {
  border-color: var(--accent-100);
  transform: perspective(1000px) rotateX(0deg) scale(1.02);
  box-shadow: 0 15px 35px rgba(241, 143, 1, 0.5);
  transition: all 0.4s ease;
}

.product-image-container::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--primary-200), var(--accent-100), var(--primary-100), var(--primary-200));
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 14px;
}

.product-image-container:hover::before {
  opacity: 0.5;
}

.pixel-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(0deg,
      transparent,
      transparent 2px,
      rgba(143, 191, 159, 0.1) 2px,
      rgba(143, 191, 159, 0.1) 4px),
    repeating-linear-gradient(90deg,
      transparent,
      transparent 2px,
      rgba(241, 143, 1, 0.1) 2px,
      rgba(241, 143, 1, 0.1) 4px);
  pointer-events: none;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-view-btn,
.add-to-cart-btn {
  background: #f18f01;
  border: 2px solid #f18f01;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(241, 143, 1, 0.5);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.quick-view-btn:hover,
.add-to-cart-btn:hover {
  background: #8fbf9f;
  border-color: #8fbf9f;
  box-shadow: 0 6px 12px rgba(143, 191, 159, 0.6);
  transform: translateY(-2px);
}

.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--accent-100);
  color: var(--bg-100);
  padding: 5px 10px;
  font-size: 10px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(241, 143, 1, 0.3);
}

.product-discount {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--accent-200);
  color: var(--bg-100);
  padding: 5px 10px;
  font-size: 10px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(131, 53, 0, 0.3);
}

.product-info {
  text-align: left;
  /* 使用flex布局，让按钮始终在底部 */
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-name {
  color: var(--primary-300);
  font-size: 18px;
  margin-bottom: 10px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  /* 文本长度限制 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: 2.8em; /* 2行的高度 */
}

.product-description {
  color: var(--text-200);
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 15px;
  /* 文本长度限制 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 4.2em; /* 3行的高度 */
}



.product-price {
  margin-bottom: 20px;
}

.original-price {
  color: var(--text-200);
  text-decoration: line-through;
  margin-right: 10px;
}

.current-price {
  color: var(--primary-300);
  font-size: 20px;
  font-weight: bold;
}

.product-actions {
  display: flex;
  gap: 10px;
  /* 将按钮推到底部 */
  margin-top: auto;
}

.pixel-btn {
  background: var(--accent-100);
  color: var(--bg-100);
  border: 2px solid var(--primary-200);
  padding: 12px 24px;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  border-radius: 8px;
  transition: all 0.1s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
  margin: 0 5px;
}

.pixel-btn:hover {
  background: var(--primary-200);
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--accent-100);
}

.pixel-btn:active {
  transform: translate(0, 0);
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.3);
}

.pixel-btn.primary {
  background: var(--primary-200);
  border-color: var(--primary-200);
  flex: 1;
}

.pixel-btn.secondary {
  background: var(--bg-100);
  color: var(--primary-200);
  border-color: var(--primary-200);
}

.pixel-btn.secondary:hover {
  background: var(--primary-200);
  color: var(--bg-100);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.page-btn {
  background: var(--accent-100);
  border: 3px solid var(--primary-200);
  color: var(--bg-100);
  padding: 12px 24px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 8px;
  margin: 0 10px;
  box-shadow: 0 4px 8px rgba(241, 143, 1, 0.4);
}

.page-btn:hover:not(:disabled) {
  background: var(--primary-200);
  border-color: var(--primary-200);
  box-shadow: 0 6px 16px rgba(143, 191, 159, 0.5);
  transform: translateY(-3px);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  background: var(--bg-300);
  color: var(--text-200);
  border-color: var(--bg-300);
}

.page-info {
  color: var(--text-200);
  font-family: 'Courier New', monospace;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--bg-300);
  border-top: 4px solid var(--primary-200);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: var(--text-200);
  margin: 0;
}

/* 错误提示样式 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.error-text {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: var(--accent-200);
  margin: 0 0 20px 0;
}

.retry-btn {
  background: var(--accent-100);
  border: 2px solid var(--accent-200);
  color: var(--bg-100);
  padding: 12px 24px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(131, 53, 0, 0.2);
}

.retry-btn:hover {
  background: var(--accent-200);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(131, 53, 0, 0.4);
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: rgba(245, 236, 215, 0.8);
  border: 2px dashed var(--primary-200);
  border-radius: 12px;
  margin: 20px 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-title {
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  color: var(--primary-300);
  margin: 0 0 10px 0;
  font-weight: bold;
}

.empty-description {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: var(--text-200);
  margin: 0 0 30px 0;
  line-height: 1.5;
}

.reset-filters-btn {
  background: var(--accent-100);
  border: 2px solid var(--accent-200);
  color: var(--bg-100);
  padding: 12px 24px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(241, 143, 1, 0.3);
}

.reset-filters-btn:hover {
  background: var(--accent-200);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(131, 53, 0, 0.4);
}

/* 动画 */
@keyframes pixelGlow {
  0%, 100% {
    text-shadow: 
      2px 2px 0px var(--primary-100),
      0 0 20px var(--primary-200);
  }
  50% {
    text-shadow: 
      2px 2px 0px var(--primary-100),
      0 0 30px var(--primary-200),
      0 0 40px var(--primary-200);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .category-filters {
    flex-direction: column;
    gap: 10px;
  }
  
  .dropdown-container {
    min-width: unset;
  }
  
  .filter-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .pixel-search {
    width: 100%;
  }
  
  .pixel-title {
    font-size: 2rem;
  }
  
  .clear-btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .product-actions {
    flex-direction: column;
  }
}
</style>