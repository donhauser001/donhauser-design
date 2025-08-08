import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { getForms, createForm, updateForm, deleteForm, toggleFormStatus, Form as FormType, FormQuery } from '../../api/forms'
import { getActiveFormCategories, FormCategory } from '../../api/formCategories'

const { Search } = Input
const { Option } = Select

// 使用从API导入的Form接口

const FormList: React.FC = () => {
    const navigate = useNavigate()
    const [forms, setForms] = useState<FormType[]>([])
    const [categories, setCategories] = useState<FormCategory[]>([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingForm, setEditingForm] = useState<FormType | null>(null)
    const [form] = Form.useForm()

    useEffect(() => {
        loadForms()
        loadCategories()
    }, [searchText, categoryFilter, statusFilter])

    const loadCategories = async () => {
        try {
            const categoriesData = await getActiveFormCategories()
            setCategories(categoriesData)
        } catch (error) {
            console.error('加载分类失败:', error)
            message.error('加载分类失败')
        }
    }

    const loadForms = async () => {
        setLoading(true)
        try {
            const query: FormQuery = {
                search: searchText || undefined,
                categoryId: categoryFilter || undefined,
                status: statusFilter || undefined,
                page: 1,
                limit: 100
            }
            const result = await getForms(query)
            setForms(result.forms)
        } catch (error) {
            console.error('加载表单失败:', error)
            message.error('加载表单失败')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setEditingForm(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    const handleEdit = (record: FormType) => {
        setEditingForm(record)
        // 先重置表单，再设置值
        form.resetFields()
        setTimeout(() => {
            form.setFieldsValue({
                name: record.name,
                description: record.description,
                categoryId: record.categoryId._id,
                status: record.status
            })
        }, 0)
        setIsModalVisible(true)
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields()

            if (editingForm) {
                // 编辑模式：更新后跳转到编辑器
                const updatedForm = await updateForm(editingForm._id, values)
                message.success('表单更新成功')
                setIsModalVisible(false)
                loadForms()
                // 跳转到编辑器页面
                navigate(`/forms/edit/${editingForm._id}`)
            } else {
                // 创建模式：创建后跳转到编辑器
                const newForm = await createForm(values)
                message.success('表单创建成功')
                setIsModalVisible(false)
                loadForms()
                // 跳转到编辑器页面
                navigate(`/forms/edit/${newForm._id}`)
            }
        } catch (error: any) {
            console.error('表单保存失败:', error)
            message.error(error.response?.data?.message || '表单保存失败')
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteForm(id)
            message.success('表单删除成功')
            loadForms()
        } catch (error: any) {
            console.error('删除失败:', error)
            message.error(error.response?.data?.message || '删除失败')
        }
    }

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        try {
            await toggleFormStatus(id)
            message.success(`表单已${currentStatus === 'published' ? '停用' : '发布'}`)
            loadForms()
        } catch (error: any) {
            console.error('状态切换失败:', error)
            message.error(error.response?.data?.message || '状态切换失败')
        }
    }

    const getCategoryLabel = (category: any) => {
        if (!category) return { label: '未分类', color: 'default' }
        return { label: category.name, color: category.color }
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
            title: '分类',
            dataIndex: 'categoryId',
            key: 'categoryId',
            render: (category: any) => {
                const { label, color } = getCategoryLabel(category)
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
            width: 150,
            render: (_: any, record: FormType) => {
                const actions = [
                    {
                        key: 'design',
                        label: '设计表单',
                        icon: <FormOutlined />,
                        onClick: () => navigate(`/forms/edit/${record._id}`)
                    },
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
                        placeholder="选择分类"
                        allowClear
                        style={{ width: 150 }}
                        onChange={setCategoryFilter}
                    >
                        {categories.map(category => (
                            <Option key={category._id} value={category._id}>
                                {category.name}
                            </Option>
                        ))}
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
            {isModalVisible && (
                <Modal
                    title={editingForm ? '编辑表单' : '创建表单'}
                    open={isModalVisible}
                    onOk={handleSave}
                    onCancel={() => {
                        setIsModalVisible(false)
                        form.resetFields()
                    }}
                    width={600}
                    destroyOnHidden
                    okText={editingForm ? '保存并编辑' : '创建并编辑'}
                    cancelText="取消"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        preserve={false}
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
                            name="categoryId"
                            label="表单分类"
                            rules={[{ required: true, message: '请选择表单分类' }]}
                        >
                            <Select placeholder="请选择表单分类">
                                {categories.map(category => (
                                    <Option key={category._id} value={category._id}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div
                                                style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    backgroundColor: category.color,
                                                    borderRadius: '2px',
                                                    marginRight: '8px'
                                                }}
                                            />
                                            {category.name}
                                        </div>
                                    </Option>
                                ))}
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
            )}
        </div>
    )
}

export default FormList 