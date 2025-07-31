<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>{{ $t('admin.login.title') }}</h1>
          <p>{{ $t('admin.login.subtitle') }}</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">{{ $t('admin.login.username') }}</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              :placeholder="$t('admin.login.usernamePlaceholder')"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">{{ $t('admin.login.password') }}</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              :placeholder="$t('admin.login.passwordPlaceholder')"
              required
            />
          </div>
          
          <div class="form-group remember-me">
            <label class="checkbox-label">
              <input
                v-model="loginForm.rememberMe"
                type="checkbox"
              />
              <span class="checkmark"></span>
              {{ $t('admin.login.rememberMe') }}
            </label>
          </div>
          
          <button
            type="submit"
            class="login-btn"
            :disabled="isLoading"
          >
            <span v-if="isLoading">{{ $t('admin.login.loggingIn') }}</span>
            <span v-else>{{ $t('admin.login.loginButton') }}</span>
          </button>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
        
        <div class="login-footer">
          <p>{{ $t('admin.login.demoHint') }}</p>
          <small>{{ $t('admin.login.demoCredentials') }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t: $t } = useI18n()

const isLoading = ref(false)
const errorMessage = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 模拟登录验证
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 简单的演示登录验证
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      // 保存登录状态
      localStorage.setItem('adminToken', 'demo-token-' + Date.now())
      localStorage.setItem('adminUser', JSON.stringify({
        id: 1,
        username: 'admin',
        name: '管理员',
        role: 'admin'
      }))
      
      // 跳转到管理后台首页
      router.push('/admin/dashboard')
    } else {
      errorMessage.value = $t('admin.login.invalidCredentials')
    }
  } catch (error) {
    errorMessage.value = $t('admin.login.loginError')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-group input[type="text"],
.form-group input[type="password"] {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input[type="text"]:focus,
.form-group input[type="password"]:focus {
  outline: none;
  border-color: #667eea;
}

.remember-me {
  margin-bottom: 30px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 8px;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  margin-top: 15px;
  padding: 12px;
  background: #fee;
  color: #c33;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}

.login-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.login-footer p {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
}

.login-footer small {
  color: #999;
  font-size: 12px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
}
</style>