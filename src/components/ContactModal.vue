<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">{{ $t('contact.title') }}</h3>
        <p class="modal-subtitle">{{ $t('contact.subtitle') }}</p>
        <button class="close-btn" @click="closeModal">
          <span>&times;</span>
        </button>
      </div>
      
      <div class="modal-body">
        <!-- 切换按钮 -->
        <div class="tab-buttons">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'wechat' }"
            @click="switchTab('wechat')"
          >
            {{ $t('contact.wechatService') }}
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'gongzhonghao' }"
            @click="switchTab('gongzhonghao')"
          >
            {{ $t('contact.xiaohongshu') }}
          </button>
        </div>
        
        <!-- 二维码卡片 -->
        <div class="qr-card">
          <div class="qr-code">
            <img 
              :src="activeTab === 'wechat' ? '/wechat-qr.png' : '/douyin-qr.png'" 
              :alt="activeTab === 'wechat' ? $t('contact.wechatQR') : $t('contact.xiaohongshuQR')" 
              class="qr-image" 
            />
          </div>
          <div class="contact-info">
            <p class="contact-id">
              <strong>{{ activeTab === 'wechat' ? $t('contact.wechatId') : $t('contact.xiaohongshuId') }}</strong>{{ activeTab === 'wechat' ? 'zdw2458' : '5552458aa' }}
            </p>
            <p class="service-time-info">
              <strong>{{ $t('contact.serviceTime') }}</strong>9:00-21:00
            </p>
            <p class="service-content">
              <strong>{{ $t('contact.serviceContent') }}</strong>{{ $t('contact.serviceContentText') }}
            </p>
          </div>
        </div>
        

      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// 当前激活的标签页
const activeTab = ref('wechat')

// 切换标签页
const switchTab = (tab) => {
  activeTab.value = tab
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(6px);
}

.modal-content {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  z-index: 10000;
}

.modal-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #ffffff;
  position: relative;
}

.modal-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  text-align: center;
}

.modal-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  text-align: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: absolute;
  right: 15px;
  top: 15px;
}

.close-btn:hover {
  background: #8fbf9f;
  color: #ffffff;
  transform: scale(1.1);
}

.modal-body {
  padding: 24px;
}

/* 切换按钮样式 */
.tab-buttons {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-bottom: 20px;
  border-radius: 25px;
  overflow: hidden;
  background: #f0f0f0;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 10px 20px;
  background: transparent;
  border: none;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 20px;
  margin: 0 2px;
}

.tab-btn.active {
  background: #6c5ce7;
  color: #ffffff;
  font-weight: 600;
}

.tab-btn:hover:not(.active) {
  background: #e0e0e0;
  color: #333;
}

/* 二维码卡片样式 */
.qr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  margin-bottom: 20px;
}

.qr-code {
  margin-bottom: 15px;
}

.qr-image {
  width: 160px;
  height: 160px;
  border-radius: 8px;
  background: #fff;
}

.contact-info {
  text-align: center;
  width: 100%;
}

.contact-id {
  font-size: 0.9rem;
  color: #666;
  margin: 8px 0;
}

.service-time {
  font-size: 0.9rem;
  color: #666;
  margin: 8px 0;
}

.service-content {
  font-size: 0.9rem;
  color: #666;
  margin: 8px 0;
  line-height: 1.4;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px auto;
    max-height: 90vh;
    max-width: 350px;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-title {
    font-size: 1.2rem;
  }
  
  .modal-subtitle {
    font-size: 0.8rem;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .tab-buttons {
    margin-bottom: 16px;
  }
  
  .tab-btn {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
  
  .qr-card {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .qr-image {
    width: 140px;
    height: 140px;
  }
  
  .contact-id,
  .service-time,
  .service-content {
    font-size: 0.8rem;
  }
  
  .close-btn {
    width: 20px;
    height: 20px;
    font-size: 1.2rem;
    right: 12px;
    top: 12px;
  }
}
</style>