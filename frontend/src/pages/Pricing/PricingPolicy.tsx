import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Space, Input, Select, Modal, Form, message, Descriptions, InputNumber, Row, Col, DatePicker, Switch, Divider } from 'antd'
import { SearchOutlined, PlusOutlined, EyeOutlined, DeleteOutlined, StopOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import {
    getAllPricingPolicies,
    createPricingPolicy,
    updatePricingPolicy,
    togglePricingPolicyStatus,
    deletePricingPolicy,
    searchPricingPolicies,
    type PricingPolicy,
    type CreatePolicyData,
    type UpdatePolicyData,
    type TierSetting
} from '../../api/pricingPolicy'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

const { Option } = Select
const { TextArea } = Input

const PricingPolicy: React.FC = () => {
    // 设置dayjs语言为中文
    dayjs.locale('zh-cn')
    const [data, setData] = useState<PricingPolicy[]>([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [detailVisible, setDetailVisible] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [selectedPolicy, setSelectedPolicy] = useState<PricingPolicy | null>(null)
    const [editingPolicy, setEditingPolicy] = useState<PricingPolicy | null>(null)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [typeFilter, setTypeFilter] = useState<string>('all')

    // 表单实例
    const [policyForm] = Form.useForm()

    // 加载数据
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const policies = await getAllPricingPolicies()
                setData(policies)
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
        const matchName = item.name.includes(search) || item.alias.includes(search)
        const matchStatus = statusFilter === 'all' || item.status === statusFilter
        const matchType = typeFilter === 'all' || item.type === typeFilter
        return matchName && matchStatus && matchType
    })

    // 查看详情
    const showDetail = (record: PricingPolicy) => {
        setSelectedPolicy(record)
        setDetailVisible(true)
    }

    // 显示新建政策模态窗口
    const showNewPolicyModal = () => {
        setModalVisible(true)
        policyForm.resetFields()
        policyForm.setFieldsValue({
            type: 'uniform_discount',
            validUntil: null,
            isPermanent: true
        })
    }

    // 显示编辑政策模态窗口
    const handleEditPolicy = (record: PricingPolicy) => {
        setEditingPolicy(record)
        policyForm.setFieldsValue({
            name: record.name,
            alias: record.alias,
            type: record.type,
            summary: record.summary,
            validUntil: record.validUntil ? dayjs(record.validUntil) : null,
            isPermanent: !record.validUntil,
            discountRatio: record.discountRatio,
            tierSettings: record.tierSettings || []
        })
        setEditModalVisible(true)
    }

    // 保存新建政策
    const handleSavePolicy = async () => {
        try {
            const values = await policyForm.validateFields()

            const newPolicy: CreatePolicyData = {
                name: values.name,
                alias: values.alias,
                type: values.type,
                summary: values.summary || '',
                validUntil: values.isPermanent ? null : values.validUntil?.toISOString(),
                discountRatio: values.type === 'uniform_discount' ? values.discountRatio : undefined,
                tierSettings: values.type === 'tiered_discount' ? values.tierSettings : undefined
            }

            const createdPolicy = await createPricingPolicy(newPolicy)
            setData([createdPolicy, ...data])
            setModalVisible(false)
            message.success('政策创建成功')
        } catch (error) {
            console.error('表单验证失败:', error)
        }
    }

    // 保存编辑政策
    const handleSaveEditPolicy = async () => {
        try {
            const values = await policyForm.validateFields()

            if (!editingPolicy) return

            const updateData: UpdatePolicyData = {
                name: values.name,
                alias: values.alias,
                type: values.type,
                summary: values.summary || '',
                validUntil: values.isPermanent ? null : values.validUntil?.toISOString(),
                discountRatio: values.type === 'uniform_discount' ? values.discountRatio : undefined,
                tierSettings: values.type === 'tiered_discount' ? values.tierSettings : undefined
            }

            const updatedPolicy = await updatePricingPolicy(editingPolicy._id, updateData)
            setData(data.map(item => item._id === editingPolicy._id ? updatedPolicy : item))
            setEditModalVisible(false)
            setEditingPolicy(null)
            message.success('政策更新成功')
        } catch (error) {
            console.error('表单验证失败:', error)
        }
    }

    // 切换政策状态
    const handleToggleStatus = async (record: PricingPolicy) => {
        try {
            const updatedPolicy = await togglePricingPolicyStatus(record._id)
            setData(data.map(item => item._id === record._id ? updatedPolicy : item))
            message.success(`政策已${updatedPolicy.status === 'active' ? '启用' : '禁用'}`)
        } catch (error) {
            message.error('切换状态失败')
        }
    }

    // 删除政策
    const handleDeletePolicy = async (record: PricingPolicy) => {
        try {
            await deletePricingPolicy(record._id)
            setData(data.filter(item => item._id !== record._id))
            message.success('删除成功')
        } catch (error) {
            message.error('删除失败')
        }
    }

    // 渲染阶梯设置
    const renderTierSettings = () => {
        return (
            <Form.List name="tierSettings">
                {(fields, { add, remove }) => (
                    <div>
                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key} style={{ marginBottom: 16, padding: 16, border: '1px solid #d9d9d9', borderRadius: 6 }}>
                                <Row gutter={16} align="middle">
                                    <Col span={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'startQuantity']}
                                            label="起始数量"
                                            rules={[{ required: true, message: '请输入起始数量' }]}
                                        >
                                            <InputNumber
                                                min={1}
                                                placeholder="起始数量"
                                                style={{ width: '100%' }}
                                                addonAfter="件"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'endQuantity']}
                                            label="结束数量"
                                        >
                                            <InputNumber
                                                min={1}
                                                placeholder="结束数量（可选）"
                                                style={{ width: '100%' }}
                                                addonAfter="件"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'discountRatio']}
                                            label="折扣比例"
                                            rules={[{ required: true, message: '请输入折扣比例' }]}
                                        >
                                            <InputNumber
                                                min={0}
                                                max={100}
                                                placeholder="0-100"
                                                style={{ width: '100%' }}
                                                addonAfter="%"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                            style={{ color: '#ff4d4f', fontSize: '16px', cursor: 'pointer' }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        ))}
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusCircleOutlined />}
                        >
                            添加阶梯
                        </Button>
                    </div>
                )}
            </Form.List>
        )
    }

    const columns = [
        {
            title: '政策名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string, record: PricingPolicy) => (
                <div>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>别名: {record.alias}</div>
                    {record.status === 'inactive' && (
                        <Tag color="red" style={{ marginTop: 4, fontSize: '12px' }}>
                            已禁用
                        </Tag>
                    )}
                </div>
            )
        },
        {
            title: '政策类型',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (type: string) => (
                <Tag color={type === 'uniform_discount' ? 'blue' : 'green'}>
                    {type === 'uniform_discount' ? '统一折扣' : '阶梯折扣'}
                </Tag>
            )
        },
        {
            title: '折扣设置',
            key: 'discount',
            width: 200,
            render: (_: any, record: PricingPolicy) => {
                if (record.type === 'uniform_discount') {
                    return `${record.discountRatio}%`
                } else if (record.tierSettings && record.tierSettings.length > 0) {
                    return (
                        <div style={{ fontSize: '12px', lineHeight: 1.4 }}>
                            {record.tierSettings.map((tier, index) => {
                                // 处理向后兼容的数据格式
                                const startQty = tier.startQuantity || tier.minQuantity || tier.minAmount
                                const endQty = tier.endQuantity || tier.maxQuantity || tier.maxAmount

                                let rangeText = ''
                                if (startQty === endQty) {
                                    rangeText = `第${startQty}件`
                                } else if (!endQty) {
                                    rangeText = `第${startQty}件及以上`
                                } else {
                                    rangeText = `第${startQty}至第${endQty}件`
                                }

                                return (
                                    <div key={tier.id || index} style={{ marginBottom: index < record.tierSettings!.length - 1 ? 2 : 0 }}>
                                        {rangeText} {tier.discountRatio}%
                                    </div>
                                )
                            })}
                        </div>
                    )
                } else {
                    return '-'
                }
            }
        },
        {
            title: '有效期',
            key: 'validUntil',
            width: 120,
            render: (_: any, record: PricingPolicy) => {
                if (!record.validUntil) {
                    return <Tag color="green">永久有效</Tag>
                }
                return new Date(record.validUntil).toLocaleDateString('zh-CN')
            }
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
            render: (_: any, record: PricingPolicy) => {
                const actions = [
                    {
                        key: 'view',
                        label: '查看详情',
                        icon: <EyeOutlined />,
                        onClick: () => showDetail(record)
                    },
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => handleEditPolicy(record)
                    },
                    {
                        key: 'toggleStatus',
                        label: record.status === 'active' ? '禁用' : '启用',
                        icon: record.status === 'active' ? <StopOutlined /> : <EyeOutlined />,
                        onClick: () => handleToggleStatus(record)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDeletePolicy(record)
                    }
                ]

                return <ActionMenu actions={actions} />
            },
        },
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>价格政策</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={showNewPolicyModal}>
                    新增政策
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索政策名称或别名"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            allowClear
                        />

                        <Select
                            placeholder="政策类型"
                            style={{ width: 120 }}
                            value={typeFilter}
                            onChange={setTypeFilter}
                        >
                            <Option value="all">全部类型</Option>
                            <Option value="uniform_discount">统一折扣</Option>
                            <Option value="tiered_discount">阶梯折扣</Option>
                        </Select>

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

            {/* 新建政策模态窗口 */}
            <Modal
                title="新建价格政策"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSavePolicy}
                width={800}
                okText="保存"
                cancelText="取消"
            >
                <Form form={policyForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="政策名称"
                                rules={[{ required: true, message: '请输入政策名称' }]}
                            >
                                <Input placeholder="请输入政策名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="alias"
                                label="政策别名"
                                rules={[{ required: true, message: '请输入政策别名' }]}
                            >
                                <Input placeholder="用于内部查看的名称" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="政策类型"
                                rules={[{ required: true, message: '请选择政策类型' }]}
                            >
                                <Select placeholder="请选择政策类型">
                                    <Option value="uniform_discount">统一折扣</Option>
                                    <Option value="tiered_discount">阶梯折扣</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="isPermanent"
                                label="有效期"
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="永久有效" unCheckedChildren="设置有效期" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.isPermanent !== currentValues.isPermanent}
                    >
                        {({ getFieldValue }) => {
                            const isPermanent = getFieldValue('isPermanent')
                            return !isPermanent ? (
                                <Form.Item
                                    name="validUntil"
                                    label="有效期至"
                                    rules={[{ required: true, message: '请选择有效期' }]}
                                >
                                    <DatePicker
                                        showTime
                                        style={{ width: '100%' }}
                                        placeholder="请选择有效期"
                                        format="YYYY-MM-DD HH:mm:ss"

                                    />
                                </Form.Item>
                            ) : null
                        }}
                    </Form.Item>

                    <Form.Item
                        name="summary"
                        label="政策摘要"
                    >
                        <TextArea rows={3} placeholder="请输入政策摘要" />
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                    >
                        {({ getFieldValue }) => {
                            const type = getFieldValue('type')
                            return type === 'uniform_discount' ? (
                                <Form.Item
                                    name="discountRatio"
                                    label="折扣比例"
                                    rules={[{ required: true, message: '请输入折扣比例' }]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        placeholder="0-100"
                                        style={{ width: '100%' }}
                                        addonAfter="%"
                                    />
                                </Form.Item>
                            ) : type === 'tiered_discount' ? (
                                <div>
                                    <Divider orientation="left">数量阶梯设置</Divider>
                                    {renderTierSettings()}
                                </div>
                            ) : null
                        }}
                    </Form.Item>
                </Form>
            </Modal>

            {/* 政策详情弹窗 */}
            <Modal
                title="政策详情"
                open={detailVisible}
                onCancel={() => { setDetailVisible(false); setSelectedPolicy(null) }}
                footer={[
                    <Button key="edit" type="primary" onClick={() => {
                        setDetailVisible(false);
                        handleEditPolicy(selectedPolicy!);
                    }}>
                        编辑政策
                    </Button>,
                    <Button key="close" onClick={() => { setDetailVisible(false); setSelectedPolicy(null) }}>
                        关闭
                    </Button>
                ]}
                width={800}
            >
                {selectedPolicy && (
                    <div>
                        <Descriptions title="基本信息" bordered column={2} style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="政策名称" span={1}>{selectedPolicy.name}</Descriptions.Item>
                            <Descriptions.Item label="政策别名" span={1}>{selectedPolicy.alias}</Descriptions.Item>
                            <Descriptions.Item label="政策类型" span={1}>
                                <Tag color={selectedPolicy.type === 'uniform_discount' ? 'blue' : 'green'}>
                                    {selectedPolicy.type === 'uniform_discount' ? '统一折扣' : '阶梯折扣'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="状态" span={1}>
                                <Tag color={selectedPolicy.status === 'active' ? 'green' : 'red'}>
                                    {selectedPolicy.status === 'active' ? '启用' : '禁用'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="有效期" span={1}>
                                {selectedPolicy.validUntil ? new Date(selectedPolicy.validUntil).toLocaleDateString('zh-CN') : '永久有效'}
                            </Descriptions.Item>
                            <Descriptions.Item label="创建时间" span={1}>{new Date(selectedPolicy.createTime).toLocaleDateString('zh-CN')}</Descriptions.Item>
                            <Descriptions.Item label="政策摘要" span={2}>{selectedPolicy.summary || '暂无摘要'}</Descriptions.Item>
                        </Descriptions>

                        {selectedPolicy.type === 'uniform_discount' && (
                            <Descriptions title="折扣设置" bordered column={1} style={{ marginBottom: 24 }}>
                                <Descriptions.Item label="折扣比例">{selectedPolicy.discountRatio}%</Descriptions.Item>
                            </Descriptions>
                        )}

                        {selectedPolicy.type === 'tiered_discount' && selectedPolicy.tierSettings && (
                            <div>
                                <h3>数量阶梯设置</h3>
                                <Table
                                    columns={[
                                        {
                                            title: '数量范围',
                                            key: 'range',
                                            render: (_, record: any) => {
                                                // 处理向后兼容的数据格式
                                                const startQty = record.startQuantity || record.minQuantity || record.minAmount
                                                const endQty = record.endQuantity || record.maxQuantity || record.maxAmount

                                                if (startQty === endQty) {
                                                    return `第${startQty}件`
                                                } else if (!endQty) {
                                                    return `第${startQty}件及以上`
                                                } else {
                                                    return `第${startQty}至第${endQty}件`
                                                }
                                            }
                                        },
                                        { title: '折扣比例', dataIndex: 'discountRatio', key: 'discountRatio', render: (val: number) => `${val}%` }
                                    ]}
                                    dataSource={selectedPolicy.tierSettings}
                                    rowKey="_id"
                                    pagination={false}
                                    size="small"
                                />
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* 编辑政策模态窗口 */}
            <Modal
                title="编辑价格政策"
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setEditingPolicy(null);
                }}
                onOk={handleSaveEditPolicy}
                width={800}
                okText="保存"
                cancelText="取消"
            >
                <Form form={policyForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="政策名称"
                                rules={[{ required: true, message: '请输入政策名称' }]}
                            >
                                <Input placeholder="请输入政策名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="alias"
                                label="政策别名"
                                rules={[{ required: true, message: '请输入政策别名' }]}
                            >
                                <Input placeholder="用于内部查看的名称" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="政策类型"
                                rules={[{ required: true, message: '请选择政策类型' }]}
                            >
                                <Select placeholder="请选择政策类型">
                                    <Option value="uniform_discount">统一折扣</Option>
                                    <Option value="tiered_discount">阶梯折扣</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="isPermanent"
                                label="有效期"
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="永久有效" unCheckedChildren="设置有效期" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.isPermanent !== currentValues.isPermanent}
                    >
                        {({ getFieldValue }) => {
                            const isPermanent = getFieldValue('isPermanent')
                            return !isPermanent ? (
                                <Form.Item
                                    name="validUntil"
                                    label="有效期至"
                                    rules={[{ required: true, message: '请选择有效期' }]}
                                >
                                    <DatePicker
                                        showTime
                                        style={{ width: '100%' }}
                                        placeholder="请选择有效期"
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                </Form.Item>
                            ) : null
                        }}
                    </Form.Item>

                    <Form.Item
                        name="summary"
                        label="政策摘要"
                    >
                        <TextArea rows={3} placeholder="请输入政策摘要" />
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                    >
                        {({ getFieldValue }) => {
                            const type = getFieldValue('type')
                            return type === 'uniform_discount' ? (
                                <Form.Item
                                    name="discountRatio"
                                    label="折扣比例"
                                    rules={[{ required: true, message: '请输入折扣比例' }]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        placeholder="0-100"
                                        style={{ width: '100%' }}
                                        addonAfter="%"
                                    />
                                </Form.Item>
                            ) : type === 'tiered_discount' ? (
                                <div>
                                    <Divider orientation="left">数量阶梯设置</Divider>
                                    {renderTierSettings()}
                                </div>
                            ) : null
                        }}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default PricingPolicy 