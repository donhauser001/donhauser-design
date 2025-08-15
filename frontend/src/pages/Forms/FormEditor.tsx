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
    RedoOutlined,
    SettingOutlined
} from '@ant-design/icons'
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    pointerWithin,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useNavigate, useParams } from 'react-router-dom'
import { getFormById, Form as FormType } from '../../api/forms'
import { useFormDesignerStore } from '../../stores/formDesignerStore'
import ComponentLibrary from '../../components/FormDesigner/ComponentLibrary'
import DesignCanvas from '../../components/FormDesigner/DesignCanvas'
import PropertyPanel from '../../components/FormDesigner/PropertyPanel'
import FormSettingsModal from '../../components/FormDesigner/FormSettingsModal'
import FormComponentRenderer from '../../components/FormDesigner/FormComponentRenderer'

const { Title, Text } = Typography

const FormEditor: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormType | null>(null)
    const [isNewForm] = useState(!id)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [isPreviewMode, setIsPreviewMode] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false)

    const {
        components,
        loadFormConfig,
        undo,
        redo,
        currentStep,
        history,
        addComponent,
        addComponentToColumn,
        moveComponent,
        moveComponentToColumn,
        batchUpdateComponents,
        saveFormToAPI
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

    // 键盘快捷键
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                if (id && !isSaving) {
                    handleSave()
                }
            }
        }

        document.addEventListener('keydown', handleKeyPress)
        return () => document.removeEventListener('keydown', handleKeyPress)
    }, [id, isSaving])

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

    const handleSave = async () => {
        if (!id) {
            message.error('无法保存：表单ID不存在');
            return;
        }

        setIsSaving(true);
        try {
            await saveFormToAPI(id);
            setLastSaved(new Date());
            message.success('表单保存成功');
        } catch (error) {
            console.error('保存失败:', error);
            message.error('表单保存失败');
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenSettings = () => {
        setIsSettingsModalVisible(true);
    };

    const handleSettingsSave = async () => {
        try {
            if (id) {
                // 保存表单基本信息
                await saveFormToAPI(id);
                setLastSaved(new Date());
                message.success('表单设置保存成功');
            }
        } catch (error) {
            console.error('保存设置失败:', error);
            message.error('保存设置失败');
        }
    };

    const handlePreview = () => {
        setIsPreviewMode(!isPreviewMode)
        message.success(isPreviewMode ? '已切换到设计模式' : '已切换到预览模式')
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

        console.log('拖拽结束事件:', {
            activeId: active.id,
            overId: over.id,
            overType: over.data.current?.type,
            activeType: active.data.current?.type
        })

        // 从组件库拖拽到画布或分组
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

            // 检查是否放置到分组区域
            if (over.data.current?.type === 'group') {
                const groupId = over.data.current.componentId
                const groupComponents = components.filter(comp => comp.parentId === groupId)
                const position = groupComponents.length // 添加到分组末尾
                addComponent(componentType, position, groupId)
                console.log('添加组件到分组:', componentType, '分组ID:', groupId)
                return
            }

            // 检查是否放置到分栏容器区域
            if (over.data.current?.type === 'column-container') {
                const containerId = over.data.current.componentId
                const containerComponents = components.filter(comp => comp.parentId === containerId)
                const position = containerComponents.length // 添加到分栏容器末尾
                addComponent(componentType, position, containerId)
                console.log('添加组件到分栏容器:', componentType, '容器ID:', containerId)
                return
            }

            // 检查是否放置到分栏的具体列
            if (over.data.current?.type === 'column') {
                const containerId = over.data.current.containerComponent.id
                const columnIndex = over.data.current.columnIndex
                const columnComponents = components.filter(comp =>
                    comp.parentId === containerId &&
                    (comp.columnIndex !== undefined ? comp.columnIndex : 0) === columnIndex
                )
                const position = columnComponents.length // 添加到该列末尾
                addComponentToColumn(componentType, position, containerId, columnIndex)
                console.log('添加组件到分栏列:', componentType, '容器ID:', containerId, '列索引:', columnIndex)
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

        // 画布内组件移动和排序
        if (active.data.current?.type === 'component-in-canvas') {
            const activeComponent = components.find(comp => comp.id === active.id)

            if (!activeComponent) return

            // 优先级1: 检查是否拖拽到画布区域（最高优先级）
            if (over.id === 'design-canvas' || over.data.current?.type === 'canvas') {
                const rootComponents = components.filter(comp => !comp.parentId)
                const position = rootComponents.length // 添加到画布末尾
                moveComponent(active.id as string, position, undefined)
                console.log('移动组件到画布:', active.id, '从父级:', activeComponent.parentId, '到位置:', position)
                return
            }

            // 优先级2: 检查是否拖拽到分组区域
            if (over.data.current?.type === 'group') {
                const groupId = over.data.current.componentId
                // 避免拖拽到自己所在的分组
                if (activeComponent.parentId !== groupId) {
                    const groupComponents = components.filter(comp => comp.parentId === groupId)
                    const position = groupComponents.length // 添加到分组末尾
                    moveComponent(active.id as string, position, groupId)
                    console.log('移动组件到分组:', active.id, '分组ID:', groupId)
                    return
                }
            }

            // 优先级3: 检查是否拖拽到分栏容器区域
            if (over.data.current?.type === 'column-container') {
                const containerId = over.data.current.componentId
                // 避免拖拽到自己所在的分栏容器
                if (activeComponent.parentId !== containerId) {
                    const containerComponents = components.filter(comp => comp.parentId === containerId)
                    const position = containerComponents.length // 添加到分栏容器末尾
                    moveComponent(active.id as string, position, containerId)
                    console.log('移动组件到分栏容器:', active.id, '容器ID:', containerId)
                    return
                }
            }

            // 优先级4: 检查是否拖拽到分栏的具体列
            if (over.data.current?.type === 'column') {
                const containerId = over.data.current.containerComponent.id
                const columnIndex = over.data.current.columnIndex
                const columnComponents = components.filter(comp =>
                    comp.parentId === containerId &&
                    (comp.columnIndex !== undefined ? comp.columnIndex : 0) === columnIndex
                )
                const position = columnComponents.length // 添加到该列末尾
                moveComponentToColumn(active.id as string, position, containerId, columnIndex)
                console.log('移动组件到分栏列:', active.id, '容器ID:', containerId, '列索引:', columnIndex)
                return
            }

            // 同级组件排序 - 简化处理
            if (active.id !== over.id && active.data.current?.type === 'component-in-canvas') {
                const overComponent = components.find(comp => comp.id === over.id)
                if (activeComponent && overComponent && activeComponent.parentId === overComponent.parentId) {
                    // 获取同级组件
                    const siblings = components
                        .filter(c => c.parentId === activeComponent.parentId)
                        .sort((a, b) => a.order - b.order)

                    const oldIndex = siblings.findIndex(s => s.id === active.id)
                    const newIndex = siblings.findIndex(s => s.id === over.id)

                    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                        // 使用arrayMove重新排序，然后批量更新所有order
                        const reorderedSiblings = arrayMove(siblings, oldIndex, newIndex)

                        // 创建批量更新
                        const updates = reorderedSiblings.map((sibling, index) => ({
                            id: sibling.id,
                            updates: { order: index }
                        }))

                        // 批量更新组件order
                        batchUpdateComponents(updates)
                        console.log('组件重新排序完成:', active.id, '从位置', oldIndex, '到位置', newIndex)
                        console.log('新的排序:', reorderedSiblings.map((s, i) => ({ id: s.id, newOrder: i })))
                    }
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
                    <div>
                        <Text type="secondary">
                            {isNewForm ? '创建新的表单并设计表单内容' : '深度设计表单内容和布局'}
                            {formData ? ` ｜ 表单: ${formData.name}` : ''}
                        </Text>
                        {lastSaved && (
                            <div style={{ marginTop: '4px' }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    上次保存：{lastSaved.toLocaleTimeString()}
                                </Text>
                            </div>
                        )}
                    </div>
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
                        icon={<SettingOutlined />}
                        onClick={handleOpenSettings}
                        title="表单设置"
                    />
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        loading={isSaving}
                        disabled={!id}
                        title={!id ? '新表单请先在表单列表中创建' : '保存表单 (Ctrl+S)'}
                    >
                        {isSaving ? '保存中...' : '保存'}
                    </Button>
                    <Button
                        type={isPreviewMode ? "primary" : "default"}
                        icon={isPreviewMode ? <FormOutlined /> : <EyeOutlined />}
                        onClick={handlePreview}
                        title={isPreviewMode ? '设计模式' : '预览模式'}
                    >
                        {isPreviewMode ? '设计' : '预览'}
                    </Button>
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
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div style={{ width: '100%' }}>
                    <Row gutter={16} style={{ height: 'calc(100vh - 300px)' }}>
                        <Col span={5}>
                            <ComponentLibrary />
                        </Col>
                        <Col span={13}>
                            <DesignCanvas isPreviewMode={isPreviewMode} />
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

            {/* 表单设置模态窗 */}
            <FormSettingsModal
                visible={isSettingsModalVisible}
                onClose={() => setIsSettingsModalVisible(false)}
                formData={formData}
                onSave={handleSettingsSave}
            />
        </div>
    )
}

export default FormEditor 