import React, { useState, useEffect } from 'react'
import {
    Table,
    Button,
    Space,
    Input,
    Select,
    Modal,
    Form,
    InputNumber,
    message,
    Tag,
    Descriptions,
    Spin,
    Row,
    Col
} from 'antd'
const { TextArea } = Input
import {
    SearchOutlined,
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    StopOutlined
} from '@ant-design/icons'
import ActionMenu from '../../components/ActionMenu'
import {
    getAllServicePricing,
    getServicePricingById,
    createServicePricing,
    updateServicePricing,
    toggleServicePricingStatus,
    deleteServicePricing,
    searchServicePricing,
    type ServicePricing,
    type CreateServicePricingData,
    type UpdateServicePricingData
} from '../../api/servicePricing'
import { getAllPricingCategories, type PricingCategory } from '../../api/pricingCategories'
import { getAllAdditionalConfigs, type AdditionalConfig } from '../../api/additionalConfig'
import { getAllServiceProcesses, type ServiceProcess } from '../../api/serviceProcess'
import { getAllPricingPolicies, type PricingPolicy } from '../../api/pricingPolicy'

const { Option } = Select

const ActionTypes = {
    EDIT: {
        key: 'edit',
        label: '编辑',
        icon: <EditOutlined />
    },
    DELETE: {
        key: 'delete',
        label: '删除',
        icon: <DeleteOutlined />
    }
}

const ServicePricing: React.FC = () => {
    const [data, setData] = useState<ServicePricing[]>([])
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [detailModalVisible, setDetailModalVisible] = useState(false)
    const [selectedPricing, setSelectedPricing] = useState<ServicePricing | null>(null)
    const [editingPricing, setEditingPricing] = useState<ServicePricing | null>(null)
    const [searchText, setSearchText] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')
    const [pricingForm] = Form.useForm()
    const [editForm] = Form.useForm()

    // 关联数据
    const [categories, setCategories] = useState<PricingCategory[]>([])
    const [additionalConfigs, setAdditionalConfigs] = useState<AdditionalConfig[]>([])
    const [serviceProcesses, setServiceProcesses] = useState<ServiceProcess[]>([])
    const [pricingPolicies, setPricingPolicies] = useState<PricingPolicy[]>([])

    // 选中状态
    const [selectedAdditionalConfig, setSelectedAdditionalConfig] = useState<string>('')
    const [selectedServiceProcess, setSelectedServiceProcess] = useState<string>('')
    const [selectedPricingPolicies, setSelectedPricingPolicies] = useState<string[]>([])

    // 加载数据
    const loadData = async () => {
        setLoading(true)
        try {
            const pricing = await getAllServicePricing()
            setData(pricing)
        } catch (error) {
            message.error('获取服务定价列表失败')
        } finally {
            setLoading(false)
        }
    }

    // 加载关联数据
    const loadRelatedData = async () => {
        try {
            const [categoriesData, configsData, processesData, policiesData] = await Promise.all([
                getAllPricingCategories(),
                getAllAdditionalConfigs(),
                getAllServiceProcesses(),
                getAllPricingPolicies()
            ])
            setCategories(categoriesData)
            setAdditionalConfigs(configsData)
            setServiceProcesses(processesData)
            setPricingPolicies(policiesData)
        } catch (error) {
            message.error('加载关联数据失败')
        }
    }

    useEffect(() => {
        loadData()
        loadRelatedData()
    }, [])

    // 搜索功能
    const handleSearch = async () => {
        if (!searchText.trim()) {
            loadData()
            return
        }

        setLoading(true)
        try {
            const results = await searchServicePricing(searchText)
            setData(results)
        } catch (error) {
            message.error('搜索失败')
        } finally {
            setLoading(false)
        }
    }

    // 显示详情
    const showDetail = (record: ServicePricing) => {
        setSelectedPricing(record)
        setDetailModalVisible(true)
    }

    // 显示新建模态窗口
    const showNewPricingModal = () => {
        pricingForm.resetFields()
        setSelectedAdditionalConfig('')
        setSelectedServiceProcess('')
        setSelectedPricingPolicies([])
        setModalVisible(true)
    }

    // 编辑定价
    const handleEditPricing = (record: ServicePricing) => {
        setEditingPricing(record)
        editForm.setFieldsValue({
            serviceName: record.serviceName,
            alias: record.alias,
            categoryId: record.categoryId,
            unitPrice: record.unitPrice,
            unit: record.unit,
            priceDescription: record.priceDescription,
            link: record.link,
            additionalConfigId: record.additionalConfigId,
            serviceProcessId: record.serviceProcessId,
            pricingPolicyIds: record.pricingPolicyIds
        })

        // 设置选中状态
        setSelectedAdditionalConfig(record.additionalConfigId || '')
        setSelectedServiceProcess(record.serviceProcessId || '')
        setSelectedPricingPolicies(record.pricingPolicyIds || [])
        setEditModalVisible(true)
    }

    // 保存新建定价
    const handleSavePricing = async () => {
        try {
            const values = await pricingForm.validateFields()
            await createServicePricing(values)
            message.success('创建成功')
            setModalVisible(false)
            loadData()
        } catch (error) {
            message.error('创建失败')
        }
    }

    // 保存编辑定价
    const handleSaveEditPricing = async () => {
        if (!editingPricing) return

        try {
            const values = await editForm.validateFields()
            await updateServicePricing(editingPricing._id, values)
            message.success('更新成功')
            setEditModalVisible(false)
            setEditingPricing(null)
            loadData()
        } catch (error) {
            message.error('更新失败')
        }
    }

    // 切换状态
    const handleToggleStatus = async (record: ServicePricing) => {
        try {
            await toggleServicePricingStatus(record._id)
            message.success('状态切换成功')
            loadData()
        } catch (error) {
            message.error('状态切换失败')
        }
    }

    // 删除定价
    const handleDeletePricing = async (record: ServicePricing) => {
        try {
            await deleteServicePricing(record._id)
            message.success('删除成功')
            loadData()
        } catch (error) {
            message.error('删除失败')
        }
    }

    // 获取选中项目的详细信息
    const getSelectedAdditionalConfig = () => {
        return additionalConfigs.find(config => config._id === selectedAdditionalConfig)
    }

    const getSelectedServiceProcess = () => {
        return serviceProcesses.find(process => process._id === selectedServiceProcess)
    }

    const getSelectedPricingPolicies = () => {
        return pricingPolicies.filter(policy => selectedPricingPolicies.includes(policy._id))
    }

    // 详情模态窗口的辅助函数
    const getDetailAdditionalConfig = () => {
        if (!selectedPricing?.additionalConfigId) return null
        return additionalConfigs.find(config => config._id === selectedPricing.additionalConfigId)
    }

    const getDetailServiceProcess = () => {
        if (!selectedPricing?.serviceProcessId) return null
        return serviceProcesses.find(process => process._id === selectedPricing.serviceProcessId)
    }

    const getDetailPricingPolicies = () => {
        if (!selectedPricing?.pricingPolicyIds || selectedPricing.pricingPolicyIds.length === 0) return []
        return pricingPolicies.filter(policy => selectedPricing.pricingPolicyIds?.includes(policy._id))
    }

    // 过滤数据
    const filteredData = data.filter(item => {
        if (categoryFilter !== 'all' && item.categoryId !== categoryFilter) {
            return false
        }
        return true
    })

    const columns = [
        {
            title: '服务名称',
            dataIndex: 'serviceName',
            key: 'serviceName',
            width: 200,
            render: (name: string, record: ServicePricing) => (
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
            title: '分类',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: 120,
            render: (categoryName: string) => categoryName || '-'
        },
        {
            title: '单价',
            key: 'price',
            width: 120,
            render: (_: any, record: ServicePricing) => (
                <div style={{ fontWeight: 500 }}>
                    ¥{record.unitPrice}/{record.unit}
                </div>
            )
        },
        {
            title: '附加配置',
            dataIndex: 'additionalConfigName',
            key: 'additionalConfigName',
            width: 120,
            render: (configName: string) => configName || '-'
        },
        {
            title: '服务流程',
            dataIndex: 'serviceProcessName',
            key: 'serviceProcessName',
            width: 120,
            render: (processName: string) => processName || '-'
        },
        {
            title: '价格政策',
            dataIndex: 'pricingPolicyNames',
            key: 'pricingPolicyNames',
            width: 150,
            render: (policyNames: string[]) => {
                if (!policyNames || policyNames.length === 0) return '-'
                return (
                    <div>
                        {policyNames.map((name, index) => (
                            <Tag key={index} color="blue" style={{ marginBottom: 2 }}>
                                {name}
                            </Tag>
                        ))}
                    </div>
                )
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
            render: (_: any, record: ServicePricing) => {
                const actions = [
                    {
                        key: 'view',
                        label: '查看详情',
                        icon: <EyeOutlined />,
                        onClick: () => showDetail(record)
                    },
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => handleEditPricing(record)
                    },
                    {
                        key: 'toggleStatus',
                        label: record.status === 'active' ? '禁用' : '启用',
                        icon: record.status === 'active' ? <StopOutlined /> : <EyeOutlined />,
                        onClick: () => handleToggleStatus(record)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDeletePricing(record)
                    }
                ]

                return <ActionMenu actions={actions} />
            },
        },
    ]

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>服务定价</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={showNewPricingModal}>
                    新增定价
                </Button>
            </div>

            <div style={{ marginBottom: 16 }}>
                <Space>
                    <Input
                        placeholder="搜索服务名称"
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                    />
                    <Select
                        placeholder="服务分类"
                        style={{ width: 120 }}
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                    >
                        <Option value="all">全部分类</Option>
                        {categories.map(category => (
                            <Option key={category.id} value={category.id}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                    <Button type="primary" onClick={handleSearch}>
                        搜索
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
            />

            {/* 新建定价模态窗口 */}
            <Modal
                title="新建服务定价"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSavePricing}
                width={800}
                okText="保存"
                cancelText="取消"
            >
                <Form form={pricingForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="serviceName"
                                label="服务名称"
                                rules={[{ required: true, message: '请输入服务名称' }]}
                            >
                                <Input placeholder="用于外部显示的名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="alias"
                                label="别名"
                                rules={[{ required: true, message: '请输入别名' }]}
                            >
                                <Input placeholder="用于内部查看的名称" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="categoryId"
                                label="分类"
                                rules={[{ required: true, message: '请选择分类' }]}
                            >
                                <Select placeholder="请选择分类">
                                    {categories.map(category => (
                                        <Option
                                            key={category.id}
                                            value={category.id}
                                            disabled={category.status === 'inactive'}
                                        >
                                            {category.name}{category.status === 'inactive' ? '（已禁用）' : ''}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="unitPrice"
                                label="单价"
                                rules={[{ required: true, message: '请输入单价' }]}
                            >
                                <InputNumber
                                    min={0}
                                    placeholder="请输入单价"
                                    style={{ width: '100%' }}
                                    addonBefore="¥"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="unit"
                                label="单位"
                                rules={[{ required: true, message: '请输入计价单位' }]}
                            >
                                <Input placeholder="如：次、件、小时等" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="link"
                                label="链接"
                            >
                                <Input placeholder="相关链接（可选）" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="priceDescription"
                        label="价格说明"
                    >
                        <TextArea rows={3} placeholder="请输入价格说明" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="additionalConfigId"
                                label="附加配置"
                            >
                                <Select
                                    placeholder="请选择附加配置"
                                    allowClear
                                    onChange={(value) => setSelectedAdditionalConfig(value)}
                                >
                                    {additionalConfigs.map(config => (
                                        <Option
                                            key={config._id}
                                            value={config._id}
                                            disabled={config.status === 'inactive'}
                                        >
                                            {config.name}{config.status === 'inactive' ? '（已禁用）' : ''}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="serviceProcessId"
                                label="服务流程"
                            >
                                <Select
                                    placeholder="请选择服务流程"
                                    allowClear
                                    onChange={(value) => setSelectedServiceProcess(value)}
                                >
                                    {serviceProcesses.map(process => (
                                        <Option
                                            key={process._id}
                                            value={process._id}
                                            disabled={process.status === 'inactive'}
                                        >
                                            {process.name}{process.status === 'inactive' ? '（已禁用）' : ''}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="pricingPolicyIds"
                                label="价格政策"
                            >
                                <Select
                                    placeholder="请选择价格政策"
                                    mode="multiple"
                                    allowClear
                                    onChange={(values) => setSelectedPricingPolicies(values)}
                                >
                                    {pricingPolicies.map(policy => (
                                        <Option
                                            key={policy._id}
                                            value={policy._id}
                                            disabled={policy.status === 'inactive'}
                                        >
                                            {policy.name}{policy.status === 'inactive' ? '（已禁用）' : ''}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* 内容预览区域 */}
                    {(selectedAdditionalConfig || selectedServiceProcess || selectedPricingPolicies.length > 0) && (
                        <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
                            <h4 style={{ marginBottom: 12 }}>选择内容预览</h4>

                            {selectedAdditionalConfig && (
                                <div style={{ marginBottom: 12 }}>
                                    <h5 style={{ marginBottom: 8 }}>附加配置</h5>
                                    <Descriptions size="small" column={2}>
                                        <Descriptions.Item label="初稿方案数量">{getSelectedAdditionalConfig()?.initialDraftCount}</Descriptions.Item>
                                        <Descriptions.Item label="最多方案数量">{getSelectedAdditionalConfig()?.maxDraftCount}</Descriptions.Item>
                                        <Descriptions.Item label="主创绩效比例">{getSelectedAdditionalConfig()?.mainCreatorRatio}%</Descriptions.Item>
                                        <Descriptions.Item label="助理绩效比例">{getSelectedAdditionalConfig()?.assistantRatio}%</Descriptions.Item>
                                    </Descriptions>
                                </div>
                            )}

                            {selectedServiceProcess && (
                                <div style={{ marginBottom: 12 }}>
                                    <h5 style={{ marginBottom: 8 }}>服务流程</h5>

                                    {getSelectedServiceProcess()?.steps && getSelectedServiceProcess()?.steps?.length > 0 && (
                                        <div style={{ marginTop: 12 }}>
                                            <div style={{ backgroundColor: 'white', borderRadius: 8, padding: 12 }}>
                                                {getSelectedServiceProcess()?.steps?.map((step, index) => (
                                                    <div key={step.id || index} style={{
                                                        marginBottom: index < (getSelectedServiceProcess()?.steps?.length || 0) - 1 ? 8 : 0,
                                                        padding: '12px',
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: 6,
                                                        border: '1px solid #e9ecef'
                                                    }}>
                                                        {/* 头部：序号和名称 */}
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            marginBottom: 6
                                                        }}>
                                                            <div style={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: '50%',
                                                                backgroundColor: '#1890ff',
                                                                color: 'white',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold',
                                                                marginRight: 10
                                                            }}>
                                                                {index + 1}
                                                            </div>
                                                            <div style={{ fontWeight: 600, fontSize: '13px', color: '#262626' }}>
                                                                {step.name}
                                                            </div>
                                                        </div>

                                                        {/* 描述 */}
                                                        <div style={{
                                                            fontSize: '12px',
                                                            color: '#666',
                                                            marginBottom: 8,
                                                            paddingLeft: 34
                                                        }}>
                                                            {step.description}
                                                        </div>

                                                        {/* 指标信息 */}
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: 12,
                                                            paddingLeft: 34
                                                        }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                padding: '4px 8px',
                                                                backgroundColor: '#e6f7ff',
                                                                borderRadius: 4,
                                                                border: '1px solid #91d5ff'
                                                            }}>
                                                                <span style={{ fontSize: '11px', color: '#1890ff', fontWeight: 500 }}>
                                                                    进度: {step.progressRatio}%
                                                                </span>
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                padding: '4px 8px',
                                                                backgroundColor: '#e6f7ff',
                                                                borderRadius: 4,
                                                                border: '1px solid #91d5ff'
                                                            }}>
                                                                <span style={{ fontSize: '11px', color: '#1890ff', fontWeight: 500 }}>
                                                                    计费: {step.lossBillingRatio}%
                                                                </span>
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                padding: '4px 8px',
                                                                backgroundColor: '#e6f7ff',
                                                                borderRadius: 4,
                                                                border: '1px solid #91d5ff'
                                                            }}>
                                                                <span style={{ fontSize: '11px', color: '#1890ff', fontWeight: 500 }}>
                                                                    周期: {step.cycle}天
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedPricingPolicies.length > 0 && (
                                <div>
                                    <h5 style={{ marginBottom: 8 }}>价格政策</h5>
                                    {getSelectedPricingPolicies().map((policy, index) => (
                                        <div key={policy._id} style={{ marginBottom: 8, padding: 8, backgroundColor: 'white', borderRadius: 4 }}>
                                            <div style={{ fontWeight: 500, marginBottom: 4 }}>{policy.name}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{policy.summary}</div>
                                            {policy.type === 'uniform_discount' && (
                                                <div style={{ fontSize: '12px', color: '#1890ff' }}>
                                                    统一折扣: {policy.discountRatio}%
                                                </div>
                                            )}
                                            {policy.type === 'tiered_discount' && policy.tierSettings && (
                                                <div style={{ fontSize: '12px', color: '#1890ff' }}>
                                                    阶梯折扣: {policy.tierSettings.map(tier => {
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
                                                        return `${rangeText} ${tier.discountRatio}%`
                                                    }).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </Form>
            </Modal>

            {/* 编辑定价模态窗口 */}
            <Modal
                title="编辑服务定价"
                open={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false)
                    setEditingPricing(null)
                    setSelectedAdditionalConfig('')
                    setSelectedServiceProcess('')
                    setSelectedPricingPolicies([])
                }}
                onOk={handleSaveEditPricing}
                width={800}
                okText="保存"
                cancelText="取消"
            >
                <Form form={editForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="serviceName"
                                label="服务名称"
                                rules={[{ required: true, message: '请输入服务名称' }]}
                            >
                                <Input placeholder="用于外部显示的名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="alias"
                                label="别名"
                                rules={[{ required: true, message: '请输入别名' }]}
                            >
                                <Input placeholder="用于内部查看的名称" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="categoryId"
                                label="分类"
                                rules={[{ required: true, message: '请选择分类' }]}
                            >
                                <Select placeholder="请选择分类">
                                    {categories.map(category => (
                                        <Option
                                            key={category.id}
                                            value={category.id}
                                            disabled={category.status === 'inactive'}
                                        >
                                            {category.name}{category.status === 'inactive' ? '（已禁用）' : ''}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="unitPrice"
                                label="单价"
                                rules={[{ required: true, message: '请输入单价' }]}
                            >
                                <InputNumber
                                    min={0}
                                    placeholder="请输入单价"
                                    style={{ width: '100%' }}
                                    addonBefore="¥"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="unit"
                                label="单位"
                                rules={[{ required: true, message: '请输入计价单位' }]}
                            >
                                <Input placeholder="如：次、件、小时等" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="link"
                                label="链接"
                            >
                                <Input placeholder="相关链接（可选）" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="priceDescription"
                        label="价格说明"
                    >
                        <TextArea rows={3} placeholder="请输入价格说明" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="additionalConfigId"
                                label="附加配置"
                            >
                                <Select
                                    placeholder="请选择附加配置"
                                    allowClear
                                    onChange={(value) => setSelectedAdditionalConfig(value)}
                                >
                                    {additionalConfigs.map(config => (
                                        <Option
                                            key={config._id}
                                            value={config._id}
                                            disabled={config.status === 'inactive'}
                                        >
                                            {config.name}{config.status === 'inactive' ? '（已禁用）' : ''}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="serviceProcessId"
                                label="服务流程"
                            >
                                <Select
                                    placeholder="请选择服务流程"
                                    allowClear
                                    onChange={(value) => setSelectedServiceProcess(value)}
                                >
                                    {serviceProcesses.map(process => (
                                        <Option
                                            key={process._id}
                                            value={process._id}
                                            disabled={process.status === 'inactive'}
                                        >
                                            {process.name}{process.status === 'inactive' ? '（已禁用）' : ''}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="pricingPolicyIds"
                                label="价格政策"
                            >
                                <Select
                                    placeholder="请选择价格政策"
                                    mode="multiple"
                                    allowClear
                                    onChange={(values) => setSelectedPricingPolicies(values)}
                                >
                                    {pricingPolicies.map(policy => (
                                        <Option
                                            key={policy._id}
                                            value={policy._id}
                                            disabled={policy.status === 'inactive'}
                                        >
                                            {policy.name}{policy.status === 'inactive' ? '（已禁用）' : ''}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* 内容预览区域 */}
                    {(selectedAdditionalConfig || selectedServiceProcess || selectedPricingPolicies.length > 0) && (
                        <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 6 }}>
                            <h4 style={{ marginBottom: 12 }}>选择内容预览</h4>

                            {selectedAdditionalConfig && (
                                <div style={{ marginBottom: 12 }}>
                                    <h5 style={{ marginBottom: 8 }}>附加配置</h5>
                                    <Descriptions size="small" column={2}>
                                        <Descriptions.Item label="初稿方案数量">{getSelectedAdditionalConfig()?.initialDraftCount}</Descriptions.Item>
                                        <Descriptions.Item label="最多方案数量">{getSelectedAdditionalConfig()?.maxDraftCount}</Descriptions.Item>
                                        <Descriptions.Item label="主创绩效比例">{getSelectedAdditionalConfig()?.mainCreatorRatio}%</Descriptions.Item>
                                        <Descriptions.Item label="助理绩效比例">{getSelectedAdditionalConfig()?.assistantRatio}%</Descriptions.Item>
                                    </Descriptions>
                                </div>
                            )}

                            {selectedServiceProcess && (
                                <div style={{ marginBottom: 12 }}>
                                    <h5 style={{ marginBottom: 8 }}>服务流程</h5>

                                    {getSelectedServiceProcess()?.steps && getSelectedServiceProcess()?.steps?.length > 0 && (
                                        <div style={{ marginTop: 12 }}>
                                            <div style={{ backgroundColor: 'white', borderRadius: 8, padding: 12 }}>
                                                {getSelectedServiceProcess()?.steps?.map((step, index) => (
                                                    <div key={step.id || index} style={{
                                                        marginBottom: index < (getSelectedServiceProcess()?.steps?.length || 0) - 1 ? 8 : 0,
                                                        padding: '12px',
                                                        backgroundColor: '#f8f9fa',
                                                        borderRadius: 6,
                                                        border: '1px solid #e9ecef'
                                                    }}>
                                                        {/* 头部：序号和名称 */}
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            marginBottom: 6
                                                        }}>
                                                            <div style={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: '50%',
                                                                backgroundColor: '#1890ff',
                                                                color: 'white',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold',
                                                                marginRight: 10
                                                            }}>
                                                                {index + 1}
                                                            </div>
                                                            <div style={{ fontWeight: 600, fontSize: '13px', color: '#262626' }}>
                                                                {step.name}
                                                            </div>
                                                        </div>

                                                        {/* 描述 */}
                                                        <div style={{
                                                            fontSize: '12px',
                                                            color: '#666',
                                                            marginBottom: 8,
                                                            paddingLeft: 34
                                                        }}>
                                                            {step.description}
                                                        </div>

                                                        {/* 指标信息 */}
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: 12,
                                                            paddingLeft: 34
                                                        }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                padding: '4px 8px',
                                                                backgroundColor: '#e6f7ff',
                                                                borderRadius: 4,
                                                                border: '1px solid #91d5ff'
                                                            }}>
                                                                <span style={{ fontSize: '11px', color: '#1890ff', fontWeight: 500 }}>
                                                                    进度: {step.progressRatio}%
                                                                </span>
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                padding: '4px 8px',
                                                                backgroundColor: '#e6f7ff',
                                                                borderRadius: 4,
                                                                border: '1px solid #91d5ff'
                                                            }}>
                                                                <span style={{ fontSize: '11px', color: '#1890ff', fontWeight: 500 }}>
                                                                    计费: {step.lossBillingRatio}%
                                                                </span>
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                padding: '4px 8px',
                                                                backgroundColor: '#e6f7ff',
                                                                borderRadius: 4,
                                                                border: '1px solid #91d5ff'
                                                            }}>
                                                                <span style={{ fontSize: '11px', color: '#1890ff', fontWeight: 500 }}>
                                                                    周期: {step.cycle}天
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedPricingPolicies.length > 0 && (
                                <div>
                                    <h5 style={{ marginBottom: 8 }}>价格政策</h5>
                                    {getSelectedPricingPolicies().map((policy, index) => (
                                        <div key={policy._id} style={{ marginBottom: 8, padding: 8, backgroundColor: 'white', borderRadius: 4 }}>
                                            <div style={{ fontWeight: 500, marginBottom: 4 }}>{policy.name}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>{policy.summary}</div>
                                            {policy.type === 'uniform_discount' && (
                                                <div style={{ fontSize: '12px', color: '#1890ff' }}>
                                                    统一折扣: {policy.discountRatio}%
                                                </div>
                                            )}
                                            {policy.type === 'tiered_discount' && policy.tierSettings && (
                                                <div style={{ fontSize: '12px', color: '#1890ff' }}>
                                                    阶梯折扣: {policy.tierSettings.map(tier => {
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
                                                        return `${rangeText} ${tier.discountRatio}%`
                                                    }).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </Form>
            </Modal>

            {/* 详情模态窗口 */}
            <Modal
                title="服务定价详情"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedPricing && (
                    <div>
                        <Descriptions column={2} bordered>
                            <Descriptions.Item label="服务名称" span={1}>
                                {selectedPricing.serviceName}
                            </Descriptions.Item>
                            <Descriptions.Item label="别名" span={1}>
                                {selectedPricing.alias}
                            </Descriptions.Item>
                            <Descriptions.Item label="分类" span={1}>
                                {selectedPricing.categoryName || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="单价" span={1}>
                                ¥{selectedPricing.unitPrice} / {selectedPricing.unit}
                            </Descriptions.Item>
                            <Descriptions.Item label="状态" span={1}>
                                <Tag color={selectedPricing.status === 'active' ? 'green' : 'red'}>
                                    {selectedPricing.status === 'active' ? '启用' : '禁用'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="创建时间" span={1}>
                                {new Date(selectedPricing.createTime).toLocaleDateString('zh-CN')}
                            </Descriptions.Item>
                            <Descriptions.Item label="价格说明" span={2}>
                                {selectedPricing.priceDescription || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="链接" span={2}>
                                {selectedPricing.link || '-'}
                            </Descriptions.Item>
                        </Descriptions>

                        {/* 附加配置预览 */}
                        {getDetailAdditionalConfig() && (
                            <div style={{ marginTop: 16 }}>
                                <h5 style={{ marginBottom: 8 }}>附加配置</h5>
                                <div style={{ backgroundColor: 'white', borderRadius: 6, padding: 12, border: '1px solid #e9ecef' }}>
                                    <Descriptions size="small" column={2}>
                                        <Descriptions.Item label="初稿方案数量">{getDetailAdditionalConfig()?.initialDraftCount}</Descriptions.Item>
                                        <Descriptions.Item label="最多方案数量">{getDetailAdditionalConfig()?.maxDraftCount}</Descriptions.Item>
                                        <Descriptions.Item label="主创绩效比例">{getDetailAdditionalConfig()?.mainCreatorRatio}%</Descriptions.Item>
                                        <Descriptions.Item label="助理绩效比例">{getDetailAdditionalConfig()?.assistantRatio}%</Descriptions.Item>
                                    </Descriptions>
                                </div>
                            </div>
                        )}

                        {/* 服务流程预览 */}
                        {getDetailServiceProcess() && (
                            <div style={{ marginTop: 16 }}>
                                <h5 style={{ marginBottom: 8 }}>服务流程</h5>
                                {getDetailServiceProcess()?.steps && getDetailServiceProcess()?.steps?.length > 0 && (
                                    <div style={{ backgroundColor: 'white', borderRadius: 8, padding: 12 }}>
                                        {getDetailServiceProcess()?.steps?.map((step, index) => (
                                            <div key={step.id || index} style={{
                                                marginBottom: index < (getDetailServiceProcess()?.steps?.length || 0) - 1 ? 8 : 0,
                                                padding: '12px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: 6,
                                                border: '1px solid #e9ecef'
                                            }}>
                                                {/* 头部：序号和名称 */}
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: 6
                                                }}>
                                                    <div style={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#1890ff',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        marginRight: 10
                                                    }}>
                                                        {index + 1}
                                                    </div>
                                                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#262626' }}>
                                                        {step.name}
                                                    </div>
                                                </div>

                                                {/* 描述 */}
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#666',
                                                    marginBottom: 8,
                                                    paddingLeft: 34
                                                }}>
                                                    {step.description}
                                                </div>

                                                {/* 指标信息 */}
                                                <div style={{
                                                    display: 'flex',
                                                    gap: 12,
                                                    paddingLeft: 34
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '4px 8px',
                                                        backgroundColor: '#e6f7ff',
                                                        borderRadius: 4,
                                                        border: '1px solid #91d5ff'
                                                    }}>
                                                        <span style={{ fontSize: '11px', color: '#1890ff', fontWeight: 500 }}>
                                                            进度: {step.progressRatio}%
                                                        </span>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '4px 8px',
                                                        backgroundColor: '#e6f7ff',
                                                        borderRadius: 4,
                                                        border: '1px solid #91d5ff'
                                                    }}>
                                                        <span style={{ fontSize: '11px', color: '#1890ff', fontWeight: 500 }}>
                                                            计费: {step.lossBillingRatio}%
                                                        </span>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '4px 8px',
                                                        backgroundColor: '#e6f7ff',
                                                        borderRadius: 4,
                                                        border: '1px solid #91d5ff'
                                                    }}>
                                                        <span style={{ fontSize: '11px', color: '#1890ff', fontWeight: 500 }}>
                                                            周期: {step.cycle}天
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 价格政策预览 */}
                        {getDetailPricingPolicies().length > 0 && (
                            <div style={{ marginTop: 16 }}>
                                <h5 style={{ marginBottom: 8 }}>价格政策</h5>
                                {getDetailPricingPolicies().map((policy, index) => (
                                    <div key={policy._id} style={{
                                        marginBottom: index < getDetailPricingPolicies().length - 1 ? 8 : 0,
                                        padding: 12,
                                        backgroundColor: 'white',
                                        borderRadius: 6,
                                        border: '1px solid #e9ecef'
                                    }}>
                                        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: 6, color: '#262626' }}>
                                            {policy.name}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666', marginBottom: 8 }}>
                                            {policy.summary}
                                        </div>
                                        {policy.type === 'uniform_discount' && (
                                            <div style={{ fontSize: '12px', color: '#1890ff' }}>
                                                统一折扣: {policy.discountRatio}%
                                            </div>
                                        )}
                                        {policy.type === 'tiered_discount' && policy.tierSettings && (
                                            <div style={{ fontSize: '12px', color: '#1890ff' }}>
                                                阶梯折扣: {policy.tierSettings.map(tier => {
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
                                                    return `${rangeText} ${tier.discountRatio}%`
                                                }).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default ServicePricing 