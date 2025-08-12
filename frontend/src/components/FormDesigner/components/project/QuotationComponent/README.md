# QuotationComponent 模块重构

## 文件结构

```
QuotationComponent/
├── README.md                    # 本文档
├── index.ts                     # 入口文件，导出所有模块
├── types.ts                     # TypeScript 类型定义
├── hooks.ts                     # React Hooks (useQuotationData)
├── policyUtils.ts               # 价格政策相关工具函数
├── CardMode.tsx                 # 卡片模式渲染组件
├── TabsMode.tsx                 # 标签页模式渲染组件
├── ListMode.tsx                 # 列表模式渲染组件
├── PolicyModal.tsx              # 价格政策详情弹窗组件
└── QuotationComponent.tsx       # 主组件文件
```

## 模块说明

### 1. types.ts
定义了所有相关的 TypeScript 接口：
- `QuotationComponentProps`: 主组件属性接口
- `PolicyTagProps`: 政策标签组件属性
- `RenderModeProps`: 渲染模式组件共享属性
- `QuotationState`: 报价单状态接口

### 2. hooks.ts
包含 `useQuotationData` Hook，负责：
- 报价单数据管理
- 价格政策数据加载
- 组件状态管理（loading, modal visibility 等）
- 数据获取和初始化逻辑

### 3. policyUtils.ts
价格政策相关的工具函数：
- `formatPolicyDescription`: 格式化政策描述
- `formatPolicyDetail`: 格式化政策详情
- `renderPriceDescriptionWithPolicy`: 渲染带政策的价格说明
- `renderPolicyTag`: 渲染政策标签

### 4. 渲染模式组件

#### CardMode.tsx
实现卡片显示模式，特点：
- 4列网格布局
- 按分类分组显示
- 支持价格政策标签显示

#### TabsMode.tsx  
实现标签页显示模式，特点：
- 每个分类为一个标签页
- 3列网格布局
- 支持价格政策标签显示

#### ListMode.tsx
实现列表显示模式，特点：
- 表格形式显示
- 按分类分组，每组显示表头
- 支持价格政策标签显示
- 优化的列宽比例

### 5. PolicyModal.tsx
价格政策详情弹窗组件，特点：
- 显示政策名称、计费说明、有效期
- 支持统一折扣和阶梯折扣两种类型
- 集成价格计算示例
- 动态单位显示

### 6. QuotationComponent.tsx
主组件文件，负责：
- 组合所有子模块
- 渲染逻辑路由
- 状态管理和事件处理
- UI 框架和布局

## 重构收益

1. **代码可维护性**: 每个模块职责单一，易于维护和修改
2. **代码复用性**: 工具函数和组件可以在其他地方复用
3. **测试友好**: 每个模块可以独立测试
4. **开发效率**: 多人协作时可以并行开发不同模块
5. **代码可读性**: 文件大小适中，逻辑清晰

## 使用方式

```typescript
// 直接使用主组件（推荐）
import QuotationComponent from './QuotationComponent';

// 或使用重构后的模块
import { useQuotationData, formatPolicyDetail } from './QuotationComponent';
```

## 依赖关系

```
QuotationComponent.tsx (主组件)
├── hooks.ts (数据逻辑)
├── policyUtils.ts (工具函数)
├── CardMode.tsx (渲染组件)
├── TabsMode.tsx (渲染组件)  
├── ListMode.tsx (渲染组件)
└── PolicyModal.tsx (弹窗组件)
```

所有模块都是相对独立的，降低了耦合度，提高了代码质量。
