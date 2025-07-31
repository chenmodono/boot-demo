<template>
  <div class="admin-categories">
    <div class="page-header">
      <h1>{{ $t('admin.categories.title') }}</h1>
      <button @click="showAddModal = true" class="add-btn">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        {{ $t('admin.categories.addCategory') }}
      </button>
    </div>

    <!-- 分类列表 -->
    <div v-if="loading" class="loading">
      {{ $t('admin.categories.loading') }}
    </div>
    
    <div v-else-if="categories.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      <h3>{{ $t('admin.categories.noCategories') }}</h3>
      <p>{{ $t('admin.categories.noCategoriesDesc') }}</p>
      <button @click="showAddModal = true" class="add-first-btn">
        {{ $t('admin.categories.addFirstCategory') }}
      </button>
    </div>
    
    <div v-else class="categories-grid">
      <div v-for="category in categories" :key="category.id" class="category-card">
        <div class="category-color" :style="{ backgroundColor: category.color }"></div>
        <div class="category-content">
          <h3>{{ category.name }}</h3>
          <p>{{ $t('admin.categories.categoryId') }}: {{ category.id }}</p>
          <div class="category-stats">
            <span>{{ getProductCount(category.id) }} {{ $t('admin.categories.products') }}</span>
          </div>
        </div>
        <div class="category-actions">
          <button @click="editCategory(category)" class="edit-btn" :title="$t('admin.categories.edit')">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
          <button @click="deleteCategory(category)" class="delete-btn" :title="$t('admin.categories.delete')">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑分类模态框 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ showAddModal ? $t('admin.categories.addCategory') : $t('admin.categories.editCategory') }}</h2>
          <button @click="closeModals" class="close-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveCategory" class="modal-form">
          <div class="form-group">
            <label for="categoryId">{{ $t('admin.categories.categoryId') }}</label>
            <input
              id="categoryId"
              v-model="categoryForm.id"
              type="text"
              :placeholder="$t('admin.categories.categoryIdPlaceholder')"
              :disabled="showEditModal"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="categoryName">{{ $t('admin.categories.categoryName') }}</label>
            <input
              id="categoryName"
              v-model="categoryForm.name"
              type="text"
              :placeholder="$t('admin.categories.categoryNamePlaceholder')"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="categoryColor">{{ $t('admin.categories.categoryColor') }}</label>
            <div class="color-input-group">
              <input
                id="categoryColor"
                v-model="categoryForm.color"
                type="color"
                class="color-picker"
              />
              <input
                v-model="categoryForm.color"
                type="text"
                class="color-text"
                :placeholder="$t('admin.categories.colorPlaceholder')"
              />
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="cancel-btn">
              {{ $t('admin.categories.cancel') }}
            </button>
            <button type="submit" class="save-btn" :disabled="isSaving">
              <span v-if="isSaving">{{ $t('admin.categories.saving') }}</span>
              <span v-else>{{ $t('admin.categories.save') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { productApi } from '../../api/productApi.js'

const { t: $t } = useI18n()

const loading = ref(true)
const categories = ref([])
const products = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const isSaving = ref(false)
const editingCategory = ref(null)

const categoryForm = reactive({
  id: '',
  name: '',
  color: '#667eea'
})

// 获取分类下的商品数量
const getProductCount = (categoryId) => {
  return products.value.filter(product => product.category === categoryId).length
}

// 加载分类数据
const loadCategories = async () => {
  try {
    loading.value = true
    const response = await productApi.getCategories()
    if (response.success) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载商品数据（用于统计）
const loadProducts = async () => {
  try {
    const response = await productApi.getProducts()
    if (response.success) {
      products.value = response.data
    }
  } catch (error) {
    console.error('加载商品失败:', error)
  }
}

// 重置表单
const resetForm = () => {
  categoryForm.id = ''
  categoryForm.name = ''
  categoryForm.color = '#667eea'
  editingCategory.value = null
}

// 关闭模态框
const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  resetForm()
}

// 编辑分类
const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.id = category.id
  categoryForm.name = category.name
  categoryForm.color = category.color
  showEditModal.value = true
}

// 保存分类
const saveCategory = async () => {
  try {
    isSaving.value = true
    
    if (showAddModal.value) {
      // 添加新分类
      const newCategory = {
        id: categoryForm.id,
        name: categoryForm.name,
        color: categoryForm.color
      }
      
      // 检查ID是否已存在
      if (categories.value.find(cat => cat.id === newCategory.id)) {
        alert($t('admin.categories.idExists'))
        return
      }
      
      categories.value.push(newCategory)
      console.log('添加分类:', newCategory)
    } else {
      // 编辑现有分类
      const index = categories.value.findIndex(cat => cat.id === editingCategory.value.id)
      if (index > -1) {
        categories.value[index] = {
          ...categories.value[index],
          name: categoryForm.name,
          color: categoryForm.color
        }
        console.log('更新分类:', categories.value[index])
      }
    }
    
    closeModals()
  } catch (error) {
    console.error('保存分类失败:', error)
  } finally {
    isSaving.value = false
  }
}

// 删除分类
const deleteCategory = async (category) => {
  const productCount = getProductCount(category.id)
  
  if (productCount > 0) {
    alert($t('admin.categories.cannotDeleteWithProducts', { count: productCount }))
    return
  }
  
  if (confirm($t('admin.categories.confirmDelete', { name: category.name }))) {
    try {
      const index = categories.value.findIndex(cat => cat.id === category.id)
      if (index > -1) {
        categories.value.splice(index, 1)
        console.log('删除分类:', category.id)
      }
    } catch (error) {
      console.error('删除分类失败:', error)
    }
  }
}

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadProducts()
  ])
})
</script>

<style scoped>
.admin-categories {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #333;
  margin: 0;
  font-size: 28px;
  font-weight: 600;
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
  margin: 0 0 24px 0;
}

.add-first-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.category-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.category-color {
  height: 8px;
  width: 100%;
}

.category-content {
  padding: 20px;
}

.category-content h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.category-content p {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
}

.category-stats {
  margin-bottom: 16px;
}

.category-stats span {
  display: inline-block;
  background: #f8f9fa;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.category-actions {
  display: flex;
  gap: 8px;
  padding: 0 20px 20px 20px;
}

.category-actions button {
  flex: 1;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.category-actions button svg {
  width: 16px;
  height: 16px;
}

.edit-btn {
  background: #e2e8f0;
  color: #4a5568;
}

.edit-btn:hover {
  background: #cbd5e0;
}

.delete-btn {
  background: #fed7d7;
  color: #742a2a;
}

.delete-btn:hover {
  background: #feb2b2;
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

.form-group input[type="text"] {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input[type="text"]:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input[type="text"]:disabled {
  background: #f8f9fa;
  color: #666;
}

.color-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.color-picker {
  width: 60px;
  height: 44px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  background: none;
}

.color-text {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  font-family: monospace;
}

.color-text:focus {
  outline: none;
  border-color: #667eea;
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

@media (max-width: 768px) {
  .admin-categories {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .categories-grid {
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