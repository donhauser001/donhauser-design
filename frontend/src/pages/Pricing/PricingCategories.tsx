import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'

const { Option } = Select

interface PricingCategory {
    id: string
    name: string
    description: string
    status: 'active' | 'inactive'
    serviceCount: number
    createTime: string
}

const PricingCategories: React.FC = () => {
    const [data, setData] = useState<PricingCategory[]>([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [editing, setEditing] = useState<PricingCategory | null>(null)
    const [form] = Form.useForm()
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    // 加载数据
    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/pricing-categories')
            setData(res.data.data)
        } catch (e) {
            message.error('获取分类数据失败')
        }
        setLoading(false)
    }

    useEffect(() => { fetchData() }, [])

    // 新增/编辑弹窗
    const showModal = (record?: PricingCategory) => {
        setEditing(record || null)
        setModalVisible(true)
        if (record) {
            form.setFieldsValue(record)
        } else {
            form.resetFields()
        }
    }

    // 保存
    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            if (editing) {
                await axios.put(`/api/pricing-categories/${editing.id}`, values)
                message.success('分类更新成功')
            } else {
                await axios.post('/api/pricing-categories', values)
                message.success('分类创建成功')
            }
            setModalVisible(false)
            setEditing(null)
            fetchData()
        } catch (e: any) {
            message.error(e?.response?.data?.message || '操作失败')
        }
    }

    // 删除
    const handleDelete = (record: PricingCategory) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除分类"${record.name}"吗？`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await axios.delete(`/api/pricing-categories/${record.id}`)
                    message.success('删除成功')
                    fetchData()
                } catch (e: any) {
                    message.error(e?.response?.data?.message || '删除失败')
                }
            }
        })
    }

    // 状态切换
    const handleStatusChange = async (checked: boolean, record: PricingCategory) => {
        try {
            await axios.put(`/api/pricing-categories/${record.id}`, { status: checked ? 'active' : 'inactive' })
            fetchData()
        } catch (e) {
            message.error('状态更新失败')
        }
    }

    // 唯一性校验
    const checkNameUnique = async (_: any, value: string) => {
        if (!value) return Promise.resolve()
        const exists = data.some(item => item.name === value && (!editing || item.id !== editing.id))
        if (exists) return Promise.reject('分类名称已存在')
        return Promise.resolve()
    }

    // 搜索和筛选
    const filteredData = data.filter(item => {
        const matchName = item.name.includes(search)
        const matchStatus = statusFilter === 'all' || item.status === statusFilter
        return matchName && matchStatus
    })

    const columns = [
        {
            title: '分类名称',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: PricingCategory) => (
                <span>
                    {name}
                    {record.status === 'inactive' && (
                        <Tag color="red" style={{ marginLeft: 8, fontSize: '12px' }}>
                            已禁用
                        </Tag>
                    )}
                </span>
            )
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '服务数量',
            dataIndex: 'serviceCount',
            key: 'serviceCount',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_: any, record: PricingCategory) => {
                const actions = [
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => showModal(record)
                    },
                    {
                        ...ActionTypes.TOGGLE_STATUS,
                        label: record.status === 'active' ? '停用' : '启用',
                        onClick: () => handleStatusChange(record.status !== 'active', record)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDelete(record)
                    }
                ]

                return <ActionMenu actions={actions} />
            }
        },
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>定价分类</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    新增分类
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索分类名称"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            allowClear
                        />
                        <Select
                            placeholder="状态"
                            style={{ width: 120 }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="all">全部状态</Option>
                            <Option value="active">启用</Option>
                            <Option value="inactive">禁用</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editing ? '编辑分类' : '新增分类'}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => { setModalVisible(false); setEditing(null); form.resetFields() }}
                destroyOnHidden
                okText="保存"
                cancelText="取消"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="分类名称"
                        rules={[
                            { required: true, message: '请输入分类名称' },
                            { validator: checkNameUnique }
                        ]}
                    >
                        <Input placeholder="请输入分类名称" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="描述"
                    >
                        <Input.TextArea placeholder="请输入描述" />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="状态"
                        initialValue="active"
                        rules={[{ required: true, message: '请选择状态' }]}
                    >
                        <Select>
                            <Option value="active">启用</Option>
                            <Option value="inactive">禁用</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default PricingCategories 