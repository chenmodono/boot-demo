<template>
  <div class="admin-settings">
    <div class="page-header">
      <h1>{{ $t('admin.settings.title') }}</h1>
    </div>

    <div class="settings-container">
      <!-- 基本设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2>{{ $t('admin.settings.basicSettings') }}</h2>
          <p>{{ $t('admin.settings.basicSettingsDesc') }}</p>
        </div>
        
        <div class="settings-form">
          <div class="form-group">
            <label>{{ $t('admin.settings.siteName') }}</label>
            <input v-model="settings.siteName" type="text" class="form-input">
          </div>
          
          <div class="form-group">
            <label>{{ $t('admin.settings.siteDescription') }}</label>
            <textarea v-model="settings.siteDescription" class="form-textarea" rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label>{{ $t('admin.settings.contactEmail') }}</label>
            <input v-model="settings.contactEmail" type="email" class="form-input">
          </div>
          
          <div class="form-group">
            <label>{{ $t('admin.settings.contactPhone') }}</label>
            <input v-model="settings.contactPhone" type="tel" class="form-input">
          </div>
        </div>
      </div>

      <!-- 商店设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2>{{ $t('admin.settings.storeSettings') }}</h2>
          <p>{{ $t('admin.settings.storeSettingsDesc') }}</p>
        </div>
        
        <div class="settings-form">
          <div class="form-group">
            <label>{{ $t('admin.settings.currency') }}</label>
            <select v-model="settings.currency" class="form-select">
              <option value="CNY">人民币 (¥)</option>
              <option value="USD">美元 ($)</option>
              <option value="EUR">欧元 (€)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>{{ $t('admin.settings.taxRate') }}</label>
            <input v-model.number="settings.taxRate" type="number" step="0.01" min="0" max="1" class="form-input">
            <small>{{ $t('admin.settings.taxRateDesc') }}</small>
          </div>
          
          <div class="form-group">
            <label>{{ $t('admin.settings.shippingFee') }}</label>
            <input v-model.number="settings.shippingFee" type="number" step="0.01" min="0" class="form-input">
          </div>
          
          <div class="form-group">
            <label>{{ $t('admin.settings.freeShippingThreshold') }}</label>
            <input v-model.number="settings.freeShippingThreshold" type="number" step="0.01" min="0" class="form-input">
          </div>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2>{{ $t('admin.settings.notificationSettings') }}</h2>
          <p>{{ $t('admin.settings.notificationSettingsDesc') }}</p>
        </div>
        
        <div class="settings-form">
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="settings.emailNotifications.newOrder" type="checkbox" class="checkbox">
              <span class="checkmark"></span>
              {{ $t('admin.settings.newOrderEmail') }}
            </label>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="settings.emailNotifications.lowStock" type="checkbox" class="checkbox">
              <span class="checkmark"></span>
              {{ $t('admin.settings.lowStockEmail') }}
            </label>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="settings.emailNotifications.newReview" type="checkbox" class="checkbox">
              <span class="checkmark"></span>
              {{ $t('admin.settings.newReviewEmail') }}
            </label>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="settings.emailNotifications.newUser" type="checkbox" class="checkbox">
              <span class="checkmark"></span>
              {{ $t('admin.settings.newUserEmail') }}
            </label>
          </div>
        </div>
      </div>

      <!-- 安全设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2>{{ $t('admin.settings.securitySettings') }}</h2>
          <p>{{ $t('admin.settings.securitySettingsDesc') }}</p>
        </div>
        
        <div class="settings-form">
          <div class="form-group">
            <label>{{ $t('admin.settings.sessionTimeout') }}</label>
            <select v-model="settings.sessionTimeout" class="form-select">
              <option value="30">30 {{ $t('admin.settings.minutes') }}</option>
              <option value="60">1 {{ $t('admin.settings.hour') }}</option>
              <option value="120">2 {{ $t('admin.settings.hours') }}</option>
              <option value="480">8 {{ $t('admin.settings.hours') }}</option>
            </select>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="settings.twoFactorAuth" type="checkbox" class="checkbox">
              <span class="checkmark"></span>
              {{ $t('admin.settings.enableTwoFactor') }}
            </label>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="settings.loginAttemptLimit" type="checkbox" class="checkbox">
              <span class="checkmark"></span>
              {{ $t('admin.settings.limitLoginAttempts') }}
            </label>
          </div>
        </div>
      </div>

      <!-- 系统维护 -->
      <div class="settings-section">
        <div class="section-header">
          <h2>{{ $t('admin.settings.systemMaintenance') }}</h2>
          <p>{{ $t('admin.settings.systemMaintenanceDesc') }}</p>
        </div>
        
        <div class="maintenance-actions">
          <div class="action-card">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div class="action-content">
              <h3>{{ $t('admin.settings.clearCache') }}</h3>
              <p>{{ $t('admin.settings.clearCacheDesc') }}</p>
              <button @click="clearCache" class="btn btn-secondary">
                {{ $t('admin.settings.clearCacheBtn') }}
              </button>
            </div>
          </div>
          
          <div class="action-card">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              </svg>
            </div>
            <div class="action-content">
              <h3>{{ $t('admin.settings.exportData') }}</h3>
              <p>{{ $t('admin.settings.exportDataDesc') }}</p>
              <button @click="exportData" class="btn btn-secondary">
                {{ $t('admin.settings.exportDataBtn') }}
              </button>
            </div>
          </div>
          
          <div class="action-card">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <div class="action-content">
              <h3>{{ $t('admin.settings.systemCheck') }}</h3>
              <p>{{ $t('admin.settings.systemCheckDesc') }}</p>
              <button @click="runSystemCheck" class="btn btn-secondary">
                {{ $t('admin.settings.systemCheckBtn') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="save-section">
        <button @click="saveSettings" class="btn btn-primary" :disabled="saving">
          <span v-if="saving">{{ $t('admin.settings.saving') }}...</span>
          <span v-else>{{ $t('admin.settings.saveSettings') }}</span>
        </button>
        <button @click="resetSettings" class="btn btn-secondary">
          {{ $t('admin.settings.resetToDefault') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

interface Settings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  currency: string
  taxRate: number
  shippingFee: number
  freeShippingThreshold: number
  emailNotifications: {
    newOrder: boolean
    lowStock: boolean
    newReview: boolean
    newUser: boolean
  }
  sessionTimeout: number
  twoFactorAuth: boolean
  loginAttemptLimit: boolean
}

const saving = ref(false)

const settings = ref<Settings>({
  siteName: '成人用品商城',
  siteDescription: '专业的成人用品在线商城，提供优质的产品和服务',
  contactEmail: 'contact@example.com',
  contactPhone: '+86 400-123-4567',
  currency: 'CNY',
  taxRate: 0.13,
  shippingFee: 15.00,
  freeShippingThreshold: 299.00,
  emailNotifications: {
    newOrder: true,
    lowStock: true,
    newReview: false,
    newUser: false
  },
  sessionTimeout: 60,
  twoFactorAuth: false,
  loginAttemptLimit: true
})

const defaultSettings: Settings = {
  siteName: '成人用品商城',
  siteDescription: '专业的成人用品在线商城，提供优质的产品和服务',
  contactEmail: 'contact@example.com',
  contactPhone: '+86 400-123-4567',
  currency: 'CNY',
  taxRate: 0.13,
  shippingFee: 15.00,
  freeShippingThreshold: 299.00,
  emailNotifications: {
    newOrder: true,
    lowStock: true,
    newReview: false,
    newUser: false
  },
  sessionTimeout: 60,
  twoFactorAuth: false,
  loginAttemptLimit: true
}

// 保存设置
const saveSettings = async () => {
  saving.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    localStorage.setItem('adminSettings', JSON.stringify(settings.value))
    alert('设置已保存成功！')
  } catch (error) {
    alert('保存设置失败，请重试')
  } finally {
    saving.value = false
  }
}

// 重置设置
const resetSettings = () => {
  if (confirm('确定要重置所有设置到默认值吗？')) {
    settings.value = { ...defaultSettings }
  }
}

// 清除缓存
const clearCache = async () => {
  if (confirm('确定要清除系统缓存吗？')) {
    try {
      // 模拟清除缓存
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('缓存已清除成功！')
    } catch (error) {
      alert('清除缓存失败，请重试')
    }
  }
}

// 导出数据
const exportData = async () => {
  try {
    // 模拟导出数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    const data = {
      settings: settings.value,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    alert('数据导出成功！')
  } catch (error) {
    alert('导出数据失败，请重试')
  }
}

// 系统检查
const runSystemCheck = async () => {
  try {
    // 模拟系统检查
    await new Promise(resolve => setTimeout(resolve, 2000))
    const results = [
      '✓ 数据库连接正常',
      '✓ 文件系统权限正常',
      '✓ 缓存系统运行正常',
      '✓ 邮件服务配置正常',
      '✓ 支付接口连接正常'
    ]
    alert('系统检查完成：\n\n' + results.join('\n'))
  } catch (error) {
    alert('系统检查失败，请重试')
  }
}

// 加载设置
const loadSettings = () => {
  const saved = localStorage.getItem('adminSettings')
  if (saved) {
    try {
      settings.value = { ...defaultSettings, ...JSON.parse(saved) }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.admin-settings {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0;
  color: #1a1a1a;
  font-size: 28px;
  font-weight: 600;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.settings-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.section-header h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.section-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.settings-form {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-input,
.form-textarea,
.form-select {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group small {
  color: #6b7280;
  font-size: 12px;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox:checked + .checkmark {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.maintenance-actions {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s;
}

.action-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 48px;
  height: 48px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  flex-shrink: 0;
}

.action-icon svg {
  width: 24px;
  height: 24px;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.action-content p {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.save-section {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .admin-settings {
    padding: 16px;
  }
  
  .settings-form {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .maintenance-actions {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .action-card {
    flex-direction: column;
    text-align: center;
  }
  
  .save-section {
    flex-direction: column;
    padding: 16px;
  }
  
  .btn {
    justify-content: center;
  }
}
</style>