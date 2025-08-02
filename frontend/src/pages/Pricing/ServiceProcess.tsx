import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Steps, Descriptions, InputNumber, Row, Col } from 'antd'
import { SearchOutlined, PlusOutlined, EyeOutlined, DeleteOutlined, DragOutlined, StopOutlined } from '@ant-design/icons'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import {
    getAllServiceProcesses,
    createServiceProcess,
    updateServiceProcess,
    toggleServiceProcessStatus,
    deleteServiceProcess,
    searchServiceProcesses,
    type ServiceProcess,
    type ProcessStep
} from '../../api/serviceProcess'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const { Option } = Select
const { Step } = Steps

// 可拖拽的流程步骤组件
const SortableStepItem: React.FC<{
    step: ProcessStep
    onUpdate: (step: ProcessStep) => void
    onDelete: (id: string) => void
}> = ({ step, onUpdate, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: step.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            className="sortable-step-item"
            style={{
                ...style,
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '8px',
                backgroundColor: '#fafafa',
            }}
        >
            <Row gutter={16} align="middle" style={{ marginBottom: 12 }}>
                <Col span={1}>
                    <div
                        {...attributes}
                        {...listeners}
                        style={{ cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <DragOutlined style={{ color: '#999' }} />
                    </div>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="流程名称"
                        style={{ marginBottom: 0 }}
                    >
                        <Input
                            value={step.name}
                            onChange={(e) => onUpdate({ ...step, name: e.target.value })}
                            placeholder="请输入流程名称"
                        />
                    </Form.Item>
                </Col>
                <Col span={5}>
                    <Form.Item
                        label="进度比例(%)"
                        style={{ marginBottom: 0 }}
                    >
                        <InputNumber
                            value={step.progressRatio}
                            onChange={(value) => onUpdate({ ...step, progressRatio: value || 0 })}
                            min={0}
                            max={100}
                            placeholder="0-100"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Col>
                <Col span={5}>
                    <Form.Item
                        label="损稿计费比例(%)"
                        style={{ marginBottom: 0 }}
                    >
                        <InputNumber
                            value={step.lossBillingRatio}
                            onChange={(value) => onUpdate({ ...step, lossBillingRatio: value || 0 })}
                            min={0}
                            max={100}
                            placeholder="0-100"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Col>
                <Col span={5}>
                    <Form.Item
                        label="周期(天)"
                        style={{ marginBottom: 0 }}
                    >
                        <InputNumber
                            value={step.cycle}
                            onChange={(value) => onUpdate({ ...step, cycle: value || 0 })}
                            min={0}
                            placeholder="天数"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(step.id)}
                        style={{ marginTop: '24px' }}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={1}>
                    <div style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '8px' }}>
                        <div style={{ width: '16px', height: '16px' }}></div>
                    </div>
                </Col>
                <Col span={23}>
                    <Form.Item
                        label="节点描述"
                        style={{ marginBottom: 0 }}
                    >
                        <Input.TextArea
                            value={step.description}
                            onChange={(e) => onUpdate({ ...step, description: e.target.value })}
                            placeholder="请输入节点描述"
                            rows={2}
                            style={{ resize: 'none' }}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )
}

const ServiceProcess: React.FC = () => {
    const [data, setData] = useState<ServiceProcess[]>([])

    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [detailVisible, setDetailVisible] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [selectedProcess, setSelectedProcess] = useState<ServiceProcess | null>(null)
    const [editingProcess, setEditingProcess] = useState<ServiceProcess | null>(null)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    // 新建流程相关状态
    const [newProcessForm] = Form.useForm()
    const [newProcessSteps, setNewProcessSteps] = useState<ProcessStep[]>([])
    const [stepCounter, setStepCounter] = useState(1)

    // DnD 传感器
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // 加载数据
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const processes = await getAllServiceProcesses()
                setData(processes)
            } catch (error) {
                message.error('加载数据失败')
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    // 搜索和筛选
    const filteredData = data.filter(item => {
        const matchName = item.name.includes(search)
        const matchStatus = statusFilter === 'all' || item.status === statusFilter
        return matchName && matchStatus
    })

    // 查看详情
    const showDetail = (record: ServiceProcess) => {
        setSelectedProcess(record)
        setDetailVisible(true)
    }

    // 显示新建流程模态窗口
    const showNewProcessModal = () => {
        setModalVisible(true)
        setNewProcessSteps([])
        setStepCounter(1)
        newProcessForm.resetFields()
    }

    // 显示编辑流程模态窗口
    const handleEditProcess = (record: ServiceProcess) => {
        setEditingProcess(record)
        setNewProcessSteps([...record.steps])
        setStepCounter(record.steps.length + 1)
        newProcessForm.setFieldsValue({
            name: record.name,
            description: record.description
        })
        setEditModalVisible(true)
    }

    // 添加流程步骤
    const addProcessStep = () => {
        const newStep: ProcessStep = {
            id: `new-${stepCounter}`,
            name: '',
            description: '',
            order: newProcessSteps.length + 1,
            progressRatio: 0,
            lossBillingRatio: 0,
            cycle: 0
        }
        setNewProcessSteps([...newProcessSteps, newStep])
        setStepCounter(stepCounter + 1)
    }

    // 更新流程步骤
    const updateProcessStep = (updatedStep: ProcessStep) => {
        setNewProcessSteps(steps =>
            steps.map(step => step.id === updatedStep.id ? updatedStep : step)
        )
    }

    // 删除流程步骤
    const deleteProcessStep = (stepId: string) => {
        setNewProcessSteps(steps => {
            const filteredSteps = steps.filter(step => step.id !== stepId)
            // 重新排序
            return filteredSteps.map((step, index) => ({
                ...step,
                order: index + 1
            }))
        })
    }

    // 处理拖拽排序
    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setNewProcessSteps((items) => {
                const oldIndex = items.findIndex((item: ProcessStep) => item.id === active.id)
                const newIndex = items.findIndex((item: ProcessStep) => item.id === over.id)

                const newItems = arrayMove(items, oldIndex, newIndex)
                // 重新排序
                return newItems.map((item: ProcessStep, index: number) => ({
                    ...item,
                    order: index + 1
                }))
            })
        }
    }

    // 保存新流程
    const handleSaveProcess = async () => {
        try {
            const values = await newProcessForm.validateFields()

            if (newProcessSteps.length === 0) {
                message.error('请至少添加一个流程步骤')
                return
            }

            const newProcess = {
                name: values.name,
                description: values.description || '',
                steps: newProcessSteps
            }

            const createdProcess = await createServiceProcess(newProcess)
            setData([createdProcess, ...data])
            setModalVisible(false)
            message.success('流程创建成功')
        } catch (error) {
            console.error('表单验证失败:', error)
        }
    }

    // 保存编辑流程
    const handleSaveEditProcess = async () => {
        try {
            const values = await newProcessForm.validateFields()

            if (newProcessSteps.length === 0) {
                message.error('请至少添加一个流程步骤')
                return
            }

            if (!editingProcess) return

            const updateData = {
                name: values.name,
                description: values.description || '',
                steps: newProcessSteps,
            }

            const updatedProcess = await updateServiceProcess(editingProcess._id, updateData)
            setData(data.map(item => item._id === editingProcess._id ? updatedProcess : item))
            setEditModalVisible(false)
            setEditingProcess(null)
            message.success('流程更新成功')
        } catch (error) {
            console.error('表单验证失败:', error)
        }
    }

    // 切换流程状态
    const handleToggleStatus = async (record: ServiceProcess) => {
        try {
            const updatedProcess = await toggleServiceProcessStatus(record._id)
            setData(data.map(item => item._id === record._id ? updatedProcess : item))
            message.success(`流程已${updatedProcess.status === 'active' ? '启用' : '禁用'}`)
        } catch (error) {
            message.error('切换状态失败')
        }
    }

    // 删除流程
    const handleDeleteProcess = async (record: ServiceProcess) => {
        try {
            await deleteServiceProcess(record._id)
            setData(data.filter(item => item._id !== record._id))
            message.success('删除成功')
        } catch (error) {
            message.error('删除失败')
        }
    }

    const columns = [
        {
            title: '流程名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string, record: ServiceProcess) => (
                <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{name}</div>
                    {record.description && (
                        <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.4 }}>
                            {record.description.length > 50 ? `${record.description.substring(0, 50)}...` : record.description}
                        </div>
                    )}
                    {record.status === 'inactive' && (
                        <Tag color="red" style={{ marginTop: 4, fontSize: '12px' }}>
                            已禁用
                        </Tag>
                    )}
                </div>
            )
        },
        {
            title: '流程步骤',
            dataIndex: 'steps',
            key: 'steps',
            width: 120,
            render: (steps: ProcessStep[]) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{steps.length}个步骤</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        总周期: {steps.reduce((sum, step) => sum + step.cycle, 0)}天
                    </div>
                </div>
            )
        },



        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 100,
            render: (createTime: string) => new Date(createTime).toLocaleDateString('zh-CN')
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_: any, record: ServiceProcess) => {
                const actions = [
                    {
                        key: 'view',
                        label: '查看详情',
                        icon: <EyeOutlined />,
                        onClick: () => showDetail(record)
                    },
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => handleEditProcess(record)
                    },
                    {
                        key: 'toggleStatus',
                        label: record.status === 'active' ? '禁用' : '启用',
                        icon: record.status === 'active' ? <StopOutlined /> : <EyeOutlined />,
                        onClick: () => handleToggleStatus(record)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDeleteProcess(record)
                    }
                ]

                return <ActionMenu actions={actions} />
            },
        },
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>服务流程</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={showNewProcessModal}>
                    新增流程
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索流程名称"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            allowClear
                        />

                        <Select
                            placeholder="状态"
                            style={{ width: 120 }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="all">全部状态</Option>
                            <Option value="active">启用</Option>
                            <Option value="inactive">禁用</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* 新建流程模态窗口 */}
            <Modal
                title="新建服务流程"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSaveProcess}
                width={1200}
                okText="保存"
                cancelText="取消"
            >
                <Form form={newProcessForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="流程名称"
                        rules={[{ required: true, message: '请输入流程名称' }]}
                    >
                        <Input placeholder="请输入流程名称" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="流程描述"
                    >
                        <Input.TextArea rows={3} placeholder="请输入流程描述" />
                    </Form.Item>

                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3>流程步骤</h3>
                            <Button type="dashed" icon={<PlusOutlined />} onClick={addProcessStep}>
                                添加步骤
                            </Button>
                        </div>

                        {newProcessSteps.length > 0 && (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={newProcessSteps.map(step => step.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {newProcessSteps.map((step) => (
                                        <SortableStepItem
                                            key={step.id}
                                            step={step}
                                            onUpdate={updateProcessStep}
                                            onDelete={deleteProcessStep}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}

                        {newProcessSteps.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                点击"添加步骤"开始创建流程
                            </div>
                        )}
                    </div>
                </Form>
            </Modal>

            {/* 流程详情弹窗 */}
            <Modal
                title="流程详情"
                open={detailVisible}
                onCancel={() => { setDetailVisible(false); setSelectedProcess(null) }}
                footer={[
                    <Button key="edit" type="primary" onClick={() => {
                        setDetailVisible(false);
                        handleEditProcess(selectedProcess!);
                    }}>
                        编辑流程
                    </Button>,
                    <Button key="close" onClick={() => { setDetailVisible(false); setSelectedProcess(null) }}>
                        关闭
                    </Button>
                ]}
                width={900}
            >
                {selectedProcess && (
                    <div>
                        <Descriptions title="基本信息" bordered column={2} style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="流程名称" span={1}>{selectedProcess.name}</Descriptions.Item>
                            <Descriptions.Item label="状态" span={1}>
                                <Tag color={selectedProcess.status === 'active' ? 'green' : 'red'}>
                                    {selectedProcess.status === 'active' ? '启用' : '禁用'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="创建时间" span={1}>{new Date(selectedProcess.createTime).toLocaleDateString('zh-CN')}</Descriptions.Item>
                            <Descriptions.Item label="流程描述" span={1}>{selectedProcess.description}</Descriptions.Item>
                        </Descriptions>

                        <div>
                            <h3>服务流程</h3>
                            <div style={{ marginTop: 16 }}>
                                {selectedProcess.steps.map((step, index) => (
                                    <div key={step.id} style={{ marginBottom: 16 }}>
                                        <div style={{
                                            border: '1px solid #d9d9d9',
                                            borderRadius: '6px',
                                            padding: '16px',
                                            backgroundColor: '#fafafa',
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: '-10px',
                                                left: '20px',
                                                backgroundColor: '#333',
                                                color: 'white',
                                                padding: '3px 10px',
                                                borderRadius: '10px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                步骤 {step.order}
                                            </div>
                                            <div style={{ marginTop: 8 }}>
                                                <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '16px' }}>{step.name}</h4>
                                                {step.description && (
                                                    <p style={{ margin: '0 0 12px 0', color: '#666', lineHeight: 1.5 }}>
                                                        {step.description}
                                                    </p>
                                                )}
                                                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <span style={{ fontSize: '12px', color: '#666' }}>进度:</span>
                                                        <span style={{ fontWeight: 'bold', color: '#333' }}>{step.progressRatio}%</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <span style={{ fontSize: '12px', color: '#666' }}>计费:</span>
                                                        <span style={{ fontWeight: 'bold', color: '#333' }}>{step.lossBillingRatio}%</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <span style={{ fontSize: '12px', color: '#666' }}>周期:</span>
                                                        <span style={{ fontWeight: 'bold', color: '#333' }}>{step.cycle}天</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {index < selectedProcess.steps.length - 1 && (
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                margin: '8px 0'
                                            }}>
                                                <div style={{
                                                    width: '1px',
                                                    height: '16px',
                                                    backgroundColor: '#d9d9d9',
                                                    position: 'relative'
                                                }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: '-3px',
                                                        left: '-2px',
                                                        width: '6px',
                                                        height: '6px',
                                                        backgroundColor: '#d9d9d9',
                                                        transform: 'rotate(45deg)'
                                                    }}></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 编辑流程模态窗口 */}
            <Modal
                title="编辑服务流程"
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setEditingProcess(null);
                    setNewProcessSteps([]);
                }}
                onOk={handleSaveEditProcess}
                width={1200}
                okText="保存"
                cancelText="取消"
            >
                <Form form={newProcessForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="流程名称"
                        rules={[{ required: true, message: '请输入流程名称' }]}
                    >
                        <Input placeholder="请输入流程名称" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="流程描述"
                    >
                        <Input.TextArea rows={3} placeholder="请输入流程描述" />
                    </Form.Item>

                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h3>流程步骤</h3>
                            <Button type="dashed" icon={<PlusOutlined />} onClick={addProcessStep}>
                                添加步骤
                            </Button>
                        </div>

                        {newProcessSteps.length > 0 && (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={newProcessSteps.map(step => step.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {newProcessSteps.map((step) => (
                                        <SortableStepItem
                                            key={step.id}
                                            step={step}
                                            onUpdate={updateProcessStep}
                                            onDelete={deleteProcessStep}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}

                        {newProcessSteps.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                点击"添加步骤"开始创建流程
                            </div>
                        )}
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default ServiceProcess 