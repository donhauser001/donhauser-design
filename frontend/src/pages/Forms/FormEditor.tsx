import React, { useState, useEffect } from 'react'
import {
    Button,
    Space,
    message,
    Breadcrumb,
    Typography,
    Row,
    Col
} from 'antd'
import {
    ArrowLeftOutlined,
    EyeOutlined,
    FormOutlined,
    SaveOutlined,
    UndoOutlined,
    RedoOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { getFormById, Form as FormType } from '../../api/forms'
import { useFormDesignerStore } from '../../stores/formDesignerStore'
import ComponentLibrary from '../../components/FormDesigner/ComponentLibrary'
import DesignCanvas from '../../components/FormDesigner/DesignCanvas'
import PropertyPanel from '../../components/FormDesigner/PropertyPanel'

const { Title, Text } = Typography

const FormEditor: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormType | null>(null)
    const [isNewForm] = useState(!id)
    const { loadFormConfig, undo, redo, currentStep, history } = useFormDesignerStore()

    useEffect(() => {
        if (id) {
            loadFormData()
        }
    }, [id])

    const loadFormData = async () => {
        if (!id) return

        setLoading(true)
        try {
            const data = await getFormById(id)
            setFormData(data)

            // 加载表单配置到设计器
            if (data.content) {
                loadFormConfig(data.content)
            }
        } catch (error) {
            console.error('加载表单失败:', error)
            message.error('加载表单失败')
        } finally {
            setLoading(false)
        }
    }

    // 删除handleSave函数，因为不再需要保存基础信息

    const handlePreview = () => {
        message.info('预览功能开发中...')
    }

    const handleBack = () => {
        navigate('/forms/list')
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* 面包屑导航 */}
            <Breadcrumb style={{ marginBottom: '16px' }}>
                <Breadcrumb.Item>
                    <a onClick={handleBack} style={{ cursor: 'pointer' }}>
                        <FormOutlined /> 表单管理
                    </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    {isNewForm ? '创建表单' : '表单设计器'}
                </Breadcrumb.Item>
            </Breadcrumb>

            {/* 页面标题与工具栏（将按钮上移到这里） */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>
                        {isNewForm ? '创建表单' : '表单设计器'}
                    </Title>
                    <Text type="secondary">
                        {isNewForm ? '创建新的表单并设计表单内容' : '深度设计表单内容和布局'}
                        {formData ? ` ｜ 表单: ${formData.name}` : ''}
                    </Text>
                </div>
                <Space>
                    <Button
                        icon={<UndoOutlined />}
                        onClick={undo}
                        disabled={currentStep <= 0}
                        title="撤销"
                    />
                    <Button
                        icon={<RedoOutlined />}
                        onClick={redo}
                        disabled={currentStep >= history.length - 1}
                        title="重做"
                    />
                    <Button
                        icon={<SaveOutlined />}
                        onClick={() => message.info('保存功能开发中...')}
                        title="保存"
                    />
                    <Button
                        icon={<EyeOutlined />}
                        onClick={handlePreview}
                        title="预览"
                    />
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        title="返回"
                    />
                </Space>
            </div>

            {/* 表单设计器主区域（移除卡片容器层） */}
            <div style={{ width: '100%' }}>
                <Row gutter={16} style={{ height: 'calc(100vh - 300px)' }}>
                    <Col span={5}>
                        <ComponentLibrary />
                    </Col>
                    <Col span={13}>
                        <DesignCanvas />
                    </Col>
                    <Col span={6}>
                        <PropertyPanel />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default FormEditor 