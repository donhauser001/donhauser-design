import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    message,
    Tag,
    Typography,
    Breadcrumb,
    Row,
    Col,
    Statistic,
    InputNumber
} from 'antd'
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    SearchOutlined,
    StopOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ColorPicker from '../../components/ColorPicker'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import {
    getTags,
    createTag,
    updateTag,
    deleteTag,
    toggleTagStatus,
    type ArticleTag as ApiArticleTag
} from '../../api/articleTags'

const { Title } = Typography
const { TextArea } = Input

type ArticleTag = ApiArticleTag

interface CreateTagRequest {
    name: string
    description?: string
    slug: string
    color?: string
}

interface UpdateTagRequest {
    name?: string
    description?: string
    slug?: string
    color?: string
    isActive?: boolean
}

const ArticleTags: React.FC = () => {
    const [tags, setTags] = useState<ArticleTag[]>([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [editingTag, setEditingTag] = useState<ArticleTag | null>(null)
    const [searchText, setSearchText] = useState('')
    const [form] = Form.useForm()
    const navigate = useNavigate()

    // 获取标签列表
    const fetchTags = async () => {
        setLoading(true)
        try {
            const result = await getTags()
            setTags(result.tags)
        } catch (error) {
            message.error('获取标签列表失败')
        } finally {
            setLoading(false)
        }
    }

    // 创建标签
    const handleCreateTag = async (values: CreateTagRequest) => {
        try {
            await createTag(values)
            await fetchTags() // 重新获取数据
            message.success('标签创建成功')
            setModalVisible(false)
            form.resetFields()
        } catch (error) {
            message.error('标签创建失败')
        }
    }

    // 更新标签
    const handleUpdateTag = async (id: string, values: UpdateTagRequest) => {
        try {
            await updateTag(id, values)
            await fetchTags() // 重新获取数据
            message.success('标签更新成功')
            setModalVisible(false)
            setEditingTag(null)
            form.resetFields()
        } catch (error) {
            message.error('标签更新失败')
        }
    }

    // 删除标签
    const handleDeleteTag = async (id: string) => {
        try {
            await deleteTag(id)
            await fetchTags() // 重新获取数据
            message.success('标签删除成功')
        } catch (error) {
            message.error('标签删除失败')
        }
    }

    // 切换标签状态
    const handleToggleTagStatus = async (id: string) => {
        try {
            await toggleTagStatus(id)
            await fetchTags() // 重新获取数据
            message.success('状态更新成功')
        } catch (error) {
            message.error('状态更新失败')
        }
    }

    // 处理表单提交
    const handleSubmit = async (values: any) => {
        if (editingTag) {
            await handleUpdateTag(editingTag._id, values)
        } else {
            await handleCreateTag(values)
        }
    }

    // 打开编辑模态框
    const handleEdit = (tag: ArticleTag) => {
        setEditingTag(tag)
        form.setFieldsValue({
            name: tag.name,
            description: tag.description,
            slug: tag.slug,
            color: tag.color
        })
        setModalVisible(true)
    }

    // 打开创建模态框
    const handleCreate = () => {
        setEditingTag(null)
        form.resetFields()
        setModalVisible(true)
    }

    // 关闭模态框
    const handleCancel = () => {
        setModalVisible(false)
        setEditingTag(null)
        form.resetFields()
    }

    // 过滤标签
    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tag.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchText.toLowerCase())
    )

    // 表格列定义
    const columns = [
        {
            title: '标签名称',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: ArticleTag) => (
                <Space>
                    <Tag color={record.color}>{name}</Tag>
                    {!record.isActive && <Tag color="red">已禁用</Tag>}
                </Space>
            )
        },
        {
            title: '别名',
            dataIndex: 'slug',
            key: 'slug',
            render: (slug: string) => <code>{slug}</code>
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: '文章数量',
            dataIndex: 'articleCount',
            key: 'articleCount',
            render: (count: number) => (
                <Tag color="blue">{count}</Tag>
            ),
            sorter: (a: ArticleTag, b: ArticleTag) => a.articleCount - b.articleCount
        },

        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (time: string) => new Date(time).toLocaleDateString(),
            sorter: (a: ArticleTag, b: ArticleTag) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: ArticleTag) => {
                const actions = [
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => handleEdit(record)
                    },
                    {
                        key: 'toggleStatus',
                        label: record.isActive ? '禁用' : '启用',
                        icon: <StopOutlined />,
                        onClick: () => handleToggleTagStatus(record._id)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => {
                            Modal.confirm({
                                title: '确定要删除这个标签吗？',
                                content: '删除后无法恢复，相关文章将失去此标签。',
                                okText: '确定',
                                cancelText: '取消',
                                onOk: () => handleDeleteTag(record._id)
                            })
                        }
                    }
                ]

                return <ActionMenu actions={actions} />
            }
        }
    ]

    // 统计数据
    const stats = {
        total: tags.length,
        active: tags.filter(tag => tag.isActive).length,
        totalArticles: tags.reduce((sum, tag) => sum + tag.articleCount, 0)
    }

    useEffect(() => {
        fetchTags()
    }, [])

    return (
        <div style={{ padding: '24px' }}>
            {/* 面包屑导航 */}
            <Breadcrumb
                style={{ marginBottom: 16 }}
                items={[
                    {
                        title: <a onClick={() => navigate('/content')}>内容管理</a>
                    },
                    {
                        title: '文章标签'
                    }
                ]}
            />

            {/* 页面标题 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    文章标签管理
                </Title>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/content')}>
                        返回内容中心
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                    >
                        新建标签
                    </Button>
                </Space>
            </div>

            {/* 统计卡片 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="总标签数"
                            value={stats.total}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="启用标签"
                            value={stats.active}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="总文章数"
                            value={stats.totalArticles}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 搜索和标签列表 */}
            <Card>
                {/* 搜索栏 */}
                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="搜索标签名称、描述或别名"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                </div>

                {/* 标签列表 */}
                <Table
                    columns={columns}
                    dataSource={filteredTags}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                    }}
                />
            </Card>

            {/* 创建/编辑模态框 */}
            <Modal
                title={editingTag ? '编辑标签' : '新建标签'}
                open={modalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="标签名称"
                        rules={[{ required: true, message: '请输入标签名称' }]}
                    >
                        <Input placeholder="请输入标签名称" />
                    </Form.Item>

                    <Form.Item
                        name="slug"
                        label="别名"
                        rules={[{ required: true, message: '请输入别名' }]}
                    >
                        <Input placeholder="请输入别名，用于URL" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="描述"
                    >
                        <TextArea
                            rows={3}
                            placeholder="请输入标签描述"
                        />
                    </Form.Item>

                    <Form.Item
                        name="color"
                        label="颜色"
                    >
                        <ColorPicker placeholder="请选择标签颜色" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingTag ? '更新' : '创建'}
                            </Button>
                            <Button onClick={handleCancel}>
                                取消
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ArticleTags 