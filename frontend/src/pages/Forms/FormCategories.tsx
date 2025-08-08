import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    Button,
    Space,
    Input,
    Modal,
    Form,
    message,
    Tag,
    Statistic,
    Row,
    Col,
    Switch
} from 'antd'
import {
    PlusOutlined,
    SearchOutlined,
    FormOutlined,
    EditOutlined,
    StopOutlined,
    PlayCircleOutlined,
    DeleteOutlined
} from '@ant-design/icons'
import ActionMenu from '../../components/ActionMenu'
import ColorPicker from '../../components/ColorPicker'
import {
    getFormCategories,
    getFormCategoryStats,
    createFormCategory,
    updateFormCategory,
    deleteFormCategory,
    toggleFormCategoryStatus,
    FormCategory,
    FormCategoryQuery
} from '../../api/formCategories'

const { Search } = Input



const FormCategories: React.FC = () => {
    const [categories, setCategories] = useState<FormCategory[]>([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingCategory, setEditingCategory] = useState<FormCategory | null>(null)
    const [form] = Form.useForm()



    useEffect(() => {
        loadCategories()
    }, [searchText])

    const loadCategories = async () => {
        setLoading(true)
        try {
            const query: FormCategoryQuery = {
                search: searchText || undefined,
                page: 1,
                limit: 100
            }
            const result = await getFormCategories(query)
            setCategories(result.categories)
        } catch (error) {
            console.error('加载分类失败:', error)
            message.error('加载分类失败')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setEditingCategory(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    const handleEdit = (record: FormCategory) => {
        setEditingCategory(record)
        // 先重置表单，再设置值
        form.resetFields()
        setTimeout(() => {
            form.setFieldsValue({
                name: record.name,
                description: record.description,
                color: record.color,
                isActive: record.isActive
            })
        }, 0)
        setIsModalVisible(true)
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields()

            if (editingCategory) {
                await updateFormCategory(editingCategory._id, values)
                message.success('分类更新成功')
            } else {
                await createFormCategory(values)
                message.success('分类创建成功')
            }

            setIsModalVisible(false)
            loadCategories() // 重新加载数据
        } catch (error: any) {
            console.error('保存失败:', error)
            message.error(error.response?.data?.message || '保存失败')
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteFormCategory(id)
            message.success('分类删除成功')
            loadCategories() // 重新加载数据
        } catch (error: any) {
            console.error('删除失败:', error)
            message.error(error.response?.data?.message || '删除失败')
        }
    }

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleFormCategoryStatus(id)
            message.success('状态更新成功')
            loadCategories() // 重新加载数据
        } catch (error: any) {
            console.error('状态更新失败:', error)
            message.error(error.response?.data?.message || '状态更新失败')
        }
    }

    const getActions = (record: FormCategory) => {
        const actions = [
            {
                key: 'edit',
                label: '编辑',
                icon: <EditOutlined />,
                onClick: () => handleEdit(record)
            }
        ]

        if (record.isActive) {
            actions.push({
                key: 'disable',
                label: '禁用',
                icon: <StopOutlined />,
                onClick: () => handleToggleStatus(record._id)
            })
        } else {
            actions.push({
                key: 'enable',
                label: '启用',
                icon: <PlayCircleOutlined />,
                onClick: () => handleToggleStatus(record._id)
            })
        }

        if (record.formCount === 0) {
            actions.push({
                key: 'delete',
                label: '删除',
                icon: <DeleteOutlined />,
                onClick: () => handleDelete(record._id)
            })
        }

        return actions
    }

    const columns = [
        {
            title: '分类名称',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: FormCategory) => (
                <Space>
                    <span style={{
                        color: record.isActive ? 'inherit' : '#999',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        {name}
                    </span>
                    <div
                        style={{
                            width: '4px',
                            height: '16px',
                            backgroundColor: record.color || '#1890ff',
                            borderRadius: '2px',
                            marginLeft: '8px'
                        }}
                    />
                    {!record.isActive && <Tag color="red">已禁用</Tag>}
                </Space>
            )
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => (
                <span style={{ color: description ? 'inherit' : '#999' }}>
                    {description || '暂无描述'}
                </span>
            )
        },
        {
            title: '表单数量',
            dataIndex: 'formCount',
            key: 'formCount',
            render: (count: number) => (
                <Tag color={count > 0 ? 'blue' : 'default'}>
                    {count} 个表单
                </Tag>
            )
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (time: string) => time.split(' ')[0]
        },
        {
            title: '操作',
            key: 'actions',
            render: (_: any, record: FormCategory) => (
                <ActionMenu actions={getActions(record)} />
            )
        }
    ]

    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        totalForms: 0
    })

    // 加载统计信息
    const loadStats = async () => {
        try {
            const statsData = await getFormCategoryStats()
            setStats(statsData)
        } catch (error) {
            console.error('加载统计信息失败:', error)
        }
    }

    useEffect(() => {
        loadStats()
    }, [])

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                    <FormOutlined style={{ marginRight: '8px' }} />
                    表单分类管理
                </h1>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    管理表单分类，为表单提供分类组织功能
                </p>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="总分类数"
                            value={stats.total}
                            prefix={<FormOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="启用分类"
                            value={stats.active}
                            prefix={<FormOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="总表单数"
                            value={stats.totalForms}
                            prefix={<FormOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Search
                        placeholder="搜索分类名称或描述"
                        allowClear
                        style={{ width: 300 }}
                        onSearch={setSearchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                    >
                        新建分类
                    </Button>
                </div>
            </Card>

            <Card>
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                    }}
                />
            </Card>

            {isModalVisible && (
                <Modal
                    title={editingCategory ? '编辑分类' : '新建分类'}
                    open={isModalVisible}
                    onOk={handleSave}
                    onCancel={() => {
                        setIsModalVisible(false)
                        form.resetFields()
                    }}
                    width={600}
                    destroyOnHidden
                >
                    <Form
                        form={form}
                        layout="vertical"
                        preserve={false}
                        initialValues={{
                            isActive: true,
                            color: '#1890ff'
                        }}
                    >
                        <Form.Item
                            name="name"
                            label="分类名称"
                            rules={[{ required: true, message: '请输入分类名称' }]}
                        >
                            <Input placeholder="请输入分类名称" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="分类描述"
                        >
                            <Input.TextArea
                                placeholder="请输入分类描述（可选）"
                                rows={3}
                                maxLength={200}
                                showCount
                            />
                        </Form.Item>

                        <Form.Item
                            name="color"
                            label="分类颜色"
                            rules={[{ required: true, message: '请选择分类颜色' }]}
                        >
                            <ColorPicker />
                        </Form.Item>

                        <Form.Item
                            name="isActive"
                            label="状态"
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren="启用"
                                unCheckedChildren="禁用"
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </div>
    )
}

export default FormCategories 