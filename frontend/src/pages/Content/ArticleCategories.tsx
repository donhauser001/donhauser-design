import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    Select,
    message,
    Tag,
    Typography,
    Breadcrumb,
    Row,
    Col,
    Statistic
} from 'antd'
import {
    PlusOutlined,
    ArrowLeftOutlined,
    StopOutlined,
    MinusOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ColorPicker from '../../components/ColorPicker'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import {
    getCategories,
    createCategory as createCategoryApi,
    updateCategory as updateCategoryApi,
    deleteCategory as deleteCategoryApi,
    toggleCategoryStatus as toggleCategoryStatusApi,
    type ArticleCategory as ApiArticleCategory
} from '../../api/articleCategories'

const { Title } = Typography
const { TextArea } = Input


type ArticleCategory = ApiArticleCategory

interface CreateCategoryRequest {
    name: string
    description?: string
    slug: string
    color?: string
    parentId?: string
}

interface UpdateCategoryRequest {
    name?: string
    description?: string
    slug?: string
    color?: string
    isActive?: boolean
    parentId?: string
}

const ArticleCategories: React.FC = () => {
    const [categories, setCategories] = useState<ArticleCategory[]>([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [editingCategory, setEditingCategory] = useState<ArticleCategory | null>(null)
    const [form] = Form.useForm()
    const navigate = useNavigate()

    // 获取所有可用的父分类（排除自己和自己的子分类）
    // 获取可用的父分类（从现有数据中过滤）
    const getAvailableParentCategories = (excludeId?: string): ArticleCategory[] => {
        return flattenedCategories.filter(cat =>
            !excludeId || cat._id !== excludeId
        )
    }

    // 根据ID查找分类
    const findCategoryById = (id: string, cats: ArticleCategory[] = categories): ArticleCategory | null => {
        for (const cat of cats) {
            if (cat._id === id) return cat
            if (cat.children) {
                const found = findCategoryById(id, cat.children)
                if (found) return found
            }
        }
        return null
    }






    // 获取分类列表
    const fetchCategories = async () => {
        setLoading(true)
        try {
            const result = await getCategories()
            setCategories(result.categories)
        } catch (error) {
            message.error('获取分类列表失败')
        } finally {
            setLoading(false)
        }
    }

    // 创建分类
    const createCategory = async (values: CreateCategoryRequest) => {
        try {
            await createCategoryApi(values)
            await fetchCategories() // 重新获取数据
            message.success('分类创建成功')
            setModalVisible(false)
            form.resetFields()
        } catch (error) {
            message.error('分类创建失败')
        }
    }

    // 更新分类
    const updateCategory = async (id: string, values: UpdateCategoryRequest) => {
        try {
            await updateCategoryApi(id, values)
            await fetchCategories() // 重新获取数据
            message.success('分类更新成功')
            setModalVisible(false)
            setEditingCategory(null)
            form.resetFields()
        } catch (error) {
            message.error('分类更新失败')
        }
    }

    // 删除分类
    const deleteCategory = async (id: string) => {
        try {
            await deleteCategoryApi(id)
            await fetchCategories() // 重新获取数据
            message.success('分类删除成功')
        } catch (error) {
            message.error('分类删除失败')
        }
    }

    // 切换分类状态
    const toggleCategoryStatus = async (id: string) => {
        try {
            await toggleCategoryStatusApi(id)
            await fetchCategories() // 重新获取数据
            message.success('状态更新成功')
        } catch (error) {
            message.error('状态更新失败')
        }
    }

    // 处理表单提交
    const handleSubmit = async (values: any) => {
        // 处理parentId，如果为空字符串则设为undefined
        const processedValues = {
            ...values,
            parentId: values.parentId === '' ? undefined : values.parentId
        }

        console.log('提交的表单值:', values)
        console.log('处理后的值:', processedValues)

        if (editingCategory) {
            await updateCategory(editingCategory._id, processedValues)
        } else {
            await createCategory(processedValues)
        }
    }

    // 打开编辑模态框
    const handleEdit = (category: ArticleCategory) => {
        setEditingCategory(category)
        form.setFieldsValue({
            name: category.name,
            description: category.description,
            slug: category.slug,
            color: category.color,
            parentId: category.parentId || undefined
        })
        setModalVisible(true)
    }

    // 打开创建模态框
    const handleCreate = () => {
        setEditingCategory(null)
        form.resetFields()
        setModalVisible(true)
    }

    // 添加子分类
    const handleAddChild = (parentCategory: ArticleCategory) => {
        setEditingCategory(null)
        form.resetFields()
        form.setFieldsValue({
            parentId: parentCategory._id
        })
        setModalVisible(true)
    }

    // 关闭模态框
    const handleCancel = () => {
        setModalVisible(false)
        setEditingCategory(null)
        form.resetFields()
    }

    // 表格列定义
    const columns = [
        {
            title: '分类名称',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: ArticleCategory) => (
                <Space>
                    <span style={{
                        color: record.isActive ? 'inherit' : '#999',
                        fontSize: record.level === 1 ? '16px' : record.level === 2 ? '14px' : record.level === 3 ? '14px' : '12px',
                        fontWeight: record.level <= 2 ? 'bold' : 'normal'
                    }}>
                        {name}
                    </span>
                    {/* 颜色条 */}
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
            title: '层级',
            dataIndex: 'level',
            key: 'level',
            width: 80,
            render: (level: number) => {
                const getLevelInfo = (level: number) => {
                    switch (level) {
                        case 1: return { color: 'blue', text: '一级' }
                        case 2: return { color: 'green', text: '二级' }
                        case 3: return { color: 'orange', text: '三级' }
                        case 4: return { color: 'red', text: '四级' }
                        case 5: return { color: 'purple', text: '五级' }
                        default: return { color: 'default', text: `${level}级` }
                    }
                }
                const levelInfo = getLevelInfo(level)
                return (
                    <Tag color={levelInfo.color}>
                        {levelInfo.text}
                    </Tag>
                )
            }
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
            width: 100,
            render: (count: number) => (
                <Tag color="blue">{count}</Tag>
            )
        },

        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180,
            render: (time: string) => new Date(time).toLocaleString()
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_: any, record: any) => {
                const actions = [
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => handleEdit(record)
                    },
                    // 只有非四级分类才显示"添加子分类"选项
                    ...(record.level < 4 ? [{
                        key: 'addChild',
                        label: '添加子分类',
                        icon: <PlusOutlined />,
                        onClick: () => handleAddChild(record)
                    }] : []),
                    {
                        key: 'toggleStatus',
                        label: record.isActive ? '禁用' : '启用',
                        icon: <StopOutlined />,
                        onClick: () => toggleCategoryStatus(record._id)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => {
                            Modal.confirm({
                                title: '确定要删除这个分类吗？',
                                content: '删除后无法恢复，相关文章将变为未分类状态。',
                                okText: '确定',
                                cancelText: '取消',
                                onOk: () => deleteCategory(record._id)
                            })
                        }
                    }
                ]

                return <ActionMenu actions={actions} />
            }
        }
    ]

    // 将树形数据扁平化为列表，用于表格显示
    const flattenCategories = (cats: ArticleCategory[], indentLevel: number = 0): any[] => {
        let result: any[] = []
        cats.forEach((cat, index) => {
            result.push({
                ...cat,
                key: `${cat._id}-${indentLevel}-${index}`, // 简化的唯一key
                indentLevel: indentLevel // 用于缩进显示的层级，不影响数据库中的level字段
            })
            if (cat.children && cat.children.length > 0) {
                result = result.concat(flattenCategories(cat.children, indentLevel + 1))
            }
        })
        return result
    }

    const flattenedCategories = flattenCategories(categories)

    // 统计数据 - 使用扁平化数据计算总数
    const stats = {
        total: flattenedCategories.length,
        topLevel: categories.length, // 顶级分类数量
        active: flattenedCategories.filter(cat => cat.isActive).length,
        totalArticles: flattenedCategories.reduce((sum, cat) => sum + cat.articleCount, 0)
    }

    useEffect(() => {
        fetchCategories()
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
                        title: '文章分类'
                    }
                ]}
            />

            {/* 页面标题 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    文章分类管理
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
                        新建分类
                    </Button>
                </Space>
            </div>

            {/* 统计卡片 */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="总分类数"
                            value={stats.total}
                            suffix={`/ ${stats.topLevel} 个顶级分类`}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="启用分类"
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

            {/* 分类列表 */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="_id"
                    loading={loading}
                    expandable={{
                        defaultExpandAllRows: false,
                        expandRowByClick: false,
                        expandIcon: ({ expanded, onExpand, record }) => {
                            // 四级分类显示圆形，不显示展开/折叠图标
                            if (record.level >= 4) {
                                return (
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            backgroundColor: record.color || '#1890ff',
                                            marginRight: '8px'
                                        }}
                                    />
                                )
                            }

                            // 检查是否有子分类
                            const hasChildren = record.children && record.children.length > 0

                            // 如果没有子分类，显示冻结的加号
                            if (!hasChildren) {
                                return (
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            border: '1px solid #d9d9d9',
                                            marginRight: '8px',
                                            opacity: 0.5
                                        }}
                                    >
                                        <PlusOutlined style={{ fontSize: '10px', color: '#999' }} />
                                    </span>
                                )
                            }

                            // 有子分类时显示正常的展开/折叠图标
                            return expanded ? (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        border: '1px solid #d9d9d9',
                                        cursor: 'pointer',
                                        marginRight: '8px'
                                    }}
                                    onClick={(e) => onExpand(record, e)}
                                >
                                    <MinusOutlined style={{ fontSize: '10px' }} />
                                </span>
                            ) : (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        border: '1px solid #d9d9d9',
                                        cursor: 'pointer',
                                        marginRight: '8px'
                                    }}
                                    onClick={(e) => onExpand(record, e)}
                                >
                                    <PlusOutlined style={{ fontSize: '10px' }} />
                                </span>
                            )
                        }
                    }}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                    }}
                />
            </Card>

            {/* 创建/编辑模态框 */}
            <Modal
                title={editingCategory ? '编辑分类' : '新建分类'}
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
                        label="分类名称"
                        rules={[{ required: true, message: '请输入分类名称' }]}
                    >
                        <Input placeholder="请输入分类名称" />
                    </Form.Item>

                    <Form.Item
                        name="parentId"
                        label="父分类"
                    >
                        <Select
                            placeholder="请选择父分类（可选）"
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            <Select.Option value="">无（顶级分类）</Select.Option>
                            {flattenedCategories
                                .filter(cat => !editingCategory || cat._id !== editingCategory._id) // 排除当前编辑的分类
                                .map(cat => {
                                    const getLevelText = (level: number) => {
                                        switch (level) {
                                            case 1: return '一级'
                                            case 2: return '二级'
                                            case 3: return '三级'
                                            case 4: return '四级'
                                            case 5: return '五级'
                                            default: return `${level}级`
                                        }
                                    }
                                    const getIndentPrefix = (level: number) => {
                                        return ''
                                    }

                                    return (
                                        <Select.Option
                                            key={cat._id}
                                            value={cat._id}
                                            disabled={cat.level >= 4} // 四级及以上分类被禁用
                                        >
                                            {'　'.repeat(cat.level - 1)}{cat.name} ({getLevelText(cat.level)}分类)
                                        </Select.Option>
                                    )
                                })}
                        </Select>
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
                            placeholder="请输入分类描述"
                        />
                    </Form.Item>

                    <Form.Item
                        name="color"
                        label="颜色"
                    >
                        <ColorPicker placeholder="请选择分类颜色" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingCategory ? '更新' : '创建'}
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

export default ArticleCategories 