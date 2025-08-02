# 订单管理组件重构

## 概述

原来的 `Orders.tsx` 文件过大（1434行），已经重构为模块化的组件结构，提高了代码的可维护性和可读性。

## 文件结构

```
Orders/
├── index.tsx          # 主入口文件，整合所有组件
├── types.ts           # TypeScript 类型定义
├── mockData.ts        # 模拟数据
├── hooks.ts           # 自定义 hooks，管理业务逻辑
├── columns.tsx        # 表格列定义
├── StepIndicator.tsx  # 步骤指示器组件
├── StepOne.tsx        # 第一步：选择客户和联系人
├── StepTwo.tsx        # 第二步：选择服务项目
├── StepThree.tsx      # 第三步：确认订单信息
├── EditForm.tsx       # 编辑订单表单
└── README.md          # 说明文档
```

## 组件说明

### 1. 类型定义 (`types.ts`)
- `OrderData`: 订单数据接口
- `ServiceDetail`: 服务详情接口
- `Client`: 客户接口
- `Contact`: 联系人接口
- `Quotation`: 报价单接口

### 2. 自定义 Hooks (`hooks.ts`)
- `useOrders`: 管理订单列表状态和操作
- `useClients`: 管理客户列表
- `useOrderModal`: 管理模态窗状态
- `useServiceSelection`: 管理服务选择逻辑

### 3. 步骤组件
- `StepIndicator`: 显示当前步骤进度
- `StepOne`: 选择客户、联系人和项目名称
- `StepTwo`: 按分类显示服务项目，支持选择和全选
- `StepThree`: 确认订单信息，显示客户信息和服务清单

### 4. 其他组件
- `EditForm`: 编辑订单的表单组件
- `columns`: 表格列定义，包含操作按钮
- `mockData`: 模拟订单数据

## 重构优势

1. **模块化**: 每个组件职责单一，易于维护
2. **可复用**: 组件可以在其他地方复用
3. **类型安全**: 完整的 TypeScript 类型定义
4. **逻辑分离**: 业务逻辑通过 hooks 管理，UI 组件只负责渲染
5. **易于测试**: 小组件更容易进行单元测试
6. **代码可读性**: 文件大小合理，便于阅读和理解

## 使用方式

主文件 `Orders.tsx` 现在只是一个简单的导入和导出：

```typescript
import Orders from './Orders/index'
export default Orders
```

所有功能都通过 `Orders/index.tsx` 提供，保持了原有的 API 不变。

## 功能特性

- ✅ 三步式订单创建流程
- ✅ 按分类显示服务项目
- ✅ 支持单个选择和分类全选
- ✅ 订单信息确认和总计显示
- ✅ 完整的 CRUD 操作
- ✅ 搜索和筛选功能
- ✅ 响应式设计 