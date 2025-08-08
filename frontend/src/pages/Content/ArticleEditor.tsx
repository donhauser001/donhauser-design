import React, { useState, useEffect, useMemo } from 'react'
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    Space,
    message,
    Breadcrumb,
    Divider,
    Row,
    Col,
    Tag,
    Switch,
    Typography,
    Upload,
    Dropdown,
    Modal
} from 'antd'
import {
    SaveOutlined,
    EyeOutlined,
    ArrowLeftOutlined,
    PlusOutlined,
    MinusCircleOutlined,
    UploadOutlined,
    PictureOutlined,
    ScissorOutlined,
    MoreOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import {
    getArticleById,
    createArticle,
    updateArticle,
    Article,
    CreateArticleRequest,
    UpdateArticleRequest
} from '../../api/articles'
import { getCategories } from '../../api/articleCategories'
import { getTags } from '../../api/articleTags'
import RichTextEditor from '../../components/RichTextEditor'
import SimpleRichTextEditor from '../../components/SimpleRichTextEditor'
import EnhancedRichTextEditor from '../../components/EnhancedRichTextEditor'
import ImageCropper from '../../components/ImageCropper'
import { deleteImage } from '../../services/uploadService'

const { Option } = Select
const { TextArea } = Input
const { Title } = Typography

const ArticleEditor: React.FC = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [article, setArticle] = useState<Article | null>(null)
    const [isEdit, setIsEdit] = useState(false)
    const [coverImageUrl, setCoverImageUrl] = useState<string>('')
    const [cropperVisible, setCropperVisible] = useState(false)
    const [tempImageUrl, setTempImageUrl] = useState<string>('')
    const [imageAspectRatio, setImageAspectRatio] = useState<number>(4 / 3)
    const [imageLoading, setImageLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState<any[]>([])
    const [tags, setTags] = useState<any[]>([])

    // 计算显示用的比例字符串
    const aspectRatioDisplay = useMemo(() => {
        return imageAspectRatio.toFixed(2)
    }, [imageAspectRatio])

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
        { value: 'draft', label: '草稿' },
        { value: 'published', label: '已发布' },
        { value: 'archived', label: '已归档' }
    ]

    // 初始化数据
    useEffect(() => {
        fetchCategories()
        fetchTags()
    }, [])

    // 获取文章详情
    const fetchArticle = async () => {
        if (!id) return

        setLoading(true)
        try {
            const response = await getArticleById(id)
            const articleData = response.data
            setArticle(articleData)
            setIsEdit(true)

            // 填充表单
            form.setFieldsValue({
                title: articleData.title,
                content: articleData.content,
                summary: articleData.summary,
                coverImage: articleData.coverImage,
                category: articleData.category,
                tags: articleData.tags,
                status: articleData.status,
                isTop: articleData.isTop,
                isRecommend: articleData.isRecommend,
                seoTitle: articleData.seoTitle,
                seoKeywords: articleData.seoKeywords,
                seoDescription: articleData.seoDescription
            })

            // 设置封面图片状态
            if (articleData.coverImage) {
                // 使用 setTimeout 避免循环引用
                setTimeout(() => {
                    setCoverImageUrl(articleData.coverImage!)
                    calculateImageAspectRatio(articleData.coverImage!)
                }, 0)
            }
        } catch (error) {
            message.error('获取文章详情失败')
            navigate('/content/articles')
        } finally {
            setLoading(false)
        }
    }



    // 初始加载
    useEffect(() => {
        if (id) {
            fetchArticle()
        }
    }, [id])

    // 处理表单提交
    const handleSubmit = async (values: any) => {
        setSaving(true)
        try {
            const articleData = {
                ...values,
                author: '当前用户', // 这里应该从用户状态获取
                authorId: 'current-user-id'
            }

            if (isEdit && article) {
                await updateArticle(article._id, articleData)
                message.success('文章更新成功')
            } else {
                await createArticle(articleData as CreateArticleRequest)
                message.success('文章创建成功')
            }

            navigate('/content/articles')
        } catch (error) {
            message.error(isEdit ? '更新文章失败' : '创建文章失败')
        } finally {
            setSaving(false)
        }
    }



    // 预览文章
    const handlePreview = () => {
        const values = form.getFieldsValue()
        if (!values.title || !values.content) {
            message.warning('请先填写文章标题和内容')
            return
        }

        // 如果是编辑模式，跳转到预览页面
        if (isEdit && article) {
            navigate(`/content/articles/preview/${article._id}`)
        } else {
            message.info('请先保存文章后再预览')
        }
    }

    // 返回列表
    const handleBack = () => {
        navigate('/content/articles')
    }

    // 处理图片裁切
    const handleCrop = (croppedImageUrl: string) => {
        // 使用 setTimeout 避免循环引用
        setTimeout(() => {
            setCoverImageUrl(croppedImageUrl)
            form.setFieldValue('coverImage', croppedImageUrl)
        }, 0)
        setCropperVisible(false)
        setTempImageUrl('')
        message.success('图片裁切成功')
    }

    // 取消裁切
    const handleCancelCrop = () => {
        setCropperVisible(false)
        setTempImageUrl('')
    }

    // 计算图片宽高比
    const calculateImageAspectRatio = (imageUrl: string) => {
        setImageLoading(true)
        const img = new Image()
        img.onload = () => {
            const ratio = img.width / img.height
            setImageAspectRatio(ratio)
            setImageLoading(false)
        }
        img.onerror = () => {
            setImageAspectRatio(4 / 3) // 默认比例
            setImageLoading(false)
        }
        img.src = imageUrl
    }

    // 打开裁切器
    const handleOpenCropper = () => {
        if (!coverImageUrl) {
            message.warning('请先上传图片')
            return
        }
        setTempImageUrl(coverImageUrl)
        setCropperVisible(true)
        message.info('请调整裁切区域以获得最佳显示效果')
    }

    // 删除封面图片
    const handleDeleteCoverImage = async () => {
        if (!coverImageUrl) {
            message.warning('没有可删除的图片')
            return
        }

        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这张封面图片吗？删除后将无法恢复。',
            okText: '确定删除',
            cancelText: '取消',
            onOk: async () => {
                try {
                    // 先删除服务器上的文件
                    const result = await deleteImage(coverImageUrl)

                    // 删除成功后清理本地状态
                    setCoverImageUrl('')
                    setImageAspectRatio(4 / 3) // 重置为默认比例
                    setImageLoading(false)
                    form.setFieldValue('coverImage', '')

                    // 如果是编辑模式，自动保存文章以更新数据库
                    if (isEdit && article) {
                        const currentValues = form.getFieldsValue()
                        const updateData = {
                            ...currentValues,
                            coverImage: '' // 确保封面图片字段为空
                        }

                        await updateArticle(article._id, updateData)
                        message.success('封面图片已删除并保存')
                    } else {
                        // 新建模式，只显示删除成功
                        if (result && result.message && result.message.includes('已不存在')) {
                            message.success('封面图片已清理')
                        } else {
                            message.success('封面图片已从服务器删除')
                        }
                    }
                } catch (error: any) {
                    console.error('删除封面图片失败:', error)
                    message.error(error.message || '删除封面图片失败')
                }
            }
        })
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
                        title: isEdit ? '编辑文章' : '新建文章'
                    }
                ]}
            />

            {/* 页面标题 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    {isEdit ? '编辑文章' : '新建文章'}
                </Title>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                        返回列表
                    </Button>
                    <Button icon={<EyeOutlined />} onClick={handlePreview}>
                        预览
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={saving}
                        onClick={() => form.submit()}
                    >
                        {saving ? '保存中...' : '保存'}
                    </Button>
                </Space>
            </div>

            {/* 文章编辑表单 */}
            <Card loading={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        status: 'draft',
                        isTop: false,
                        isRecommend: false,
                        tags: []
                    }}
                >
                    <Row gutter={24}>
                        {/* 左侧：主要内容 */}
                        <Col span={16}>
                            <Card title="文章内容" style={{ marginBottom: 24 }}>
                                <Form.Item
                                    name="title"
                                    label="文章标题"
                                    rules={[{ required: true, message: '请输入文章标题' }]}
                                >
                                    <Input
                                        placeholder="请输入文章标题"
                                        size="large"
                                        style={{ fontSize: 16 }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="summary"
                                    label="文章摘要"
                                >
                                    <TextArea
                                        placeholder="请输入文章摘要（可选）"
                                        rows={3}
                                        maxLength={200}
                                        showCount
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="content"
                                    label="文章内容"
                                    rules={[{ required: true, message: '请输入文章内容' }]}
                                    getValueFromEvent={(html: string) => html}
                                >
                                    <EnhancedRichTextEditor
                                        placeholder="请输入文章内容..."
                                        height={500}
                                    />
                                </Form.Item>
                            </Card>
                        </Col>

                        {/* 右侧：设置面板 */}
                        <Col span={8}>
                            <Card title="封面图片" style={{ marginBottom: 24 }}>
                                <Form.Item
                                    name="coverImage"
                                >
                                    <div>
                                        {/* 上传组件 - 只在没有图片时显示 */}
                                        {!coverImageUrl && (
                                            <div style={{
                                                width: '100%',
                                                height: 120,
                                                border: '2px dashed #d9d9d9',
                                                borderRadius: 8,
                                                backgroundColor: '#fafafa',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: 16
                                            }}>
                                                <Upload
                                                    name="file"
                                                    showUploadList={false}
                                                    action="/api/upload/article-image"
                                                    beforeUpload={(file) => {
                                                        const isImage = file.type.startsWith('image/');
                                                        if (!isImage) {
                                                            message.error('只能上传图片文件！');
                                                            return false;
                                                        }
                                                        const isLt5M = file.size / 1024 / 1024 < 5;
                                                        if (!isLt5M) {
                                                            message.error('图片大小不能超过 5MB！');
                                                            return false;
                                                        }
                                                        return true;
                                                    }}
                                                    onChange={(info) => {
                                                        if (info.file.status === 'done') {
                                                            const imageUrl = info.file.response?.data?.url;
                                                            if (imageUrl) {
                                                                // 使用 setTimeout 避免循环引用
                                                                setTimeout(() => {
                                                                    form.setFieldValue('coverImage', imageUrl);
                                                                    setCoverImageUrl(imageUrl);
                                                                    calculateImageAspectRatio(imageUrl);
                                                                }, 0);
                                                                message.success('封面图片上传成功');
                                                            }
                                                        } else if (info.file.status === 'error') {
                                                            message.error('封面图片上传失败');
                                                        }
                                                    }}
                                                >
                                                    <div style={{
                                                        textAlign: 'center',
                                                        color: '#999',
                                                        cursor: 'pointer'
                                                    }}>
                                                        <PictureOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                                                        <div>点击上传封面图片</div>
                                                    </div>
                                                </Upload>
                                            </div>
                                        )}

                                        {/* 图片预览 - 独立显示，不受容器限制 */}
                                        {coverImageUrl && (
                                            <div style={{ marginBottom: 16 }}>
                                                <div style={{
                                                    width: '100%',
                                                    border: '1px solid #e8e8e8',
                                                    borderRadius: 8,
                                                    overflow: 'hidden',
                                                    backgroundColor: '#fafafa',
                                                    position: 'relative'
                                                }}>
                                                    <img
                                                        src={coverImageUrl}
                                                        alt="封面图片"
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            display: 'block'
                                                        }}
                                                    />

                                                    {/* 悬浮菜单 */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                        borderRadius: 12,
                                                        padding: 4,
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                                        backdropFilter: 'blur(10px)',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                                    }}>
                                                        <Dropdown
                                                            menu={{
                                                                items: [
                                                                    {
                                                                        key: 'crop',
                                                                        icon: <ScissorOutlined />,
                                                                        label: '裁切图片',
                                                                        onClick: handleOpenCropper
                                                                    },
                                                                    {
                                                                        key: 'delete',
                                                                        icon: <DeleteOutlined />,
                                                                        label: '删除图片',
                                                                        onClick: handleDeleteCoverImage
                                                                    }
                                                                ]
                                                            }}
                                                            placement="bottomRight"
                                                            trigger={['click']}
                                                        >
                                                            <Button
                                                                type="text"
                                                                icon={<EditOutlined />}
                                                                style={{
                                                                    color: '#666',
                                                                    border: 'none',
                                                                    padding: 0,
                                                                    width: 20,
                                                                    height: 20,
                                                                    borderRadius: '50%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    transition: 'all 0.2s ease',
                                                                    minWidth: 'auto'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                                                    e.currentTarget.style.color = '#333';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                                    e.currentTarget.style.color = '#666';
                                                                }}
                                                            />
                                                        </Dropdown>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 说明文字 */}
                                        <div style={{
                                            fontSize: 13,
                                            color: '#666',
                                            lineHeight: 1.5
                                        }}>
                                            <div>• 建议尺寸：1200×900px（4:3比例）</div>
                                            <div>• 支持 JPG、PNG、GIF 格式，最大 5MB</div>
                                            <div>• 图片按原始比例显示，建议使用裁切功能调整比例</div>
                                        </div>
                                    </div>
                                </Form.Item>
                            </Card>

                            <Card title="发布设置" style={{ marginBottom: 24 }}>
                                <Form.Item
                                    name="category"
                                    label="文章分类"
                                    rules={[{ required: true, message: '请选择文章分类' }]}
                                >
                                    <Select placeholder="请选择分类">
                                        {categories.map(category => (
                                            <Option key={category._id} value={category._id}>
                                                {category.displayName}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="status"
                                    label="发布状态"
                                >
                                    <Select placeholder="请选择发布状态">
                                        {statusOptions.map(option => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="tags"
                                    label="标签"
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="请选择标签"
                                        style={{ width: '100%' }}
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {tags.map(tag => (
                                            <Option key={tag._id} value={tag._id}>
                                                {tag.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="isTop"
                                    label="置顶文章"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>

                                <Form.Item
                                    name="isRecommend"
                                    label="推荐文章"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>
                            </Card>

                            <Card title="SEO设置">
                                <Form.Item
                                    name="seoTitle"
                                    label="SEO标题"
                                >
                                    <Input placeholder="请输入SEO标题" />
                                </Form.Item>

                                <Form.Item
                                    name="seoKeywords"
                                    label="SEO关键词"
                                >
                                    <Input placeholder="请输入SEO关键词，用逗号分隔" />
                                </Form.Item>

                                <Form.Item
                                    name="seoDescription"
                                    label="SEO描述"
                                >
                                    <TextArea
                                        placeholder="请输入SEO描述"
                                        rows={3}
                                        maxLength={200}
                                        showCount
                                    />
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* 图片裁切器 */}
            <ImageCropper
                visible={cropperVisible}
                imageUrl={tempImageUrl}
                onCancel={handleCancelCrop}
                onConfirm={handleCrop}
                aspectRatio={4 / 3}
            />
        </div>
    )
}

export default ArticleEditor

