// 模拟API服务 - 商品相关接口
import productsData from '../data/products.json'

// 模拟网络延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟API响应格式
const createResponse = (data, success = true, message = '') => {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString()
  }
}

// 商品API服务
export const productApi = {
  // 获取所有商品列表
  async getProducts(params = {}) {
    await delay(300) // 模拟网络延迟
    
    try {
      let products = [...productsData.products]
      
      // 分类筛选
      if (params.category && params.category.length > 0) {
        products = products.filter(product => 
          params.category.includes(product.category)
        )
      }
      
      // 搜索筛选
      if (params.search) {
        const searchTerm = params.search.toLowerCase()
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        )
      }
      
      // 价格范围筛选
      if (params.minPrice !== undefined) {
        products = products.filter(product => product.price >= params.minPrice)
      }
      if (params.maxPrice !== undefined) {
        products = products.filter(product => product.price <= params.maxPrice)
      }
      
      // 排序
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'price-low':
            products.sort((a, b) => a.price - b.price)
            break
          case 'price-high':
            products.sort((a, b) => b.price - a.price)
            break
          case 'rating':
            products.sort((a, b) => b.rating - a.rating)
            break
          case 'reviews':
            products.sort((a, b) => b.reviews - a.reviews)
            break
          case 'name':
          default:
            products.sort((a, b) => a.name.localeCompare(b.name))
            break
        }
      }
      
      // 分页
      const page = params.page || 1
      const limit = params.limit || 12
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      
      const paginatedProducts = products.slice(startIndex, endIndex)
      
      return createResponse({
        products: paginatedProducts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(products.length / limit),
          totalItems: products.length,
          itemsPerPage: limit,
          hasNextPage: endIndex < products.length,
          hasPrevPage: page > 1
        }
      })
    } catch (error) {
      return createResponse(null, false, '获取商品列表失败')
    }
  },
  
  // 根据ID获取商品详情
  async getProductById(id) {
    await delay(400) // 模拟网络延迟
    
    try {
      const product = productsData.products.find(p => p.id === parseInt(id))
      
      if (!product) {
        return createResponse(null, false, '商品不存在')
      }
      
      return createResponse(product)
    } catch (error) {
      return createResponse(null, false, '获取商品详情失败')
    }
  },
  
  // 获取相关推荐商品
  async getRelatedProducts(productId, limit = 4) {
    await delay(200)
    
    try {
      const currentProduct = productsData.products.find(p => p.id === parseInt(productId))
      if (!currentProduct) {
        return createResponse([], false, '商品不存在')
      }
      
      // 获取同类别的其他商品作为推荐
      let relatedProducts = productsData.products
        .filter(p => p.id !== parseInt(productId) && p.category === currentProduct.category)
        .slice(0, limit)
      
      // 如果同类别商品不足，补充其他商品
      if (relatedProducts.length < limit) {
        const additionalProducts = productsData.products
          .filter(p => p.id !== parseInt(productId) && p.category !== currentProduct.category)
          .slice(0, limit - relatedProducts.length)
        relatedProducts = [...relatedProducts, ...additionalProducts]
      }
      
      return createResponse(relatedProducts)
    } catch (error) {
      return createResponse([], false, '获取推荐商品失败')
    }
  },
  
  // 获取商品分类
  async getCategories() {
    await delay(100)
    
    try {
      return createResponse(productsData.categories)
    } catch (error) {
      return createResponse([], false, '获取分类失败')
    }
  },
  
  // 搜索商品
  async searchProducts(query, params = {}) {
    await delay(300)
    
    try {
      const searchTerm = query.toLowerCase()
      let products = productsData.products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      )
      
      // 应用其他筛选条件
      if (params.category && params.category.length > 0) {
        products = products.filter(product => 
          params.category.includes(product.category)
        )
      }
      
      // 排序
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'price-low':
            products.sort((a, b) => a.price - b.price)
            break
          case 'price-high':
            products.sort((a, b) => b.price - a.price)
            break
          case 'rating':
            products.sort((a, b) => b.rating - a.rating)
            break
          case 'name':
          default:
            products.sort((a, b) => a.name.localeCompare(b.name))
            break
        }
      }
      
      return createResponse({
        products,
        query,
        total: products.length
      })
    } catch (error) {
      return createResponse(null, false, '搜索失败')
    }
  },
  
  // 获取热门商品
  async getHotProducts(limit = 6) {
    await delay(200)
    
    try {
      const hotProducts = productsData.products
        .filter(product => product.isHot)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit)
      
      return createResponse(hotProducts)
    } catch (error) {
      return createResponse([], false, '获取热门商品失败')
    }
  },
  
  // 获取新品
  async getNewProducts(limit = 6) {
    await delay(200)
    
    try {
      const newProducts = productsData.products
        .filter(product => product.isNew)
        .sort((a, b) => b.id - a.id) // 按ID倒序，模拟最新添加的商品
        .slice(0, limit)
      
      return createResponse(newProducts)
    } catch (error) {
      return createResponse([], false, '获取新品失败')
    }
  },

  // 获取用户评价
  async getUserReviews(limit = 6) {
    await delay(200)
    
    try {
      const reviews = productsData.userReviews || []
      
      // 按日期倒序排列，显示最新评价
      const sortedReviews = reviews
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit)
      
      return createResponse(sortedReviews)
    } catch (error) {
      return createResponse([], false, '获取用户评价失败')
    }
  },

  // 获取Banner广告数据
  async getBannerAds() {
    await delay(100)
    
    try {
      const bannerAds = productsData.bannerAds || []
      
      return createResponse(bannerAds)
    } catch (error) {
      return createResponse([], false, '获取Banner广告失败')
    }
  }
}

// 导出默认API实例
export default productApi

// 错误处理工具函数
export const handleApiError = (error) => {
  console.error('API Error:', error)
  return {
    success: false,
    data: null,
    message: error.message || '网络请求失败，请稍后重试',
    timestamp: new Date().toISOString()
  }
}

// API状态码常量
export const API_STATUS = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400
}