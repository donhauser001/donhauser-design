import React from 'react'
import { Button, Dropdown } from 'antd'
import { MoreOutlined, EditOutlined, DeleteOutlined, LockOutlined, SettingOutlined, StopOutlined, CopyOutlined, EyeOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

export interface ActionItem {
    key: string
    label: string
    icon?: React.ReactNode
    danger?: boolean
    disabled?: boolean
    onClick: () => void
}

export interface ActionMenuProps {
    actions: ActionItem[]
    width?: number
}

const ActionMenu: React.FC<ActionMenuProps> = ({ actions, width = 80 }) => {
    const menuItems: MenuProps['items'] = actions.map(action => ({
        key: action.key,
        label: action.label,
        icon: action.icon,
        danger: action.danger,
        disabled: action.disabled,
        onClick: action.onClick
    }))

    return (
        <Dropdown
            menu={{ items: menuItems }}
            placement="bottomRight"
            trigger={['click']}
        >
            <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                style={{ padding: '4px 8px' }}
            />
        </Dropdown>
    )
}

// 预定义的操作类型
export const ActionTypes = {
    VIEW: {
        key: 'view',
        label: '查看',
        icon: <EyeOutlined />
    },
    EDIT: {
        key: 'edit',
        label: '编辑',
        icon: <EditOutlined />
    },
    DELETE: {
        key: 'delete',
        label: '删除',
        icon: <DeleteOutlined />,
        danger: true
    },
    PASSWORD: {
        key: 'password',
        label: '修改密码',
        icon: <LockOutlined />
    },
    PERMISSION: {
        key: 'permission',
        label: '权限设置',
        icon: <SettingOutlined />
    },
    TOGGLE_STATUS: {
        key: 'toggleStatus',
        label: '停用',
        icon: <StopOutlined />
    },
    COPY: {
        key: 'copy',
        label: '复制',
        icon: <CopyOutlined />
    }
}

export default ActionMenu 