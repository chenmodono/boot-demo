<template>
  <div class="home-page">
    <!-- 像素化背景 -->
    <div class="pixel-bg"></div>
    <div class="pixel-overlay"></div>

    <!-- 导航栏 -->
    <nav class="pixel-nav">
      <a @click="goToProducts" class="pixel-nav-item" :class="{ active: currentPage === 'products' }">商品分类</a>
      <a @click="goToCustomize" class="pixel-nav-item" :class="{ active: currentPage === 'customize' }">私人定制</a>
      <a @click="openContactModal" class="pixel-nav-item" :class="{ active: currentPage === 'contact' }">联系客服</a>
    </nav>

    <!-- 主要内容容器 -->
    <div class="pixel-container">
      <div class="pixel-text" style="text-align: center; font-size: 1.5rem; margin-bottom: 40px; font-weight: bold; color: var(--primary-300);">
        ▼ 我们的六大热门系列 ▼
      </div>

      <!-- 产品系列网格 -->
      <div class="pixel-grid">
        <div 
          v-for="category in productCategories" 
          :key="category.id" 
          class="pixel-card"
          @click="goToProductsByCategory(category.id)"
        >
          <div class="pixel-image-container">
            <img :src="category.image" :alt="category.name"
              class="pixel-image">
            <div class="pixel-image-overlay"></div>
          </div>
          <h3 class="pixel-title-small">{{ category.name }}</h3>
          <p class="pixel-text">
            {{ category.description }}
          </p>
          <br>
          <button class="pixel-btn" @click.stop="goToProductsByCategory(category.id)">查看系列</button>
        </div>
      </div>

      <!-- 用户评价展示区 -->
      <div class="pixel-gallery">
        <h2 class="pixel-title-small" style="text-align: center; margin-bottom: 20px; font-size: 2rem;">
          ▼ 真实用户评价 ▼
        </h2>
        <div class="reviews-container">
          <div v-if="isLoadingReviews" class="loading-state">
            <div class="loading-spinner"></div>
            <p>正在加载用户评价...</p>
          </div>
          <div v-else-if="userReviews.length > 0" class="reviews-scroll">
            <div v-for="(review, index) in userReviews" :key="index" class="review-item">
              <div class="review-image">
                <img :src="review.image" :alt="review.productName">
                <div class="review-rating">
                  <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= review.rating }">★</span>
                </div>
              </div>
              <div class="review-content">
                 <p class="review-text">{{ review.comment }}</p>
                 <div class="review-user">
                   <span class="user-name">{{ review.userName }}</span>
                   <span class="review-date">{{ review.date }}</span>
                 </div>
               </div>
            </div>
            <!-- 复制一遍用于无缝循环 -->
            <div v-for="(review, index) in userReviews" :key="'copy-' + index" class="review-item">
              <div class="review-image">
                <img :src="review.image" :alt="review.productName">
                <div class="review-rating">
                  <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= review.rating }">★</span>
                </div>
              </div>
              <div class="review-content">
                 <p class="review-text">{{ review.comment }}</p>
                 <div class="review-user">
                   <span class="user-name">{{ review.userName }}</span>
                   <span class="review-date">{{ review.date }}</span>
                 </div>
               </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>暂无用户评价</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Banner广告位 -->
    <div v-if="isLoadingBanners" class="banner-loading">
      <div class="loading-spinner"></div>
      <p>正在加载广告...</p>
    </div>
    <div v-else-if="bannerAds.length > 0" class="banner-section">
      <div class="banner-content">
        <div class="banner-icon">{{ bannerAds[currentBanner].icon }}</div>
        <h3 class="banner-title-text">{{ bannerAds[currentBanner].title }}</h3>
        <p class="banner-description">{{ bannerAds[currentBanner].description }}</p>
        <button class="pixel-btn banner-btn" @click="handleBannerClick(bannerAds[currentBanner].action)">{{ bannerAds[currentBanner].buttonText }}</button>
      </div>
      <div class="banner-indicators">
        <span v-for="(banner, index) in bannerAds" :key="index" class="indicator"
          :class="{ active: index === currentBanner }" @click="goToBanner(index)"></span>
      </div>
    </div>
    <div v-else class="banner-empty">
      <p>暂无广告内容</p>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <p>© 2025 优质生活馆 | 品质保证 | 隐私保护 | 安全第一</p>
    </div>

    <!-- 联系弹窗 -->
    <ContactModal :visible="showContactModal" @close="closeContactModal" />
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ContactModal from '@/components/ContactModal.vue'
import { productApi } from '@/api/productApi'

const router = useRouter()

// 当前页面状态
const currentPage = ref('home')

// 产品分类数据
const productCategories = ref([
  {
    id: 'male-toys',
    name: '倒模',
    description: '高品质仿真设计，带来极致体验',
    image: 'https://shoplineimg.com/573bfdf903905586e8000240/660bb49bf8945c00206a6c57/800x.webp?source_format=jpg',
    color: '#FF6B6B'
  },
  {
    id: 'female-vibrators',
    name: '按摩棒',
    description: '多频震动模式，舒适安全材质',
    image: 'https://shoplineimg.com/573bfdf903905586e8000240/6864a4efb98276000e4b0e90/360x.webp?source_format=jpg',
    color: '#4ECDC4'
  },
  {
    id: 'couple-toys',
    name: '情趣内衣',
    description: '浪漫设计，增进情侣感情',
    image: 'https://shoplineimg.com/573bfdf903905586e8000240/66bc71b5f25b480016fdcd99/360x.webp?source_format=jpg',
    color: '#45B7D1'
  },
  {
    id: 'massage-oil',
    name: '按摩油',
    description: '天然植物精华，温和滋润',
    image: 'https://shoplineimg.com/573bfdf903905586e8000240/67f49c174694230010000250/360x.webp?source_format=jpg',
    color: '#96CEB4'
  },
  {
    id: 'massage-device',
    name: '按摩器',
    description: '智能控制，多种按摩模式',
    image: 'https://shoplineimg.com/573bfdf903905586e8000240/686b88e1dccd8d000df034e7/360x.webp?source_format=png',
    color: '#FFEAA7'
  },
  {
    id: 'private-care',
    name: '私密护理',
    description: '专业护理，温和呵护',
    image: 'https://shoplineimg.com/573bfdf903905586e8000240/67934e22dd0a73000f1aaf4f/360x.webp?source_format=png',
    color: '#DDA0DD'
  }
])

// 跳转到指定分类的商品页面
function goToProductsByCategory(categoryId) {
  router.push({
    path: '/products',
    query: { category: categoryId }
  })
}

// 联系弹窗相关
const showContactModal = ref(false)

function openContactModal() {
  currentPage.value = 'contact'
  showContactModal.value = true
}

function closeContactModal() {
  showContactModal.value = false
  currentPage.value = 'home'
}

// Banner广告相关数据
const currentBanner = ref(0)
const bannerInterval = ref(null)

// Banner广告数据
const bannerAds = ref([])
const isLoadingBanners = ref(false)

// 获取Banner广告数据
const fetchBannerAds = async () => {
  try {
    isLoadingBanners.value = true
    const response = await productApi.getBannerAds()
    if (response.success) {
      bannerAds.value = response.data
    } else {
      console.error('获取Banner广告失败:', response.message)
    }
  } catch (error) {
    console.error('获取Banner广告出错:', error)
  } finally {
    isLoadingBanners.value = false
  }
}

// 用户评价数据
const userReviews = ref([])
const isLoadingReviews = ref(false)

// 获取用户评价数据
const fetchUserReviews = async () => {
  try {
    isLoadingReviews.value = true
    const response = await productApi.getUserReviews(6)
    if (response.success) {
      userReviews.value = response.data
    } else {
      console.error('获取用户评价失败:', response.message)
    }
  } catch (error) {
    console.error('获取用户评价出错:', error)
  } finally {
    isLoadingReviews.value = false
  }
}

// 跳转到商品页面
function goToProducts() {
  currentPage.value = 'products'
  router.push('/products')
}

// 跳转到私人定制页面
function goToCustomize() {
  currentPage.value = 'customize'
  router.push('/customize')
}

// Banner控制方法
function goToBanner(index) {
  if (index !== currentBanner.value) {
    triggerBannerAnimation()
    setTimeout(() => {
      currentBanner.value = index
    }, 300)
  }
  resetBannerTimer()
}

function triggerBannerAnimation() {
  const bannerContent = document.querySelector('.banner-content')
  if (bannerContent) {
    bannerContent.classList.add('changing')
    setTimeout(() => {
      bannerContent.classList.remove('changing')
    }, 600)
  }
}

function nextBanner() {
  triggerBannerAnimation()
  setTimeout(() => {
    currentBanner.value = (currentBanner.value + 1) % bannerAds.value.length
  }, 300)
}

function startBanner() {
  bannerInterval.value = setInterval(() => {
    triggerBannerAnimation()
    setTimeout(() => {
      currentBanner.value = (currentBanner.value + 1) % bannerAds.value.length
    }, 300)
  }, 5000)
}

function resetBannerTimer() {
  if (bannerInterval.value) {
    clearInterval(bannerInterval.value)
  }
  startBanner()
}

// Banner点击处理
function handleBannerClick(action) {
  // 所有banner点击都打开联系客服弹窗
  openContactModal()
}

// 创建像素装饰
function createPixelDecorations() {
  const colors = ['#8FBF9F', '#F18F01', '#24613b', '#68a67d']

  for (let i = 0; i < 15; i++) {
    const pixel = document.createElement('div')
    pixel.className = 'pixel-decoration'
    pixel.style.left = Math.random() * 100 + '%'
    pixel.style.top = Math.random() * 100 + '%'
    pixel.style.background = colors[Math.floor(Math.random() * colors.length)]
    pixel.style.animationDelay = Math.random() * 5 + 's'
    document.body.appendChild(pixel)
  }
}

// 按钮点击音效模拟
function initPixelButtons() {
  const buttons = document.querySelectorAll('.pixel-btn')

  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault()

      // 模拟8位游戏音效的视觉反馈
      const originalText = this.textContent
      this.textContent = '*** 已激活 ***'
      this.style.background = '#8FBF9F'

      setTimeout(() => {
        this.textContent = originalText
        this.style.background = '#F18F01'
      }, 500)
    })
  })
}

// 像素化故障效果
function createGlitchEffect() {
  const cards = document.querySelectorAll('.pixel-card')

  setInterval(() => {
    const randomCard = cards[Math.floor(Math.random() * cards.length)]
    randomCard.style.transform = 'translate(' +
      (Math.random() * 4 - 2) + 'px, ' +
      (Math.random() * 4 - 2) + 'px)'

    setTimeout(() => {
      randomCard.style.transform = 'translate(0, 0)'
    }, 100)
  }, 2000)
}

// 初始化
onMounted(() => {
  createPixelDecorations()
  initPixelButtons()
  createGlitchEffect()
  
  // 获取数据
  fetchBannerAds()
  fetchUserReviews()
  
  // 启动Banner轮播（需要等待数据加载完成）
  setTimeout(() => {
    if (bannerAds.value.length > 0) {
      startBanner()
    }
  }, 500)
})

// 清理定时器
onUnmounted(() => {
  if (bannerInterval.value) {
    clearInterval(bannerInterval.value)
  }
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

.home-page {
  position: relative;
  min-height: 100vh;
  background: var(--bg-100);
  font-family: 'Courier New', monospace;
  color: var(--text-100);
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  overflow-x: hidden;
}

/* 自然风格背景 */
.pixel-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(90deg, transparent 0%, rgba(143, 191, 159, 0.1) 25%, transparent 50%, rgba(241, 143, 1, 0.1) 75%, transparent 100%),
    linear-gradient(0deg, transparent 0%, rgba(143, 191, 159, 0.05) 50%, transparent 100%);
  background-size: 20px 20px, 20px 20px;
  animation: pixelMove 4s linear infinite;
  z-index: -2;
}

@keyframes pixelMove {
  0% {
    background-position: 0 0, 0 0;
  }

  100% {
    background-position: 20px 20px, 0 20px;
  }
}

/* 自然风格网格覆盖 */
.pixel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    repeating-linear-gradient(0deg,
      transparent,
      transparent 2px,
      rgba(143, 191, 159, 0.03) 2px,
      rgba(143, 191, 159, 0.03) 4px),
    repeating-linear-gradient(90deg,
      transparent,
      transparent 2px,
      rgba(241, 143, 1, 0.03) 2px,
      rgba(241, 143, 1, 0.03) 4px);
  z-index: -1;
}

/* 简化容器 */
.pixel-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
}

/* 自然风格标题 */
.pixel-title {
  font-size: 4rem;
  font-weight: bold;
  text-align: center;
  color: var(--primary-300);
  text-shadow:
    2px 2px 0 var(--accent-100),
    4px 4px 0 var(--primary-100),
    6px 6px 0 var(--accent-200);
  margin: 40px 0;
  animation: titleGlitch 3s ease-in-out infinite;
}

@keyframes titleGlitch {

  0%,
  100% {
    transform: translate(0);
  }

  20% {
    transform: translate(-2px, 2px);
  }

  40% {
    transform: translate(-2px, -2px);
  }

  60% {
    transform: translate(2px, 2px);
  }

  80% {
    transform: translate(2px, -2px);
  }
}

/* 自然风格按钮 */
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

/* 增强主题卡片 */
.pixel-card {
  background: linear-gradient(135deg, rgba(245, 236, 215, 0.95) 0%, rgba(143, 191, 159, 0.1) 100%);
  border: 4px solid var(--primary-200);
  margin: 20px;
  padding: 25px;
  position: relative;
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(143, 191, 159, 0.25);
  backdrop-filter: blur(5px);
}

.pixel-card::before {
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

/* 玫瑰密语 - 粉色主题 */
.pixel-card:nth-child(1) {
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.9) 0%, rgba(255, 105, 180, 0.2) 100%);
  border: 4px solid #FF69B4;
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
}

/* 钻石之吻 - 蓝色主题 */
.pixel-card:nth-child(2) {
  background: linear-gradient(135deg, rgba(173, 216, 230, 0.9) 0%, rgba(70, 130, 180, 0.2) 100%);
  border: 4px solid #4682B4;
  box-shadow: 0 8px 25px rgba(70, 130, 180, 0.4);
}

/* 雷电之舞 - 黄色主题 */
.pixel-card:nth-child(3) {
  background: linear-gradient(135deg, rgba(255, 255, 224, 0.9) 0%, rgba(255, 215, 0, 0.3) 100%);
  border: 4px solid #FFD700;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.5);
}

/* 星辰密码 - 深蓝主题 */
.pixel-card:nth-child(4) {
  background: linear-gradient(135deg, rgba(25, 25, 112, 0.8) 0%, rgba(72, 61, 139, 0.3) 100%);
  border: 4px solid #483D8B;
  box-shadow: 0 8px 25px rgba(72, 61, 139, 0.5);
  color: white;
}

/* 时空之门 - 绿色主题 */
.pixel-card:nth-child(5) {
  background: linear-gradient(135deg, rgba(144, 238, 144, 0.9) 0%, rgba(34, 139, 34, 0.2) 100%);
  border: 4px solid #228B22;
  box-shadow: 0 8px 25px rgba(34, 139, 34, 0.4);
}

/* 魅惑之心 - 红色主题 */
.pixel-card:nth-child(6) {
  background: linear-gradient(135deg, rgba(255, 160, 122, 0.9) 0%, rgba(220, 20, 60, 0.2) 100%);
  border: 4px solid #DC143C;
  box-shadow: 0 8px 25px rgba(220, 20, 60, 0.4);
}

.pixel-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

/* 各主题卡片悬停效果 */
.pixel-card:nth-child(1):hover {
  box-shadow: 0 15px 40px rgba(255, 105, 180, 0.6);
}

.pixel-card:nth-child(2):hover {
  box-shadow: 0 15px 40px rgba(70, 130, 180, 0.6);
}

.pixel-card:nth-child(3):hover {
  box-shadow: 0 15px 40px rgba(138, 43, 226, 0.6);
}

.pixel-card:nth-child(4):hover {
  box-shadow: 0 15px 40px rgba(255, 215, 0, 0.7);
}

.pixel-card:nth-child(5):hover {
  box-shadow: 0 15px 40px rgba(0, 206, 209, 0.6);
}

.pixel-card:nth-child(6):hover {
  box-shadow: 0 15px 40px rgba(72, 61, 139, 0.7);
}

.pixel-card:nth-child(7):hover {
  box-shadow: 0 15px 40px rgba(34, 139, 34, 0.6);
}

.pixel-card:nth-child(8):hover {
  box-shadow: 0 15px 40px rgba(220, 20, 60, 0.6);
}

/* 自然风格图片容器 */
.pixel-image-container {
  width: 160px;
  height: 160px;
  margin: 0 auto 20px;
  position: relative;
  border: 3px solid var(--primary-200);
  background: var(--bg-300);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
}

.pixel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  filter: contrast(1.2) saturate(1.5);
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

.pixel-image-container:hover {
  border-color: var(--accent-100);
  transform: scale(1.05);
  transition: all 0.3s ease;
}

.pixel-image-container::before {
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

.pixel-image-container:hover::before {
  opacity: 0.5;
}

/* 自然风格画廊部分 */
.pixel-gallery {
  margin: 40px 0;
  padding: 20px;
  background: rgba(235, 226, 205, 0.9);
  border: 4px solid var(--accent-100);
  position: relative;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(143, 191, 159, 0.2);
}

.pixel-gallery::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--accent-100), var(--primary-200), var(--primary-100), var(--accent-100));
  z-index: -1;
  animation: galleryGlow 3s ease-in-out infinite alternate;
  border-radius: 18px;
}





.pixel-gallery {
  background: transparent;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.reviews-container {
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
  padding: 20px 0;
}

.reviews-scroll {
  display: flex;
  gap: 30px;
  animation: reviewsAutoScroll 40s linear infinite;
  width: calc(200% + 30px);
}

@keyframes reviewsAutoScroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(calc(-50% - 15px));
  }
}

.review-item {
  position: relative;
  background: linear-gradient(135deg, rgba(245, 236, 215, 0.95) 0%, rgba(143, 191, 159, 0.1) 100%);
  border: 4px solid var(--primary-200);
  border-radius: 12px;
  box-shadow:
    0 0 0 2px var(--accent-100),
    0 6px 20px rgba(143, 191, 159, 0.3),
    inset 0 0 0 2px rgba(143, 191, 159, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
  width: 320px;
  padding: 15px;
}

.review-item::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--primary-200), var(--accent-100), var(--primary-200));
  z-index: -1;
  border-radius: 14px;
}

.review-image {
  position: relative;
  width: 100%;
  height: 120px;
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
}

.review-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.review-rating {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 14px;
  transition: color 0.3s ease;
}

.star.filled {
  color: #ffd700;
}

.review-content {
  padding: 0;
}

.review-text {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-100);
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-200);
}

.user-name {
  font-weight: bold;
  color: var(--primary-200);
}

.review-date {
  color: var(--text-200);
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-200);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--bg-300);
  border-top: 3px solid var(--accent-100);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态样式 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-200);
  font-size: 16px;
}

/* Banner加载状态样式 */
.banner-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-200);
  background: var(--bg-200);
  border-radius: 12px;
  margin: 20px 0;
}

/* Banner空状态样式 */
.banner-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-200);
  font-size: 16px;
  background: var(--bg-200);
  border-radius: 12px;
  margin: 20px 0;
}

.reviews-scroll:hover {
  animation-play-state: paused;
}

.review-item:hover {
  transform: translateY(-5px);
  box-shadow:
    0 0 0 2px var(--accent-100),
    0 10px 25px rgba(241, 143, 1, 0.4),
    inset 0 0 0 4px rgba(241, 143, 1, 0.1);
}

.gallery-item:hover img {
  transform: scale(1.02);
  filter: brightness(1.1) contrast(1.1);
}

.banner-content {
  background: rgba(245, 236, 215, 0.9);
  padding: 30px;
  border: 3px solid var(--primary-200);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(143, 191, 159, 0.3);
  transition: all 0.6s ease;
  text-align: center;
  max-width: 1200px;
  margin: 20px auto;
  position: relative;
  overflow: hidden;
}

.banner-content::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(143, 191, 159, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.banner-content.changing::before {
  transform: translateX(100%);
}

.banner-icon {
  font-size: 3rem;
  color: var(--accent-100);
  margin-bottom: 15px;
  display: block;
  transition: all 0.6s ease;
  transform: scale(1);
}

.banner-content.changing .banner-icon {
  transform: scale(1.2) rotate(10deg);
  color: var(--primary-200);
}

.banner-title-text {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-100);
  margin-bottom: 15px;
  transition: all 0.6s ease;
  transform: translateY(0);
  opacity: 1;
}

.banner-content.changing .banner-title-text {
  transform: translateY(-10px);
  opacity: 0.7;
}

.banner-description {
  font-size: 1.1rem;
  color: var(--text-200);
  margin-bottom: 20px;
  line-height: 1.5;
  transition: all 0.6s ease;
  transform: translateY(0);
  opacity: 1;
}

.banner-content.changing .banner-description {
  transform: translateY(10px);
  opacity: 0.7;
}

.banner-content:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(143, 191, 159, 0.4);
  border-color: var(--accent-100);
}



.banner-btn {
  background: var(--accent-100);
  border: 2px solid var(--primary-200);
  color: var(--bg-100);
  padding: 15px 30px;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.6s ease;
  border-radius: 8px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 12px rgba(241, 143, 1, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  transform: scale(1);
}

.banner-content.changing .banner-btn {
  transform: scale(0.95);
  background: var(--primary-200);
  box-shadow: 0 2px 8px rgba(143, 191, 159, 0.4);
}

.banner-btn:hover {
  background: var(--primary-200);
  border-color: var(--primary-200);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(104, 166, 125, 0.5);
}

.banner-indicators {
  display: flex;
  justify-content: center;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto 30px auto;
}

.indicator {
  width: 20px;
  height: 20px;
  background: rgba(194, 186, 166, 0.6);
  border: 4px solid var(--primary-200);
  cursor: pointer;
  transition: all 0.4s ease;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.indicator::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 3px solid transparent;
  border-radius: 50%;
  transition: all 0.4s ease;
}

.indicator.active {
  background: var(--accent-100);
  border-color: var(--primary-300);
  box-shadow: 
    0 0 20px rgba(241, 143, 1, 0.8),
    0 4px 15px rgba(241, 143, 1, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transform: scale(1.4);
}

.indicator.active::before {
  border-color: var(--accent-100);
  animation: indicatorPulse 2.5s ease-in-out infinite;
}

@keyframes indicatorPulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
    border-color: var(--accent-100);
  }

  50% {
    transform: scale(1.8);
    opacity: 0.3;
    border-color: var(--primary-200);
  }
}

.indicator:hover {
  background: var(--primary-200);
  border-color: var(--accent-100);
  transform: scale(1.5);
  box-shadow: 
    0 0 15px rgba(104, 166, 125, 0.7),
    0 4px 12px rgba(104, 166, 125, 0.4);
}

/* 自然风格文本 */
.pixel-text {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--primary-200);
  text-shadow: 1px 1px 0 var(--bg-100);
}

.pixel-title-small {
  font-size: 1.5rem;
  color: var(--accent-100);
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 2px 2px 0 var(--primary-200);
}

/* 网格布局 */
.pixel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

/* 自然风格导航栏 */
.pixel-nav {
  background: var(--bg-200);
  border-bottom: 4px solid var(--primary-200);
  padding: 20px;
  text-align: center;
}

.pixel-nav-item {
  display: inline-block;
  margin: 0 10px;
  padding: 10px 20px;
  background: var(--accent-100);
  color: var(--bg-100);
  border: 2px solid var(--accent-100);
  text-decoration: none;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(241, 143, 1, 0.4);
  cursor: pointer;
  animation: pulse 2s infinite;
}

.pixel-nav-item.active {
  background: var(--primary-200);
  color: var(--bg-100);
  border-color: var(--primary-200);
  animation: none;
  box-shadow: 0 4px 12px rgba(143, 191, 159, 0.6), 0 0 20px rgba(143, 191, 159, 0.3);
  transform: scale(1.05);
}

@keyframes pulse {

  0%,
  100% {
    box-shadow: 0 4px 8px rgba(241, 143, 1, 0.4);
  }

  50% {
    box-shadow: 0 4px 15px rgba(241, 143, 1, 0.6), 0 0 25px rgba(241, 143, 1, 0.3);
  }
}

.pixel-nav-item:hover {
  background: var(--accent-200);
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--primary-200);
}

.pixel-nav-item.active:hover {
  background: var(--primary-300);
  transform: translate(-2px, -2px) scale(1.05);
  box-shadow: 4px 4px 0 var(--accent-100), 0 4px 15px rgba(143, 191, 159, 0.8);
}



/* 自然风格装饰 */
:deep(.pixel-decoration) {
  position: fixed;
  width: 8px;
  height: 8px;
  background: var(--primary-200);
  animation: pixelFloat 5s ease-in-out infinite;
  z-index: 1;
  border-radius: 2px;
}

@keyframes pixelFloat {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  25% {
    transform: translateY(-20px) rotate(90deg);
  }

  50% {
    transform: translateY(0) rotate(180deg);
  }

  75% {
    transform: translateY(-10px) rotate(270deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pixel-container {
    margin: 10px;
  }

  .pixel-title {
    font-size: 2.5rem;
  }

  .pixel-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }

  .pixel-nav {
    padding: 15px 10px;
  }

  .pixel-nav-item {
    display: block;
    margin: 5px 0;
    padding: 8px 15px;
    font-size: 0.9rem;
  }

  .gallery-container {
    padding: 15px 0;
  }

  .gallery-scroll {
    gap: 20px;
  }

  .gallery-item {
    border-width: 6px;
    width: 160px;
  }

  .gallery-item img {
    height: 120px;
  }

  /* Banner响应式 */
  .banner-content {
    padding: 20px;
    margin: 10px auto;
  }

  .banner-icon {
    font-size: 2.5rem;
  }

  .banner-title-text {
    font-size: 1.5rem;
  }

  .banner-btn {
    padding: 12px 20px;
    font-size: 1rem;
  }

  .banner-indicators {
    gap: 8px;
    margin: 0 auto 15px auto;
  }

  .indicator {
    width: 10px;
    height: 10px;
  }
}

/* 闪烁效果 */
.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {

  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0;
  }
}

/* 页脚样式 */
.footer {
  text-align: center;
  padding: 40px;
  background: var(--bg-300);
  color: var(--text-200);
  border-top: 2px solid var(--primary-200);
}
</style>
