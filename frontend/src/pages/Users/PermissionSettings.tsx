import React, { useState, useEffect } from 'react'
import { Card, Tree, Button, Space, message, Form, Modal, Input, Table, Tag } from 'antd'
import { SaveOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import axios from 'axios'
import PermissionSelector from '../../components/PermissionSelector'

const { TextArea } = Input

interface PermissionData {
    key: string
    title: string
    children?: PermissionData[]
}

interface PermissionGroup {
    id: string
    name: string
    description: string
    permissions: string[]
    createTime: string
}

const PermissionSettings: React.FC = () => {
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])
    const [treeData, setTreeData] = useState<PermissionData[]>([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(null)
    const [checkedKeys, setCheckedKeys] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [tableLoading, setTableLoading] = useState(false)
    const [form] = Form.useForm()

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

    // 获取权限组列表
    const fetchPermissionGroups = async () => {
        try {
            setTableLoading(true)
            const response = await axios.get('/api/permissions/groups', {
                params: {
                    page: 1,
                    limit: 100
                }
            })
            if (response.data.success) {
                setPermissionGroups(response.data.data)
            }
        } catch (error) {
            console.error('获取权限组列表失败:', error)
            message.error('获取权限组列表失败')
        } finally {
            setTableLoading(false)
        }
    }

    // 组件挂载时获取数据
    useEffect(() => {
        fetchPermissionTree()
        fetchPermissionGroups()
    }, [])

    // 显示新建权限组模态窗
    const showAddModal = () => {
        setEditingGroup(null)
        setCheckedKeys([])
        form.resetFields()
        setIsModalVisible(true)
    }

    // 显示编辑权限组模态窗
    const showEditModal = (group: PermissionGroup) => {
        setEditingGroup(group)

        // 处理特殊权限 'all'
        let permissionsToShow: string[] = []
        if (group.permissions.includes('all')) {
            // 如果包含 'all' 权限，获取所有叶子节点权限
            permissionsToShow = getAllLeafPermissions(treeData)
        } else {
            // 否则使用原始权限
            permissionsToShow = group.permissions
        }

        setCheckedKeys(permissionsToShow)
        form.setFieldsValue({
            name: group.name,
            description: group.description
        })
        setIsModalVisible(true)
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

            // 处理超级管理员权限组的特殊逻辑
            let permissionsToSave = validPermissions
            if (editingGroup && editingGroup.name === '超级管理员权限组') {
                // 如果选中的权限数量等于所有权限数量，则保存为 ['all']
                if (validPermissions.length === allPermissions.length) {
                    permissionsToSave = ['all']
                }
            }

            if (editingGroup) {
                // 编辑权限组
                const response = await axios.put(`/api/permissions/groups/${editingGroup.id}`, {
                    ...values,
                    permissions: permissionsToSave
                })

                if (response.data.success) {
                    message.success('权限组更新成功')
                    fetchPermissionGroups()
                } else {
                    message.error(response.data.message || '权限组更新失败')
                }
            } else {
                // 新建权限组
                const response = await axios.post('/api/permissions/groups', {
                    ...values,
                    permissions: permissionsToSave
                })

                if (response.data.success) {
                    message.success('权限组创建成功')
                    fetchPermissionGroups()
                } else {
                    message.error(response.data.message || '权限组创建失败')
                }
            }

            setIsModalVisible(false)
            form.resetFields()
            setEditingGroup(null)
            setCheckedKeys([])
        } catch (error: any) {
            console.error('操作失败:', error)
            if (error.response?.data?.message) {
                message.error(error.response.data.message)
            } else {
                message.error('操作失败')
            }
        } finally {
            setLoading(false)
        }
    }

    // 处理模态窗取消
    const handleModalCancel = () => {
        setIsModalVisible(false)
        form.resetFields()
        setEditingGroup(null)
        setCheckedKeys([])
    }

    // 删除权限组
    const handleDeleteGroup = (groupId: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个权限组吗？删除后无法恢复。',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await axios.delete(`/api/permissions/groups/${groupId}`)
                    if (response.data.success) {
                        message.success('权限组删除成功')
                        fetchPermissionGroups()
                    } else {
                        message.error(response.data.message || '权限组删除失败')
                    }
                } catch (error: any) {
                    console.error('删除权限组失败:', error)
                    if (error.response?.data?.message) {
                        message.error(error.response.data.message)
                    } else {
                        message.error('删除权限组失败')
                    }
                }
            }
        })
    }

    // 处理权限选择
    const handleCheck = (checkedKeysValue: any) => {
        setCheckedKeys(checkedKeysValue)
    }

    // 权限组列表表格列定义
    const columns = [
        {
            title: '权限组名称',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <strong>{name}</strong>
        },
        {
            title: '权限组描述',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => (
                <span style={{ color: '#666' }}>{description}</span>
            )
        },
        {
            title: '包含权限',
            key: 'permissions',
            render: (_: any, record: PermissionGroup) => {
                // 处理超级管理员权限组的特殊显示
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
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (createTime: string) => (
                <span style={{ color: '#999' }}>{createTime}</span>
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_: any, record: PermissionGroup) => {
                const isSuperAdmin = record.name === '超级管理员权限组';
                const actions = [
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => showEditModal(record)
                    },
                    {
                        ...ActionTypes.DELETE,
                        disabled: isSuperAdmin,
                        onClick: () => handleDeleteGroup(record.id)
                    }
                ]

                return <ActionMenu actions={actions} />
            }
        }
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>权限组管理</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showAddModal}
                >
                    新建权限组
                </Button>
            </div>

            <Card title="权限组列表">
                <Table
                    columns={columns}
                    dataSource={permissionGroups}
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

            {/* 新建/编辑权限组模态窗 */}
            <Modal
                title={editingGroup ? '编辑权限组' : '新建权限组'}
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
                >
                    <Form.Item
                        name="name"
                        label="权限组名称"
                        rules={[
                            { required: true, message: '请输入权限组名称' },
                            { max: 50, message: '权限组名称不能超过50个字符' }
                        ]}
                    >
                        <Input placeholder="请输入权限组名称" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="权限组描述"
                        rules={[
                            { required: true, message: '请输入权限组描述' },
                            { max: 200, message: '权限组描述不能超过200个字符' }
                        ]}
                    >
                        <TextArea
                            placeholder="请输入权限组描述"
                            rows={3}
                            showCount
                            maxLength={200}
                        />
                    </Form.Item>

                    <Form.Item
                        label="选择权限"
                        required
                    >
                        <PermissionSelector
                            treeData={treeData}
                            checkedKeys={checkedKeys}
                            onCheck={handleCheck}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default PermissionSettings 