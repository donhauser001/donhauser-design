# 订单版本管理 API 文档

## 概述

订单版本管理系统用于存储和管理订单的快照信息。每次保存订单时，系统会自动创建一个新版本，记录当前订单的完整状态。

## 数据模型

### OrderVersion (订单版本)

```typescript
interface OrderVersion {
    _id: string
    orderId: string              // 关联的订单ID
    versionNumber: number        // 版本号
    iterationTime: Date          // 迭代时间
    
    // 客户信息
    clientId: string
    clientName: string
    contactIds: string[]
    contactNames: string[]
    contactPhones: string[]
    
    // 项目信息
    projectName: string
    quotationId?: string
    
    // 服务项目
    items: OrderItemSnapshot[]
    
    // 金额信息
    totalAmount: number
    totalAmountRMB: string
    
    // 计算摘要
    calculationSummary: {
        totalItems: number
        totalQuantity: number
        appliedPolicies: string[]
    }
    
    // 元数据
    createdBy: string
    createdAt: Date
    updatedAt: Date
}
```

## API 端点

### 1. 创建订单版本

**POST** `/api/order-versions`

**请求体:**
```json
{
    "orderId": "订单ID",
    "clientId": "客户ID",
    "clientName": "客户名称",
    "contactIds": ["联系人ID1", "联系人ID2"],
    "contactNames": ["联系人1", "联系人2"],
    "contactPhones": ["电话1", "电话2"],
    "projectName": "项目名称",
    "quotationId": "报价单ID",
    "selectedServices": ["服务ID1", "服务ID2"],
    "serviceDetails": [...],
    "policies": [...]
}
```

**响应:**
```json
{
    "success": true,
    "message": "订单版本创建成功",
    "data": { /* 订单版本对象 */ }
}
```

### 2. 获取订单的所有版本

**GET** `/api/order-versions/:orderId`

**响应:**
```json
{
    "success": true,
    "message": "获取订单版本成功",
    "data": [
        { /* 订单版本对象 */ }
    ]
}
```

### 3. 获取订单的特定版本

**GET** `/api/order-versions/:orderId/:versionNumber`

**响应:**
```json
{
    "success": true,
    "message": "获取订单版本成功",
    "data": { /* 订单版本对象 */ }
}
```

### 4. 获取订单的最新版本

**GET** `/api/order-versions/:orderId/latest`

**响应:**
```json
{
    "success": true,
    "message": "获取最新订单版本成功",
    "data": { /* 订单版本对象 */ }
}
```

### 5. 删除订单的所有版本

**DELETE** `/api/order-versions/:orderId`

**响应:**
```json
{
    "success": true,
    "message": "删除订单版本成功"
}
```

## 使用场景

1. **订单创建**: 创建订单时自动创建第一个版本
2. **订单更新**: 每次保存订单时创建新版本
3. **版本历史**: 查看订单的修改历史
4. **版本回滚**: 恢复到之前的版本
5. **数据备份**: 保存订单的完整快照

## 注意事项

1. 版本号自动递增，确保唯一性
2. 每个版本包含完整的订单信息快照
3. 版本创建失败不影响订单操作
4. 支持删除订单时同时删除所有版本 