import React, { useState, useEffect } from 'react'
import {
    Card,
    Button,
    Space,
    message,
    Breadcrumb,
    Typography,
    Tag,
    Divider,
    Row,
    Col,
    Statistic
} from 'antd'
import {
    ArrowLeftOutlined,
    EditOutlined,
    EyeOutlined,
    CalendarOutlined,
    UserOutlined,
    TagOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { getArticleById, incrementViewCount, Article } from '../../api/articles'

const { Title, Paragraph } = Typography

const ArticlePreview: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(false)

    // 分类映射
    const categoryMap: { [key: string]: { color: string; label: string } } = {
        news: { color: 'blue', label: '新闻' },
        blog: { color: 'green', label: '博客' },
        case: { color: 'purple', label: '案例' },
        tutorial: { color: 'orange', label: '教程' },
        company: { color: 'cyan', label: '公司动态' }
    }

    // 状态映射
    const statusMap: { [key: string]: { color: string; label: string } } = {
        draft: { color: 'default', label: '草稿' },
        published: { color: 'success', label: '已发布' },
        archived: { color: 'warning', label: '已归档' }
    }

    // 获取文章详情
    const fetchArticle = async () => {
        if (!id) return

        setLoading(true)
        try {
            const response = await getArticleById(id)
            const articleData = response.data
            setArticle(articleData)

            // 增加浏览量
            await incrementViewCount(id)
        } catch (error) {
            message.error('获取文章详情失败')
            navigate('/content/articles')
        } finally {
            setLoading(false)
        }
    }

    // 初始加载
    useEffect(() => {
        fetchArticle()
    }, [id])

    // 返回列表
    const handleBack = () => {
        navigate('/content/articles')
    }

    // 编辑文章
    const handleEdit = () => {
        if (article) {
            navigate(`/content/articles/edit/${article._id}`)
        }
    }

    // 渲染文章内容
    const renderContent = (content: string) => {
        // 如果是HTML内容，直接渲染
        if (content.includes('<') && content.includes('>')) {
            return (
                <div
                    dangerouslySetInnerHTML={{ __html: content }}
                    style={{ fontSize: 16, lineHeight: 1.8 }}
                />
            )
        }

        // 否则按原来的Markdown方式渲染
        return content
            .split('\n')
            .map((line, index) => {
                if (line.startsWith('## ')) {
                    return <Title level={3} key={index}>{line.substring(3)}</Title>
                } else if (line.startsWith('### ')) {
                    return <Title level={4} key={index}>{line.substring(4)}</Title>
                } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
                    return <li key={index}>{line.substring(line.indexOf(' ') + 1)}</li>
                } else if (line.startsWith('- ')) {
                    return <li key={index}>{line.substring(2)}</li>
                } else if (line.trim() === '') {
                    return <br key={index} />
                } else {
                    return <Paragraph key={index}>{line}</Paragraph>
                }
            })
    }

    if (loading) {
        return (
            <div style={{ padding: '24px' }}>
                <Card loading={true} />
            </div>
        )
    }

    if (!article) {
        return (
            <div style={{ padding: '24px' }}>
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Title level={3}>文章不存在</Title>
                        <Button type="primary" onClick={handleBack}>
                            返回列表
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* 面包屑导航 */}
            <Breadcrumb
                style={{ marginBottom: 16 }}
                items={[
                    {
                        title: <a onClick={handleBack}>内容管理</a>
                    },
                    {
                        title: <a onClick={handleBack}>文章管理</a>
                    },
                    {
                        title: '文章预览'
                    }
                ]}
            />

            {/* 操作按钮 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    文章预览
                </Title>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                        返回列表
                    </Button>
                    <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                        编辑文章
                    </Button>
                </Space>
            </div>

            {/* 文章内容 */}
            <Row gutter={24}>
                <Col span={18}>
                    <Card>
                        {/* 文章头部信息 */}
                        <div style={{ marginBottom: 32 }}>
                            {/* 封面图片 */}
                            {article.coverImage && (
                                <div style={{ marginBottom: 24, textAlign: 'center' }}>
                                    <img
                                        src={article.coverImage}
                                        alt="封面图片"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: 400,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                </div>
                            )}

                            <Title level={1} style={{ marginBottom: 16 }}>
                                {article.title}
                            </Title>

                            {article.summary && (
                                <Paragraph style={{
                                    fontSize: 16,
                                    color: '#666',
                                    marginBottom: 16,
                                    fontStyle: 'italic'
                                }}>
                                    {article.summary}
                                </Paragraph>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                                <Space>
                                    <Tag color={categoryMap[article.category]?.color || 'default'}>
                                        {categoryMap[article.category]?.label || article.category}
                                    </Tag>
                                    <Tag color={statusMap[article.status]?.color || 'default'}>
                                        {statusMap[article.status]?.label || article.status}
                                    </Tag>
                                    {article.isTop && <Tag color="red">置顶</Tag>}
                                    {article.isRecommend && <Tag color="gold">推荐</Tag>}
                                </Space>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 24, color: '#666' }}>
                                <Space>
                                    <span><UserOutlined /> {article.author}</span>
                                    <span><CalendarOutlined /> {new Date(article.createTime).toLocaleDateString()}</span>
                                    <span><EyeOutlined /> {article.viewCount} 次浏览</span>
                                </Space>
                            </div>

                            {article.tags && article.tags.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                    <TagOutlined style={{ marginRight: 8 }} />
                                    {article.tags.map((tag, index) => (
                                        <Tag key={index} color="blue">{tag}</Tag>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Divider />

                        {/* 文章正文 */}
                        <div style={{ fontSize: 16, lineHeight: 1.8 }}>
                            {renderContent(article.content)}
                        </div>

                        {/* 文章底部信息 */}
                        <Divider />
                        <div style={{ textAlign: 'center', color: '#666' }}>
                            <p>最后更新时间：{new Date(article.updateTime).toLocaleString()}</p>
                            {article.publishTime && (
                                <p>发布时间：{new Date(article.publishTime).toLocaleString()}</p>
                            )}
                        </div>
                    </Card>
                </Col>

                {/* 右侧信息栏 */}
                <Col span={6}>
                    <Card title="文章信息" style={{ marginBottom: 16 }}>
                        <Statistic
                            title="浏览量"
                            value={article.viewCount}
                            prefix={<EyeOutlined />}
                        />
                        <Divider />
                        <div>
                            <p><strong>作者：</strong>{article.author}</p>
                            <p><strong>分类：</strong>{categoryMap[article.category]?.label || article.category}</p>
                            <p><strong>状态：</strong>{statusMap[article.status]?.label || article.status}</p>
                            <p><strong>创建时间：</strong>{new Date(article.createTime).toLocaleDateString()}</p>
                        </div>
                    </Card>

                    {article.seoTitle || article.seoKeywords || article.seoDescription ? (
                        <Card title="SEO信息">
                            {article.seoTitle && (
                                <div style={{ marginBottom: 12 }}>
                                    <strong>SEO标题：</strong>
                                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{article.seoTitle}</p>
                                </div>
                            )}
                            {article.seoKeywords && (
                                <div style={{ marginBottom: 12 }}>
                                    <strong>SEO关键词：</strong>
                                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{article.seoKeywords}</p>
                                </div>
                            )}
                            {article.seoDescription && (
                                <div>
                                    <strong>SEO描述：</strong>
                                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{article.seoDescription}</p>
                                </div>
                            )}
                        </Card>
                    ) : null}
                </Col>
            </Row>
        </div>
    )
}

export default ArticlePreview 