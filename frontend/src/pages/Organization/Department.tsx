import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Modal, Form, Input, message, Table, Tag, Select } from 'antd'
import { TeamOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import axios from 'axios'

const { Option } = Select

interface DepartmentData {
    id: string
    name: string
    parentId?: string
    enterpriseId: string
    enterpriseName: string
    level: number
    employeeCount: number
    status: 'active' | 'inactive'
    createTime: string
}

interface EnterpriseData {
    id: string
    enterpriseName: string
}

const Department: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingDepartment, setEditingDepartment] = useState<DepartmentData | null>(null)
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [selectedEnterprise, setSelectedEnterprise] = useState<string>('')
    const [departments, setDepartments] = useState<DepartmentData[]>([])
    const [enterprises, setEnterprises] = useState<EnterpriseData[]>([])
    const [tableLoading, setTableLoading] = useState(false)

    // 获取企业列表
    const fetchEnterprises = async () => {
        try {
            const response = await axios.get('/api/enterprises')
            if (response.data.success) {
                setEnterprises(response.data.data)
            }
        } catch (error) {
            console.error('获取企业列表失败:', error)
            message.error('获取企业列表失败')
        }
    }

    // 获取部门列表
    const fetchDepartments = async (enterpriseId?: string) => {
        try {
            setTableLoading(true)
            const params = enterpriseId ? { enterpriseId } : {}
            const response = await axios.get('/api/departments', { params })
            if (response.data.success) {
                setDepartments(response.data.data)
            }
        } catch (error) {
            console.error('获取部门列表失败:', error)
            message.error('获取部门列表失败')
        } finally {
            setTableLoading(false)
        }
    }

    // 组件加载时获取数据
    useEffect(() => {
        fetchEnterprises()
        fetchDepartments()
    }, [])

    // 企业筛选变化时重新获取数据
    useEffect(() => {
        fetchDepartments(selectedEnterprise)
    }, [selectedEnterprise])

    // 显示新增部门模态窗
    const showAddModal = () => {
        setEditingDepartment(null)
        form.resetFields()
        form.setFieldsValue({
            status: 'active'
        })
        setIsModalVisible(true)
    }

    // 显示编辑部门模态窗
    const showEditModal = (department: DepartmentData) => {
        setEditingDepartment(department)
        form.setFieldsValue({
            name: department.name,
            enterpriseId: department.enterpriseId,
            parentId: department.parentId,
            status: department.status
        })
        setIsModalVisible(true)
    }

    // 处理模态窗确认
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields()
            setLoading(true)

            if (editingDepartment) {
                // 编辑部门
                try {
                    const response = await axios.put(`/api/departments/${editingDepartment.id}`, values)
                    if (response.data.success) {
                        message.success('部门信息更新成功')
                        fetchDepartments(selectedEnterprise) // 重新获取数据
                    } else {
                        message.error(response.data.message || '更新失败')
                    }
                } catch (error) {
                    console.error('更新部门失败:', error)
                    message.error('更新部门失败')
                }
            } else {
                // 新增部门
                try {
                    const response = await axios.post('/api/departments', values)
                    if (response.data.success) {
                        message.success('部门创建成功')
                        fetchDepartments(selectedEnterprise) // 重新获取数据
                    } else {
                        message.error(response.data.message || '创建失败')
                    }
                } catch (error) {
                    console.error('创建部门失败:', error)
                    message.error('创建部门失败')
                }
            }

            setIsModalVisible(false)
            form.resetFields()
        } catch (error) {
            console.error('表单验证失败:', error)
        } finally {
            setLoading(false)
        }
    }

    // 处理模态窗取消
    const handleModalCancel = () => {
        setIsModalVisible(false)
        form.resetFields()
        setEditingDepartment(null)
    }

    // 删除部门
    const handleDeleteDepartment = (departmentId: string) => {
        const department = departments.find(d => d.id === departmentId)

        // 检查是否有子部门
        const hasChildren = departments.some(dept => dept.parentId === departmentId)
        // 检查是否有员工
        const hasEmployees = department?.employeeCount && department.employeeCount > 0

        if (hasChildren || hasEmployees) {
            message.error('该部门下还有子部门或员工，无法删除')
            return
        }

        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个部门吗？删除后无法恢复。',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await axios.delete(`/api/departments/${departmentId}`)
                    if (response.data.success) {
                        message.success('部门删除成功')
                        fetchDepartments(selectedEnterprise) // 重新获取数据
                    } else {
                        message.error(response.data.message || '删除失败')
                    }
                } catch (error) {
                    console.error('删除部门失败:', error)
                    message.error('删除部门失败')
                }
            }
        })
    }

    // 获取上级部门选项
    const getParentDepartmentOptions = (enterpriseId: string) => {
        return departments
            .filter(dept => dept.enterpriseId === enterpriseId && dept.level === 1)
            .map(dept => ({
                label: dept.name,
                value: dept.id
            }))
    }

    // 部门表格列
    const departmentColumns = [
        {
            title: '部门名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: DepartmentData) => (
                <div>
                    <strong>{text}</strong>
                    {record.level === 2 && (
                        <Tag color="blue" style={{ marginLeft: 8 }}>子部门</Tag>
                    )}
                </div>
            )
        },
        {
            title: '所属企业',
            dataIndex: 'enterpriseName',
            key: 'enterpriseName'
        },
        {
            title: '上级部门',
            dataIndex: 'parentId',
            key: 'parentId',
            render: (parentId: string) => {
                if (!parentId) return '-'
                const parentDept = departments.find(d => d.id === parentId)
                return parentDept?.name || '-'
            }
        },
        {
            title: '员工数量',
            dataIndex: 'employeeCount',
            key: 'employeeCount',
            render: (count: number) => (
                <Tag color="green">{count} 人</Tag>
            )
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
            render: (_: any, record: DepartmentData) => {
                const actions = [
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => showEditModal(record)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDeleteDepartment(record.id)
                    }
                ]

                return <ActionMenu actions={actions} />
            }
        }
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>部门管理</h1>
                <Button icon={<PlusOutlined />} type="primary" onClick={showAddModal}>
                    新增部门
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <span>企业筛选：</span>
                        <Select
                            placeholder="请选择企业"
                            style={{ width: 200 }}
                            allowClear
                            value={selectedEnterprise}
                            onChange={setSelectedEnterprise}
                        >
                            {enterprises.map(enterprise => (
                                <Option key={enterprise.id} value={enterprise.id}>
                                    {enterprise.enterpriseName}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={departmentColumns}
                    dataSource={departments}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`
                    }}
                    loading={tableLoading}
                />
            </Card>

            {/* 新增/编辑部门模态窗 */}
            <Modal
                title={editingDepartment ? '编辑部门' : '新增部门'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={loading}
                width={600}
                okText="确认"
                cancelText="取消"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: 'active'
                    }}
                >
                    <Form.Item
                        name="enterpriseId"
                        label="所属企业"
                        rules={[
                            { required: true, message: '请选择所属企业' }
                        ]}
                    >
                        <Select
                            placeholder="请选择所属企业"
                            onChange={(value) => {
                                form.setFieldsValue({ parentId: undefined })
                            }}
                        >
                            {enterprises.map(enterprise => (
                                <Option key={enterprise.id} value={enterprise.id}>
                                    {enterprise.enterpriseName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="部门名称"
                        rules={[
                            { required: true, message: '请输入部门名称' }
                        ]}
                    >
                        <Input placeholder="请输入部门名称" />
                    </Form.Item>

                    <Form.Item
                        name="parentId"
                        label="上级部门"
                    >
                        <Select
                            placeholder="请选择上级部门"
                            disabled={!form.getFieldValue('enterpriseId')}
                        >
                            <Option value="">无</Option>
                            {form.getFieldValue('enterpriseId') &&
                                getParentDepartmentOptions(form.getFieldValue('enterpriseId')).map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))
                            }
                        </Select>
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

export default Department 