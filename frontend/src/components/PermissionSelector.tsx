import React, { useState } from 'react'
import { Card, Tree, Checkbox, Space, Divider } from 'antd'
import type { TreeProps } from 'antd'

interface PermissionData {
    key: string
    title: string
    children?: PermissionData[]
}

interface PermissionSelectorProps {
    treeData: PermissionData[]
    checkedKeys: string[]
    onCheck: (checkedKeys: any) => void
    description?: string
}

const PermissionSelector: React.FC<PermissionSelectorProps> = ({
    treeData,
    checkedKeys,
    onCheck,
    description = "请选择该权限组包含的具体权限："
}) => {
    // 将权限树数据分成四列的辅助函数
    const splitTreeData = (data: PermissionData[]): [PermissionData[], PermissionData[], PermissionData[], PermissionData[]] => {
        const chunkSize = Math.ceil(data.length / 4)
        return [
            data.slice(0, chunkSize),
            data.slice(chunkSize, chunkSize * 2),
            data.slice(chunkSize * 2, chunkSize * 3),
            data.slice(chunkSize * 3)
        ]
    }

    // 获取所有叶子节点权限的辅助函数
    const getAllLeafPermissions = (nodes: PermissionData[]): string[] => {
        const permissions: string[] = []

        const extractPermissions = (nodeList: PermissionData[]) => {
            nodeList.forEach(node => {
                if (node.children && node.children.length > 0) {
                    extractPermissions(node.children)
                } else {
                    permissions.push(node.key)
                }
            })
        }

        extractPermissions(nodes)
        return permissions
    }

    // 处理全选/取消全选
    const handleSelectAll = (moduleKey: string, checked: boolean) => {
        const module = treeData.find(item => item.key === moduleKey)
        if (!module || !module.children) return

        const modulePermissions = module.children.map(child => child.key)
        const currentChecked = checkedKeys.filter(key => modulePermissions.includes(key))

        if (checked) {
            // 全选：添加该模块所有权限
            const newCheckedKeys = [...new Set([...checkedKeys, ...modulePermissions])]
            onCheck(newCheckedKeys)
        } else {
            // 取消全选：移除该模块所有权限
            const newCheckedKeys = checkedKeys.filter(key => !modulePermissions.includes(key))
            onCheck(newCheckedKeys)
        }
    }

    // 检查模块是否全选
    const isModuleFullySelected = (moduleKey: string): boolean => {
        const module = treeData.find(item => item.key === moduleKey)
        if (!module || !module.children) return false

        const modulePermissions = module.children.map(child => child.key)
        const selectedCount = checkedKeys.filter(key => modulePermissions.includes(key)).length

        return selectedCount === modulePermissions.length
    }

    // 检查模块是否部分选中
    const isModulePartiallySelected = (moduleKey: string): boolean => {
        const module = treeData.find(item => item.key === moduleKey)
        if (!module || !module.children) return false

        const modulePermissions = module.children.map(child => child.key)
        const selectedCount = checkedKeys.filter(key => modulePermissions.includes(key)).length

        return selectedCount > 0 && selectedCount < modulePermissions.length
    }

    // 获取模块已选权限数量
    const getModuleSelectedCount = (moduleKey: string): number => {
        const module = treeData.find(item => item.key === moduleKey)
        if (!module || !module.children) return 0

        const modulePermissions = module.children.map(child => child.key)
        return checkedKeys.filter(key => modulePermissions.includes(key)).length
    }

    const renderPermissionCard = (module: PermissionData) => {
        const isFullySelected = isModuleFullySelected(module.key)
        const isPartiallySelected = isModulePartiallySelected(module.key)
        const selectedCount = getModuleSelectedCount(module.key)
        const totalCount = module.children?.length || 0

        return (
            <Card
                key={module.key}
                size="small"
                style={{
                    marginBottom: 8,
                    border: isFullySelected ? '2px solid #1890ff' : '1px solid #d9d9d9'
                }}
                styles={{ body: { padding: '8px' } }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <Checkbox
                        checked={isFullySelected}
                        indeterminate={isPartiallySelected}
                        onChange={(e) => handleSelectAll(module.key, e.target.checked)}
                        style={{ marginRight: 8 }}
                    />
                    <span style={{
                        fontWeight: 'bold',
                        color: isFullySelected ? '#1890ff' : '#333',
                        flex: 1
                    }}>
                        {module.title}
                    </span>
                    <span style={{
                        fontSize: '12px',
                        color: '#666',
                        backgroundColor: '#f5f5f5',
                        padding: '2px 6px',
                        borderRadius: '10px'
                    }}>
                        {selectedCount}/{totalCount}
                    </span>
                </div>

                {module.children && (
                    <div style={{ marginLeft: 16 }}>
                        {module.children.map(child => (
                            <div key={child.key} style={{ marginBottom: 2 }}>
                                <Checkbox
                                    checked={checkedKeys.includes(child.key)}
                                    onChange={(e) => {
                                        const newCheckedKeys = e.target.checked
                                            ? [...checkedKeys, child.key]
                                            : checkedKeys.filter(key => key !== child.key)
                                        onCheck(newCheckedKeys)
                                    }}
                                >
                                    <span style={{ fontSize: '12px' }}>{child.title}</span>
                                </Checkbox>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        )
    }

    const [col1, col2, col3, col4] = splitTreeData(treeData)

    return (
        <div>
            <div style={{ marginBottom: 12 }}>
                <span style={{ color: '#666', fontSize: '13px' }}>{description}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                    {col1.map(renderPermissionCard)}
                </div>
                <div style={{ flex: 1 }}>
                    {col2.map(renderPermissionCard)}
                </div>
                <div style={{ flex: 1 }}>
                    {col3.map(renderPermissionCard)}
                </div>
                <div style={{ flex: 1 }}>
                    {col4.map(renderPermissionCard)}
                </div>
            </div>
        </div>
    )
}

export default PermissionSelector 