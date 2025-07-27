<template>
  <div class="product-detail-page">
    <!-- 像素化背景 -->
    <div class="pixel-bg"></div>
    <div class="pixel-overlay"></div>
    
    <!-- 返回按钮 -->
    <div class="header-nav">
      <button @click="goBack" class="back-btn">
        ← 返回商品列表
      </button>
      <button @click="goHome" class="home-btn">
        🏠 返回首页
      </button>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在加载商品详情...</p>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="error-container">
      <p class="error-text">{{ error }}</p>
      <button @click="loadProduct" class="retry-btn">重试</button>
    </div>
    
    <!-- 商品详情内容 -->
    <div v-else-if="product" class="product-detail-container">
      <!-- 商品主要信息 -->
      <div class="product-main">
        <!-- 商品图片区域 -->
        <div class="product-images">
          <div class="main-image">
            <img :src="selectedImage" :alt="product.name" class="main-product-image">
            <div class="image-overlay"></div>
            
            <!-- 自动播放控制按钮 -->
            <div class="auto-slide-controls">
              <button 
                @click="toggleAutoSlide" 
                :class="['auto-slide-btn', { active: isAutoSliding }]"
                :title="isAutoSliding ? '停止自动播放' : '开始自动播放'"
              >
                {{ isAutoSliding ? '⏸️' : '▶️' }}
              </button>
            </div>
            
            <!-- 图片指示器 -->
            <div class="image-indicators" v-if="product.images && product.images.length > 1">
              <div 
                v-for="(image, index) in product.images" 
                :key="index"
                :class="['indicator', { active: selectedImageIndex === index }]"
                @click="selectImage(index)"
              ></div>
            </div>
          </div>
          
          <div class="thumbnail-list">
            <div 
              v-for="(image, index) in product.images" 
              :key="index"
              :class="['thumbnail', { active: selectedImageIndex === index }]"
              @click="selectImage(index)"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`">
            </div>
          </div>
        </div>
        
        <!-- 商品信息区域 -->
        <div class="product-info">
          <div class="product-badges">
            <span v-if="product.isNew" class="badge new">NEW</span>
            <span v-if="product.discount" class="badge discount">-{{ product.discount }}%</span>
            <span v-if="product.isHot" class="badge hot">HOT</span>
          </div>
          
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="product-rating">
            <div class="stars">
              <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= product.rating }">★</span>
            </div>
            <span class="rating-text">{{ product.rating }} ({{ product.reviews }} 评价)</span>
          </div>
          
          <div class="product-price">
            <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
            <span class="current-price">¥{{ product.price }}</span>
            <span v-if="product.discount" class="save-amount">节省 ¥{{ product.originalPrice - product.price }}</span>
          </div>
          
          <div class="product-description">
            <h3>商品描述</h3>
            <p>{{ product.description }}</p>
          </div>
          
          <!-- 商品款式选择 -->
          <div class="product-variants" v-if="product.variants">
            <div class="variants-header">
              <h4>选择款式</h4>
              <button 
                class="toggle-btn" 
                @click="toggleVariantsExpanded"
                v-if="product.variants.length > 3"
              >
                {{ isVariantsExpanded ? '收起' : '展开' }}
                <span class="toggle-icon">{{ isVariantsExpanded ? '▲' : '▼' }}</span>
              </button>
            </div>
            <div class="variants-list" :class="{ 'collapsed': !isVariantsExpanded && product.variants.length > 3 }">
              <div 
                v-for="(variant, index) in product.variants" 
                :key="variant.id"
                class="variant-item"
                v-show="isVariantsExpanded || index < 3"
              >
                <div class="variant-image">
                  <img :src="variant.image" :alt="variant.name" />
                </div>
                <div class="variant-info">
                  <div class="variant-header">
                    <h5 class="variant-name">{{ variant.name }}</h5>
                    <span class="variant-price">¥{{ variant.price }}</span>
                  </div>
                  <p class="variant-description">{{ variant.description }}</p>
                  <div class="variant-stock">库存：{{ variant.stock }} 件</div>
                </div>
                
                <div class="variant-controls">
                  <div class="quantity-controls">
                    <button 
                      @click="decreaseVariantQuantity(variant.id)" 
                      :disabled="variantQuantities[variant.id] <= 0" 
                      class="qty-btn"
                    >-</button>
                    <span class="quantity">{{ variantQuantities[variant.id] || 0 }}</span>
                    <button 
                      @click="increaseVariantQuantity(variant.id)" 
                      :disabled="variantQuantities[variant.id] >= variant.stock" 
                      class="qty-btn"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 总计信息 -->
            <div class="total-summary" v-if="totalQuantity > 0">
              <h5>购买总计</h5>
              <div class="total-info">
                <span class="total-quantity">总数量：{{ totalQuantity }} 件</span>
                <span class="total-price">总价：¥{{ totalPrice }}</span>
              </div>
            </div>
          </div>
          
          <!-- 购买按钮 -->
          <div class="purchase-actions">
            <button @click="buyNow" class="pixel-btn buy-now">
              ⚡ 立即购买
            </button>
            <button @click="toggleFavorite" :class="['pixel-btn', 'favorite', { active: isFavorite }]">
              {{ isFavorite ? '❤️' : '🤍' }} {{ isFavorite ? '已收藏' : '收藏' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- 商品详细信息标签页 -->
      <div class="product-tabs">
        <div class="tab-headers">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-header', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <div class="tab-content">
          <!-- 详细描述 -->
          <div v-if="activeTab === 'description'" class="tab-panel">
            <h3>详细描述</h3>
            <div class="description-content">
              <!-- 描述文字 -->
              <div class="description-text">
                <p v-for="paragraph in product.detailedDescription" :key="paragraph">{{ paragraph }}</p>
              </div>
              
              <!-- 描述图片 -->
              <div v-if="product.descriptionImages && product.descriptionImages.length > 0" class="description-images">
                <h4>产品展示</h4>
                <div class="images-grid">
                  <div 
                    v-for="(image, index) in product.descriptionImages" 
                    :key="index" 
                    class="description-image-item"
                    @click="openImageModal(image)"
                  >
                    <img :src="image" :alt="`产品展示图 ${index + 1}`" class="description-image">
                    <div class="image-overlay">
                      <span class="zoom-icon">🔍</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 规格参数 -->
          <div v-if="activeTab === 'specifications'" class="tab-panel">
            <h3>规格参数</h3>
            <table class="specs-table">
              <tr v-for="param in product.parameters" :key="param.name">
                <td class="param-name">{{ param.name }}</td>
                <td class="param-value">{{ param.value }}</td>
              </tr>
            </table>
          </div>
          
          <!-- 用户评价 -->
          <div v-if="activeTab === 'reviews'" class="tab-panel">
            <h3>用户评价 ({{ product.reviews }})</h3>
            <div class="reviews-list">
              <div v-for="review in product.reviewList" :key="review.id" class="review-item">
                <div class="review-header">
                  <span class="reviewer-name">{{ review.username }}</span>
                  <div class="review-rating">
                    <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= review.rating }">★</span>
                  </div>
                  <span class="review-date">{{ review.date }}</span>
                </div>
                <p class="review-content">{{ review.content }}</p>
              </div>
            </div>
          </div>
          
          <!-- 售后服务 -->
          <div v-if="activeTab === 'service'" class="tab-panel">
            <h3>售后服务</h3>
            <div class="service-content">
              <div class="service-item">
                <h4>🚚 配送服务</h4>
                <p>全国包邮，48小时内发货，支持货到付款</p>
              </div>
              <div class="service-item">
                <h4>🔄 退换政策</h4>
                <p>7天无理由退换，30天质量保证</p>
              </div>
              <div class="service-item">
                <h4>🛡️ 隐私保护</h4>
                <p>隐私包装，保护您的个人隐私</p>
              </div>
              <div class="service-item">
                <h4>📞 客服支持</h4>
                <p>24小时在线客服，专业解答您的疑问</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </div>
    
    <!-- 加载状态 -->
    <div v-else class="loading">
      <div class="loading-text">加载中...</div>
    </div>
    
    <!-- 图片模态框 -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <span class="close-btn" @click="closeImageModal">&times;</span>
        <img :src="modalImage" alt="产品详细图片" class="modal-image">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productApi } from '../api/productApi.js'

const route = useRoute()
const router = useRouter()

// 响应式数据
const product = ref(null)
const selectedImageIndex = ref(0)
const autoSlideTimer = ref(null)
const isAutoSliding = ref(true)
const isFavorite = ref(false)
const activeTab = ref('description')
const loading = ref(false)
const error = ref('')

const variantQuantities = ref({}) // 存储每个款式的数量
const isVariantsExpanded = ref(false) // 控制款式展开状态
const showImageModal = ref(false) // 控制图片模态框显示
const modalImage = ref('') // 模态框中显示的图片

// 标签页配置
const tabs = ref([
  { id: 'description', name: '详细描述' },
  { id: 'specifications', name: '规格参数' },
  { id: 'reviews', name: '用户评价' },
  { id: 'service', name: '售后服务' }
])

// 计算属性
const selectedImage = computed(() => {
  return product.value?.images?.[selectedImageIndex.value] || ''
})



// 计算总数量
const totalQuantity = computed(() => {
  return Object.values(variantQuantities.value).reduce((sum, qty) => sum + (qty || 0), 0)
})

// 计算总价格
const totalPrice = computed(() => {
  if (!product.value?.variants) return 0
  
  return product.value.variants.reduce((total, variant) => {
    const qty = variantQuantities.value[variant.id] || 0
    return total + (variant.price * qty)
  }, 0)
})

// 方法
async function loadProduct() {
  const productId = parseInt(route.params.id)
  
  try {
    loading.value = true
    error.value = ''
    
    // 获取商品详情
    const response = await productApi.getProductById(productId)
    
    if (response.success) {
      product.value = response.data
      
      // 初始化款式数量
      if (response.data.variants) {
        response.data.variants.forEach(variant => {
          variantQuantities.value[variant.id] = 0
        })
      }
      

    } else {
      error.value = response.message
      console.error('加载商品详情失败:', response.message)
    }
  } catch (err) {
    error.value = '网络请求失败，请稍后重试'
    console.error('API请求错误:', err)
  } finally {
    loading.value = false
  }
}



function selectImage(index) {
  selectedImageIndex.value = index
  // 手动选择图片时重置自动切换定时器
  resetAutoSlide()
}

// 自动切换图片
function startAutoSlide() {
  if (!isAutoSliding.value || !product.value?.images?.length) return
  
  autoSlideTimer.value = setInterval(() => {
    if (product.value?.images?.length > 1) {
      selectedImageIndex.value = (selectedImageIndex.value + 1) % product.value.images.length
    }
  }, 3000) // 每3秒切换一次
}

// 停止自动切换
function stopAutoSlide() {
  if (autoSlideTimer.value) {
    clearInterval(autoSlideTimer.value)
    autoSlideTimer.value = null
  }
}

// 重置自动切换
function resetAutoSlide() {
  stopAutoSlide()
  setTimeout(() => {
    startAutoSlide()
  }, 5000) // 手动操作后5秒重新开始自动切换
}

// 切换自动播放状态
function toggleAutoSlide() {
  isAutoSliding.value = !isAutoSliding.value
  if (isAutoSliding.value) {
    startAutoSlide()
  } else {
    stopAutoSlide()
  }
}

// 增加款式数量
function increaseVariantQuantity(variantId) {
  const variant = product.value.variants.find(v => v.id === variantId)
  if (variant && (variantQuantities.value[variantId] || 0) < variant.stock) {
    variantQuantities.value[variantId] = (variantQuantities.value[variantId] || 0) + 1
  }
}

// 减少款式数量
function decreaseVariantQuantity(variantId) {
  if ((variantQuantities.value[variantId] || 0) > 0) {
    variantQuantities.value[variantId] = variantQuantities.value[variantId] - 1
  }
}

// 切换款式展开状态
function toggleVariantsExpanded() {
  isVariantsExpanded.value = !isVariantsExpanded.value
}

// 打开图片模态框
function openImageModal(imageUrl) {
  modalImage.value = imageUrl
  showImageModal.value = true
}

// 关闭图片模态框
function closeImageModal() {
  showImageModal.value = false
  modalImage.value = ''
}

function buyNow() {
  // 检查是否有选择的款式
  if (totalQuantity.value === 0) {
    alert('请先选择商品款式和数量')
    return
  }
  
  // 构建订单数据，包含所有选择的款式
  const selectedVariants = []
  Object.keys(variantQuantities.value).forEach(variantId => {
    const quantity = variantQuantities.value[variantId]
    if (quantity > 0) {
      const variant = product.value.variants.find(v => v.id === variantId)
      if (variant) {
        selectedVariants.push({
          variantId: variantId,
          variantName: variant.name,
          variantPrice: variant.price,
          quantity: quantity
        })
      }
    }
  })
  
  const orderData = {
    productId: product.value.id,
    productName: product.value.name,
    productImage: product.value.image,
    variants: JSON.stringify(selectedVariants),
    totalQuantity: totalQuantity.value,
    totalPrice: totalPrice.value
  }
  
  router.push({
    path: '/checkout',
    query: orderData
  })
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value
  console.log('收藏状态:', isFavorite.value)
}



function goBack() {
  router.push('/products')
}

function goHome() {
  router.push('/')
}

onMounted(() => {
  loadProduct()
  // 延迟启动自动切换，确保产品数据已加载
  setTimeout(() => {
    startAutoSlide()
  }, 1000)
})

onUnmounted(() => {
  stopAutoSlide()
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
.product-detail-page {
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
    radial-gradient(circle at 25% 25%, rgba(143, 191, 159, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(241, 143, 1, 0.1) 0%, transparent 50%),
    linear-gradient(45deg, var(--bg-200) 25%, transparent 25%),
    linear-gradient(-45deg, var(--bg-200) 25%, transparent 25%),
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
      rgba(241, 143, 1, 0.03) 2px,
      rgba(241, 143, 1, 0.03) 4px
    );
  z-index: -1;
}

/* 导航区域 */
.header-nav {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.back-btn,
.home-btn {
  background: var(--bg-200);
  border: 2px solid var(--primary-200);
  color: var(--primary-200);
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.2);
}

.back-btn:hover,
.home-btn:hover {
  background: var(--primary-200);
  color: var(--bg-100);
  box-shadow: 0 4px 12px rgba(143, 191, 159, 0.4);
  transform: translateY(-2px);
}

/* 商品详情容器 */
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 商品主要信息 */
.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 50px;
}

/* 商品图片区域 */
.product-images {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image {
  position: relative;
  width: 100%;
  height: 500px;
  border: 2px solid var(--bg-300);
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(143, 191, 159, 0.2);
}

.main-product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-image:hover .main-product-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    rgba(143, 191, 159, 0.1) 0%, 
    rgba(241, 143, 1, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-image:hover .image-overlay {
  opacity: 1;
}

/* 自动播放控制按钮 */
.auto-slide-controls {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
}

.auto-slide-btn {
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.auto-slide-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: var(--primary-200);
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.auto-slide-btn.active {
  background: rgba(143, 191, 159, 0.9);
  border-color: var(--primary-200);
  color: var(--bg-100);
}

/* 图片指示器 */
.image-indicators {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.indicator.active {
  background: var(--primary-200);
  border-color: var(--primary-200);
  box-shadow: 0 0 10px rgba(143, 191, 159, 0.6);
  transform: scale(1.3);
}

.thumbnail-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border: 2px solid var(--bg-300);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.2);
}

.thumbnail.active {
  border-color: var(--primary-200);
  box-shadow: 0 0 10px rgba(143, 191, 159, 0.3);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 商品信息区域 */
.product-info {
  padding: 20px;
}

.product-badges {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.badge {
  padding: 5px 10px;
  font-size: 12px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
}

.badge.new {
  background: var(--accent-100);
  color: var(--bg-100);
  border-radius: 4px;
}

.badge.discount {
  background: var(--accent-200);
  color: var(--bg-100);
  border-radius: 4px;
}

.badge.hot {
  background: var(--primary-300);
  color: var(--bg-100);
  border-radius: 4px;
}

.product-title {
  font-size: 2.5rem;
  color: var(--primary-300);
  margin-bottom: 20px;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 10px rgba(36, 97, 59, 0.3);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.stars {
  display: flex;
}

.star {
  color: var(--bg-300);
  font-size: 20px;
}

.star.filled {
  color: var(--accent-100);
}

.rating-text {
  color: var(--text-200);
  font-size: 14px;
}

.product-price {
  margin-bottom: 30px;
}

.original-price {
  color: var(--text-200);
  text-decoration: line-through;
  margin-right: 15px;
  font-size: 18px;
}

.current-price {
  color: var(--primary-300);
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(36, 97, 59, 0.3);
}

.save-amount {
  color: var(--accent-100);
  margin-left: 15px;
  font-size: 16px;
}

.product-description {
  margin-bottom: 30px;
}

.product-description h3 {
  color: var(--primary-300);
  margin-bottom: 10px;
  font-family: 'Courier New', monospace;
}

.product-description p {
  color: var(--text-200);
  line-height: 1.6;
}

/* 款式选择 */
.product-variants {
  margin-bottom: 30px;
  padding: 20px;
  background: var(--bg-200);
  border-radius: 8px;
  border: 2px solid var(--bg-300);
}

.variants-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.product-variants h4 {
  color: var(--primary-300);
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 18px;
}

.toggle-btn {
  background: var(--bg-100);
  border: 2px solid var(--primary-200);
  color: var(--primary-200);
  padding: 8px 15px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  transition: all 0.3s ease;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.toggle-btn:hover {
  background: var(--primary-200);
  color: var(--bg-100);
}

.toggle-icon {
  font-size: 10px;
  transition: transform 0.3s ease;
}

.variants-list.collapsed {
  max-height: 300px;
  overflow: hidden;
  position: relative;
}

.variants-list.collapsed::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(transparent, var(--bg-200));
  pointer-events: none;
}

.variant-item {
   display: flex;
   align-items: center;
   gap: 15px;
   padding: 15px;
   margin-bottom: 10px;
   background: var(--bg-100);
   border-radius: 8px;
   border: 2px solid var(--bg-300);
   transition: all 0.3s ease;
   box-shadow: 0 2px 4px rgba(143, 191, 159, 0.1);
 }
 
 .variant-item:hover {
   border-color: var(--primary-200);
   box-shadow: 0 4px 8px rgba(143, 191, 159, 0.2);
   transform: translateY(-1px);
 }
 
 .variant-image {
   width: 60px;
   height: 60px;
   flex-shrink: 0;
   border-radius: 6px;
   overflow: hidden;
   border: 2px solid var(--bg-300);
   background: var(--bg-200);
 }
 
 .variant-image img {
   width: 100%;
   height: 100%;
   object-fit: cover;
   transition: transform 0.3s ease;
 }
 
 .variant-image:hover img {
   transform: scale(1.05);
 }
 
 .variant-info {
   flex: 1;
   min-width: 0;
 }

.variant-name {
  font-weight: 600;
  color: var(--primary-300);
  margin-bottom: 5px;
  font-family: 'Courier New', monospace;
}

.variant-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent-100);
  margin-bottom: 5px;
  font-family: 'Courier New', monospace;
}

.variant-description {
  font-size: 14px;
  color: var(--text-200);
  margin-bottom: 5px;
}

.variant-stock {
  font-size: 12px;
  color: var(--text-300);
}

.variant-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 2px solid var(--bg-300);
  border-radius: 6px;
  overflow: hidden;
  background: var(--bg-100);
}

.quantity-btn {
  width: 35px;
  height: 35px;
  border: none;
  background: var(--bg-200);
  color: var(--primary-200);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
}

.quantity-btn:hover:not(:disabled) {
  background: var(--primary-200);
  color: var(--bg-100);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  width: 50px;
  height: 35px;
  border: none;
  text-align: center;
  font-size: 14px;
  background: var(--bg-100);
  color: var(--primary-300);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.total-summary {
  margin-top: 20px;
  padding: 15px;
  background: var(--bg-100);
  border-radius: 8px;
  border: 2px solid var(--accent-100);
  box-shadow: 0 4px 8px rgba(241, 143, 1, 0.2);
}

.total-summary h5 {
  margin-bottom: 10px;
  color: var(--primary-300);
  font-size: 16px;
  font-family: 'Courier New', monospace;
}

.total-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-quantity {
  font-size: 14px;
  color: var(--text-200);
  font-family: 'Courier New', monospace;
}

.total-price {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-100);
  font-family: 'Courier New', monospace;
}

.total-items {
  font-size: 14px;
  color: var(--text-200);
  font-family: 'Courier New', monospace;
}

/* 数量选择 */
.quantity-section {
  margin-bottom: 30px;
}

.quantity-section h4 {
  color: var(--primary-300);
  margin-bottom: 10px;
  font-family: 'Courier New', monospace;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.qty-btn {
  background: var(--bg-200);
  border: 2px solid var(--primary-200);
  color: var(--primary-200);
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s ease;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.2);
}

.qty-btn:hover:not(:disabled) {
  background: var(--primary-200);
  color: var(--bg-100);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-size: 18px;
  font-weight: bold;
  color: var(--primary-300);
  min-width: 30px;
  text-align: center;
}

.stock-info {
  color: var(--text-200);
  font-size: 14px;
}

/* 购买按钮 */
.purchase-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.pixel-btn {
  border: 2px solid;
  padding: 15px 25px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pixel-btn.buy-now {
  background: var(--accent-100);
  border-color: var(--accent-100);
  color: var(--bg-100);
  flex: 1;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(241, 143, 1, 0.3);
}

.pixel-btn.buy-now:hover {
  background: var(--accent-200);
  box-shadow: 0 6px 12px rgba(241, 143, 1, 0.4);
}

.pixel-btn.favorite {
  background: var(--bg-200);
  border-color: var(--bg-300);
  color: var(--text-200);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.2);
}

.pixel-btn.favorite:hover,
.pixel-btn.favorite.active {
  border-color: var(--accent-100);
  color: var(--accent-100);
}

/* 标签页 */
.product-tabs {
  margin-bottom: 50px;
}

.tab-headers {
  display: flex;
  border-bottom: 2px solid var(--bg-300);
  margin-bottom: 30px;
}

.tab-header {
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-200);
  padding: 15px 25px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.3s ease;
}

.tab-header:hover,
.tab-header.active {
  color: var(--primary-300);
  border-bottom-color: var(--primary-300);
}

.tab-content {
  background: rgba(235, 226, 205, 0.5);
  border: 2px solid var(--bg-300);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.1);
}

.tab-panel h3 {
  color: var(--primary-300);
  margin-bottom: 20px;
  font-family: 'Courier New', monospace;
}

.description-content p {
  color: var(--text-200);
  line-height: 1.8;
  margin-bottom: 15px;
}

.description-text {
  margin-bottom: 30px;
}

.description-images {
  margin-top: 30px;
}

.description-images h4 {
  color: var(--primary-300);
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
  align-items: start;
}

.description-image-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: var(--bg-200);
  border: 2px solid var(--bg-300);
}

.description-image-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(143, 191, 159, 0.3);
  border-color: var(--primary-200);
}

.description-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.description-image-item:hover .description-image {
  transform: scale(1.05);
}

.description-image-item .image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.description-image-item:hover .image-overlay {
  opacity: 1;
}

.zoom-icon {
  font-size: 24px;
  color: white;
}

/* 图片模态框样式 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background: var(--bg-100);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid var(--primary-200);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 30px;
  color: white;
  cursor: pointer;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.7);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: var(--primary-200);
  transform: scale(1.1);
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  display: block;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table td {
  padding: 12px;
  border-bottom: 1px solid var(--bg-300);
}

.param-name {
  color: var(--primary-300);
  font-weight: bold;
  width: 30%;
}

.param-value {
  color: var(--text-200);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  background: rgba(235, 226, 205, 0.3);
  border: 1px solid var(--bg-300);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.1);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.reviewer-name {
  color: var(--primary-300);
  font-weight: bold;
}

.review-rating {
  display: flex;
}

.review-date {
  color: var(--text-200);
  font-size: 12px;
  margin-left: auto;
}

.review-content {
  color: var(--text-200);
  line-height: 1.6;
}

.service-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.service-item {
  background: rgba(235, 226, 205, 0.3);
  border: 1px solid var(--bg-300);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.1);
}

.service-item h4 {
  color: var(--primary-300);
  margin-bottom: 10px;
}

.service-item p {
  color: var(--text-200);
  line-height: 1.6;
}



/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
  min-height: 400px;
}

.loading-spinner {
  width: 60px;
  height: 60px;
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
  font-size: 18px;
  color: var(--text-200);
  margin: 0;
}

/* 错误提示样式 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
  min-height: 400px;
}

.error-text {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  color: var(--accent-200);
  margin: 0 0 30px 0;
  max-width: 500px;
  line-height: 1.5;
}

.retry-btn {
  background: var(--accent-100);
  border: 2px solid var(--accent-200);
  color: var(--bg-100);
  padding: 15px 30px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(131, 53, 0, 0.2);
}

.retry-btn:hover {
  background: var(--accent-200);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(131, 53, 0, 0.4);
}

/* 加载状态 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .purchase-actions {
    flex-direction: column;
  }
  
  .tab-headers {
    flex-wrap: wrap;
  }
  
  .related-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .service-content {
    grid-template-columns: 1fr;
  }
  
  .loading-container,
  .error-container {
    padding: 60px 20px;
    min-height: 300px;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
  }
  
  .loading-text,
  .error-text {
    font-size: 16px;
  }
  
  .retry-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .header-nav {
    flex-direction: column;
  }
  
  .product-title {
    font-size: 1.8rem;
  }
  
  .current-price {
    font-size: 2rem;
  }
}
</style>