<template>
  <div class="admin-users">
    <div class="page-header">
      <h1>{{ $t('admin.users.title') }}</h1>
      <div class="header-actions">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('admin.users.searchPlaceholder')"
            @input="handleSearch"
          />
        </div>
        <select v-model="statusFilter" @change="handleFilter" class="status-filter">
          <option value="">{{ $t('admin.users.allStatuses') }}</option>
          <option value="active">{{ $t('admin.users.active') }}</option>
          <option value="inactive">{{ $t('admin.users.inactive') }}</option>
          <option value="banned">{{ $t('admin.users.banned') }}</option>
        </select>
        <button @click="showAddModal = true" class="add-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          {{ $t('admin.users.addUser') }}
        </button>
      </div>
    </div>

    <!-- 用户统计 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2 1l-3.72 5.58L8.5 11.5C8.22 11.19 7.82 11 7.4 11H3v2h3.5l2.47 2.47L7.84 17H5v2h3.5c.4 0 .8-.19 1.06-.5L11 17l3.5 5H20z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ userStats.total }}</h3>
          <p>{{ $t('admin.users.totalUsers') }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ userStats.active }}</h3>
          <p>{{ $t('admin.users.activeUsers') }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon new">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ userStats.newThisMonth }}</h3>
          <p>{{ $t('admin.users.newThisMonth') }}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon orders">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ userStats.avgOrdersPerUser.toFixed(1) }}</h3>
          <p>{{ $t('admin.users.avgOrdersPerUser') }}</p>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div v-if="loading" class="loading">
      {{ $t('admin.users.loading') }}
    </div>
    
    <div v-else-if="filteredUsers.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V3H13V9H19V21Z"/>
      </svg>
      <h3>{{ $t('admin.users.noUsers') }}</h3>
      <p>{{ $t('admin.users.noUsersDesc') }}</p>
    </div>
    
    <div v-else class="users-table">
      <table>
        <thead>
          <tr>
            <th>{{ $t('admin.users.avatar') }}</th>
            <th>{{ $t('admin.users.name') }}</th>
            <th>{{ $t('admin.users.email') }}</th>
            <th>{{ $t('admin.users.phone') }}</th>
            <th>{{ $t('admin.users.status') }}</th>
            <th>{{ $t('admin.users.orders') }}</th>
            <th>{{ $t('admin.users.totalSpent') }}</th>
            <th>{{ $t('admin.users.joinDate') }}</th>
            <th>{{ $t('admin.users.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id" class="user-row">
            <td class="user-avatar">
              <div class="avatar" :style="{ backgroundColor: user.avatarColor }">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
            </td>
            <td class="user-name">
              <div class="name-info">
                <strong>{{ user.name }}</strong>
                <span v-if="user.isVip" class="vip-badge">VIP</span>
              </div>
            </td>
            <td class="user-email">
              {{ user.email }}
            </td>
            <td class="user-phone">
              {{ user.phone || '-' }}
            </td>
            <td class="user-status">
              <span :class="['status-badge', user.status]">
                {{ $t(`admin.users.${user.status}`) }}
              </span>
            </td>
            <td class="user-orders">
              {{ user.orderCount }}
            </td>
            <td class="user-spent">
              ¥{{ user.totalSpent.toLocaleString() }}
            </td>
            <td class="user-date">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="user-actions">
              <button @click="viewUser(user)" class="view-btn" :title="$t('admin.users.view')">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
              <button @click="editUser(user)" class="edit-btn" :title="$t('admin.users.edit')">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
              <select @change="updateUserStatus(user, $event)" :value="user.status" class="status-select">
                <option value="active">{{ $t('admin.users.active') }}</option>
                <option value="inactive">{{ $t('admin.users.inactive') }}</option>
                <option value="banned">{{ $t('admin.users.banned') }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="currentPage = 1" 
        :disabled="currentPage === 1"
        class="page-btn"
      >
        {{ $t('admin.users.first') }}
      </button>
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="page-btn"
      >
        {{ $t('admin.users.previous') }}
      </button>
      
      <span class="page-info">
        {{ $t('admin.users.pageInfo', { current: currentPage, total: totalPages }) }}
      </span>
      
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        {{ $t('admin.users.next') }}
      </button>
      <button 
        @click="currentPage = totalPages" 
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        {{ $t('admin.users.last') }}
      </button>
    </div>

    <!-- 添加/编辑用户模态框 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ showAddModal ? $t('admin.users.addUser') : $t('admin.users.editUser') }}</h2>
          <button @click="closeModals" class="close-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveUser" class="modal-form">
          <div class="form-group">
            <label for="userName">{{ $t('admin.users.name') }}</label>
            <input
              id="userName"
              v-model="userForm.name"
              type="text"
              :placeholder="$t('admin.users.namePlaceholder')"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="userEmail">{{ $t('admin.users.email') }}</label>
            <input
              id="userEmail"
              v-model="userForm.email"
              type="email"
              :placeholder="$t('admin.users.emailPlaceholder')"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="userPhone">{{ $t('admin.users.phone') }}</label>
            <input
              id="userPhone"
              v-model="userForm.phone"
              type="tel"
              :placeholder="$t('admin.users.phonePlaceholder')"
            />
          </div>
          
          <div class="form-group">
            <label for="userStatus">{{ $t('admin.users.status') }}</label>
            <select id="userStatus" v-model="userForm.status" required>
              <option value="active">{{ $t('admin.users.active') }}</option>
              <option value="inactive">{{ $t('admin.users.inactive') }}</option>
              <option value="banned">{{ $t('admin.users.banned') }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="userForm.isVip" />
              <span class="checkmark"></span>
              {{ $t('admin.users.vipUser') }}
            </label>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="cancel-btn">
              {{ $t('admin.users.cancel') }}
            </button>
            <button type="submit" class="save-btn" :disabled="isSaving">
              <span v-if="isSaving">{{ $t('admin.users.saving') }}</span>
              <span v-else>{{ $t('admin.users.save') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 用户详情模态框 -->
    <div v-if="showUserModal" class="modal-overlay" @click="closeUserModal">
      <div class="modal user-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ $t('admin.users.userDetails') }}</h2>
          <button @click="closeUserModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-content" v-if="selectedUser">
          <div class="user-profile">
            <div class="profile-avatar" :style="{ backgroundColor: selectedUser.avatarColor }">
              {{ selectedUser.name.charAt(0).toUpperCase() }}
            </div>
            <div class="profile-info">
              <h3>{{ selectedUser.name }}</h3>
              <p>{{ selectedUser.email }}</p>
              <div class="profile-badges">
                <span :class="['status-badge', selectedUser.status]">
                  {{ $t(`admin.users.${selectedUser.status}`) }}
                </span>
                <span v-if="selectedUser.isVip" class="vip-badge">VIP</span>
              </div>
            </div>
          </div>
          
          <div class="user-stats-grid">
            <div class="stat-item">
              <h4>{{ $t('admin.users.totalOrders') }}</h4>
              <p>{{ selectedUser.orderCount }}</p>
            </div>
            <div class="stat-item">
              <h4>{{ $t('admin.users.totalSpent') }}</h4>
              <p>¥{{ selectedUser.totalSpent.toLocaleString() }}</p>
            </div>
            <div class="stat-item">
              <h4>{{ $t('admin.users.avgOrderValue') }}</h4>
              <p>¥{{ selectedUser.orderCount > 0 ? (selectedUser.totalSpent / selectedUser.orderCount).toFixed(0) : '0' }}</p>
            </div>
            <div class="stat-item">
              <h4>{{ $t('admin.users.joinDate') }}</h4>
              <p>{{ formatDate(selectedUser.createdAt) }}</p>
            </div>
          </div>
          
          <div class="user-details">
            <h4>{{ $t('admin.users.contactInfo') }}</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <strong>{{ $t('admin.users.phone') }}:</strong>
                <span>{{ selectedUser.phone || '-' }}</span>
              </div>
              <div class="detail-item">
                <strong>{{ $t('admin.users.address') }}:</strong>
                <span>{{ selectedUser.address || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const loading = ref(true)
const users = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showAddModal = ref(false)
const showEditModal = ref(false)
const showUserModal = ref(false)
const isSaving = ref(false)
const selectedUser = ref(null)
const editingUser = ref(null)

const userForm = reactive({
  name: '',
  email: '',
  phone: '',
  status: 'active',
  isVip: false
})

// 用户统计
const userStats = computed(() => {
  const stats = {
    total: users.value.length,
    active: 0,
    newThisMonth: 0,
    avgOrdersPerUser: 0
  }
  
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  let totalOrders = 0
  
  users.value.forEach(user => {
    if (user.status === 'active') stats.active++
    if (new Date(user.createdAt) >= thisMonth) stats.newThisMonth++
    totalOrders += user.orderCount
  })
  
  stats.avgOrdersPerUser = stats.total > 0 ? totalOrders / stats.total : 0
  
  return stats
})

// 过滤用户
const filteredUsers = computed(() => {
  let filtered = users.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phone && user.phone.includes(query))
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }
  
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// 分页用户
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage)
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 筛选处理
const handleFilter = () => {
  currentPage.value = 1
}

// 重置表单
const resetForm = () => {
  userForm.name = ''
  userForm.email = ''
  userForm.phone = ''
  userForm.status = 'active'
  userForm.isVip = false
  editingUser.value = null
}

// 关闭模态框
const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetForm()
}

// 关闭用户详情模态框
const closeUserModal = () => {
  showUserModal.value = false
  selectedUser.value = null
}

// 查看用户详情
const viewUser = (user) => {
  selectedUser.value = user
  showUserModal.value = true
}

// 编辑用户
const editUser = (user) => {
  editingUser.value = user
  userForm.name = user.name
  userForm.email = user.email
  userForm.phone = user.phone || ''
  userForm.status = user.status
  userForm.isVip = user.isVip
  showEditModal.value = true
}

// 保存用户
const saveUser = async () => {
  try {
    isSaving.value = true
    
    if (showAddModal.value) {
      // 添加新用户
      const newUser = {
        id: `user-${Date.now()}`,
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        status: userForm.status,
        isVip: userForm.isVip,
        orderCount: 0,
        totalSpent: 0,
        avatarColor: getRandomColor(),
        address: '',
        createdAt: new Date().toISOString()
      }
      
      // 检查邮箱是否已存在
      if (users.value.find(user => user.email === newUser.email)) {
        alert($t('admin.users.emailExists'))
        return
      }
      
      users.value.push(newUser)
      console.log('添加用户:', newUser)
    } else {
      // 编辑现有用户
      const index = users.value.findIndex(user => user.id === editingUser.value.id)
      if (index > -1) {
        users.value[index] = {
          ...users.value[index],
          name: userForm.name,
          email: userForm.email,
          phone: userForm.phone,
          status: userForm.status,
          isVip: userForm.isVip
        }
        console.log('更新用户:', users.value[index])
      }
    }
    
    closeModals()
  } catch (error) {
    console.error('保存用户失败:', error)
  } finally {
    isSaving.value = false
  }
}

// 更新用户状态
const updateUserStatus = (user, event) => {
  const newStatus = event.target.value
  const userIndex = users.value.findIndex(u => u.id === user.id)
  if (userIndex > -1) {
    users.value[userIndex].status = newStatus
    console.log(`用户 ${user.name} 状态更新为: ${newStatus}`)
  }
}

// 获取随机颜色
const getRandomColor = () => {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 生成模拟用户数据
const generateMockUsers = () => {
  const names = [
    '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
    '郑十一', '王十二', '冯十三', '陈十四', '褚十五', '卫十六', '蒋十七', '沈十八'
  ]
  
  const domains = ['qq.com', '163.com', 'gmail.com', 'hotmail.com', 'sina.com']
  const statuses = ['active', 'inactive', 'banned']
  
  const mockUsers = []
  
  for (let i = 0; i < 50; i++) {
    const name = names[i % names.length] + (i > names.length - 1 ? i : '')
    const email = `${name.toLowerCase().replace(/[^a-z]/g, '')}${i}@${domains[Math.floor(Math.random() * domains.length)]}`
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const orderCount = Math.floor(Math.random() * 20)
    const totalSpent = orderCount * (Math.floor(Math.random() * 500) + 100)
    
    mockUsers.push({
      id: `user-${i + 1}`,
      name: name,
      email: email,
      phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      status: status,
      isVip: Math.random() > 0.8,
      orderCount: orderCount,
      totalSpent: totalSpent,
      avatarColor: getRandomColor(),
      address: `北京市朝阳区某某街道${i + 1}号`,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return mockUsers
}

// 加载用户数据
const loadUsers = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    users.value = generateMockUsers()
  } catch (error) {
    console.error('加载用户失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.admin-users {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.page-header h1 {
  color: #333;
  margin: 0;
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
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: #666;
  z-index: 1;
}

.search-box input {
  padding: 10px 12px 10px 40px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  width: 250px;
  transition: border-color 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
}

.status-filter {
  padding: 10px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.add-btn svg {
  width: 20px;
  height: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.new {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.stat-icon.orders {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-content h3 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.stat-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 20px;
}

.empty-state p {
  color: #666;
  margin: 0;
}

.users-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.users-table table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #f8f9fa;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e1e5e9;
  font-size: 14px;
}

.users-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
}

.user-row:hover {
  background: #f8f9fa;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.name-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-info strong {
  color: #333;
}

.vip-badge {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.user-email {
  color: #666;
  font-size: 14px;
}

.user-phone {
  color: #666;
  font-size: 14px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #f3f4f6;
  color: #374151;
}

.status-badge.banned {
  background: #fee2e2;
  color: #991b1b;
}

.user-orders {
  color: #333;
  font-weight: 500;
}

.user-spent {
  color: #333;
  font-weight: 600;
}

.user-date {
  color: #666;
  font-size: 13px;
}

.user-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.view-btn, .edit-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #e2e8f0;
  color: #4a5568;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.view-btn:hover, .edit-btn:hover {
  background: #cbd5e0;
}

.view-btn svg, .edit-btn svg {
  width: 16px;
  height: 16px;
}

.status-select {
  padding: 4px 8px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  font-size: 12px;
  background: white;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.page-btn {
  padding: 8px 16px;
  border: 2px solid #e1e5e9;
  background: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 14px;
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
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.user-modal {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e9ecef;
}

.close-btn svg {
  width: 18px;
  height: 18px;
  color: #666;
}

.modal-form {
  padding: 0 24px 24px 24px;
}

.modal-content {
  padding: 0 24px 24px 24px;
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

.form-group input, .form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-btn {
  padding: 10px 20px;
  border: 2px solid #e1e5e9;
  background: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  border-color: #cbd5e0;
  color: #4a5568;
}

.save-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.2s ease;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 32px;
}

.profile-info h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 24px;
}

.profile-info p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 16px;
}

.profile-badges {
  display: flex;
  gap: 8px;
}

.user-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item h4 {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.stat-item p {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.user-details h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f4;
}

.detail-item strong {
  color: #333;
}

.detail-item span {
  color: #666;
}

@media (max-width: 768px) {
  .admin-users {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .users-table {
    overflow-x: auto;
  }
  
  .users-table table {
    min-width: 1000px;
  }
  
  .user-profile {
    flex-direction: column;
    text-align: center;
  }
  
  .user-stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    margin: 0;
    border-radius: 0;
    height: 100vh;
    max-height: none;
  }
}
</style>