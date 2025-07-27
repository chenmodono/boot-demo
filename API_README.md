# 商品数据API模拟系统

本项目已经实现了完整的前后端数据请求模拟系统，包含商品列表和商品详情的API调用。

## 文件结构

```
src/
├── data/
│   └── products.json          # 模拟商品数据文件
├── api/
│   └── productApi.js          # API服务封装
└── views/
    ├── ProductsView.vue       # 商品列表页面（已更新为API调用）
    └── ProductDetailView.vue  # 商品详情页面（已更新为API调用）
```

## 功能特性

### 1. 模拟数据 (`src/data/products.json`)
- 包含6个完整的商品数据
- 每个商品包含详细信息：基本信息、图片、规格、参数、评价等
- 包含商品分类数据
- 数据结构完整，支持所有页面功能

### 2. API服务 (`src/api/productApi.js`)
- **getProducts()** - 获取商品列表（支持分页、筛选、排序、搜索）
- **getProductById()** - 根据ID获取商品详情
- **getRelatedProducts()** - 获取相关推荐商品
- **getCategories()** - 获取商品分类
- **searchProducts()** - 搜索商品
- **getHotProducts()** - 获取热门商品
- **getNewProducts()** - 获取新品

### 3. 真实的网络请求体验
- 模拟网络延迟（200-500ms）
- 统一的响应格式
- 完整的错误处理
- 加载状态管理

## API响应格式

所有API都返回统一的响应格式：

```javascript
{
  success: boolean,     // 请求是否成功
  data: any,           // 返回的数据
  message: string,     // 错误信息（失败时）
  timestamp: string    // 时间戳
}
```

## 使用示例

### 在组件中使用API

```javascript
import { productApi } from '../api/productApi.js'

// 获取商品列表
const response = await productApi.getProducts({
  page: 1,
  limit: 12,
  category: ['male-toys'],
  search: '按摩',
  sortBy: 'price-low'
})

if (response.success) {
  console.log('商品列表:', response.data.products)
  console.log('分页信息:', response.data.pagination)
}

// 获取商品详情
const productResponse = await productApi.getProductById(1)
if (productResponse.success) {
  console.log('商品详情:', productResponse.data)
}
```

## 页面功能

### 商品列表页面 (ProductsView.vue)
- ✅ 通过API加载商品数据
- ✅ 支持分类筛选
- ✅ 支持搜索功能
- ✅ 支持排序（名称、价格、评分）
- ✅ 支持分页
- ✅ 加载状态显示
- ✅ 错误处理和重试

### 商品详情页面 (ProductDetailView.vue)
- ✅ 通过API加载商品详情
- ✅ 自动加载相关推荐商品
- ✅ 完整的商品信息展示
- ✅ 加载状态显示
- ✅ 错误处理和重试

## 数据特点

### 商品分类
- `male-toys` - 男性用品
- `female-vibrators` - 按摩棒
- `couple-toys` - 情趣内衣
- `massage-oil` - 按摩油
- `massage-device` - 按摩器

### 商品属性
- 基本信息（名称、描述、价格、库存等）
- 多张商品图片
- 详细描述段落
- 可选规格（容量、颜色、尺寸等）
- 技术参数
- 用户评价列表
- 评分和评价数量
- 新品和热门标识

## 开发说明

1. **数据修改**：直接编辑 `src/data/products.json` 文件
2. **API扩展**：在 `src/api/productApi.js` 中添加新的API方法
3. **错误处理**：所有API调用都包含完整的错误处理
4. **性能优化**：搜索功能包含防抖处理，避免频繁请求

## 下一步扩展

- 可以轻松替换为真实的后端API
- 支持添加购物车功能
- 支持用户收藏功能
- 支持商品评价提交
- 支持库存管理

这个模拟系统完全模拟了真实的前后端分离架构，为后续接入真实API奠定了良好的基础。