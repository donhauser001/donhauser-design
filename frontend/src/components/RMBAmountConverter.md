# RMBAmountConverter 人民币大写转换组件

## 概述

`RMBAmountConverter` 是一个专门用于将数字金额转换为人民币大写格式的组件。该组件遵循中国人民银行的人民币大写规范，支持整数、小数、负数等各类金额的转换。

## 功能特性

- ✅ **标准转换**：遵循中国人民银行人民币大写规范
- ✅ **完整支持**：支持整数、小数、负数、零值
- ✅ **精确计算**：支持角分精确到分
- ✅ **大数支持**：支持万亿级别的大额数字
- ✅ **灵活配置**：支持自定义样式和符号显示
- ✅ **TypeScript支持**：完整的类型定义

## 组件结构

### 主要导出

```typescript
// 组件
export default RMBAmountConverter

// 工具函数
export const convertToRMB

// 类型定义
export interface RMBAmountConverterProps
```

### 核心接口

```typescript
interface RMBAmountConverterProps {
  amount: number        // 金额数字
  showSymbol?: boolean  // 是否显示￥符号（默认：true）
  showPrefix?: boolean  // 是否显示"人民币"前缀（默认：false）
  className?: string    // 自定义样式类
  style?: React.CSSProperties  // 自定义样式
}
```

## 使用方法

### 1. 基础用法

```tsx
import RMBAmountConverter from '../components/RMBAmountConverter'

const MyComponent = () => {
  return (
    <div>
      <RMBAmountConverter amount={1234.56} />
    </div>
  )
}
```

### 2. 自定义样式

```tsx
<RMBAmountConverter
  amount={1234.56}
  showSymbol={false}
  style={{ fontSize: '18px', color: '#1890ff' }}
/>
```

### 3. 仅使用转换函数

```tsx
import { convertToRMB } from '../components/RMBAmountConverter'

const amount = 1234.56
const rmbText = convertToRMB(amount)
console.log(rmbText) // 输出：壹仟贰佰叁拾肆元伍角陆分
```

### 4. 在表格中使用

```tsx
const columns = [
  {
    title: '金额大写',
    key: 'amount',
    render: (_, record) => (
      <RMBAmountConverter
        amount={record.amount}
        showSymbol={false}
        style={{ fontSize: '12px' }}
      />
    )
  }
]
```

## 转换规则

### 数字映射

```typescript
const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const units = ['', '拾', '佰', '仟']
const bigUnits = ['', '万', '亿', '万亿']
```

### 转换示例

| 数字 | 大写结果 | 带前缀结果 |
|------|----------|------------|
| 0 | 零元整 | 人民币零元整 |
| 1 | 壹元整 | 人民币壹元整 |
| 10 | 壹拾元整 | 人民币壹拾元整 |
| 100 | 壹佰元整 | 人民币壹佰元整 |
| 1000 | 壹仟元整 | 人民币壹仟元整 |
| 10000 | 壹万元整 | 人民币壹万元整 |
| 1234.56 | 壹仟贰佰叁拾肆元伍角陆分 | 人民币壹仟贰佰叁拾肆元伍角陆分 |
| 1000000 | 壹佰万元整 | 人民币壹佰万元整 |
| -1234.56 | 负壹仟贰佰叁拾肆元伍角陆分 | 负人民币壹仟贰佰叁拾肆元伍角陆分 |

### 特殊情况处理

#### 1. 零值处理
```typescript
convertToRMB(0) // 零元整
```

#### 2. 负数处理
```typescript
convertToRMB(-1234.56) // 负壹仟贰佰叁拾肆元伍角陆分
```

#### 3. 小数处理
```typescript
convertToRMB(1234.5)   // 壹仟贰佰叁拾肆元伍角
convertToRMB(1234.05)  // 壹仟贰佰叁拾肆元零伍分
convertToRMB(1234.00)  // 壹仟贰佰叁拾肆元整
```

#### 4. 大数处理
```typescript
convertToRMB(1234567890) // 壹拾贰亿叁仟肆佰伍拾陆万柒仟捌佰玖拾元整
```

## 显示效果

### 默认样式
```
￥壹仟贰佰叁拾肆元伍角陆分
```

### 带人民币前缀
```
人民币壹仟贰佰叁拾肆元伍角陆分
```

### 字体说明
- 使用系统默认字体，不再强制使用SimSun字体
- 支持自定义字体样式覆盖

### 自定义样式
```tsx
<RMBAmountConverter
  amount={1234.56}
  showSymbol={false}
  style={{ 
    fontSize: '16px', 
    color: '#d32f2f', 
    fontWeight: 'bold' 
  }}
/>
```

## 最佳实践

### 1. 金额验证

```typescript
const validateAmount = (amount: number) => {
  if (isNaN(amount) || !isFinite(amount)) {
    return false
  }
  
  // 限制最大金额（万亿级别）
  if (Math.abs(amount) > 999999999999) {
    return false
  }
  
  return true
}

const MyComponent = ({ amount }) => {
  if (!validateAmount(amount)) {
    return <span>金额无效</span>
  }
  
  return <RMBAmountConverter amount={amount} />
}
```

### 2. 格式化显示

```typescript
const formatAmount = (amount: number) => {
  // 先格式化为两位小数
  const formattedAmount = Math.round(amount * 100) / 100
  return formattedAmount
}

<RMBAmountConverter amount={formatAmount(1234.567)} />
```

### 3. 错误处理

```typescript
const SafeRMBConverter = ({ amount, ...props }) => {
  try {
    return <RMBAmountConverter amount={amount} {...props} />
  } catch (error) {
    console.error('金额转换错误:', error)
    return <span>金额转换失败</span>
  }
}
```

## 注意事项

1. **精度限制**：建议金额不超过万亿级别
2. **小数精度**：自动四舍五入到分
3. **字体支持**：使用系统默认字体，支持自定义字体样式
4. **负数处理**：自动添加"负"字前缀
5. **零值处理**：零值显示为"零元整"

## 更新日志

### v1.1.0
- ✅ 移除强制SimSun字体，使用系统默认字体
- ✅ 支持自定义字体样式覆盖
- ✅ 添加showPrefix参数支持"人民币"前缀

### v1.0.0
- ✅ 初始版本发布
- ✅ 支持标准人民币大写转换
- ✅ 支持整数、小数、负数
- ✅ 支持万亿级别大数
- ✅ 完整的TypeScript类型支持
- ✅ 详细的文档和使用示例 