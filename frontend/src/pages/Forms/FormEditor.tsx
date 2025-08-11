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
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
} from '@dnd-kit/core'
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useNavigate, useParams } from 'react-router-dom'
import { getFormById, Form as FormType } from '../../api/forms'
import { useFormDesignerStore } from '../../stores/formDesignerStore'
import ComponentLibrary from '../../components/FormDesigner/ComponentLibrary'
import DesignCanvas from '../../components/FormDesigner/DesignCanvas'
import PropertyPanel from '../../components/FormDesigner/PropertyPanel'
import FormComponentRenderer from '../../components/FormDesigner/FormComponentRenderer'

const { Title, Text } = Typography

const FormEditor: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormType | null>(null)
    const [isNewForm] = useState(!id)
    const [activeId, setActiveId] = useState<string | null>(null)

    const {
        components,
        loadFormConfig,
        undo,
        redo,
        currentStep,
        history,
        addComponent,
        moveComponent
    } = useFormDesignerStore()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

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

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        // 从组件库拖拽到画布
        if (active.data.current?.type === 'component-from-library') {
            const componentType = active.data.current.componentType

            // 检查是否放置到画布区域
            if (over.id === 'design-canvas' || over.data.current?.type === 'canvas') {
                const rootComponents = components.filter(comp => !comp.parentId)
                const position = rootComponents.length // 添加到末尾
                addComponent(componentType, position)
                console.log('添加组件到画布:', componentType)
                return
            }

            // 如果放置到某个组件上，在该组件后面插入
            if (over.data.current?.type === 'component-in-canvas') {
                const overComponent = components.find(comp => comp.id === over.id)
                if (overComponent) {
                    addComponent(componentType, overComponent.order + 1, overComponent.parentId)
                    console.log('添加组件到组件后:', componentType)
                    return
                }
            }
        }

        // 画布内组件排序
        if (active.id !== over.id && active.data.current?.type === 'component-in-canvas') {
            const activeComponent = components.find(comp => comp.id === active.id)
            const overComponent = components.find(comp => comp.id === over.id)

            if (activeComponent && overComponent) {
                // 只处理同级组件的排序
                if (activeComponent.parentId === overComponent.parentId) {
                    moveComponent(active.id as string, overComponent.order, overComponent.parentId)
                    console.log('组件重新排序:', active.id, '->', overComponent.order)
                }
            }
        }
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* 面包屑导航（使用 items API） */}
            <Breadcrumb
                style={{ marginBottom: '16px' }}
                items={[
                    {
                        title: (
                            <a onClick={handleBack} style={{ cursor: 'pointer' }}>
                                <FormOutlined /> 表单管理
                            </a>
                        )
                    },
                    { title: isNewForm ? '创建表单' : '表单设计器' }
                ]}
            />

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
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
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

                <DragOverlay>
                    {activeId ? (
                        <div style={{
                            opacity: 0.8,
                            transform: 'rotate(5deg)',
                            backgroundColor: '#fff',
                            border: '2px solid #1890ff',
                            borderRadius: '6px',
                            padding: '8px'
                        }}>
                            {activeId.startsWith('component-') ? (
                                <div>正在添加组件...</div>
                            ) : (
                                (() => {
                                    const component = components.find(comp => comp.id === activeId)
                                    return component ? <FormComponentRenderer component={component} /> : null
                                })()
                            )}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default FormEditor 