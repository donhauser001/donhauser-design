import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Space, Input, Modal, Form, Select, message, Divider } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import PermissionSelector from '../../components/PermissionSelector'
import axios from 'axios'

const { Option } = Select

interface RoleData {
    id: string
    roleName: string
    description: string
    permissions: string[]
    permissionGroups: string[]
    status: 'active' | 'inactive'
    userCount: number
    createTime: string
}

interface PermissionGroup {
    id: string
    name: string
    description: string
    permissions: string[]
    createTime: string
}

interface PermissionData {
    key: string
    title: string
    children?: PermissionData[]
}

const RoleSettings: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingRole, setEditingRole] = useState<RoleData | null>(null)
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [selectedPermissionGroups, setSelectedPermissionGroups] = useState<string[]>([])
    const [checkedKeys, setCheckedKeys] = useState<string[]>([])
    const [roles, setRoles] = useState<RoleData[]>([])
    const [treeData, setTreeData] = useState<PermissionData[]>([])
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])

    // 获取权限树数据
    const fetchPermissionTree = async () => {
        try {
            const response = await axios.get('/api/permissions/tree')
            if (response.data.success) {
                setTreeData(response.data.data)
            }
        } catch (error) {
            console.error('获取权限树失败:', error)
            message.error('获取权限树失败')
        }
    }

    // 获取权限组数据
    const fetchPermissionGroups = async () => {
        try {
            const response = await axios.get('/api/permissions/groups')
            if (response.data.success) {
                setPermissionGroups(response.data.data)
            }
        } catch (error) {
            console.error('获取权限组失败:', error)
            message.error('获取权限组失败')
        }
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

    // 获取角色列表
    const fetchRoles = async () => {
        try {
            setTableLoading(true)
            const response = await axios.get('/api/roles', {
                params: {
                    search: searchText,
                    page: 1,
                    limit: 100
                }
            })
            if (response.data.success) {
                setRoles(response.data.data)
            }
        } catch (error) {
            console.error('获取角色列表失败:', error)
            message.error('获取角色列表失败')
        } finally {
            setTableLoading(false)
        }
    }

    // 组件挂载时获取数据
    useEffect(() => {
        fetchRoles()
        fetchPermissionTree()
        fetchPermissionGroups()
    }, [])

    // 搜索时重新获取数据
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchRoles()
        }, 500)
        return () => clearTimeout(timer)
    }, [searchText])

    // 显示新增角色模态窗
    const showAddModal = () => {
        setEditingRole(null)
        setSelectedPermissionGroups([])
        setCheckedKeys([])
        form.resetFields()
        setIsModalVisible(true)
    }

    // 显示编辑角色模态窗
    const showEditModal = (role: RoleData) => {
        setEditingRole(role)

        // 设置权限组选择
        const rolePermissionGroups = role.permissionGroups || []
        setSelectedPermissionGroups(rolePermissionGroups)

        // 获取所有有效的叶子节点权限
        const allLeafPermissions = getAllLeafPermissions(treeData)

        // 过滤出有效的权限
        const validPermissions = (role.permissions || []).filter((permission: string) =>
            allLeafPermissions.includes(permission)
        )
        setCheckedKeys(validPermissions)

        form.setFieldsValue({
            roleName: role.roleName,
            description: role.description,
            status: role.status,
            permissions: validPermissions,
            permissionGroups: rolePermissionGroups
        })
        setIsModalVisible(true)
    }

    // 处理权限组选择变化
    const handlePermissionGroupChange = (groupIds: string[]) => {
        setSelectedPermissionGroups(groupIds)

        // 根据选择的权限组，重新计算应该选中的权限
        let groupPermissions: string[] = []
        groupIds.forEach(groupId => {
            const group = permissionGroups.find(g => g.id === groupId)
            if (group && group.permissions) {
                // 处理特殊权限 'all'
                if (group.permissions.includes('all')) {
                    // 如果权限组包含 'all'，获取所有叶子节点权限
                    const allLeafPermissions = getAllLeafPermissions(treeData)
                    groupPermissions = [...groupPermissions, ...allLeafPermissions]
                } else {
                    groupPermissions = [...groupPermissions, ...group.permissions]
                }
            }
        })

        // 获取所有有效的叶子节点权限
        const allLeafPermissions = getAllLeafPermissions(treeData)

        // 过滤出有效的权限组权限
        const validGroupPermissions = groupPermissions.filter(permission =>
            allLeafPermissions.includes(permission)
        )

        // 更新选中的权限（只保留权限组中的权限）
        const newCheckedKeys = [...new Set(validGroupPermissions)]
        setCheckedKeys(newCheckedKeys)

        // 更新表单中的权限字段
        form.setFieldsValue({
            permissions: newCheckedKeys
        })
    }

    // 处理权限选择变化
    const handlePermissionCheck = (checkedKeysValue: any) => {
        // 获取所有有效的叶子节点权限
        const allLeafPermissions = getAllLeafPermissions(treeData)

        // 过滤出有效的权限
        const validCheckedKeys = checkedKeysValue.filter((key: string) =>
            allLeafPermissions.includes(key)
        )

        setCheckedKeys(validCheckedKeys)
        form.setFieldsValue({
            permissions: validCheckedKeys
        })
    }

    // 处理模态窗确认
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields()
            setLoading(true)

            // 获取所有有效的权限列表（叶子节点）
            const allPermissions = getAllLeafPermissions(treeData)

            // 过滤checkedKeys，只保留有效的叶子节点权限
            const validPermissions = checkedKeys.filter((key: string) =>
                allPermissions.includes(key)
            )

            if (editingRole) {
                // 编辑角色
                const response = await axios.put(`/api/roles/${editingRole.id}`, {
                    ...values,
                    permissions: validPermissions,
                    permissionGroups: selectedPermissionGroups
                })
                if (response.data.success) {
                    message.success('角色更新成功')
                    setIsModalVisible(false)
                    fetchRoles()
                } else {
                    message.error(response.data.message || '角色更新失败')
                }
            } else {
                // 新建角色
                const response = await axios.post('/api/roles', {
                    ...values,
                    permissions: validPermissions,
                    permissionGroups: selectedPermissionGroups
                })
                if (response.data.success) {
                    message.success('角色创建成功')
                    setIsModalVisible(false)
                    fetchRoles()
                } else {
                    message.error(response.data.message || '角色创建失败')
                }
            }
        } catch (error: any) {
            console.error('操作失败:', error)
            message.error(error.response?.data?.message || '操作失败')
        } finally {
            setLoading(false)
        }
    }

    // 处理模态窗取消
    const handleModalCancel = () => {
        setIsModalVisible(false)
        setEditingRole(null)
        setSelectedPermissionGroups([])
        setCheckedKeys([])
        form.resetFields()
    }

    // 处理删除角色
    const handleDeleteRole = (roleId: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个角色吗？删除后无法恢复。',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await axios.delete(`/api/roles/${roleId}`)
                    if (response.data.success) {
                        message.success('角色删除成功')
                        fetchRoles()
                    } else {
                        message.error(response.data.message || '角色删除失败')
                    }
                } catch (error: any) {
                    console.error('删除失败:', error)
                    message.error(error.response?.data?.message || '删除失败')
                }
            }
        })
    }

    // 过滤角色列表
    const filteredRoles = roles.filter(role =>
        role.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
        role.description.toLowerCase().includes(searchText.toLowerCase())
    )

    // 角色列表表格列定义
    const columns = [
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
            render: (name: string) => <strong>{name}</strong>
        },
        {
            title: '角色描述',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => (
                <span style={{ color: '#666' }}>{description}</span>
            )
        },
        {
            title: '包含权限',
            key: 'permissions',
            render: (_: any, record: RoleData) => {
                // 处理超级管理员角色的特殊显示
                if (record.permissions.includes('all')) {
                    return (
                        <Tag color="red">
                            所有权限
                        </Tag>
                    )
                }
                return (
                    <Tag color="blue">
                        {record.permissions.length} 个权限
                    </Tag>
                )
            }
        },
        {
            title: '用户数量',
            dataIndex: 'userCount',
            key: 'userCount',
            render: (count: number) => <Tag color="green">{count}</Tag>
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? '启用' : '禁用'}
                </Tag>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime'
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_: unknown, record: RoleData) => {
                const actions = [
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => showEditModal(record)
                    },
                    {
                        ...ActionTypes.DELETE,
                        disabled: record.userCount > 0,
                        onClick: () => handleDeleteRole(record.id)
                    }
                ]

                return <ActionMenu actions={actions} />
            }
        }
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>角色设置</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                    新增角色
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="搜索角色名称或描述"
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredRoles}
                    rowKey="id"
                    loading={tableLoading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`
                    }}
                />
            </Card>

            {/* 新增/编辑角色模态窗 */}
            <Modal
                title={editingRole ? '编辑角色' : '新增角色'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={loading}
                width={1200}
                okText="确认"
                cancelText="取消"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: 'active',
                        permissions: [],
                        permissionGroups: []
                    }}
                >
                    <Form.Item
                        name="roleName"
                        label="角色名称"
                        rules={[
                            { required: true, message: '请输入角色名称' },
                            { min: 2, max: 20, message: '角色名称长度在 2-20 个字符' }
                        ]}
                    >
                        <Input placeholder="请输入角色名称" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="角色描述"
                        rules={[
                            { required: true, message: '请输入角色描述' },
                            { max: 100, message: '角色描述不能超过 100 个字符' }
                        ]}
                    >
                        <Input.TextArea
                            placeholder="请输入角色描述"
                            rows={3}
                            showCount
                            maxLength={100}
                        />
                    </Form.Item>

                    <Form.Item
                        name="permissionGroups"
                        label="权限组设置"
                    >
                        <Select
                            mode="multiple"
                            placeholder="请选择权限组（可选）"
                            style={{ width: '100%' }}
                            maxTagCount="responsive"
                            value={selectedPermissionGroups}
                            onChange={handlePermissionGroupChange}
                        >
                            {permissionGroups.map(group => (
                                <Option key={group.id} value={group.id}>
                                    {group.name} - {group.description}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Divider>或手动选择具体权限</Divider>

                    <Form.Item
                        label="选择权限"
                        required
                    >
                        <PermissionSelector
                            treeData={treeData}
                            checkedKeys={checkedKeys}
                            onCheck={handlePermissionCheck}
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="状态"
                        rules={[
                            { required: true, message: '请选择状态' }
                        ]}
                    >
                        <Select placeholder="请选择状态">
                            <Option value="active">启用</Option>
                            <Option value="inactive">禁用</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default RoleSettings 