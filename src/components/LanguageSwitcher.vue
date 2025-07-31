<template>
  <div class="language-switcher">
    <button 
      class="lang-btn" 
      :class="{ active: locale === 'en' }"
      @click="switchLanguage('en')"
    >
      EN
    </button>
    <button 
      class="lang-btn" 
      :class="{ active: locale === 'zh' }"
      @click="switchLanguage('zh')"
    >
      中文
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const switchLanguage = (lang: string) => {
  locale.value = lang
  // 保存到本地存储
  localStorage.setItem('language', lang)
}

// 页面加载时从本地存储读取语言设置
const savedLanguage = localStorage.getItem('language')
if (savedLanguage) {
  locale.value = savedLanguage
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 8px;
  align-items: center;
}

.lang-btn {
  padding: 6px 12px;
  border: 2px solid #333;
  background: transparent;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.lang-btn:hover {
  background: #333;
  color: white;
}

.lang-btn.active {
  background: #333;
  color: white;
}

/* 像素风格适配 */
@media (max-width: 768px) {
  .lang-btn {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>