<template>
  <div class="admin-products">
    <div class="page-header">
      <h1>{{ $t('admin.products.title') }}</h1>
      <router-link to="/admin/products/add" class="add-btn">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        {{ $t('admin.products.addProduct') }}
      </router-link>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('admin.products.searchPlaceholder')"
          @input="handleSearch"
        />
        <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </div>
      
      <select v-model="selectedCategory" @change="handleCategoryFilter">
        <option value="">{{ $t('admin.products.allCategories') }}</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      
      <select v-model="sortBy" @change="handleSort">
        <option value="name">{{ $t('admin.products.sortByName') }}</option>
        <option value="price">{{ $t('admin.products.sortByPrice') }}</option>
        <option value="stock">{{ $t('admin.products.sortByStock') }}</option>
        <option value="created">{{ $t('admin.products.sortByCreated') }}</option>
      </select>
    </div>

    <!-- 商品列表 -->
    <div v-if="loading" class="loading">
      {{ $t('admin.products.loading') }}
    </div>
    
    <div v-else-if="products.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1z"/>
      </svg>
      <h3>{{ $t('admin.products.noProducts') }}</h3>
      <p>{{ $t('admin.products.noProductsDesc') }}</p>
      <router-link to="/admin/products/add" class="add-first-btn">
        {{ $t('admin.products.addFirstProduct') }}
      </router-link>
    </div>
    
    <div v-else class="products-table">
      <table>
        <thead>
          <tr>
            <th>{{ $t('admin.products.image') }}</th>
            <th>{{ $t('admin.products.name') }}</th>
            <th>{{ $t('admin.products.category') }}</th>
            <th>{{ $t('admin.products.price') }}</th>
            <th>{{ $t('admin.products.stock') }}</th>
            <th>{{ $t('admin.products.status') }}</th>
            <th>{{ $t('admin.products.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td>
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
              </div>
            </td>
            <td>
              <div class="product-info">
                <h4>{{ product.name }}</h4>
                <p>{{ product.description }}</p>
              </div>
            </td>
            <td>
              <span class="category-tag" :style="{ backgroundColor: getCategoryColor(product.category) }">
                {{ getCategoryName(product.category) }}
              </span>
            </td>
            <td>
              <div class="price-info">
                <span class="current-price">¥{{ product.price }}</span>
                <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
              </div>
            </td>
            <td>
              <span class="stock" :class="{ 'low-stock': product.stock < 10 }">
                {{ product.stock }}
              </span>
            </td>
            <td>
              <span class="status" :class="getStatusClass(product)">
                {{ getStatusText(product) }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button @click="editProduct(product)" class="edit-btn" :title="$t('admin.products.edit')">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button @click="toggleProductStatus(product)" class="toggle-btn" :title="product.isActive ? $t('admin.products.deactivate') : $t('admin.products.activate')">
                  <svg v-if="product.isActive" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
                  </svg>
                </button>
                <button @click="deleteProduct(product)" class="delete-btn" :title="$t('admin.products.delete')">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="page-btn"
      >
        ← {{ $t('admin.products.previous') }}
      </button>
      
      <span class="page-info">
        {{ $t('admin.products.pageInfo', { current: currentPage, total: totalPages }) }}
      </span>
      
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        {{ $t('admin.products.next') }} →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { productApi } from '../../api/productApi.js'

const { t: $t } = useI18n()
const router = useRouter()

const loading = ref(true)
const products = ref([])
const categories = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = 10

// 计算属性
const filteredProducts = computed(() => {
  let filtered = [...products.value]
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    )
  }
  
  // 分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value)
  }
  
  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'price':
        return a.price - b.price
      case 'stock':
        return a.stock - b.stock
      case 'created':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      default:
        return a.name.localeCompare(b.name)
    }
  })
  
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// 方法
const loadProducts = async () => {
  try {
    loading.value = true
    const response = await productApi.getProducts()
    if (response.success) {
      // 为每个商品添加状态字段
      products.value = response.data.map(product => ({
        ...product,
        isActive: true,
        createdAt: new Date().toISOString()
      }))
    }
  } catch (error) {
    console.error('加载商品失败:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await productApi.getCategories()
    if (response.success) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : categoryId
}

const getCategoryColor = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.color : '#999'
}

const getStatusClass = (product) => {
  if (!product.isActive) return 'inactive'
  if (product.stock === 0) return 'out-of-stock'
  if (product.stock < 10) return 'low-stock'
  return 'active'
}

const getStatusText = (product) => {
  if (!product.isActive) return $t('admin.products.inactive')
  if (product.stock === 0) return $t('admin.products.outOfStock')
  if (product.stock < 10) return $t('admin.products.lowStock')
  return $t('admin.products.active')
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleCategoryFilter = () => {
  currentPage.value = 1
}

const handleSort = () => {
  currentPage.value = 1
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const editProduct = (product) => {
  router.push(`/admin/products/edit/${product.id}`)
}

const toggleProductStatus = async (product) => {
  try {
    product.isActive = !product.isActive
    // 这里应该调用API更新商品状态
    console.log('切换商品状态:', product.id, product.isActive)
  } catch (error) {
    console.error('更新商品状态失败:', error)
    // 回滚状态
    product.isActive = !product.isActive
  }
}

const deleteProduct = async (product) => {
  if (confirm($t('admin.products.confirmDelete', { name: product.name }))) {
    try {
      // 这里应该调用API删除商品
      const index = products.value.findIndex(p => p.id === product.id)
      if (index > -1) {
        products.value.splice(index, 1)
      }
      console.log('删除商品:', product.id)
    } catch (error) {
      console.error('删除商品失败:', error)
    }
  }
}

onMounted(async () => {
  await Promise.all([
    loadProducts(),
    loadCategories()
  ])
})
</script>

<style scoped>
.admin-products {
  padding: 20px;
  max-width: 1400px;
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
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  text-decoration: none;
  color: white;
}

.add-btn svg {
  width: 20px;
  height: 20px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-box input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #999;
}

.filters select {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 150px;
}

.filters select:focus {
  outline: none;
  border-color: #667eea;
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
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
}

.products-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
}

.products-table table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th {
  background: #f8f9fa;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e1e5e9;
}

.products-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.products-table tr:last-child td {
  border-bottom: none;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.current-price {
  font-weight: 600;
  color: #333;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.stock {
  font-weight: 600;
}

.stock.low-stock {
  color: #f56565;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.active {
  background: #c6f6d5;
  color: #22543d;
}

.status.inactive {
  background: #fed7d7;
  color: #742a2a;
}

.status.out-of-stock {
  background: #fed7d7;
  color: #742a2a;
}

.status.low-stock {
  background: #feebc8;
  color: #7b341e;
}

.actions {
  display: flex;
  gap: 8px;
}

.actions button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.actions button svg {
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

.toggle-btn {
  background: #c6f6d5;
  color: #22543d;
}

.toggle-btn:hover {
  background: #9ae6b4;
}

.delete-btn {
  background: #fed7d7;
  color: #742a2a;
}

.delete-btn:hover {
  background: #feb2b2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.page-btn {
  padding: 8px 16px;
  border: 2px solid #e1e5e9;
  background: white;
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

@media (max-width: 768px) {
  .admin-products {
    padding: 15px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .products-table {
    overflow-x: auto;
  }
  
  .products-table table {
    min-width: 800px;
  }
}
</style>