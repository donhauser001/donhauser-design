# ActionMenu 组件使用指南

## 概述
ActionMenu 是一个通用的操作菜单组件，用于在表格的操作列中显示折叠菜单。它提供了统一的样式和交互体验，大大简化了代码并保持了全站一致性。

## 基本用法

### 1. 导入组件
```tsx
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
```

### 2. 在表格列中使用
```tsx
{
    title: '操作',
    key: 'action',
    width: 80,
    render: (_: any, record: YourDataType) => {
        const actions = [
            {
                ...ActionTypes.EDIT,
                onClick: () => handleEdit(record)
            },
            {
                ...ActionTypes.DELETE,
                onClick: () => handleDelete(record.id)
            }
        ]

        return <ActionMenu actions={actions} />
    }
}
```

## 预定义操作类型

### 基础操作
- `ActionTypes.EDIT` - 编辑操作
- `ActionTypes.DELETE` - 删除操作（危险操作）
- `ActionTypes.PASSWORD` - 修改密码
- `ActionTypes.PERMISSION` - 权限设置
- `ActionTypes.TOGGLE_STATUS` - 停用/启用
- `ActionTypes.COPY` - 复制操作

### 自定义操作
```tsx
const actions = [
    {
        key: 'custom',
        label: '自定义操作',
        icon: <CustomIcon />,
        onClick: () => handleCustomAction(record)
    }
]
```

## 完整示例

### 用户列表操作
```tsx
const actions = [
    {
        ...ActionTypes.EDIT,
        onClick: () => showEditModal(record)
    },
    {
        ...ActionTypes.PERMISSION,
        onClick: () => showPermissionModal(record)
    },
    {
        ...ActionTypes.PASSWORD,
        onClick: () => showPasswordModal(record)
    },
    {
        ...ActionTypes.TOGGLE_STATUS,
        label: record.status === 'active' ? '停用' : '启用',
        onClick: () => handleToggleStatus(record.id, record.status)
    },
    {
        ...ActionTypes.DELETE,
        onClick: () => handleDelete(record.id)
    }
]
```

### 角色设置操作
```tsx
const actions = [
    {
        ...ActionTypes.EDIT,
        onClick: () => showEditModal(record)
    },
    {
        ...ActionTypes.DELETE,
        disabled: record.userCount > 0,
        onClick: () => handleDelete(record.id)
    }
]
```

## 属性说明

### ActionItem 接口
```tsx
interface ActionItem {
    key: string           // 操作唯一标识
    label: string         // 操作显示文本
    icon?: React.ReactNode // 操作图标
    danger?: boolean      // 是否为危险操作
    disabled?: boolean    // 是否禁用
    onClick: () => void   // 点击回调函数
}
```

### ActionMenuProps 接口
```tsx
interface ActionMenuProps {
    actions: ActionItem[] // 操作项数组
    width?: number        // 操作列宽度（默认80）
}
```

## 优势

1. **代码统一**：全站使用相同的操作菜单样式
2. **易于维护**：修改样式只需要改一个组件
3. **类型安全**：使用 TypeScript 提供完整的类型支持
4. **灵活配置**：支持自定义操作和预定义操作
5. **一致性**：保证所有页面的操作体验一致 