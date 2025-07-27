<template>
  <div class="checkout-page">
    <!-- 像素化背景 -->
    <div class="pixel-bg"></div>
    <div class="pixel-overlay"></div>
    
    <!-- 返回按钮 -->
    <div class="header-nav">
      <button @click="goBack" class="back-btn">
        ← 返回商品详情
      </button>
      <button @click="goHome" class="home-btn">
        🏠 返回首页
      </button>
    </div>
    
    <!-- 结算内容 -->
    <div class="checkout-container">
      <h1 class="checkout-title">订单结算</h1>
      
      <!-- 商品信息确认 -->
      <div class="checkout-section">
        <h2 class="section-title">📦 商品信息</h2>
        <div class="product-summary">
          <div class="product-item">
            <img :src="orderData.product.image" :alt="orderData.product.name" class="product-image">
            <div class="product-details">
              <h3 class="product-name">{{ orderData.product.name }}</h3>
              <p class="product-description">{{ orderData.product.description }}</p>
              
              <!-- 款式信息 -->
              <div class="product-variants" v-if="orderData.variants && orderData.variants.length > 0">
                <div v-for="variant in orderData.variants" :key="variant.variantId" class="variant-item">
                  <span class="variant-name">{{ variant.variantName }}</span>
                  <span class="variant-price">¥{{ variant.variantPrice }}</span>
                  <span class="variant-quantity">× {{ variant.quantity }}</span>
                </div>
              </div>
              
              <div class="product-pricing">
                <span class="total-quantity">总数量: {{ orderData.totalQuantity }}</span>
                <span class="total-price">总价: ¥{{ orderData.totalPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 收货地址 -->
      <div class="checkout-section">
        <h2 class="section-title">📍 收货地址</h2>
        <div class="address-section">
          <!-- 地址列表 -->
          <div class="address-list" v-if="addresses.length > 0">
            <div 
              v-for="address in addresses" 
              :key="address.id"
              :class="['address-item', { active: selectedAddressId === address.id }]"
              @click="selectAddress(address.id)"
            >
              <div class="address-header">
                <span class="recipient">{{ address.name }}</span>
                <span class="phone">{{ address.phone }}</span>
                <span v-if="address.isDefault" class="default-tag">默认</span>
              </div>
              <p class="address-detail">{{ address.fullAddress }}</p>
            </div>
          </div>
          
          <!-- 新增地址 -->
          <div class="add-address" v-if="showAddressForm">
            <h3>新增收货地址</h3>
            <form @submit.prevent="addAddress" class="address-form">
              <div class="form-row">
                <input v-model="newAddress.name" placeholder="收货人姓名" required class="form-input">
                <input v-model="newAddress.phone" placeholder="手机号码" required class="form-input">
              </div>
              <div class="form-row">
                <select v-model="newAddress.province" @change="onProvinceChange" required class="form-select">
                  <option value="">选择省份</option>
                  <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
                </select>
                <select v-model="newAddress.city" @change="onCityChange" required class="form-select">
                  <option value="">选择城市</option>
                  <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                </select>
                <select v-model="newAddress.district" required class="form-select">
                  <option value="">选择区县</option>
                  <option v-for="district in districts" :key="district" :value="district">{{ district }}</option>
                </select>
              </div>
              <textarea v-model="newAddress.detail" placeholder="详细地址" required class="form-textarea"></textarea>
              <div class="form-actions">
                <button type="submit" class="pixel-btn save-btn">保存地址</button>
                <button type="button" @click="cancelAddAddress" class="pixel-btn cancel-btn">取消</button>
              </div>
            </form>
          </div>
          
          <button v-if="!showAddressForm" @click="showAddressForm = true" class="pixel-btn add-address-btn">
            ➕ 新增收货地址
          </button>
        </div>
      </div>
      
      <!-- 配送方式 -->
      <div class="checkout-section">
        <h2 class="section-title">🚚 配送方式</h2>
        <div class="delivery-options">
          <div 
            v-for="option in deliveryOptions" 
            :key="option.id"
            :class="['delivery-option', { active: selectedDeliveryId === option.id }]"
            @click="selectDelivery(option.id)"
          >
            <div class="option-header">
              <span class="option-name">{{ option.name }}</span>
              <span class="option-price">{{ option.price === 0 ? '免费' : `¥${option.price}` }}</span>
            </div>
            <p class="option-description">{{ option.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- 支付方式 -->
      <div class="checkout-section">
        <h2 class="section-title">💳 支付方式</h2>
        <div class="payment-methods">
          <div 
            v-for="method in paymentMethods" 
            :key="method.id"
            :class="['payment-method', { active: selectedPaymentId === method.id }]"
            @click="selectPayment(method.id)"
          >
            <div class="method-icon">{{ method.icon }}</div>
            <div class="method-info">
              <span class="method-name">{{ method.name }}</span>
              <p class="method-description">{{ method.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 优惠券 -->
      <div class="checkout-section">
        <h2 class="section-title">🎫 优惠券</h2>
        <div class="coupon-section">
          <div class="coupon-input">
            <input v-model="couponCode" placeholder="请输入优惠券代码" class="form-input">
            <button @click="applyCoupon" class="pixel-btn apply-btn">使用</button>
          </div>
          
          <div v-if="appliedCoupon" class="applied-coupon">
            <span class="coupon-name">{{ appliedCoupon.name }}</span>
            <span class="coupon-discount">-¥{{ appliedCoupon.discount }}</span>
            <button @click="removeCoupon" class="remove-coupon">✕</button>
          </div>
          
          <div class="available-coupons">
            <h4>可用优惠券</h4>
            <div 
              v-for="coupon in availableCoupons" 
              :key="coupon.id"
              class="coupon-item"
              @click="useCoupon(coupon)"
            >
              <div class="coupon-info">
                <span class="coupon-title">{{ coupon.name }}</span>
                <span class="coupon-desc">{{ coupon.description }}</span>
              </div>
              <span class="coupon-value">¥{{ coupon.discount }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 订单备注 -->
      <div class="checkout-section">
        <h2 class="section-title">📝 订单备注</h2>
        <textarea 
          v-model="orderNote" 
          placeholder="请输入订单备注（选填）" 
          class="form-textarea order-note"
        ></textarea>
      </div>
    </div>
    
    <!-- 订单总价和提交 -->
    <div class="order-summary">
      <div class="summary-container">
        <div class="price-breakdown">
          <div class="price-item">
            <span>商品总价</span>
            <span>¥{{ productTotal.toFixed(2) }}</span>
          </div>
          <div class="price-item">
            <span>配送费用</span>
            <span>{{ deliveryFee === 0 ? '免费' : `¥${deliveryFee.toFixed(2)}` }}</span>
          </div>
          <div v-if="appliedCoupon" class="price-item discount">
            <span>优惠券折扣</span>
            <span>-¥{{ appliedCoupon.discount.toFixed(2) }}</span>
          </div>
          <div class="price-item total">
            <span>订单总价</span>
            <span>¥{{ finalTotal.toFixed(2) }}</span>
          </div>
        </div>
        
        <button @click="submitOrder" :disabled="!canSubmit" class="pixel-btn submit-btn">
          💰 确认支付 ¥{{ finalTotal.toFixed(2) }}
        </button>
      </div>
    </div>
    
    <!-- 支付确认弹窗 -->
    <div v-if="showPaymentModal" class="payment-modal">
      <div class="modal-content">
        <h3>确认支付</h3>
        <div class="payment-info">
          <p>支付方式: {{ selectedPaymentMethod?.name }}</p>
          <p>支付金额: ¥{{ finalTotal.toFixed(2) }}</p>
        </div>
        <div class="modal-actions">
          <button @click="confirmPayment" class="pixel-btn confirm-btn">确认支付</button>
          <button @click="cancelPayment" class="pixel-btn cancel-btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 响应式数据
const orderData = ref({
  product: {
    id: 1,
    name: '玫瑰花瓣按摩油',
    description: '天然玫瑰精油，带来浪漫体验',
    price: 199,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop'
  },
  variants: [],
  totalQuantity: 1,
  totalPrice: 199
})

const addresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '138****8888',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '三里屯街道工体北路8号院',
    fullAddress: '北京市北京市朝阳区三里屯街道工体北路8号院',
    isDefault: true
  }
])

const deliveryOptions = ref([
  {
    id: 1,
    name: '标准配送',
    price: 0,
    description: '免费配送，3-5个工作日送达'
  },
  {
    id: 2,
    name: '加急配送',
    price: 15,
    description: '加急处理，1-2个工作日送达'
  },
  {
    id: 3,
    name: '次日达',
    price: 25,
    description: '次日送达，限部分地区'
  }
])

const paymentMethods = ref([
  {
    id: 1,
    name: '微信支付',
    icon: '💚',
    description: '安全便捷的移动支付'
  },
  {
    id: 2,
    name: '支付宝',
    icon: '💙',
    description: '支付宝安全支付'
  },
  {
    id: 3,
    name: '银行卡',
    icon: '💳',
    description: '支持各大银行储蓄卡和信用卡'
  },
  {
    id: 4,
    name: '货到付款',
    icon: '💰',
    description: '收货时现金支付'
  }
])

const availableCoupons = ref([
  {
    id: 1,
    name: '新用户专享',
    description: '满199减20',
    discount: 20,
    minAmount: 199
  },
  {
    id: 2,
    name: '限时优惠',
    description: '满299减50',
    discount: 50,
    minAmount: 299
  }
])

const provinces = ref(['北京市', '上海市', '广东省', '浙江省', '江苏省'])
const cities = ref([])
const districts = ref([])

const selectedAddressId = ref(1)
const selectedDeliveryId = ref(1)
const selectedPaymentId = ref(1)
const showAddressForm = ref(false)
const newAddress = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: ''
})
const couponCode = ref('')
const appliedCoupon = ref(null)
const orderNote = ref('')
const showPaymentModal = ref(false)

// 计算属性
const productTotal = computed(() => {
  return orderData.value.totalPrice || 0
})

const deliveryFee = computed(() => {
  const selectedDelivery = deliveryOptions.value.find(d => d.id === selectedDeliveryId.value)
  return selectedDelivery ? selectedDelivery.price : 0
})

const finalTotal = computed(() => {
  let total = productTotal.value + deliveryFee.value
  if (appliedCoupon.value) {
    total -= appliedCoupon.value.discount
  }
  return Math.max(total, 0)
})

const selectedAddress = computed(() => {
  return addresses.value.find(addr => addr.id === selectedAddressId.value)
})

const selectedPaymentMethod = computed(() => {
  return paymentMethods.value.find(method => method.id === selectedPaymentId.value)
})

const canSubmit = computed(() => {
  return selectedAddressId.value && selectedDeliveryId.value && selectedPaymentId.value
})

// 方法
function loadOrderData() {
  // 从路由参数获取订单数据
  const productId = route.query.productId
  const productName = route.query.productName
  const productImage = route.query.productImage
  const variants = route.query.variants ? JSON.parse(route.query.variants) : []
  const totalQuantity = parseInt(route.query.totalQuantity) || 1
  const totalPrice = parseFloat(route.query.totalPrice) || 0
  
  if (productId) {
    // 更新订单数据
    orderData.value.product.id = productId
    orderData.value.product.name = productName || orderData.value.product.name
    orderData.value.product.image = productImage || orderData.value.product.image
    orderData.value.variants = variants
    orderData.value.totalQuantity = totalQuantity
    orderData.value.totalPrice = totalPrice
  }
}

function selectAddress(addressId) {
  selectedAddressId.value = addressId
}

function selectDelivery(deliveryId) {
  selectedDeliveryId.value = deliveryId
}

function selectPayment(paymentId) {
  selectedPaymentId.value = paymentId
}

function onProvinceChange() {
  // 模拟城市数据
  const cityMap = {
    '北京市': ['北京市'],
    '上海市': ['上海市'],
    '广东省': ['广州市', '深圳市', '珠海市'],
    '浙江省': ['杭州市', '宁波市', '温州市'],
    '江苏省': ['南京市', '苏州市', '无锡市']
  }
  cities.value = cityMap[newAddress.value.province] || []
  newAddress.value.city = ''
  newAddress.value.district = ''
}

function onCityChange() {
  // 模拟区县数据
  districts.value = ['区县1', '区县2', '区县3']
  newAddress.value.district = ''
}

function addAddress() {
  const address = {
    id: Date.now(),
    name: newAddress.value.name,
    phone: newAddress.value.phone,
    province: newAddress.value.province,
    city: newAddress.value.city,
    district: newAddress.value.district,
    detail: newAddress.value.detail,
    fullAddress: `${newAddress.value.province}${newAddress.value.city}${newAddress.value.district}${newAddress.value.detail}`,
    isDefault: addresses.value.length === 0
  }
  
  addresses.value.push(address)
  selectedAddressId.value = address.id
  cancelAddAddress()
}

function cancelAddAddress() {
  showAddressForm.value = false
  newAddress.value = {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: ''
  }
}

function applyCoupon() {
  const coupon = availableCoupons.value.find(c => c.name === couponCode.value)
  if (coupon && productTotal.value >= coupon.minAmount) {
    appliedCoupon.value = coupon
    couponCode.value = ''
    alert('优惠券使用成功！')
  } else {
    alert('优惠券无效或不满足使用条件')
  }
}

function useCoupon(coupon) {
  if (productTotal.value >= coupon.minAmount) {
    appliedCoupon.value = coupon
    alert('优惠券使用成功！')
  } else {
    alert(`订单金额需满¥${coupon.minAmount}才能使用此优惠券`)
  }
}

function removeCoupon() {
  appliedCoupon.value = null
}

function submitOrder() {
  if (!canSubmit.value) {
    alert('请完善订单信息')
    return
  }
  showPaymentModal.value = true
}

function confirmPayment() {
  const orderInfo = {
    product: orderData.value,
    address: selectedAddress.value,
    delivery: deliveryOptions.value.find(d => d.id === selectedDeliveryId.value),
    payment: selectedPaymentMethod.value,
    coupon: appliedCoupon.value,
    note: orderNote.value,
    total: finalTotal.value
  }
  
  console.log('订单信息:', orderInfo)
  
  // 模拟支付处理
  alert('支付成功！订单已提交')
  showPaymentModal.value = false
  
  // 跳转到订单成功页面或首页
  router.push('/')
}

function cancelPayment() {
  showPaymentModal.value = false
}

function goBack() {
  router.go(-1)
}

function goHome() {
  router.push('/')
}

onMounted(() => {
  loadOrderData()
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
.checkout-page {
  min-height: 100vh;
  background: var(--bg-100);
  color: var(--text-100);
  position: relative;
  padding: 20px;
  padding-bottom: 120px;
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
  color: var(--primary-300);
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.3s ease;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.back-btn:hover,
.home-btn:hover {
  background: var(--primary-200);
  color: var(--bg-100);
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.4);
  transform: translateY(-2px);
}

/* 结算容器 */
.checkout-container {
  max-width: 800px;
  margin: 0 auto;
}

.checkout-title {
  font-size: 2.5rem;
  color: var(--primary-300);
  text-align: center;
  margin-bottom: 40px;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 10px rgba(143, 191, 159, 0.3);
}

/* 结算区块 */
.checkout-section {
  background: rgba(235, 226, 205, 0.5);
  border: 2px solid var(--bg-300);
  margin-bottom: 30px;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.1);
}

.section-title {
  color: var(--primary-300);
  font-size: 1.3rem;
  margin-bottom: 20px;
  font-family: 'Courier New', monospace;
  border-bottom: 2px solid var(--bg-300);
  padding-bottom: 10px;
}

/* 商品信息 */
.product-summary {
  background: rgba(235, 226, 205, 0.3);
  border: 1px solid var(--bg-300);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.1);
}

.product-item {
  display: flex;
  gap: 20px;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 2px solid var(--bg-300);
  border-radius: 8px;
}

.product-details {
  flex: 1;
}

.product-name {
  color: var(--primary-300);
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.product-description {
  color: var(--text-200);
  margin-bottom: 10px;
}

.product-variants {
  margin-bottom: 15px;
}

.variant-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 8px 12px;
  margin-bottom: 8px;
  background: var(--bg-200);
  border: 1px solid var(--bg-300);
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(143, 191, 159, 0.1);
}

.variant-name {
  color: var(--primary-300);
  font-weight: bold;
  flex: 1;
}

.variant-price {
  color: var(--accent-100);
  font-weight: bold;
}

.variant-quantity {
  color: var(--text-200);
  font-size: 14px;
}

.product-pricing {
  display: flex;
  gap: 20px;
  align-items: center;
}

.total-quantity {
  color: var(--text-200);
  font-weight: 500;
}

.total-price {
  color: var(--accent-100);
  font-weight: bold;
  font-size: 1.1rem;
}

/* 地址选择 */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.address-item {
  background: rgba(235, 226, 205, 0.3);
  border: 2px solid var(--bg-300);
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.1);
}

.address-item:hover {
  border-color: var(--primary-200);
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
  transform: translateY(-2px);
}

.address-item.active {
  background: rgba(143, 191, 159, 0.15) !important;
  border-color: var(--primary-200) !important;
  box-shadow: 0 6px 16px rgba(143, 191, 159, 0.4) !important;
  transform: translateY(-2px);
  position: relative;
}

.address-item.active::before {
  content: '✓';
  position: absolute;
  top: 10px;
  right: 15px;
  background: var(--primary-200);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(143, 191, 159, 0.4);
}

.address-header {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 5px;
}

.recipient {
  color: var(--primary-300);
  font-weight: bold;
}

.phone {
  color: var(--text-200);
}

.default-tag {
  background: var(--accent-100);
  color: var(--bg-100);
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
}

.address-detail {
  color: var(--text-200);
  margin: 0;
}

/* 表单样式 */
.address-form {
  background: rgba(235, 226, 205, 0.3);
  border: 1px solid var(--bg-300);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.1);
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-input,
.form-select {
  background: var(--bg-100);
  border: 2px solid var(--bg-300);
  color: var(--text-100);
  padding: 10px;
  font-family: 'Courier New', monospace;
  flex: 1;
  border-radius: 4px;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--primary-200);
  outline: none;
  box-shadow: 0 0 8px rgba(143, 191, 159, 0.3);
}

.form-textarea {
  background: var(--bg-100);
  border: 2px solid var(--bg-300);
  color: var(--text-100);
  padding: 10px;
  font-family: 'Courier New', monospace;
  width: 100%;
  min-height: 80px;
  resize: vertical;
  border-radius: 4px;
}

.form-textarea:focus {
  border-color: var(--primary-200);
  outline: none;
  box-shadow: 0 0 8px rgba(143, 191, 159, 0.3);
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

/* 配送方式 */
.delivery-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.delivery-option {
  background: rgba(235, 226, 205, 0.3);
  border: 2px solid var(--bg-300);
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.1);
}

.delivery-option:hover {
  border-color: var(--primary-200);
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
  transform: translateY(-2px);
}

.delivery-option.active {
  background: rgba(241, 143, 1, 0.1) !important;
  border-color: var(--accent-100) !important;
  box-shadow: 0 6px 16px rgba(241, 143, 1, 0.3) !important;
  transform: translateY(-2px);
  position: relative;
}

.delivery-option.active::before {
  content: '🚚';
  position: absolute;
  top: 10px;
  right: 15px;
  background: var(--accent-100);
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(241, 143, 1, 0.4);
}

.delivery-option.active .option-name {
  color: var(--accent-100) !important;
  font-weight: bold;
}

.delivery-option.active .option-price {
  color: var(--accent-200) !important;
  font-weight: bold;
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.option-name {
  color: var(--primary-300);
  font-weight: bold;
}

.option-price {
  color: var(--accent-100);
  font-weight: bold;
}

.option-description {
  color: var(--text-200);
  margin: 0;
  font-size: 14px;
}

/* 支付方式 */
.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.payment-method {
  background: rgba(235, 226, 205, 0.3);
  border: 2px solid var(--bg-300);
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.1);
}

.payment-method:hover {
  border-color: var(--primary-200);
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
  transform: translateY(-3px) scale(1.02);
}

.payment-method.active {
  background: rgba(36, 97, 59, 0.1) !important;
  border-color: var(--primary-300) !important;
  box-shadow: 0 8px 20px rgba(36, 97, 59, 0.3) !important;
  transform: translateY(-3px) scale(1.05);
  position: relative;
}

.payment-method.active::before {
  content: '✓';
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--primary-300);
  color: white;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(36, 97, 59, 0.4);
}

.payment-method.active .method-icon {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.payment-method.active .method-name {
  color: var(--primary-300) !important;
  text-shadow: 0 0 8px rgba(36, 97, 59, 0.3);
}

.payment-method.active .method-description {
  color: var(--primary-200) !important;
}

.method-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.method-name {
  color: var(--primary-300);
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.method-description {
  color: var(--text-200);
  font-size: 12px;
  margin: 0;
}

/* 优惠券 */
.coupon-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.applied-coupon {
  background: rgba(143, 191, 159, 0.1);
  border: 2px solid var(--accent-100);
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.1);
}

.coupon-name {
  color: var(--accent-100);
  font-weight: bold;
}

.coupon-discount {
  color: var(--primary-300);
  font-weight: bold;
}

.remove-coupon {
  background: var(--accent-200);
  border: none;
  color: var(--bg-100);
  cursor: pointer;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 4px;
}

.available-coupons h4 {
  color: var(--primary-300);
  margin-bottom: 10px;
}

.coupon-item {
  background: rgba(235, 226, 205, 0.3);
  border: 2px solid var(--bg-300);
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.1);
}

.coupon-item:hover {
  border-color: var(--primary-200);
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
}

.coupon-title {
  color: var(--primary-300);
  font-weight: bold;
  display: block;
}

.coupon-desc {
  color: var(--text-200);
  font-size: 12px;
}

.coupon-value {
  color: var(--accent-100);
  font-weight: bold;
  font-size: 1.2rem;
}

/* 订单备注 */
.order-note {
  width: 100%;
  min-height: 100px;
}

/* 按钮样式 */
.pixel-btn {
  border: 2px solid;
  padding: 12px 20px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.1);
}

.pixel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-btn,
.apply-btn {
  background: var(--bg-100);
  border-color: var(--accent-100);
  color: var(--accent-100);
}

.save-btn:hover,
.apply-btn:hover {
  background: var(--accent-100);
  color: var(--bg-100);
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
}

.cancel-btn {
  background: var(--bg-100);
  border-color: var(--text-200);
  color: var(--text-200);
}

.cancel-btn:hover {
  background: var(--text-200);
  color: var(--bg-100);
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.2);
}

.add-address-btn {
  background: var(--bg-100);
  border-color: var(--primary-300);
  color: var(--primary-300);
  width: 100%;
}

.add-address-btn:hover {
  background: var(--primary-300);
  color: var(--bg-100);
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.3);
}

/* 订单总价区域 */
.order-summary {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(235, 226, 205, 0.95);
  border-top: 2px solid var(--bg-300);
  padding: 20px;
  z-index: 100;
  box-shadow: 0 -4px 8px rgba(143, 191, 159, 0.2);
}

.summary-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.price-breakdown {
  flex: 1;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: var(--text-200);
}

.price-item.discount {
  color: var(--primary-300);
}

.price-item.total {
  color: var(--accent-100);
  font-weight: bold;
  font-size: 1.2rem;
  border-top: 1px solid var(--bg-300);
  padding-top: 8px;
  margin-top: 8px;
}

.submit-btn {
  background: var(--primary-300);
  border-color: var(--primary-300);
  color: var(--bg-100);
  font-size: 16px;
  padding: 15px 30px;
  white-space: nowrap;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(143, 191, 159, 0.2);
}

.submit-btn:hover:not(:disabled) {
  background: var(--primary-200);
  box-shadow: 0 4px 8px rgba(143, 191, 159, 0.4);
}

/* 支付弹窗 */
.payment-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: #ffffff;
  border: 3px solid var(--primary-300);
  padding: 35px;
  max-width: 450px;
  width: 90%;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal-content::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--primary-200), var(--accent-100), var(--primary-300));
  border-radius: 18px;
  z-index: -1;
}

.modal-content h3 {
  color: var(--primary-300);
  text-align: center;
  margin-bottom: 25px;
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(36, 97, 59, 0.2);
}

.payment-info {
  margin-bottom: 25px;
  background: rgba(143, 191, 159, 0.1);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(143, 191, 159, 0.3);
}

.payment-info p {
  color: var(--text-100);
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-info p:last-child {
  margin-bottom: 0;
  font-weight: bold;
  color: var(--primary-300);
  font-size: 18px;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.modal-actions .pixel-btn.confirm-btn {
  background: #24613b !important;
  border: 2px solid #24613b !important;
  color: #ffffff !important;
  flex: 1;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(36, 97, 59, 0.3);
  font-size: 16px !important;
  font-weight: bold !important;
  padding: 15px 20px;
  transition: all 0.3s ease;
  text-shadow: none !important;
  font-family: 'Courier New', monospace !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  line-height: 1.2 !important;
  display: inline-block !important;
  text-align: center !important;
  opacity: 1 !important;
  visibility: visible !important;
  overflow: visible !important;
  text-indent: 0 !important;
  white-space: nowrap !important;
  position: relative;
}

.modal-actions .pixel-btn.confirm-btn::before {
  content: '确认支付';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  z-index: 10;
  pointer-events: none;
}

.modal-actions .pixel-btn.confirm-btn:hover {
  background: #68a67d !important;
  box-shadow: 0 6px 16px rgba(36, 97, 59, 0.4);
  transform: translateY(-2px);
}

.modal-actions .cancel-btn {
  background: #ffffff;
  border-color: var(--text-200);
  color: var(--text-100);
  flex: 1;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(95, 95, 95, 0.2);
  font-size: 16px;
  font-weight: bold;
  padding: 15px 20px;
  transition: all 0.3s ease;
}

.modal-actions .cancel-btn:hover {
  background: var(--text-200);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(95, 95, 95, 0.3);
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .checkout-page {
    padding: 15px;
    padding-bottom: 140px;
  }
  
  .product-item {
    flex-direction: column;
  }
  
  .product-image {
    width: 100%;
    height: 200px;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .payment-methods {
    grid-template-columns: 1fr;
  }
  
  .summary-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .submit-btn {
    width: 100%;
  }
  
  .product-pricing {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .header-nav {
    flex-direction: column;
  }
  
  .checkout-title {
    font-size: 1.8rem;
  }
  
  .coupon-input {
    flex-direction: column;
  }
}
</style>