import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    Tag,
    Button,
    Space,
    Input,
    Select,
    message,
    Popconfirm,
    Tooltip
} from 'antd'
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    StarOutlined,
    StarFilled,
    PushpinOutlined,
    PushpinFilled
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import {
    getArticles,
    deleteArticle,
    toggleArticleStatus,
    toggleTopStatus,
    toggleRecommendStatus,
    Article,
    ArticleQuery
} from '../../api/articles'
import { getCategories } from '../../api/articleCategories'
import { getTags } from '../../api/articleTags'

const { Option } = Select

const Articles: React.FC = () => {
    const navigate = useNavigate()
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // 搜索和筛选状态
    const [searchText, setSearchText] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [categories, setCategories] = useState<any[]>([])
    const [tags, setTags] = useState<any[]>([])

    // 将树形分类数据扁平化为列表
    const flattenCategories = (cats: any[], level: number = 0): any[] => {
        let result: any[] = []
        cats.forEach(cat => {
            result.push({
                ...cat,
                displayName: '　'.repeat(level) + cat.name // 使用全角空格进行缩进
            })
            if (cat.children && cat.children.length > 0) {
                result = result.concat(flattenCategories(cat.children, level + 1))
            }
        })
        return result
    }

    // 获取分类列表
    const fetchCategories = async () => {
        try {
            const response = await getCategories()
            const flattenedCategories = flattenCategories(response.categories)
            setCategories(flattenedCategories)
        } catch (error) {
            message.error('获取分类列表失败')
        }
    }

    // 获取标签列表
    const fetchTags = async () => {
        try {
            const response = await getTags()
            setTags(response.tags)
        } catch (error) {
            message.error('获取标签列表失败')
        }
    }

    // 状态选项
    const statusOptions = [
        { value: 'all', label: '全部状态' },
        { value: 'draft', label: '草稿' },
        { value: 'published', label: '已发布' },
        { value: 'archived', label: '已归档' }
    ]

    // 获取文章列表
    const fetchArticles = async () => {
        setLoading(true)
        try {
            const query: ArticleQuery = {
                search: searchText || undefined,
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                status: selectedStatus !== 'all' ? selectedStatus : undefined,
                page: currentPage,
                limit: pageSize
            }

            const response = await getArticles(query)
            setArticles(response.data)
            setTotal(response.total)
        } catch (error) {
            message.error('获取文章列表失败')
        } finally {
            setLoading(false)
        }
    }

    // 初始加载
    useEffect(() => {
        fetchCategories()
        fetchTags()
        fetchArticles()
    }, [currentPage, pageSize, searchText, selectedCategory, selectedStatus])

    // 处理搜索
    const handleSearch = (value: string) => {
        setSearchText(value)
        setCurrentPage(1)
    }

    // 处理分类筛选
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value)
        setCurrentPage(1)
    }

    // 处理状态筛选
    const handleStatusChange = (value: string) => {
        setSelectedStatus(value)
        setCurrentPage(1)
    }

    // 跳转到新建文章页面
    const handleCreate = () => {
        navigate('/content/articles/new')
    }

    // 跳转到编辑文章页面
    const handleEdit = (article: Article) => {
        navigate(`/content/articles/edit/${article._id}`)
    }

    // 跳转到预览文章页面
    const handlePreview = (article: Article) => {
        navigate(`/content/articles/preview/${article._id}`)
    }

    // 删除文章
    const handleDelete = async (id: string) => {
        try {
            await deleteArticle(id)
            message.success('文章删除成功')
            fetchArticles()
        } catch (error) {
            message.error('删除文章失败')
        }
    }

    // 切换文章状态
    const handleToggleStatus = async (id: string) => {
        try {
            await toggleArticleStatus(id)
            message.success('状态切换成功')
            fetchArticles()
        } catch (error) {
            message.error('状态切换失败')
        }
    }

    // 切换置顶状态
    const handleToggleTop = async (id: string) => {
        try {
            await toggleTopStatus(id)
            message.success('置顶状态切换成功')
            fetchArticles()
        } catch (error) {
            message.error('置顶状态切换失败')
        }
    }

    // 切换推荐状态
    const handleToggleRecommend = async (id: string) => {
        try {
            await toggleRecommendStatus(id)
            message.success('推荐状态切换成功')
            fetchArticles()
        } catch (error) {
            message.error('推荐状态切换失败')
        }
    }

    // 表格列定义
    const columns = [
        {
            title: '封面',
            dataIndex: 'coverImage',
            key: 'coverImage',
            width: 80,
            render: (coverImage: string) => (
                coverImage ? (
                    <img
                        src={coverImage}
                        alt="封面"
                        style={{
                            width: 60,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 4,
                            border: '1px solid #d9d9d9'
                        }}
                    />
                ) : (
                    <div style={{
                        width: 60,
                        height: 40,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 4,
                        border: '1px solid #d9d9d9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        color: '#999'
                    }}>
                        无封面
                    </div>
                )
            )
        },
        {
            title: '文章标题',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: Article) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {record.isTop && <PushpinFilled style={{ color: '#ff4d4f' }} />}
                        {record.isRecommend && <StarFilled style={{ color: '#faad14' }} />}
                        <span>{text}</span>
                    </div>
                    {record.summary && (
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                            {record.summary}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: '分类',
            dataIndex: 'category',
            key: 'category',
            render: (categoryId: string) => {
                const category = categories.find(cat => cat._id === categoryId)
                if (category) {
                    return <Tag color={category.color || 'blue'}>{category.name}</Tag>
                }
                return <Tag color="default">{categoryId}</Tag>
            }
        },
        {
            title: '标签',
            dataIndex: 'tags',
            key: 'tags',
            render: (tagIds: string[]) => (
                <Space size={[0, 4]} wrap>
                    {tagIds && tagIds.length > 0 ? (
                        tagIds.map(tagId => {
                            const tag = tags.find(t => t._id === tagId)
                            return tag ? (
                                <Tag key={tagId} color={tag.color || 'default'}>
                                    {tag.name}
                                </Tag>
                            ) : (
                                <Tag key={tagId} color="default">
                                    {tagId}
                                </Tag>
                            )
                        })
                    ) : (
                        <span style={{ color: '#999' }}>无标签</span>
                    )}
                </Space>
            )
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusMap: { [key: string]: { color: string; label: string } } = {
                    draft: { color: 'default', label: '草稿' },
                    published: { color: 'success', label: '已发布' },
                    archived: { color: 'warning', label: '已归档' }
                }
                const config = statusMap[status] || { color: 'default', label: status }
                return <Tag color={config.color}>{config.label}</Tag>
            }
        },
        {
            title: '浏览量',
            dataIndex: 'viewCount',
            key: 'viewCount',
            render: (count: number) => <span>{count}</span>
        },
        {
            title: '发布时间',
            dataIndex: 'publishTime',
            key: 'publishTime',
            render: (time: string) => time ? new Date(time).toLocaleString() : '-'
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: Article) => (
                <Space size="small">
                    <Tooltip title="预览">
                        <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handlePreview(record)}
                        />
                    </Tooltip>
                    <Tooltip title="编辑">
                        <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title={record.isTop ? '取消置顶' : '置顶'}>
                        <Button
                            type="link"
                            size="small"
                            icon={record.isTop ? <PushpinFilled /> : <PushpinOutlined />}
                            onClick={() => handleToggleTop(record._id)}
                        />
                    </Tooltip>
                    <Tooltip title={record.isRecommend ? '取消推荐' : '推荐'}>
                        <Button
                            type="link"
                            size="small"
                            icon={record.isRecommend ? <StarFilled /> : <StarOutlined />}
                            onClick={() => handleToggleRecommend(record._id)}
                        />
                    </Tooltip>
                    <Tooltip title="切换状态">
                        <Button
                            type="link"
                            size="small"
                            onClick={() => handleToggleStatus(record._id)}
                        >
                            {record.status === 'draft' ? '发布' :
                                record.status === 'published' ? '归档' : '恢复'}
                        </Button>
                    </Tooltip>
                    <Popconfirm
                        title="确定要删除这篇文章吗？"
                        onConfirm={() => handleDelete(record._id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Tooltip title="删除">
                            <Button
                                type="link"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>文章管理</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    新建文章
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索文章标题"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
                        />
                        <Select
                            placeholder="请选择分类"
                            style={{ width: 120 }}
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <Option value="all">全部分类</Option>
                            {categories.map(category => (
                                <Option key={category._id} value={category._id}>
                                    {category.displayName}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="发布状态"
                            style={{ width: 120 }}
                            value={selectedStatus}
                            onChange={handleStatusChange}
                        >
                            {statusOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={articles}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                        onChange: (page, size) => {
                            setCurrentPage(page)
                            setPageSize(size || 10)
                        }
                    }}
                />
            </Card>
        </div>
    )
}

export default Articles