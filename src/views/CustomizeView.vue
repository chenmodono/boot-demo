<template>
  <div class="customize-page">
    <!-- 像素化背景 -->
    <div class="pixel-bg"></div>
    <div class="pixel-overlay"></div>

    <!-- 左侧按钮组 -->
    <div class="left-buttons">
      <button @click="goToHome" class="left-btn">返回首页</button>
      <button @click="openContactModal" class="left-btn">联系客服</button>
    </div>

    <!-- 主要内容容器 -->
    <div class="main-content">
      <h1 class="pixel-title">私人定制</h1>
      <div class="pixel-text" style="text-align: center; font-size: 1.3rem; margin-bottom: 40px;">
        ▼ 专属于你的独特体验 ▼
      </div>

      <!-- 定制步骤指示器 -->
      <div class="step-indicator">
        <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <div class="step-number">1</div>
          <div class="step-title">选择类型</div>
        </div>
        <div class="step-line" :class="{ active: currentStep > 1 }"></div>
        <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <div class="step-number">2</div>
          <div class="step-title">个性配置</div>
        </div>
        <div class="step-line" :class="{ active: currentStep > 2 }"></div>
        <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
          <div class="step-number">3</div>
          <div class="step-title">确认订单</div>
        </div>
      </div>

      <!-- 步骤1: 选择类型 -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 class="step-heading">选择定制类型</h2>
        <div class="customize-grid">
          <div v-for="category in categories" :key="category.id" class="customize-card"
            :class="{ selected: selectedCategory === category.id }" @click="selectCategory(category.id)">
            <div class="customize-image-container">
              <img :src="category.image" :alt="category.name" class="customize-image">
              <div class="customize-image-overlay"></div>
            </div>
            <h3 class="customize-title-small">{{ category.name }}</h3>
            <p class="customize-text">{{ category.description }}</p>
            <div class="price-range">{{ category.priceRange }}</div>
          </div>
        </div>
        <div class="step-actions">
          <button class="pixel-btn" :disabled="!selectedCategory" @click="nextStep">
            下一步
          </button>
        </div>
      </div>

      <!-- 步骤2: 个性配置 -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 class="step-heading">个性化配置</h2>
        <div class="config-form">
          <div class="config-section">
            <h3 class="config-title">基础配置</h3>
            <div class="form-group">
              <label class="form-label">材质选择</label>
              <div class="option-grid">
                <div v-for="material in materials" :key="material.id" class="option-card"
                  :class="{ selected: selectedMaterial === material.id }" @click="selectedMaterial = material.id">
                  <div class="option-name">{{ material.name }}</div>
                  <div class="option-price">+¥{{ material.price }}</div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">颜色选择</label>
              <div class="color-grid">
                <div v-for="color in colors" :key="color.id" class="color-option"
                  :class="{ selected: selectedColor === color.id }" :style="{ backgroundColor: color.value }"
                  @click="selectedColor = color.id">
                  <span class="color-name">{{ color.name }}</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">尺寸规格</label>
              <div class="size-selector">
                <select v-model="selectedSize" class="pixel-select">
                  <option value="">请选择尺寸</option>
                  <option v-for="size in sizes" :key="size.id" :value="size.id">
                    {{ size.name }} ({{ size.dimensions }})
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="config-section">
            <h3 class="config-title">特殊功能</h3>
            <div class="feature-list">
              <div v-for="feature in features" :key="feature.id" class="feature-item"
                :class="{ selected: selectedFeatures.includes(feature.id) }" @click="toggleFeature(feature.id)">
                <div class="feature-info">
                  <div class="feature-name">{{ feature.name }}</div>
                  <div class="feature-desc">{{ feature.description }}</div>
                </div>
                <div class="feature-price">+¥{{ feature.price }}</div>
              </div>
            </div>
          </div>

          <div class="config-section">
            <h3 class="config-title">个性化定制</h3>
            <div class="form-group">
              <label class="form-label">刻字内容 (可选)</label>
              <input v-model="customText" type="text" class="pixel-input" placeholder="请输入要刻印的文字（最多20字符）"
                maxlength="20">
            </div>

            <div class="form-group">
              <label class="form-label">特殊要求</label>
              <textarea v-model="specialRequirements" class="pixel-textarea" placeholder="请描述您的特殊要求或想法..."
                rows="4"></textarea>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="pixel-btn secondary" @click="prevStep">上一步</button>
          <button class="pixel-btn" :disabled="!isStep2Valid" @click="nextStep">
            下一步
          </button>
        </div>
      </div>

      <!-- 步骤3: 确认订单 -->
      <div v-if="currentStep === 3" class="step-content">
        <h2 class="step-heading">确认订单</h2>
        <div class="order-summary">
          <div class="summary-section">
            <h3 class="summary-title">定制详情</h3>
            <div class="summary-item">
              <span class="item-label">产品类型:</span>
              <span class="item-value">{{ getCategoryName(selectedCategory) }}</span>
            </div>
            <div class="summary-item">
              <span class="item-label">材质:</span>
              <span class="item-value">{{ getMaterialName(selectedMaterial) }}</span>
            </div>
            <div class="summary-item">
              <span class="item-label">颜色:</span>
              <span class="item-value">{{ getColorName(selectedColor) }}</span>
            </div>
            <div class="summary-item">
              <span class="item-label">尺寸:</span>
              <span class="item-value">{{ getSizeName(selectedSize) }}</span>
            </div>
            <div v-if="selectedFeatures.length > 0" class="summary-item">
              <span class="item-label">特殊功能:</span>
              <span class="item-value">{{ getFeatureNames(selectedFeatures).join(', ') }}</span>
            </div>
            <div v-if="customText" class="summary-item">
              <span class="item-label">刻字内容:</span>
              <span class="item-value">{{ customText }}</span>
            </div>
            <div v-if="specialRequirements" class="summary-item">
              <span class="item-label">特殊要求:</span>
              <span class="item-value">{{ specialRequirements }}</span>
            </div>
          </div>

          <div class="summary-section">
            <h3 class="summary-title">价格明细</h3>
            <div class="price-breakdown">
              <div class="price-item">
                <span class="price-label">基础价格:</span>
                <span class="price-value">¥{{ basePrice }}</span>
              </div>
              <div v-if="materialPrice > 0" class="price-item">
                <span class="price-label">材质升级:</span>
                <span class="price-value">¥{{ materialPrice }}</span>
              </div>
              <div v-if="featurePrice > 0" class="price-item">
                <span class="price-label">特殊功能:</span>
                <span class="price-value">¥{{ featurePrice }}</span>
              </div>
              <div v-if="customText" class="price-item">
                <span class="price-label">个性刻字:</span>
                <span class="price-value">¥50</span>
              </div>
              <div class="price-item total">
                <span class="price-label">总计:</span>
                <span class="price-value">¥{{ totalPrice }}</span>
              </div>
            </div>
          </div>

          <div class="summary-section">
            <h3 class="summary-title">联系信息</h3>
            <div class="form-group">
              <label class="form-label">联系人姓名</label>
              <input v-model="contactInfo.name" type="text" class="pixel-input" placeholder="请输入您的姓名">
            </div>
            <div class="form-group">
              <label class="form-label">联系电话</label>
              <input v-model="contactInfo.phone" type="tel" class="pixel-input" placeholder="请输入您的手机号">
            </div>
            <div class="form-group">
              <label class="form-label">微信号</label>
              <input v-model="contactInfo.wechat" type="text" class="pixel-input" placeholder="请输入您的微信号">
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="pixel-btn secondary" @click="prevStep">上一步</button>
          <button class="pixel-btn" :disabled="!isStep3Valid" @click="submitOrder">
            提交定制需求
          </button>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <p>© 2025 神秘秘境 | 私人定制服务 | 专业团队 | 品质保证</p>
    </div>

    <!-- 联系弹窗 -->
    <ContactModal :visible="showContactModal" @close="closeContactModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ContactModal from '@/components/ContactModal.vue'

const router = useRouter()

// 联系弹窗相关
const showContactModal = ref(false)

function openContactModal() {
  showContactModal.value = true
}

function closeContactModal() {
  showContactModal.value = false
}

// 导航方法
function goToHome() {
  router.push('/')
}

// 步骤控制
const currentStep = ref(1)

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++
    // 页面滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
    // 页面滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

// 定制数据
const selectedCategory = ref('')
const selectedMaterial = ref('')
const selectedColor = ref('')
const selectedSize = ref('')
const selectedFeatures = ref([])
const customText = ref('')
const specialRequirements = ref('')
const contactInfo = ref({
  name: '',
  phone: '',
  wechat: ''
})

// 产品类型数据
const categories = ref([
  {
    id: 'premium',
    name: '高端系列',
    description: '采用顶级材料，精工制作，为您带来极致体验',
    image: 'https://shoplineimg.com/573bfdf903905586e8000240/6864eca1fedefa000e463146/360x.webp?source_format=jpg',
    priceRange: '¥800-2000',
    basePrice: 800
  },
  {
    id: 'smart',
    name: '智能系列',
    description: '融合现代科技，智能控制，个性化体验',
    image: 'https://shoplineimg.com/573bfdf903905586e8000240/685b7ce8333751000d5c6959/360x.jpg?',
    priceRange: '¥1200-3000',
    basePrice: 1200
  },
  {
    id: 'luxury',
    name: '奢华系列',
    description: '奢华设计，独特工艺，彰显品味与格调',
    image: 'https://shoplineimg.com/573bfdf903905586e8000240/683eae9baef3280011675cae/360x.jpg?',
    priceRange: '¥2000-5000',
    basePrice: 2000
  },
])

// 材质选项
const materials = ref([
  { id: 'silicone', name: '医用硅胶', price: 0 },
  { id: 'premium-silicone', name: '高级硅胶', price: 200 },
  { id: 'metal', name: '医用金属', price: 500 },
  { id: 'crystal', name: '水晶材质', price: 800 }
])

// 颜色选项
const colors = ref([
  { id: 'pink', name: '樱花粉', value: '#FFB6C1' },
  { id: 'purple', name: '薰衣草紫', value: '#DDA0DD' },
  { id: 'blue', name: '天空蓝', value: '#87CEEB' },
  { id: 'black', name: '神秘黑', value: '#2F2F2F' },
  { id: 'white', name: '珍珠白', value: '#F8F8FF' },
  { id: 'gold', name: '香槟金', value: '#FFD700' }
])

// 尺寸选项
const sizes = ref([
  { id: 'small', name: '小号', dimensions: '10cm' },
  { id: 'medium', name: '中号', dimensions: '15cm' },
  { id: 'large', name: '大号', dimensions: '20cm' },
  { id: 'custom', name: '定制尺寸', dimensions: '按需定制' }
])

// 特殊功能
const features = ref([
  { id: 'vibration', name: '震动功能', description: '多档位震动模式', price: 300 },
  { id: 'heating', name: '加热功能', description: '体温加热技术', price: 400 },
  { id: 'remote', name: '遥控功能', description: '无线遥控操作', price: 200 },
  { id: 'app', name: 'APP控制', description: '手机APP智能控制', price: 500 },
  { id: 'waterproof', name: '防水设计', description: 'IPX7级防水', price: 150 },
  { id: 'rechargeable', name: '充电功能', description: 'USB充电设计', price: 100 }
])

// 选择类型
function selectCategory(categoryId) {
  selectedCategory.value = categoryId
}

// 切换功能选择
function toggleFeature(featureId) {
  const index = selectedFeatures.value.indexOf(featureId)
  if (index > -1) {
    selectedFeatures.value.splice(index, 1)
  } else {
    selectedFeatures.value.push(featureId)
  }
}

// 验证步骤
const isStep2Valid = computed(() => {
  return selectedMaterial.value && selectedColor.value && selectedSize.value
})

const isStep3Valid = computed(() => {
  return contactInfo.value.name && contactInfo.value.phone && contactInfo.value.wechat
})

// 价格计算
const basePrice = computed(() => {
  const category = categories.value.find(c => c.id === selectedCategory.value)
  return category ? category.basePrice : 0
})

const materialPrice = computed(() => {
  const material = materials.value.find(m => m.id === selectedMaterial.value)
  return material ? material.price : 0
})

const featurePrice = computed(() => {
  return selectedFeatures.value.reduce((total, featureId) => {
    const feature = features.value.find(f => f.id === featureId)
    return total + (feature ? feature.price : 0)
  }, 0)
})

const totalPrice = computed(() => {
  let total = basePrice.value + materialPrice.value + featurePrice.value
  if (customText.value) {
    total += 50 // 刻字费用
  }
  return total
})

// 获取名称的辅助方法
function getCategoryName(id) {
  const category = categories.value.find(c => c.id === id)
  return category ? category.name : ''
}

function getMaterialName(id) {
  const material = materials.value.find(m => m.id === id)
  return material ? material.name : ''
}

function getColorName(id) {
  const color = colors.value.find(c => c.id === id)
  return color ? color.name : ''
}

function getSizeName(id) {
  const size = sizes.value.find(s => s.id === id)
  return size ? size.name : ''
}

function getFeatureNames(ids) {
  return ids.map(id => {
    const feature = features.value.find(f => f.id === id)
    return feature ? feature.name : ''
  }).filter(name => name)
}

// 提交订单
function submitOrder() {
  const orderData = {
    category: selectedCategory.value,
    material: selectedMaterial.value,
    color: selectedColor.value,
    size: selectedSize.value,
    features: selectedFeatures.value,
    customText: customText.value,
    specialRequirements: specialRequirements.value,
    contactInfo: contactInfo.value,
    totalPrice: totalPrice.value,
    timestamp: new Date().toISOString()
  }

  console.log('提交定制订单:', orderData)

  // 这里可以调用API提交订单
  alert(`定制需求已提交！\n\n我们的客服将在24小时内联系您确认详细需求。\n\n订单总价: ¥${totalPrice.value}\n联系方式: ${contactInfo.value.phone}`)

  // 重置表单
  resetForm()
}

// 重置表单
function resetForm() {
  currentStep.value = 1
  selectedCategory.value = ''
  selectedMaterial.value = ''
  selectedColor.value = ''
  selectedSize.value = ''
  selectedFeatures.value = []
  customText.value = ''
  specialRequirements.value = ''
  contactInfo.value = {
    name: '',
    phone: '',
    wechat: ''
  }
}

// 初始化
onMounted(() => {
  // 可以在这里添加初始化逻辑
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

.customize-page {
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

/* 复用首页的背景样式 */
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

/* 左侧按钮样式 */
.left-buttons {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: row;
  gap: 15px;
  z-index: 1000;
}

.left-btn {
  background: var(--bg-100);
  color: var(--text-100);
  border: 2px solid var(--primary-200);
  padding: 12px 20px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(143, 191, 159, 0.2);
}

.left-btn:hover {
  border-color: var(--accent-100);
  background: var(--accent-100);
  color: var(--bg-100);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(241, 143, 1, 0.4);
}

.left-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.3);
}

/* 主要内容样式 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 40px;
  position: relative;
}

/* 标题样式 */
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

/* 步骤指示器 */
.step-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
  gap: 20px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--bg-300);
  border: 3px solid var(--primary-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--text-200);
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: var(--accent-100);
  border-color: var(--accent-100);
  color: white;
}

.step.completed .step-number {
  background: var(--primary-200);
  border-color: var(--primary-200);
  color: white;
}

.step-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--primary-300);
  text-align: center;
}

.step.active .step-title {
  color: var(--accent-100);
  font-size: 1.2rem;
}

.step-line {
  width: 80px;
  height: 3px;
  background: var(--bg-300);
  transition: all 0.3s ease;
}

.step-line.active {
  background: var(--primary-200);
}

/* 步骤内容 */
.step-content {
  margin: 40px 0;
}

.step-heading {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: var(--primary-300);
  margin-bottom: 30px;
}

/* 定制网格 */
.customize-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.customize-card {
  background: linear-gradient(135deg, rgba(235, 226, 205, 0.9) 0%, rgba(143, 191, 159, 0.1) 100%);
  border: 4px solid var(--primary-200);
  padding: 25px;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.2);
  backdrop-filter: blur(5px);
  position: relative;
}

.customize-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(143, 191, 159, 0.1) 0%, rgba(235, 226, 205, 0.1) 100%);
  border-radius: 12px;
  z-index: -1;
}

.customize-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent-100);
  box-shadow: 0 12px 35px rgba(143, 191, 159, 0.4);
  background: linear-gradient(135deg, rgba(235, 226, 205, 0.95) 0%, rgba(143, 191, 159, 0.15) 100%);
}

.customize-card.selected {
  border-color: var(--accent-100);
  background: linear-gradient(135deg, var(--accent-100) 0%, rgba(143, 191, 159, 0.8) 100%);
  color: var(--primary-300);
  box-shadow: 0 8px 30px rgba(143, 191, 159, 0.5);
}

.customize-image-container {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  position: relative;
  border: 3px solid var(--primary-200);
  background: var(--bg-300);
  border-radius: 12px;
  overflow: hidden;
}

.customize-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
}

.customize-image-overlay {
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
      rgba(143, 191, 159, 0.1) 4px);
  pointer-events: none;
}

.customize-title-small {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--primary-300);
  margin: 15px 0 10px;
}

.customize-text {
  color: var(--text-200);
  line-height: 1.5;
  margin-bottom: 15px;
}

.price-range {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--accent-100);
  background: rgba(241, 143, 1, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
}

/* 配置表单 */
.config-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.config-section {
  background: linear-gradient(135deg, rgba(235, 226, 205, 0.85) 0%, rgba(143, 191, 159, 0.08) 100%);
  border: 3px solid var(--primary-200);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.15);
  backdrop-filter: blur(3px);
}

.config-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-300);
  margin-bottom: 20px;
  border-bottom: 2px solid var(--primary-200);
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: bold;
  color: var(--text-100);
  margin-bottom: 10px;
  font-size: 1.1rem;
}

/* 选项网格 */
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.option-card {
  background: var(--bg-100);
  border: 2px solid var(--primary-200);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(143, 191, 159, 0.3);
}

.option-card.selected {
  border-color: var(--accent-100);
  border-width: 3px;
  background: rgba(241, 143, 1, 0.15);
  box-shadow: 0 4px 12px rgba(241, 143, 1, 0.4), 0 0 0 2px var(--accent-100);
  transform: translateY(-4px) scale(1.02);
  position: relative;
}

.option-card.selected::after {
  content: '✓';
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--accent-100);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.option-name {
  font-weight: bold;
  color: var(--text-100);
  margin-bottom: 5px;
}

.option-price {
  color: var(--accent-100);
  font-weight: bold;
}

/* 颜色选择器 */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
}

.color-option {
  width: 100px;
  height: 60px;
  border: 3px solid var(--primary-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-option:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.color-option.selected {
  border-color: var(--accent-100);
  border-width: 4px;
  box-shadow: 0 0 0 3px var(--accent-100), 0 0 20px rgba(241, 143, 1, 0.6);
  transform: scale(1.1);
  position: relative;
}

.color-option.selected::after {
  content: '✓';
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--accent-100);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.color-name {
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--text-100);
}

/* 尺寸选择器 */
.size-selector {
  width: 100%;
}

.pixel-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--primary-200);
  border-radius: 8px;
  background: var(--bg-100);
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: var(--text-100);
  cursor: pointer;
}

.pixel-select:focus {
  outline: none;
  border-color: var(--accent-100);
  box-shadow: 0 0 0 2px rgba(241, 143, 1, 0.2);
}

/* 功能列表 */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.feature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-100);
  border: 2px solid var(--primary-200);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(143, 191, 159, 0.3);
}

.feature-item.selected {
  border-color: var(--accent-100);
  border-width: 3px;
  background: rgba(241, 143, 1, 0.15);
  box-shadow: 0 4px 12px rgba(241, 143, 1, 0.4), 0 0 0 2px var(--accent-100);
  transform: translateX(8px) scale(1.02);
  position: relative;
}

.feature-item.selected::before {
  content: '✓';
  position: absolute;
  top: 10px;
  left: -12px;
  background: var(--accent-100);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.feature-info {
  flex: 1;
}

.feature-name {
  font-weight: bold;
  color: var(--text-100);
  margin-bottom: 5px;
}

.feature-desc {
  color: var(--text-200);
  font-size: 0.9rem;
}

.feature-price {
  font-weight: bold;
  color: var(--accent-100);
  font-size: 1.1rem;
}

/* 输入框样式 */
.pixel-input,
.pixel-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--primary-200);
  border-radius: 8px;
  background: var(--bg-100);
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: var(--text-100);
  resize: vertical;
}

.pixel-input:focus,
.pixel-textarea:focus {
  outline: none;
  border-color: var(--accent-100);
  box-shadow: 0 0 0 2px rgba(241, 143, 1, 0.2);
}

/* 按钮样式 */
.pixel-btn {
  background: var(--accent-100);
  color: var(--bg-100);
  border: 2px solid var(--primary-200);
  padding: 12px 24px;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.1s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
}

.pixel-btn:hover:not(:disabled) {
  background: var(--primary-200);
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--accent-100);
}

.pixel-btn:active:not(:disabled) {
  transform: translate(0, 0);
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.3);
}

.pixel-btn:disabled {
  background: var(--bg-300);
  color: var(--text-200);
  cursor: not-allowed;
  opacity: 0.6;
}

.pixel-btn.secondary {
  background: var(--bg-200);
  color: var(--text-100);
  border-color: var(--text-200);
}

.pixel-btn.secondary:hover:not(:disabled) {
  background: var(--bg-300);
  box-shadow: 4px 4px 0 var(--text-200);
}

/* 步骤操作 */
.step-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

/* 订单摘要 */
.order-summary {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.summary-section {
  background: linear-gradient(135deg, rgba(235, 226, 205, 0.9) 0%, rgba(143, 191, 159, 0.1) 100%);
  border: 4px solid var(--primary-200);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.2);
  backdrop-filter: blur(5px);
  position: relative;
}

.summary-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(143, 191, 159, 0.1) 0%, rgba(235, 226, 205, 0.1) 100%);
  border-radius: 12px;
  z-index: -1;
}

.summary-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--primary-300);
  margin-bottom: 20px;
  border-bottom: 2px solid var(--primary-200);
  padding-bottom: 10px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--bg-300);
}

.summary-item:last-child {
  border-bottom: none;
}

.item-label {
  font-weight: bold;
  color: var(--text-100);
}

.item-value {
  color: var(--text-200);
  text-align: right;
  max-width: 60%;
  word-wrap: break-word;
}

/* 价格明细 */
.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.price-item.total {
  border-top: 2px solid var(--primary-200);
  padding-top: 15px;
  margin-top: 10px;
  font-size: 1.2rem;
  font-weight: bold;
}

.price-label {
  color: var(--text-100);
}

.price-value {
  color: var(--accent-100);
  font-weight: bold;
}

.price-item.total .price-value {
  color: var(--primary-300);
  font-size: 1.3rem;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 20px;
  background: rgba(143, 191, 159, 0.1);
  border-top: 2px solid var(--primary-200);
  color: var(--text-200);
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 60px 15px 30px;
  }

  .pixel-title {
    font-size: 2.5rem;
  }

  .step-indicator {
    flex-direction: column;
    gap: 15px;
  }

  .step-line {
    width: 3px;
    height: 40px;
  }

  .customize-grid {
    grid-template-columns: 1fr;
  }

  .option-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .color-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }

  .step-actions {
    flex-direction: column;
    align-items: center;
  }

  .left-buttons {
    top: 10px;
    left: 10px;
    gap: 10px;
  }

  .left-btn {
    font-size: 0.9rem;
    padding: 10px 16px;
  }
}

@media (max-width: 480px) {
  .pixel-title {
    font-size: 2rem;
  }

  .step-heading {
    font-size: 1.5rem;
  }

  .config-section {
    padding: 15px;
  }

  .summary-section {
    padding: 15px;
  }

  .feature-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .feature-price {
    align-self: flex-end;
  }
}
</style>