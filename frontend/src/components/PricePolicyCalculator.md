# PricePolicyCalculator 价格政策计算组件

## 概述

`PricePolicyCalculator` 是一个通用的价格政策计算组件，用于处理统一折扣和阶梯折扣的价格计算逻辑。该组件提供了完整的计算功能、格式化显示和可复用的业务逻辑。

## 功能特性

- ✅ **统一折扣计算**：支持按百分比计费的统一折扣
- ✅ **阶梯折扣计算**：支持按数量分段的阶梯折扣
- ✅ **最佳政策选择**：自动选择最优惠的价格政策
- ✅ **单位支持**：支持自定义单位（天、个、次等）
- ✅ **格式化显示**：提供美观的价格和计算详情显示
- ✅ **灵活配置**：支持显示/隐藏详细信息
- ✅ **TypeScript支持**：完整的类型定义

## 组件结构

### 主要导出

```typescript
// 组件
export default PricePolicyCalculator

// 工具函数
export const calculatePriceWithPolicies
export const formatCalculationDetails

// 类型定义
export interface PriceCalculationResult
export interface PricePolicyCalculatorProps
```

### 核心接口

```typescript
interface PriceCalculationResult {
  originalPrice: number        // 原价
  discountedPrice: number      // 折扣后价格
  discountAmount: number       // 优惠金额
  discountRatio: number        // 计费比例
  appliedPolicy: PricingPolicy | null  // 应用的政策
  calculationDetails: string   // 计算详情
}

interface PricePolicyCalculatorProps {
  originalPrice: number        // 原价
  quantity: number            // 数量
  policies: PricingPolicy[]   // 可用政策列表
  selectedPolicyIds: string[] // 选中的政策ID
  unit?: string              // 单位（默认：件）
  showDetails?: boolean      // 是否显示详情（默认：true）
  className?: string         // 自定义样式类
}
```

## 使用方法

### 1. 基础用法

```tsx
import PricePolicyCalculator from '../components/PricePolicyCalculator'
import { getAllPricingPolicies } from '../api/pricingPolicy'

const MyComponent = () => {
  const [policies, setPolicies] = useState([])
  const [selectedPolicyIds, setSelectedPolicyIds] = useState([])

  useEffect(() => {
    // 加载价格政策
    getAllPricingPolicies().then(setPolicies)
  }, [])

  return (
    <PricePolicyCalculator
      originalPrice={1000}
      quantity={5}
      policies={policies}
      selectedPolicyIds={selectedPolicyIds}
      unit="个"
    />
  )
}
```

### 2. 仅使用计算函数

```tsx
import { calculatePriceWithPolicies, formatCalculationDetails } from '../components/PricePolicyCalculator'

const calculatePrice = () => {
  const result = calculatePriceWithPolicies(
    1000,           // 原价
    5,              // 数量
    policies,       // 政策列表
    ['policy-id'],  // 选中的政策ID
    '个'            // 单位
  )

  console.log('计算结果:', result)
  console.log('格式化详情:', formatCalculationDetails(result))
}
```

### 3. 在表格中使用

```tsx
import PricePolicyCalculator from '../components/PricePolicyCalculator'

const columns = [
  {
    title: '价格',
    key: 'price',
    render: (_, record) => (
      <PricePolicyCalculator
        originalPrice={record.unitPrice * record.quantity}
        quantity={record.quantity}
        policies={policies}
        selectedPolicyIds={record.selectedPolicyIds || []}
        unit={record.unit}
        showDetails={false}  // 表格中不显示详情
      />
    )
  }
]
```

### 4. 在模态框中使用

```tsx
import PricePolicyCalculator from '../components/PricePolicyCalculator'

const OrderModal = () => {
  return (
    <Modal title="订单详情">
      <div>
        <h3>价格计算</h3>
        <PricePolicyCalculator
          originalPrice={totalOriginalPrice}
          quantity={totalQuantity}
          policies={policies}
          selectedPolicyIds={selectedPolicyIds}
          unit="件"
          showDetails={true}  // 模态框中显示详情
        />
      </div>
    </Modal>
  )
}
```

## 价格政策类型

### 统一折扣 (uniform_discount)

```typescript
{
  type: 'uniform_discount',
  discountRatio: 80,  // 按80%计费
  name: '限时优惠'
}
```

**计算逻辑**：
- 折扣后价格 = 原价 × (discountRatio / 100)
- 优惠金额 = 原价 - 折扣后价格

### 阶梯折扣 (tiered_discount)

```typescript
{
  type: 'tiered_discount',
  tierSettings: [
    { startQuantity: 1, endQuantity: 1, discountRatio: 100 },    // 第1件按100%计费
    { startQuantity: 2, endQuantity: 5, discountRatio: 95 },     // 第2-5件按95%计费
    { startQuantity: 6, endQuantity: null, discountRatio: 90 }   // 第6件以上按90%计费
  ],
  name: '批量优惠'
}
```

**计算逻辑**：
- 按阶梯分段计算
- 每个阶梯独立计算价格
- 总价 = 各阶梯价格之和

## 显示效果

### 无折扣时
```
¥1,000
```

### 有折扣时
```
¥1,000  ¥800  优惠: ¥200
应用政策: 限时优惠
┌─────────────────────────┐
│ 优惠折扣: 按80%计费     │
│ 原价: ¥1,000            │
│ 优惠比例: 20%           │
│ 优惠金额: ¥200          │
│ 最终价格: ¥800          │
└─────────────────────────┘
```

### 阶梯折扣详情
```
应用政策: 批量优惠
┌─────────────────────────┐
│ 计费方式:               │
│ 第1件按100%计费: ¥200   │
│ 第2-5件按95%计费: ¥760  │
│ 原价: ¥1,000            │
│ 优惠金额: ¥40           │
│ 最终价格: ¥960          │
└─────────────────────────┘
```

## 最佳实践

### 1. 政策选择逻辑

```typescript
// 单选逻辑：每个服务只能选择一个政策
const handlePolicyChange = (serviceId: string, policyIds: string[]) => {
  // 确保只选择一个政策
  const selectedPolicyId = policyIds.length > 0 ? policyIds[0] : null
  setSelectedPolicies(prev => ({
    ...prev,
    [serviceId]: selectedPolicyId ? [selectedPolicyId] : []
  }))
}
```

### 2. 性能优化

```typescript
// 缓存政策列表，避免重复请求
const [policies, setPolicies] = useState([])
const [policiesLoaded, setPoliciesLoaded] = useState(false)

useEffect(() => {
  if (!policiesLoaded) {
    getAllPricingPolicies().then(data => {
      setPolicies(data)
      setPoliciesLoaded(true)
    })
  }
}, [policiesLoaded])
```

### 3. 错误处理

```typescript
const handleCalculation = () => {
  try {
    const result = calculatePriceWithPolicies(
      originalPrice,
      quantity,
      policies,
      selectedPolicyIds,
      unit
    )
    
    if (result.appliedPolicy) {
      // 计算成功
      setFinalPrice(result.discountedPrice)
    } else {
      // 无适用政策
      setFinalPrice(originalPrice)
    }
  } catch (error) {
    console.error('价格计算错误:', error)
    // 降级到原价
    setFinalPrice(originalPrice)
  }
}
```

## 注意事项

1. **政策状态**：只有 `status: 'active'` 的政策才会被计算
2. **单位一致性**：确保传入的 `unit` 与政策设置的单位一致
3. **数量验证**：确保 `quantity` 大于0
4. **政策ID**：确保传入的 `selectedPolicyIds` 在 `policies` 中存在
5. **阶梯连续性**：阶梯折扣的阶梯设置必须连续且无重叠

## 迁移指南

### 从旧版本迁移

如果您的项目中已有价格计算逻辑，可以按以下步骤迁移：

1. **替换计算函数**：
```typescript
// 旧代码
const calculateDiscount = (price, policy) => { /* ... */ }

// 新代码
import { calculatePriceWithPolicies } from '../components/PricePolicyCalculator'
const result = calculatePriceWithPolicies(price, quantity, policies, [policy.id])
```

2. **替换显示组件**：
```typescript
// 旧代码
<div>价格: ¥{price}</div>

// 新代码
<PricePolicyCalculator
  originalPrice={price}
  quantity={quantity}
  policies={policies}
  selectedPolicyIds={selectedPolicyIds}
/>
```

3. **更新类型定义**：
```typescript
// 使用组件提供的类型
import { PriceCalculationResult } from '../components/PricePolicyCalculator'
```

## 更新日志

### v1.0.0
- ✅ 初始版本发布
- ✅ 支持统一折扣和阶梯折扣
- ✅ 提供计算函数和显示组件
- ✅ 完整的TypeScript类型支持
- ✅ 详细的文档和使用示例 