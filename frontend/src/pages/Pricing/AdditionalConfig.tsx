import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Descriptions, InputNumber, Row, Col } from 'antd'
import { SearchOutlined, PlusOutlined, EyeOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import {
    getAllAdditionalConfigs,
    createAdditionalConfig,
    updateAdditionalConfig,
    toggleAdditionalConfigStatus,
    deleteAdditionalConfig,
    searchAdditionalConfigs,
    type AdditionalConfig,
    type CreateConfigData,
    type UpdateConfigData
} from '../../api/additionalConfig'

const { Option } = Select

const AdditionalConfig: React.FC = () => {
    const [data, setData] = useState<AdditionalConfig[]>([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [detailVisible, setDetailVisible] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [selectedConfig, setSelectedConfig] = useState<AdditionalConfig | null>(null)
    const [editingConfig, setEditingConfig] = useState<AdditionalConfig | null>(null)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    // 表单实例
    const [configForm] = Form.useForm()

    // 加载数据
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const configs = await getAllAdditionalConfigs()
                setData(configs)
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
    const showDetail = (record: AdditionalConfig) => {
        setSelectedConfig(record)
        setDetailVisible(true)
    }

    // 显示新建配置模态窗口
    const showNewConfigModal = () => {
        setModalVisible(true)
        configForm.resetFields()
    }

    // 显示编辑配置模态窗口
    const handleEditConfig = (record: AdditionalConfig) => {
        setEditingConfig(record)
        configForm.setFieldsValue({
            name: record.name,
            description: record.description,
            initialDraftCount: record.initialDraftCount,
            maxDraftCount: record.maxDraftCount,
            mainCreatorRatio: record.mainCreatorRatio,
            assistantRatio: record.assistantRatio
        })
        setEditModalVisible(true)
    }

    // 保存新建配置
    const handleSaveConfig = async () => {
        try {
            const values = await configForm.validateFields()

            const newConfig: CreateConfigData = {
                name: values.name,
                description: values.description || '',
                initialDraftCount: values.initialDraftCount,
                maxDraftCount: values.maxDraftCount,
                mainCreatorRatio: values.mainCreatorRatio,
                assistantRatio: values.assistantRatio
            }

            const createdConfig = await createAdditionalConfig(newConfig)
            setData([createdConfig, ...data])
            setModalVisible(false)
            message.success('配置创建成功')
        } catch (error) {
            console.error('表单验证失败:', error)
        }
    }

    // 保存编辑配置
    const handleSaveEditConfig = async () => {
        try {
            const values = await configForm.validateFields()

            if (!editingConfig) return

            const updateData: UpdateConfigData = {
                name: values.name,
                description: values.description || '',
                initialDraftCount: values.initialDraftCount,
                maxDraftCount: values.maxDraftCount,
                mainCreatorRatio: values.mainCreatorRatio,
                assistantRatio: values.assistantRatio
            }

            const updatedConfig = await updateAdditionalConfig(editingConfig._id, updateData)
            setData(data.map(item => item._id === editingConfig._id ? updatedConfig : item))
            setEditModalVisible(false)
            setEditingConfig(null)
            message.success('配置更新成功')
        } catch (error) {
            console.error('表单验证失败:', error)
        }
    }

    // 切换配置状态
    const handleToggleStatus = async (record: AdditionalConfig) => {
        try {
            const updatedConfig = await toggleAdditionalConfigStatus(record._id)
            setData(data.map(item => item._id === record._id ? updatedConfig : item))
            message.success(`配置已${updatedConfig.status === 'active' ? '启用' : '禁用'}`)
        } catch (error) {
            message.error('切换状态失败')
        }
    }

    // 删除配置
    const handleDeleteConfig = async (record: AdditionalConfig) => {
        try {
            await deleteAdditionalConfig(record._id)
            setData(data.filter(item => item._id !== record._id))
            message.success('删除成功')
        } catch (error) {
            message.error('删除失败')
        }
    }

    const columns = [
        {
            title: '配置名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string, record: AdditionalConfig) => (
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
            title: '初稿方案数量',
            dataIndex: 'initialDraftCount',
            key: 'initialDraftCount',
            width: 120,
            render: (count: number) => `${count}个`
        },
        {
            title: '最多方案数量',
            dataIndex: 'maxDraftCount',
            key: 'maxDraftCount',
            width: 120,
            render: (count: number) => `${count}个`
        },
        {
            title: '主创绩效比例',
            dataIndex: 'mainCreatorRatio',
            key: 'mainCreatorRatio',
            width: 120,
            render: (ratio: number) => `${ratio}%`
        },
        {
            title: '助理绩效比例',
            dataIndex: 'assistantRatio',
            key: 'assistantRatio',
            width: 120,
            render: (ratio: number) => `${ratio}%`
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
            render: (_: any, record: AdditionalConfig) => {
                const actions = [
                    {
                        key: 'view',
                        label: '查看详情',
                        icon: <EyeOutlined />,
                        onClick: () => showDetail(record)
                    },
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => handleEditConfig(record)
                    },
                    {
                        key: 'toggleStatus',
                        label: record.status === 'active' ? '禁用' : '启用',
                        icon: record.status === 'active' ? <StopOutlined /> : <EyeOutlined />,
                        onClick: () => handleToggleStatus(record)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDeleteConfig(record)
                    }
                ]

                return <ActionMenu actions={actions} />
            },
        },
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>附加配置</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={showNewConfigModal}>
                    新增配置
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索配置名称"
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

            {/* 新建配置模态窗口 */}
            <Modal
                title="新建附加配置"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSaveConfig}
                width={800}
                okText="保存"
                cancelText="取消"
            >
                <Form form={configForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="配置名称"
                                rules={[{ required: true, message: '请输入配置名称' }]}
                            >
                                <Input placeholder="请输入配置名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="initialDraftCount"
                                label="初稿方案数量"
                                rules={[{ required: true, message: '请输入初稿方案数量' }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={10}
                                    placeholder="1-10"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="maxDraftCount"
                                label="最多方案数量"
                                rules={[{ required: true, message: '请输入最多方案数量' }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={20}
                                    placeholder="1-20"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="mainCreatorRatio"
                                label="主创绩效比例(%)"
                                rules={[{ required: true, message: '请输入主创绩效比例' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    placeholder="0-100"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="assistantRatio"
                                label="助理绩效比例(%)"
                                rules={[{ required: true, message: '请输入助理绩效比例' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    placeholder="0-100"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="description"
                        label="配置说明"
                    >
                        <Input.TextArea rows={3} placeholder="请输入配置说明" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 配置详情弹窗 */}
            <Modal
                title="配置详情"
                open={detailVisible}
                onCancel={() => { setDetailVisible(false); setSelectedConfig(null) }}
                footer={[
                    <Button key="edit" type="primary" onClick={() => {
                        setDetailVisible(false);
                        handleEditConfig(selectedConfig!);
                    }}>
                        编辑配置
                    </Button>,
                    <Button key="close" onClick={() => { setDetailVisible(false); setSelectedConfig(null) }}>
                        关闭
                    </Button>
                ]}
                width={800}
            >
                {selectedConfig && (
                    <div>
                        <Descriptions title="基本信息" bordered column={2} style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="配置名称" span={1}>{selectedConfig.name}</Descriptions.Item>
                            <Descriptions.Item label="状态" span={1}>
                                <Tag color={selectedConfig.status === 'active' ? 'green' : 'red'}>
                                    {selectedConfig.status === 'active' ? '启用' : '禁用'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="初稿方案数量" span={1}>{selectedConfig.initialDraftCount}个</Descriptions.Item>
                            <Descriptions.Item label="最多方案数量" span={1}>{selectedConfig.maxDraftCount}个</Descriptions.Item>
                            <Descriptions.Item label="主创绩效比例" span={1}>{selectedConfig.mainCreatorRatio}%</Descriptions.Item>
                            <Descriptions.Item label="助理绩效比例" span={1}>{selectedConfig.assistantRatio}%</Descriptions.Item>
                            <Descriptions.Item label="创建时间" span={1}>{new Date(selectedConfig.createTime).toLocaleDateString('zh-CN')}</Descriptions.Item>
                            <Descriptions.Item label="配置说明" span={1}>{selectedConfig.description || '暂无说明'}</Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Modal>

            {/* 编辑配置模态窗口 */}
            <Modal
                title="编辑附加配置"
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setEditingConfig(null);
                }}
                onOk={handleSaveEditConfig}
                width={800}
                okText="保存"
                cancelText="取消"
            >
                <Form form={configForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="配置名称"
                                rules={[{ required: true, message: '请输入配置名称' }]}
                            >
                                <Input placeholder="请输入配置名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="initialDraftCount"
                                label="初稿方案数量"
                                rules={[{ required: true, message: '请输入初稿方案数量' }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={10}
                                    placeholder="1-10"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="maxDraftCount"
                                label="最多方案数量"
                                rules={[{ required: true, message: '请输入最多方案数量' }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={20}
                                    placeholder="1-20"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="mainCreatorRatio"
                                label="主创绩效比例(%)"
                                rules={[{ required: true, message: '请输入主创绩效比例' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    placeholder="0-100"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="assistantRatio"
                                label="助理绩效比例(%)"
                                rules={[{ required: true, message: '请输入助理绩效比例' }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    placeholder="0-100"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="description"
                        label="配置说明"
                    >
                        <Input.TextArea rows={3} placeholder="请输入配置说明" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default AdditionalConfig 