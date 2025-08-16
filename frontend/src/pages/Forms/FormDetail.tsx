import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Button,
    Space,
    Breadcrumb,
    Typography,
    message,
    Spin,
    Alert,
    Divider
} from 'antd'
import {
    ArrowLeftOutlined,
    EditOutlined,
    FormOutlined,
    FileTextOutlined
} from '@ant-design/icons'
import { getFormById, Form as FormType } from '../../api/forms'
import { useFormDesignerStore } from '../../stores/formDesignerStore'
import FormComponentRenderer from '../../components/FormDesigner/FormComponentRenderer'
import { FormComponent } from '../../types/formDesigner'

const { Text, Title, Paragraph } = Typography

const FormDetail: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [form, setForm] = useState<FormType | null>(null)
    const [loading, setLoading] = useState(true)
    const { loadFormConfig } = useFormDesignerStore()

    useEffect(() => {
        if (id) {
            loadForm()
        }
    }, [id])

    const loadForm = async () => {
        if (!id) return

        try {
            setLoading(true)
            const formData = await getFormById(id)
            setForm(formData)

            // 加载表单配置到设计器状态中，以便渲染组件
            if (formData.content) {
                await loadFormConfig(formData.content)
            }
        } catch (error: any) {
            console.error('加载表单失败:', error)
            message.error(error.response?.data?.message || '加载表单失败')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = () => {
        if (form) {
            navigate(`/forms/edit/${form._id}`)
        }
    }

    const handleBack = () => {
        navigate('/forms/list')
    }



    if (loading) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        )
    }

    if (!form) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    message="表单不存在"
                    description="您访问的表单不存在或已被删除"
                    type="error"
                    showIcon
                    action={
                        <Button type="primary" onClick={handleBack}>
                            返回列表
                        </Button>
                    }
                />
            </div>
        )
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* 面包屑导航 */}
            <Breadcrumb style={{ marginBottom: '16px' }}>
                <Breadcrumb.Item>
                    <FormOutlined style={{ marginRight: '4px' }} />
                    表单系统
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <span
                        onClick={() => navigate('/forms/list')}
                        style={{
                            cursor: 'pointer',
                            color: '#1890ff',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = 'underline'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = 'none'
                        }}
                    >
                        表单列表
                    </span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    {form.name}
                </Breadcrumb.Item>
            </Breadcrumb>

            {/* 操作按钮 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                        返回列表
                    </Button>
                    <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                        编辑表单
                    </Button>
                </Space>
            </div>

            {/* 表单内容预览 */}
            <div>
                <FormPreviewRenderer form={form} />
            </div>
        </div>
    )
}

// 表单预览渲染器组件
interface FormPreviewRendererProps {
    form: FormType
}

const FormPreviewRenderer: React.FC<FormPreviewRendererProps> = ({ form }) => {
    const { components, layout, theme } = useFormDesignerStore()

    if (!form.content || !components || components.length === 0) {
        return (
            <div style={{ textAlign: 'center', color: '#999', padding: '60px 0' }}>
                <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>该表单暂无内容</div>
            </div>
        )
    }

    // 只渲染根级组件（没有父组件的组件）
    const rootComponents = components.filter(comp => !comp.parentId)

    return (
        <div style={{ position: 'relative' }}>
            {/* 表单标题和描述 */}
            {(form.showFormTitle || form.showFormDescription) && (
                <div style={{
                    marginBottom: theme.formDescriptionMarginBottom || '32px',
                    paddingBottom: '24px',
                    borderBottom: '1px solid #f0f0f0',
                    maxWidth: layout.formWidth || '1200px',
                    margin: `0 auto ${theme.formDescriptionMarginBottom || '32px'} auto`
                }}>
                    {form.showFormTitle && form.name && (
                        <h1 style={{
                            margin: `0 0 ${theme.formTitleMarginBottom || '16px'} 0`,
                            fontSize: theme.formTitleFontSize || '28px',
                            fontWeight: theme.formTitleFontWeight || 600,
                            color: theme.formTitleColor || theme.textColor || '#262626',
                            textAlign: theme.formTitleAlign || 'center'
                        }}>
                            {form.name}
                        </h1>
                    )}
                    {form.showFormDescription && form.description && (
                        <p style={{
                            margin: 0,
                            fontSize: theme.formDescriptionFontSize || '16px',
                            color: theme.formDescriptionColor || theme.descriptionColor || '#8c8c8c',
                            textAlign: theme.formDescriptionAlign || 'center',
                            lineHeight: theme.formDescriptionLineHeight || 1.6
                        }}>
                            {form.description}
                        </p>
                    )}
                </div>
            )}

            {/* 渲染表单组件 */}
            <div style={{
                maxWidth: layout.formWidth || '1200px',
                margin: '0 auto'
            }}>
                {rootComponents.map((component: FormComponent) => (
                    <div key={component.id} style={{ marginBottom: layout.componentSpacing || '16px' }}>
                        <FormComponentRenderer
                            component={component}
                            isDesignMode={false}
                        />
                    </div>
                ))}
            </div>

            {/* 提交按钮区域 */}
            <div style={{
                marginTop: '32px',
                textAlign: form.submitButtonPosition || 'center',
                borderTop: '1px solid #f0f0f0',
                paddingTop: '24px'
            }}>
                <Button
                    type="primary"
                    size="large"
                    disabled
                    style={{ opacity: 0.6 }}
                >
                    {form.submitButtonText || '提交'}
                    <Text style={{ fontSize: '12px', marginLeft: '8px', color: '#999' }}>
                        (预览模式)
                    </Text>
                </Button>
            </div>
        </div>
    )
}

export default FormDetail
