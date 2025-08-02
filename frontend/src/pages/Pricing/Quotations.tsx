import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    Tag,
    Button,
    Space,
    Input,
    Select,
    Modal,
    Form,
    Row,
    Col,
    Checkbox,
    DatePicker,
    Divider,
    message,
    Typography,
    Switch
} from 'antd'
const { TextArea } = Input
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, StopOutlined, StarOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import {
    getAllQuotations,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    toggleQuotationStatus,
    searchQuotations,
    type Quotation as ApiQuotation,
    type CreateQuotationData,
    type UpdateQuotationData
} from '../../api/quotations'

const { Option } = Select
const { Title, Text } = Typography

// 报价单接口
interface Quotation {
    _id: string
    name: string
    status: 'active' | 'inactive'
    validUntil?: string
    description: string
    isDefault: boolean
    selectedServices: string[]
    createTime: string
    updateTime: string
}

// 服务定价接口（复用现有的）
interface ServicePricing {
    _id: string
    serviceName: string
    alias: string
    categoryId: string
    categoryName?: string
    unitPrice: number
    unit: string
    priceDescription: string
    pricingPolicyIds?: string[]
    status: 'active' | 'inactive'
}

// 分类接口
interface Category {
    id: string
    name: string
    status: 'active' | 'inactive'
}

// 价格政策接口
interface PricingPolicy {
    _id: string
    name: string
    type: 'tiered' | 'uniform'
    discountType: 'percentage' | 'fixed'
    discountValue: number
    tierSettings?: Array<{
        startQuantity: number
        endQuantity?: number
        discountValue: number
    }>
    status: 'active' | 'inactive'
}

const Quotations: React.FC = () => {
    const [quotations, setQuotations] = useState<Quotation[]>([])
    const [servicePricings, setServicePricings] = useState<ServicePricing[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [pricingPolicies, setPricingPolicies] = useState<PricingPolicy[]>([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    // 新建报价单相关状态
    const [newQuotationModalVisible, setNewQuotationModalVisible] = useState(false)
    const [newQuotationForm] = Form.useForm()
    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [isPermanent, setIsPermanent] = useState(false)
    const [showDisabledServices, setShowDisabledServices] = useState(false)

    // 编辑报价单相关状态
    const [editQuotationModalVisible, setEditQuotationModalVisible] = useState(false)
    const [editQuotationForm] = Form.useForm()
    const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)
    const [editSelectedServices, setEditSelectedServices] = useState<string[]>([])
    const [editIsPermanent, setEditIsPermanent] = useState(false)
    const [editShowDisabledServices, setEditShowDisabledServices] = useState(false)

    // 加载数据
    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            // 获取服务定价数据
            const servicePricingResponse = await fetch('http://localhost:3000/api/service-pricing')
            const servicePricingData = await servicePricingResponse.json()

            if (servicePricingData.success) {
                console.log('服务定价API返回数据:', servicePricingData.data)
                setServicePricings(servicePricingData.data)
            } else {
                console.error('服务定价API调用失败:', servicePricingData)
            }

            // 获取分类数据
            const categoriesResponse = await fetch('http://localhost:3000/api/pricing-categories')
            const categoriesData = await categoriesResponse.json()

            if (categoriesData.success) {
                setCategories(categoriesData.data)
            }

            // 获取价格政策数据
            const pricingPoliciesResponse = await fetch('http://localhost:3000/api/pricing-policies')
            const pricingPoliciesData = await pricingPoliciesResponse.json()

            if (pricingPoliciesData.success) {
                setPricingPolicies(pricingPoliciesData.data)
            }

            // 获取报价单数据
            const quotationsData = await getAllQuotations()
            console.log('加载的报价单数据:', quotationsData)
            setQuotations(quotationsData)
        } catch (error) {
            message.error('加载数据失败')
        } finally {
            setLoading(false)
        }
    }

    // 按分类分组服务项目
    const getServicesByCategory = (showDisabled = showDisabledServices) => {
        const grouped: { [key: string]: ServicePricing[] } = {}

        // 调试信息
        console.log('所有服务定价数据:', servicePricings)
        console.log('活跃服务数量:', servicePricings.filter(s => s.status === 'active').length)
        console.log('显示禁用项目:', showDisabled)

        // 首先获取所有分类，确保顺序固定
        const allCategories = new Set<string>()
        servicePricings.forEach(service => {
            const categoryName = service.categoryName || service.categoryId
            allCategories.add(categoryName)
        })

        // 初始化所有分类的空数组
        allCategories.forEach(categoryName => {
            grouped[categoryName] = []
        })

        // 然后根据开关状态填充服务项目
        servicePricings.forEach(service => {
            // 根据开关状态决定是否显示禁用的服务项目
            if (showDisabled || service.status === 'active') {
                const categoryName = service.categoryName || service.categoryId
                grouped[categoryName].push(service)
            }
        })

        console.log('按分类分组结果:', grouped)
        return grouped
    }



    // 显示新建报价单模态窗口
    const showNewQuotationModal = () => {
        setNewQuotationModalVisible(true)
        setSelectedServices([])
        setIsPermanent(false)
        setShowDisabledServices(false) // 默认隐藏禁用项目
        newQuotationForm.resetFields()
    }

    // 保存报价单
    const handleSaveQuotation = async () => {
        try {
            const values = await newQuotationForm.validateFields()

            const quotationData: CreateQuotationData = {
                name: values.name,
                description: values.description,
                isDefault: values.isDefault || false,
                selectedServices,
                validUntil: isPermanent ? undefined : values.validUntil?.format('YYYY-MM-DD')
            }

            await createQuotation(quotationData)
            message.success('报价单创建成功')
            setNewQuotationModalVisible(false)
            loadData()
        } catch (error) {
            message.error('保存失败')
        }
    }

    // 查看报价单详情
    const handleViewQuotation = (record: Quotation) => {
        console.log('查看报价单:', record)
        message.info('查看详情功能待实现')
    }

    // 编辑报价单
    const handleEditQuotation = (record: Quotation) => {
        console.log('打开编辑模态窗，报价单数据:', record)
        setEditingQuotation(record)
        setEditSelectedServices(record.selectedServices)
        setEditIsPermanent(!record.validUntil)
        setEditShowDisabledServices(false)

        const formValues = {
            name: record.name,
            description: record.description,
            isDefault: record.isDefault,
            validUntil: record.validUntil ? dayjs(record.validUntil) : undefined
        }
        console.log('设置表单初始值:', formValues)
        editQuotationForm.setFieldsValue(formValues)

        setEditQuotationModalVisible(true)
    }

    // 切换报价单状态
    const handleToggleStatus = async (record: Quotation) => {
        try {
            await toggleQuotationStatus(record._id)
            message.success('状态切换成功')
            loadData()
        } catch (error) {
            message.error('状态切换失败')
        }
    }

    // 删除报价单
    const handleDeleteQuotation = async (record: Quotation) => {
        try {
            await deleteQuotation(record._id)
            message.success('删除成功')
            loadData()
        } catch (error) {
            message.error('删除失败')
        }
    }

    // 设为默认报价单
    const handleSetAsDefault = async (record: Quotation) => {
        try {
            if (record.isDefault) {
                message.info('该报价单已经是默认报价单')
                return
            }

            const quotationData: UpdateQuotationData = {
                name: record.name,
                description: record.description,
                isDefault: true,
                selectedServices: record.selectedServices,
                validUntil: record.validUntil
            }

            await updateQuotation(record._id, quotationData)
            message.success('设为默认报价单成功')
            loadData()
        } catch (error) {
            console.error('设为默认失败:', error)
            message.error('设为默认失败')
        }
    }

    // 保存编辑报价单
    const handleSaveEditQuotation = async () => {
        try {
            console.log('开始保存编辑报价单...')
            const values = await editQuotationForm.validateFields()
            console.log('表单验证通过，表单值:', values)

            if (!editingQuotation) {
                message.error('编辑数据不存在')
                return
            }

            const quotationData: UpdateQuotationData = {
                name: values.name,
                description: values.description,
                isDefault: values.isDefault || false,
                selectedServices: editSelectedServices,
                validUntil: editIsPermanent ? undefined : values.validUntil?.format('YYYY-MM-DD')
            }

            console.log('发送的编辑数据:', quotationData)
            console.log('isDefault字段值:', values.isDefault)
            console.log('isDefault字段类型:', typeof values.isDefault)

            const result = await updateQuotation(editingQuotation._id, quotationData)
            console.log('更新结果:', result)
            message.success('报价单更新成功')
            setEditQuotationModalVisible(false)
            setEditingQuotation(null)
            loadData()
        } catch (error) {
            console.error('更新失败详情:', error)
            if (error instanceof Error) {
                message.error(`更新失败: ${error.message}`)
            } else {
                message.error('更新失败')
            }
        }
    }

    // 处理服务选择
    const handleServiceSelection = (serviceId: string, checked: boolean) => {
        if (checked) {
            setSelectedServices([...selectedServices, serviceId])
        } else {
            setSelectedServices(selectedServices.filter(id => id !== serviceId))
        }
    }

    // 处理编辑模式下的服务选择
    const handleEditServiceSelection = (serviceId: string, checked: boolean) => {
        if (checked) {
            setEditSelectedServices([...editSelectedServices, serviceId])
        } else {
            setEditSelectedServices(editSelectedServices.filter(id => id !== serviceId))
        }
    }

    // 全选/取消全选分类下的服务（新建模式）
    const handleCategorySelection = (categoryName: string, checked: boolean) => {
        const categoryServices = getServicesByCategory()[categoryName] || []
        const categoryServiceIds = categoryServices.map(s => s._id)

        if (checked) {
            // 添加该分类下所有未选中的服务
            const newSelected = [...selectedServices]
            categoryServiceIds.forEach(id => {
                if (!newSelected.includes(id)) {
                    newSelected.push(id)
                }
            })
            setSelectedServices(newSelected)
        } else {
            // 移除该分类下所有已选中的服务
            setSelectedServices(selectedServices.filter(id => !categoryServiceIds.includes(id)))
        }
    }

    // 全选/取消全选分类下的服务（编辑模式）
    const handleEditCategorySelection = (categoryName: string, checked: boolean) => {
        const categoryServices = getServicesByCategory(editShowDisabledServices)[categoryName] || []
        const categoryServiceIds = categoryServices.map(s => s._id)

        if (checked) {
            // 添加该分类下所有未选中的服务
            const newSelected = [...editSelectedServices]
            categoryServiceIds.forEach(id => {
                if (!newSelected.includes(id)) {
                    newSelected.push(id)
                }
            })
            setEditSelectedServices(newSelected)
        } else {
            // 移除该分类下所有已选中的服务
            setEditSelectedServices(editSelectedServices.filter(id => !categoryServiceIds.includes(id)))
        }
    }

    // 检查分类是否全选（新建模式）
    const isCategoryFullySelected = (categoryName: string) => {
        const categoryServices = getServicesByCategory()[categoryName] || []
        const categoryServiceIds = categoryServices.map(s => s._id)
        return categoryServiceIds.every(id => selectedServices.includes(id))
    }

    // 检查分类是否部分选中（新建模式）
    const isCategoryPartiallySelected = (categoryName: string) => {
        const categoryServices = getServicesByCategory()[categoryName] || []
        const categoryServiceIds = categoryServices.map(s => s._id)
        const selectedCount = categoryServiceIds.filter(id => selectedServices.includes(id)).length
        return selectedCount > 0 && selectedCount < categoryServiceIds.length
    }

    // 检查分类是否全选（编辑模式）
    const isEditCategoryFullySelected = (categoryName: string) => {
        const categoryServices = getServicesByCategory(editShowDisabledServices)[categoryName] || []
        const categoryServiceIds = categoryServices.map(s => s._id)
        return categoryServiceIds.every(id => editSelectedServices.includes(id))
    }

    // 检查分类是否部分选中（编辑模式）
    const isEditCategoryPartiallySelected = (categoryName: string) => {
        const categoryServices = getServicesByCategory(editShowDisabledServices)[categoryName] || []
        const categoryServiceIds = categoryServices.map(s => s._id)
        const selectedCount = categoryServiceIds.filter(id => editSelectedServices.includes(id)).length
        return selectedCount > 0 && selectedCount < categoryServiceIds.length
    }

    // 获取服务项目的价格政策信息
    const getServicePricingPolicies = (service: ServicePricing) => {
        if (!service.pricingPolicyIds || service.pricingPolicyIds.length === 0) {
            return []
        }

        return pricingPolicies.filter(policy =>
            service.pricingPolicyIds?.includes(policy._id) && policy.status === 'active'
        )
    }

    // 表格列定义
    const columns = [
        {
            title: '报价单名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string, record: Quotation) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{name}</span>
                    {record.isDefault && (
                        <Tag color="green" style={{ fontSize: '12px' }}>
                            默认
                        </Tag>
                    )}
                    {record.status === 'inactive' && (
                        <Tag color="red" style={{ fontSize: '12px' }}>
                            已禁用
                        </Tag>
                    )}
                </div>
            )
        },
        {
            title: '服务数量',
            dataIndex: 'selectedServices',
            key: 'serviceCount',
            width: 100,
            render: (selectedServices: string[]) => (
                <span style={{ color: '#1890ff', fontWeight: '500' }}>
                    {selectedServices?.length || 0} 项
                </span>
            )
        },
        {
            title: '有效期至',
            dataIndex: 'validUntil',
            key: 'validUntil',
            width: 120,
            render: (validUntil: string) => validUntil ? dayjs(validUntil).format('YYYY-MM-DD') : '永久有效'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 120,
            render: (createTime: string) => dayjs(createTime).format('YYYY-MM-DD')
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_: any, record: Quotation) => {
                const actions = [
                    {
                        key: 'view',
                        label: '查看详情',
                        icon: <EyeOutlined />,
                        onClick: () => handleViewQuotation(record)
                    },
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => handleEditQuotation(record)
                    },
                    {
                        key: 'setAsDefault',
                        label: '设为默认',
                        icon: <StarOutlined />,
                        onClick: () => handleSetAsDefault(record),
                        disabled: record.isDefault
                    },
                    {
                        key: 'toggleStatus',
                        label: record.status === 'active' ? '停用' : '启用',
                        icon: record.status === 'active' ? <StopOutlined /> : <EyeOutlined />,
                        onClick: () => handleToggleStatus(record)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDeleteQuotation(record)
                    }
                ]

                return <ActionMenu actions={actions} />
            }
        }
    ]

    // 过滤数据
    const filteredQuotations = quotations.filter(quotation => {
        if (searchText && !quotation.name.includes(searchText)) {
            return false
        }
        if (statusFilter !== 'all' && quotation.status !== statusFilter) {
            return false
        }
        return true
    })

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>报价单</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={showNewQuotationModal}>
                    新建报价单
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索报价单名称"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                            placeholder="报价状态"
                            style={{ width: 120 }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="all">全部状态</Option>
                            <Option value="active">启用</Option>
                            <Option value="inactive">停用</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredQuotations}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    rowKey="_id"
                />
            </Card>

            {/* 新建报价单模态窗口 */}
            <Modal
                title="新建报价单"
                open={newQuotationModalVisible}
                onCancel={() => setNewQuotationModalVisible(false)}
                onOk={handleSaveQuotation}
                width={1000}
                okText="保存"
                cancelText="取消"
            >
                <Form form={newQuotationForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label="报价单名称"
                                rules={[{ required: true, message: '请输入报价单名称' }]}
                            >
                                <Input placeholder="请输入报价单名称，如：标准网站建设套餐" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="validUntil"
                                label="有效期至"
                            >
                                <DatePicker
                                    placeholder="请选择有效期"
                                    style={{ width: '100%' }}
                                    disabled={isPermanent}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label=" ">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Switch
                                        checked={isPermanent}
                                        onChange={setIsPermanent}
                                        checkedChildren="永久有效"
                                        unCheckedChildren="设置有效期"
                                    />
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="报价说明"
                    >
                        <TextArea rows={3} placeholder="请输入报价说明" />
                    </Form.Item>

                    <Form.Item
                        name="isDefault"
                        label=" "
                        valuePropName="checked"
                    >
                        <Checkbox>设为默认报价</Checkbox>
                    </Form.Item>

                    <Divider>选择服务项目</Divider>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                        padding: '12px 16px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: 6,
                        border: '1px solid #e9ecef'
                    }}>
                        <Text strong>服务项目列表</Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text style={{ fontSize: '14px', color: '#666' }}>
                                {showDisabledServices ? '显示全部' : '隐藏禁用项目'}
                            </Text>
                            <Switch
                                checked={showDisabledServices}
                                onChange={setShowDisabledServices}
                                checkedChildren="显示全部"
                                unCheckedChildren="隐藏禁用"
                                size="small"
                            />
                        </div>
                    </div>

                    <div style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #d9d9d9', borderRadius: 6, padding: 16 }}>
                        {Object.entries(getServicesByCategory()).map(([categoryName, services]) => (
                            <div key={categoryName} style={{ marginBottom: 24 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 12,
                                    padding: '8px 12px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 4
                                }}>
                                    <Checkbox
                                        checked={isCategoryFullySelected(categoryName)}
                                        indeterminate={isCategoryPartiallySelected(categoryName)}
                                        onChange={(e) => handleCategorySelection(categoryName, e.target.checked)}
                                        style={{ marginRight: 8 }}
                                    >
                                        <Title level={5} style={{ margin: 0 }}>{categoryName}</Title>
                                    </Checkbox>
                                </div>

                                <Row gutter={[16, 16]}>
                                    {services.map(service => (
                                        <Col span={6} key={service._id}>
                                            <div style={{
                                                padding: '12px',
                                                border: '1px solid #d9d9d9',
                                                borderRadius: 6,
                                                backgroundColor: selectedServices.includes(service._id) ? '#f6ffed' : '#fff',
                                                height: '60px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                cursor: service.status === 'active' ? 'pointer' : 'not-allowed',
                                                opacity: service.status === 'active' ? 1 : 0.6,
                                                position: 'relative'
                                            }}
                                                onClick={() => {
                                                    if (service.status === 'active') {
                                                        handleServiceSelection(service._id, !selectedServices.includes(service._id))
                                                    }
                                                }}
                                            >
                                                {/* 禁用状态标识 */}
                                                {service.status === 'inactive' && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        backgroundColor: '#ff4d4f',
                                                        color: '#fff',
                                                        fontSize: '10px',
                                                        padding: '2px 6px',
                                                        borderRadius: 4,
                                                        fontWeight: 'bold'
                                                    }}>
                                                        已禁用
                                                    </div>
                                                )}
                                                <Checkbox
                                                    checked={selectedServices.includes(service._id)}
                                                    onChange={(e) => handleServiceSelection(service._id, e.target.checked)}
                                                    disabled={service.status === 'inactive'}
                                                    style={{ marginBottom: 8 }}
                                                >
                                                    <div style={{ width: '100%' }}>
                                                        <div style={{
                                                            fontWeight: 'bold',
                                                            marginBottom: 4,
                                                            fontSize: '14px',
                                                            lineHeight: '1.2',
                                                            color: '#262626',
                                                            textAlign: 'left'
                                                        }}>
                                                            {service.alias}
                                                            <span style={{
                                                                color: '#1890ff',
                                                                fontSize: '13px',
                                                                fontWeight: '500',
                                                                marginLeft: 8
                                                            }}>
                                                                ¥{service.unitPrice.toLocaleString()}/{service.unit}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Checkbox>

                                                {/* 价格政策信息 */}
                                                {(() => {
                                                    const policies = getServicePricingPolicies(service)
                                                    if (policies.length === 0) return null

                                                    return (
                                                        <div style={{
                                                            marginTop: 'auto',
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: 2,
                                                            justifyContent: 'flex-start'
                                                        }}>
                                                            {policies.map(policy => (
                                                                <Tag
                                                                    key={policy._id}
                                                                    color="blue"
                                                                    style={{
                                                                        fontSize: '12px',
                                                                        padding: '2px 6px',
                                                                        marginRight: 6,
                                                                        lineHeight: '1.2'
                                                                    }}
                                                                >
                                                                    {policy.name}
                                                                </Tag>
                                                            ))}
                                                        </div>
                                                    )
                                                })()}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ))}
                    </div>

                    <Divider />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: '#f6ffed',
                        borderRadius: 6,
                        border: '1px solid #b7eb8f'
                    }}>
                        <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                            已选择 {selectedServices.length} 项服务
                        </Text>
                    </div>
                </Form>
            </Modal>

            {/* 编辑报价单模态窗口 */}
            <Modal
                title="编辑报价单"
                open={editQuotationModalVisible}
                onCancel={() => {
                    setEditQuotationModalVisible(false)
                    setEditingQuotation(null)
                }}
                onOk={handleSaveEditQuotation}
                width={1000}
                okText="保存"
                cancelText="取消"
            >
                <Form form={editQuotationForm} layout="vertical">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label="报价单名称"
                                rules={[{ required: true, message: '请输入报价单名称' }]}
                            >
                                <Input placeholder="请输入报价单名称，如：标准网站建设套餐" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="validUntil"
                                label="有效期至"
                            >
                                <DatePicker
                                    placeholder="请选择有效期"
                                    style={{ width: '100%' }}
                                    disabled={editIsPermanent}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label=" ">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Switch
                                        checked={editIsPermanent}
                                        onChange={setEditIsPermanent}
                                        checkedChildren="永久有效"
                                        unCheckedChildren="设置有效期"
                                    />
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="报价说明"
                    >
                        <TextArea rows={3} placeholder="请输入报价说明" />
                    </Form.Item>

                    <Form.Item
                        name="isDefault"
                        label=" "
                        valuePropName="checked"
                    >
                        <Checkbox>设为默认报价</Checkbox>
                    </Form.Item>

                    <Divider>选择服务项目</Divider>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                        padding: '12px 16px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: 6,
                        border: '1px solid #e9ecef'
                    }}>
                        <Text strong>服务项目列表</Text>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text style={{ fontSize: '14px', color: '#666' }}>
                                {editShowDisabledServices ? '显示全部' : '隐藏禁用项目'}
                            </Text>
                            <Switch
                                checked={editShowDisabledServices}
                                onChange={setEditShowDisabledServices}
                                checkedChildren="显示全部"
                                unCheckedChildren="隐藏禁用"
                                size="small"
                            />
                        </div>
                    </div>

                    <div style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #d9d9d9', borderRadius: 6, padding: 16 }}>
                        {Object.entries(getServicesByCategory(editShowDisabledServices)).map(([categoryName, services]) => (
                            <div key={categoryName} style={{ marginBottom: 24 }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 12,
                                    padding: '8px 12px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 4
                                }}>
                                    <Checkbox
                                        checked={isEditCategoryFullySelected(categoryName)}
                                        indeterminate={isEditCategoryPartiallySelected(categoryName)}
                                        onChange={(e) => handleEditCategorySelection(categoryName, e.target.checked)}
                                        style={{ marginRight: 8 }}
                                    >
                                        <Title level={5} style={{ margin: 0 }}>{categoryName}</Title>
                                    </Checkbox>
                                </div>

                                <Row gutter={[16, 16]}>
                                    {services.map(service => (
                                        <Col span={6} key={service._id}>
                                            <div style={{
                                                padding: '12px',
                                                border: '1px solid #d9d9d9',
                                                borderRadius: 6,
                                                backgroundColor: editSelectedServices.includes(service._id) ? '#f6ffed' : '#fff',
                                                height: '60px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                cursor: service.status === 'active' ? 'pointer' : 'not-allowed',
                                                opacity: service.status === 'active' ? 1 : 0.6,
                                                position: 'relative'
                                            }}
                                                onClick={() => {
                                                    if (service.status === 'active') {
                                                        handleEditServiceSelection(service._id, !editSelectedServices.includes(service._id))
                                                    }
                                                }}
                                            >
                                                {/* 禁用状态标识 */}
                                                {service.status === 'inactive' && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        backgroundColor: '#ff4d4f',
                                                        color: '#fff',
                                                        fontSize: '10px',
                                                        padding: '2px 6px',
                                                        borderRadius: 4,
                                                        fontWeight: 'bold'
                                                    }}>
                                                        已禁用
                                                    </div>
                                                )}
                                                <Checkbox
                                                    checked={editSelectedServices.includes(service._id)}
                                                    onChange={(e) => handleEditServiceSelection(service._id, e.target.checked)}
                                                    disabled={service.status === 'inactive'}
                                                    style={{ marginBottom: 8 }}
                                                >
                                                    <div style={{ width: '100%' }}>
                                                        <div style={{
                                                            fontWeight: 'bold',
                                                            marginBottom: 4,
                                                            fontSize: '14px',
                                                            lineHeight: '1.2',
                                                            color: '#262626',
                                                            textAlign: 'left'
                                                        }}>
                                                            {service.alias}
                                                            <span style={{
                                                                color: '#1890ff',
                                                                fontSize: '13px',
                                                                fontWeight: '500',
                                                                marginLeft: 8
                                                            }}>
                                                                ¥{service.unitPrice.toLocaleString()}/{service.unit}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Checkbox>

                                                {/* 价格政策信息 */}
                                                {(() => {
                                                    const policies = getServicePricingPolicies(service)
                                                    if (policies.length === 0) return null

                                                    return (
                                                        <div style={{
                                                            marginTop: 'auto',
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: 2,
                                                            justifyContent: 'flex-start'
                                                        }}>
                                                            {policies.map(policy => (
                                                                <Tag
                                                                    key={policy._id}
                                                                    color="blue"
                                                                    style={{
                                                                        fontSize: '12px',
                                                                        padding: '2px 6px',
                                                                        marginRight: 6,
                                                                        lineHeight: '1.2'
                                                                    }}
                                                                >
                                                                    {policy.name}
                                                                </Tag>
                                                            ))}
                                                        </div>
                                                    )
                                                })()}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ))}
                    </div>

                    <Divider />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: '#f6ffed',
                        borderRadius: 6,
                        border: '1px solid #b7eb8f'
                    }}>
                        <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                            已选择 {editSelectedServices.length} 项服务
                        </Text>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default Quotations 