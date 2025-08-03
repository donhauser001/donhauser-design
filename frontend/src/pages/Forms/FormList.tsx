import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    Button,
    Space,
    Input,
    Select,
    Tag,
    Modal,
    Form,
    message,
    Popconfirm,
    Tooltip
} from 'antd'
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CopyOutlined,
    FormOutlined
} from '@ant-design/icons'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'

const { Search } = Input
const { Option } = Select

interface FormItem {
    _id: string
    name: string
    description?: string
    type: 'contract' | 'customer' | 'survey' | 'application'
    status: 'draft' | 'published' | 'disabled'
    createdBy: string
    createTime: string
    updateTime: string
    submissions?: number
}

const FormList: React.FC = () => {
    const [forms, setForms] = useState<FormItem[]>([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingForm, setEditingForm] = useState<FormItem | null>(null)
    const [form] = Form.useForm()

    // 模拟数据
    const mockForms: FormItem[] = [
        {
            _id: '1',
            name: '标准服务合同模板',
            description: '用于生成标准服务合同的模板',
            type: 'contract',
            status: 'published',
            createdBy: 'admin',
            createTime: '2024-01-15 10:30:00',
            updateTime: '2024-01-20 14:20:00',
            submissions: 25
        },
        {
            _id: '2',
            name: '客户需求收集表',
            description: '收集客户项目需求的表单',
            type: 'customer',
            status: 'published',
            createdBy: 'admin',
            createTime: '2024-01-10 09:15:00',
            updateTime: '2024-01-18 16:45:00',
            submissions: 12
        },
        {
            _id: '3',
            name: '客户满意度调查',
            description: '调查客户对服务的满意度',
            type: 'survey',
            status: 'draft',
            createdBy: 'admin',
            createTime: '2024-01-22 11:00:00',
            updateTime: '2024-01-22 11:00:00',
            submissions: 0
        }
    ]

    useEffect(() => {
        loadForms()
    }, [searchText, typeFilter, statusFilter])

    const loadForms = () => {
        setLoading(true)
        // 模拟API调用
        setTimeout(() => {
            let filteredForms = mockForms

            if (searchText) {
                filteredForms = filteredForms.filter(form =>
                    form.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    (form.description && form.description.toLowerCase().includes(searchText.toLowerCase()))
                )
            }

            if (typeFilter) {
                filteredForms = filteredForms.filter(form => form.type === typeFilter)
            }

            if (statusFilter) {
                filteredForms = filteredForms.filter(form => form.status === statusFilter)
            }

            setForms(filteredForms)
            setLoading(false)
        }, 500)
    }

    const handleCreate = () => {
        setEditingForm(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    const handleEdit = (record: FormItem) => {
        setEditingForm(record)
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            type: record.type,
            status: record.status
        })
        setIsModalVisible(true)
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields()

            if (editingForm) {
                // 更新表单
                message.success('表单更新成功')
            } else {
                // 创建表单
                message.success('表单创建成功')
            }

            setIsModalVisible(false)
            loadForms()
        } catch (error) {
            console.error('表单保存失败:', error)
        }
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个表单吗？删除后无法恢复。',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                message.success('表单删除成功')
                loadForms()
            }
        })
    }

    const handleToggleStatus = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'disabled' : 'published'
        const actionText = newStatus === 'published' ? '发布' : '停用'

        Modal.confirm({
            title: `确认${actionText}`,
            content: `确定要${actionText}这个表单吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                message.success(`${actionText}成功`)
                loadForms()
            }
        })
    }

    const getTypeLabel = (type: string) => {
        const typeMap = {
            contract: { label: '合同模板', color: 'blue' },
            customer: { label: '客户表单', color: 'green' },
            survey: { label: '问卷调查', color: 'orange' },
            application: { label: '申请表单', color: 'purple' }
        }
        return typeMap[type as keyof typeof typeMap] || { label: type, color: 'default' }
    }

    const getStatusLabel = (status: string) => {
        const statusMap = {
            draft: { label: '草稿', color: 'default' },
            published: { label: '已发布', color: 'success' },
            disabled: { label: '已停用', color: 'error' }
        }
        return statusMap[status as keyof typeof statusMap] || { label: status, color: 'default' }
    }

    const columns = [
        {
            title: '表单名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: FormItem) => (
                <Space>
                    <FormOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontWeight: 500 }}>{text}</span>
                    {record.status === 'disabled' && (
                        <Tag
                            style={{
                                color: '#ff4d4f',
                                border: '1px solid #ffccc7',
                                backgroundColor: 'transparent',
                                borderRadius: '4px'
                            }}
                        >
                            已停用
                        </Tag>
                    )}
                </Space>
            )
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => text || '-'
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => {
                const { label, color } = getTypeLabel(type)
                return <Tag color={color}>{label}</Tag>
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const { label, color } = getStatusLabel(status)
                return <Tag color={color}>{label}</Tag>
            }
        },
        {
            title: '提交次数',
            dataIndex: 'submissions',
            key: 'submissions',
            render: (count: number) => count || 0
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 180,
            render: (text: string) => {
                if (!text) return '-'
                try {
                    const date = new Date(text)
                    return date.toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    })
                } catch (error) {
                    return text
                }
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (_: any, record: FormItem) => {
                const actions = [
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => handleEdit(record)
                    },
                    {
                        ...ActionTypes.TOGGLE_STATUS,
                        label: record.status === 'published' ? '停用' : '发布',
                        onClick: () => handleToggleStatus(record._id, record.status)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDelete(record._id)
                    }
                ]
                return <ActionMenu actions={actions} />
            }
        }
    ]

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                    <FormOutlined style={{ marginRight: '8px' }} />
                    表单列表
                </h1>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    管理所有表单，包括合同模板、客户表单、问卷调查等
                </p>
            </div>

            <Card>
                {/* 搜索和筛选 */}
                <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Search
                        placeholder="搜索表单名称或描述"
                        allowClear
                        style={{ width: 300 }}
                        onSearch={setSearchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Select
                        placeholder="选择类型"
                        allowClear
                        style={{ width: 150 }}
                        onChange={setTypeFilter}
                    >
                        <Option value="contract">合同模板</Option>
                        <Option value="customer">客户表单</Option>
                        <Option value="survey">问卷调查</Option>
                        <Option value="application">申请表单</Option>
                    </Select>
                    <Select
                        placeholder="选择状态"
                        allowClear
                        style={{ width: 150 }}
                        onChange={setStatusFilter}
                    >
                        <Option value="draft">草稿</Option>
                        <Option value="published">已发布</Option>
                        <Option value="disabled">已停用</Option>
                    </Select>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                    >
                        创建表单
                    </Button>
                </div>

                {/* 表单列表 */}
                <Table
                    columns={columns}
                    dataSource={forms}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`
                    }}
                />
            </Card>

            {/* 创建/编辑表单模态框 */}
            <Modal
                title={editingForm ? '编辑表单' : '创建表单'}
                open={isModalVisible}
                onOk={handleSave}
                onCancel={() => setIsModalVisible(false)}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="表单名称"
                        rules={[{ required: true, message: '请输入表单名称' }]}
                    >
                        <Input placeholder="请输入表单名称" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="表单描述"
                    >
                        <Input.TextArea
                            placeholder="请输入表单描述"
                            rows={3}
                        />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="表单类型"
                        rules={[{ required: true, message: '请选择表单类型' }]}
                    >
                        <Select placeholder="请选择表单类型">
                            <Option value="contract">合同模板</Option>
                            <Option value="customer">客户表单</Option>
                            <Option value="survey">问卷调查</Option>
                            <Option value="application">申请表单</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="表单状态"
                        initialValue="draft"
                    >
                        <Select>
                            <Option value="draft">草稿</Option>
                            <Option value="published">已发布</Option>
                            <Option value="disabled">已停用</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default FormList 