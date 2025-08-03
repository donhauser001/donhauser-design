import React, { useEffect } from 'react'
import { Card, Table, Button, Space, Input, Select, Modal, Form, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios'
import dayjs from 'dayjs'

// 导入类型定义
import { Contact } from './types'
import { Order, updateOrderStatus, deleteOrder } from '../../../api/orders'

// 导入组件
import StepIndicator from './StepIndicator'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import ViewOrderModal from './ViewOrderModal'

// 导入工具函数
import { getColumns } from './columns'

// 导入hooks
import { useOrders, useClients, useOrderModal, useServiceSelection } from './hooks'

const { Option } = Select

const Orders: React.FC = () => {
    const [form] = Form.useForm()

    // 使用自定义hooks
    const {
        orders,
        loading,
        fetchOrders
    } = useOrders()

    // 添加搜索和过滤状态
    const [searchText, setSearchText] = React.useState('')
    const [statusFilter, setStatusFilter] = React.useState<'normal' | 'cancelled' | 'all'>('all')

    // 添加缺失的状态变量
    const [quotations, setQuotations] = React.useState<any[]>([])

    const { clients, loading: clientLoading, fetchClients } = useClients()

    // 获取服务项目详细信息
    const fetchServiceDetails = async (serviceIds: string[], updateModeData?: { items: any[] }) => {
        try {
            if (serviceIds.length === 0) {
                setServiceDetails([])
                return
            }

            const response = await axios.get('/api/service-pricing/by-ids', {
                params: {
                    ids: serviceIds.join(',')
                }
            })

            if (response.data.success) {
                let servicesWithQuantity = response.data.data.map((service: any) => ({
                    ...service,
                    quantity: 1,
                    selectedPolicies: []
                }))

                // 如果是更新模式，只设置数量和选中的政策，其他数据保持原样
                if (updateModeData) {
                    servicesWithQuantity = servicesWithQuantity.map((service: any) => {
                        const updateItem = updateModeData.items.find((item: any) => item.serviceId === (service._id || service.id))
                        if (updateItem) {
                            return {
                                ...service,
                                quantity: updateItem.quantity || 1,
                                selectedPolicies: updateItem.pricingPolicies.map((policy: any) => policy.policyId)
                            }
                        }
                        return service
                    })
                }

                setServiceDetails(servicesWithQuantity)

                // 在新建模式下，默认全部未选中；在更新模式下，设置已选择的服务
                if (!updateModeData) {
                    setSelectedServices([])
                }
            } else {
                console.error('获取服务项目详情失败:', response.data.message)
                setServiceDetails([])
            }
        } catch (error) {
            console.error('获取服务项目详情失败:', error)
            setServiceDetails([])
        }
    }

    const {
        isModalVisible,
        currentStep,
        selectedContactIds,
        selectedClientId,
        projectName,
        serviceDetails,
        selectedServices,
        contacts,
        selectedQuotation,
        policies,
        setServiceDetails,
        setSelectedServices,
        setContacts,
        setSelectedQuotation,
        setSelectedClientId,
        setSelectedContactIds,
        setProjectName,
        setCurrentStep,
        setIsModalVisible,
        setPolicies,
        showAddModal,
        handleModalCancel,
        handleCreateOrder,
        handleUpdateOrder
    } = useOrderModal(clients, fetchServiceDetails, fetchOrders)

    // 添加更新订单状态
    const [updatingOrderId, setUpdatingOrderId] = React.useState<string | null>(null)

    // 查看订单模态窗状态
    const [isViewModalVisible, setIsViewModalVisible] = React.useState(false)
    const [viewingOrder, setViewingOrder] = React.useState<Order | null>(null)

    // 自定义取消处理函数
    const handleCustomModalCancel = () => {
        handleModalCancel()
        setUpdatingOrderId(null) // 重置更新状态
    }

    // 查看订单处理函数
    const handleViewOrder = (order: Order) => {
        setViewingOrder(order)
        setIsViewModalVisible(true)
    }

    // 关闭查看模态窗
    const handleViewModalClose = () => {
        setIsViewModalVisible(false)
        setViewingOrder(null)
    }

    // 使用服务选择hooks
    const {
        handleServiceSelect,
        handleCategorySelectAll,
        isCategoryAllSelected,
        isCategoryIndeterminate
    } = useServiceSelection(serviceDetails, selectedServices, setSelectedServices)

    // 处理数量变化
    const handleQuantityChange = (serviceId: string, quantity: number) => {
        setServiceDetails(prev =>
            prev.map(service =>
                (service._id || service.id) === serviceId
                    ? { ...service, quantity }
                    : service
            )
        )
    }

    // 处理价格政策变化
    const handlePolicyChange = (serviceId: string, policyIds: string[]) => {
        setServiceDetails(prev =>
            prev.map(service =>
                (service._id || service.id) === serviceId
                    ? { ...service, selectedPolicies: policyIds }
                    : service
            )
        )
    }

    // 处理客户选择
    const handleClientSelect = async (clientId: string) => {
        try {
            // 获取客户详情
            const clientResponse = await axios.get(`/api/clients/${clientId}`)
            if (clientResponse.data.success) {
                const client = clientResponse.data.data

                // 获取该客户的联系人列表 - 包含已禁用的联系人
                const contactsResponse = await axios.get('/api/users', {
                    params: {
                        role: '客户',
                        page: 1,
                        limit: 1000 // 获取所有联系人，不使用分页限制
                    }
                })

                if (contactsResponse.data.success) {
                    // 过滤出属于该公司的联系人
                    const clientContacts = contactsResponse.data.data.filter((contact: Contact) => {
                        const clientName = client.name || client.companyName || ''
                        const contactCompany = contact.company || ''
                        return contactCompany === clientName
                    })
                    setContacts(clientContacts)
                }

                // 根据客户的quotationId获取报价单
                if (client.quotationId) {
                    try {
                        const quotationResponse = await axios.get(`/api/quotations/${client.quotationId}`)

                        if (quotationResponse.data.success) {
                            const quotation = quotationResponse.data.data
                            setQuotations([quotation])
                            setSelectedQuotation(quotation)

                            // 获取服务项目详情
                            if (quotation.selectedServices && quotation.selectedServices.length > 0) {
                                await fetchServiceDetails(quotation.selectedServices)
                            } else {
                                setServiceDetails([])
                            }
                        }
                    } catch (error) {
                        console.error('获取报价单失败:', error)
                        message.warning('该客户关联的报价单不存在或已被删除')
                        setQuotations([])
                        setSelectedQuotation(null)
                        setServiceDetails([])
                    }
                } else {
                    // 如果客户没有关联报价单，获取所有活跃的报价单
                    const quotationsResponse = await axios.get('/api/quotations', {
                        params: {
                            status: 'active' // 只获取活跃的报价单
                        }
                    })

                    if (quotationsResponse.data.success) {
                        const allQuotations = quotationsResponse.data.data

                        setQuotations(allQuotations)
                        if (allQuotations.length > 0) {
                            const quotation = allQuotations[0]
                            setSelectedQuotation(quotation)

                            // 获取服务项目详情
                            if (quotation.selectedServices && quotation.selectedServices.length > 0) {
                                await fetchServiceDetails(quotation.selectedServices)
                            } else {
                                setServiceDetails([])
                            }
                        } else {
                            setServiceDetails([])
                        }
                    }
                }

                // 更新表单
                form.setFieldsValue({
                    clientId: clientId,
                    clientName: client.companyName || client.name,
                    contactId: undefined // 清空之前选择的联系人
                })
                setSelectedClientId(clientId) // 保存选择的客户ID

                // 检查之前选择的联系人是否仍然属于新选择的客户
                if (selectedContactIds.length > 0) {
                    const previousContact = contacts.find(contact =>
                        (contact.id || contact._id) === selectedContactIds[0]
                    )
                    if (!previousContact || previousContact.company !== (client.companyName || client.name)) {
                        setSelectedContactIds([]) // 如果联系人不属于新客户，则重置
                        form.setFieldsValue({ contactId: undefined })
                    }
                } else {
                    setSelectedContactIds([]) // 重置联系人选择状态
                }
            }
        } catch (error) {
            console.error('获取客户信息失败:', error)
            message.error('获取客户信息失败')
        }
    }

    // 处理模态窗确认
    const handleModalOk = async () => {
        // 新增订单
        await handleCreateOrder()
    }

    // 删除订单
    const handleDeleteOrder = (order: Order) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除订单 ${order.orderNo} 吗？此操作不可恢复。`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await deleteOrder(order._id)
                    if (response.success) {
                        message.success('订单删除成功')
                        // 刷新订单列表
                        fetchOrders()
                    } else {
                        message.error(response.message || '删除订单失败')
                    }
                } catch (error: any) {
                    console.error('删除失败:', error)
                    message.error(error?.response?.data?.message || '删除失败')
                }
            }
        })
    }

    // 确认订单
    const handleConfirmOrder = (order: Order) => {
        Modal.confirm({
            title: '确认订单',
            content: `确定要确认订单 ${order.orderNo} 吗？`,
            okText: '确认',
            okType: 'primary',
            cancelText: '取消',
            onOk: async () => {
                try {
                    // 注意：后端还没有实现状态更新功能，这里暂时显示提示
                    message.info('状态更新功能暂未实现')
                } catch (error: any) {
                    console.error('确认失败:', error)
                    message.error(error?.response?.data?.message || '确认失败')
                }
            }
        })
    }

    // 取消订单
    const handleCancelOrder = (order: Order) => {
        Modal.confirm({
            title: '取消订单',
            content: `确定要取消订单 ${order.orderNo} 吗？`,
            okText: '取消订单',
            okType: 'danger',
            cancelText: '返回',
            onOk: async () => {
                try {
                    const response = await updateOrderStatus(order._id, 'cancelled')
                    if (response.success) {
                        message.success('订单已取消')
                        // 刷新订单列表
                        fetchOrders()
                    } else {
                        message.error(response.message || '取消订单失败')
                    }
                } catch (error: any) {
                    console.error('取消失败:', error)
                    message.error(error?.response?.data?.message || '取消失败')
                }
            }
        })
    }

    // 恢复订单
    const handleRestoreOrder = (order: Order) => {
        Modal.confirm({
            title: '恢复订单',
            content: `确定要恢复订单 ${order.orderNo} 为正常状态吗？`,
            okText: '恢复订单',
            okType: 'primary',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await updateOrderStatus(order._id, 'normal')
                    if (response.success) {
                        message.success('订单已恢复')
                        // 刷新订单列表
                        fetchOrders()
                    } else {
                        message.error(response.message || '恢复订单失败')
                    }
                } catch (error: any) {
                    console.error('恢复失败:', error)
                    message.error(error?.response?.data?.message || '恢复失败')
                }
            }
        })
    }

    // 处理订单更新
    const handleUpdateOrderClick = async (order: Order) => {
        // 设置正在更新的订单ID
        setUpdatingOrderId(order._id)

        // 获取订单的最后一个版本信息
        const snapshots = order.snapshots || []
        const lastSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null

        if (lastSnapshot) {
            // 填充表单数据 - 使用最后一个版本的数据
            setSelectedClientId(lastSnapshot.clientInfo.clientId)
            setSelectedContactIds(lastSnapshot.clientInfo.contactIds || [])
            setProjectName(lastSnapshot.projectInfo.projectName)

            // 先获取客户信息，然后获取联系人列表和报价单信息
            try {
                // 获取客户详情 - 使用最后一个版本的客户ID
                const clientResponse = await axios.get(`/api/clients/${lastSnapshot.clientInfo.clientId}`)
                if (clientResponse.data.success) {
                    const client = clientResponse.data.data

                    // 获取该客户的联系人列表
                    const contactsResponse = await axios.get('/api/users', {
                        params: {
                            role: '客户'
                        }
                    })

                    if (contactsResponse.data.success) {
                        // 过滤出属于该公司的联系人
                        const clientContacts = contactsResponse.data.data.filter((contact: Contact) => {
                            return contact.company === (client.companyName || client.name)
                        })
                        setContacts(clientContacts)
                    }


                }
            } catch (error) {
                console.error('获取客户和联系人信息失败:', error)
            }

            // 注意：不要覆盖全局的价格政策数据，保持使用系统中的完整政策信息
            // 价格政策应该已经在组件初始化时正确加载了

            // 获取报价单信息并加载服务项目
            if (lastSnapshot.projectInfo.quotationId) {
                try {
                    const quotationResponse = await axios.get(`/api/quotations/${lastSnapshot.projectInfo.quotationId}`)
                    if (quotationResponse.data.success) {
                        const quotation = quotationResponse.data.data
                        setSelectedQuotation(quotation)
                        console.log('获取到报价单:', quotation.name)

                        // 获取报价单中的所有服务项目
                        if (quotation.selectedServices && quotation.selectedServices.length > 0) {
                            await fetchServiceDetails(quotation.selectedServices, {
                                items: lastSnapshot.items
                            })

                            // 在服务项目加载完成后，设置已选择的服务项目
                            const serviceIds = lastSnapshot.items.map((item: any) => item.serviceId)
                            setSelectedServices(serviceIds)
                        }
                    }
                } catch (error) {
                    console.error('获取报价单信息失败:', error)
                    setSelectedQuotation(null)
                }
            } else {
                setSelectedQuotation(null)
            }

            // 设置数量
            lastSnapshot.items.forEach((item: any) => {
                handleQuantityChange(item.serviceId, item.quantity)
            })
        }

        // 打开模态窗
        setCurrentStep(1)
        setIsModalVisible(true)
    }

    // 当步骤切换时，确保表单状态保持一致
    useEffect(() => {
        if (currentStep === 1) {
            // 确保表单值与状态变量同步
            if (selectedClientId) {
                form.setFieldsValue({ clientId: selectedClientId })
            }
            if (selectedContactIds.length > 0) {
                form.setFieldsValue({ contactId: selectedContactIds })
            }
            if (projectName) {
                form.setFieldsValue({ projectName: projectName })
            }
        }
    }, [currentStep, selectedClientId, selectedContactIds, projectName, form])

    // 过滤订单数据
    const filteredOrders = orders.filter(order => {
        // 搜索文本过滤
        const searchMatch = !searchText ||
            order.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
            order.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
            order.projectName?.toLowerCase().includes(searchText.toLowerCase())

        // 状态过滤
        const statusMatch = statusFilter === 'all' || order.status === statusFilter

        return searchMatch && statusMatch
    })

    // 移除编辑功能，只保留新建订单

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>订单管理</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                    新建订单
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input.Search
                            placeholder="搜索订单号、客户名称、项目名称、描述"
                            style={{ width: 300 }}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Select
                            placeholder="订单状态"
                            style={{ width: 120 }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="all">全部状态</Option>
                            <Option value="normal">正常</Option>
                            <Option value="cancelled">已取消</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={getColumns({
                        handleDeleteOrder,
                        handleConfirmOrder,
                        handleCancelOrder,
                        handleRestoreOrder,
                        handleUpdateOrder: handleUpdateOrderClick,
                        handleViewOrder
                    })}
                    dataSource={filteredOrders}
                    rowKey={(record) => record._id || ''}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`
                    }}
                />
            </Card>

            {/* 新建/更新订单模态窗 */}
            <Modal
                title={updatingOrderId ? "更新订单" : "新建订单"}
                open={isModalVisible}
                onCancel={handleCustomModalCancel}
                width={1200}
                destroyOnHidden
                footer={null}
            >
                <div>
                    {/* 步骤指示器 */}
                    <StepIndicator currentStep={currentStep} />

                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            status: 'normal',
                            createTime: dayjs()
                        }}
                    >
                        {currentStep === 1 && (
                            <StepOne
                                form={form}
                                clients={clients}
                                contacts={contacts}
                                selectedClientId={selectedClientId}
                                selectedContactIds={selectedContactIds}
                                projectName={projectName}
                                onClientSelect={handleClientSelect}
                                onContactSelect={(contactIds: string[]) => {
                                    setSelectedContactIds(contactIds)
                                    form.setFieldsValue({ contactId: contactIds }) // 直接使用数组
                                }}
                                onProjectNameChange={(name: string) => {
                                    setProjectName(name)
                                    form.setFieldsValue({ projectName: name })
                                }}
                                onNext={() => setCurrentStep(2)}
                                onCancel={handleCustomModalCancel}
                                onClientSearch={fetchClients}
                                clientLoading={clientLoading}
                            />
                        )}

                        {currentStep === 2 && (
                            <StepTwo
                                selectedQuotation={selectedQuotation}
                                serviceDetails={serviceDetails}
                                selectedServices={selectedServices}
                                onServiceSelect={handleServiceSelect}
                                onCategorySelectAll={handleCategorySelectAll}
                                isCategoryAllSelected={isCategoryAllSelected}
                                isCategoryIndeterminate={isCategoryIndeterminate}
                                onPrevious={() => setCurrentStep(1)}
                                onNext={() => setCurrentStep(3)}
                                onCancel={handleCustomModalCancel}
                            />
                        )}

                        {currentStep === 3 && (
                            <StepThree
                                clients={clients}
                                contacts={contacts}
                                serviceDetails={serviceDetails}
                                selectedClientId={selectedClientId}
                                selectedContactIds={selectedContactIds}
                                projectName={projectName}
                                selectedServices={selectedServices}
                                policies={policies}
                                isUpdateMode={!!updatingOrderId}
                                onPrevious={() => setCurrentStep(2)}
                                onCreateOrder={updatingOrderId ? () => handleUpdateOrder(updatingOrderId) : handleModalOk}
                                onCancel={handleCustomModalCancel}
                                onQuantityChange={handleQuantityChange}
                                onPolicyChange={handlePolicyChange}
                            />
                        )}
                    </Form>
                </div>
            </Modal>

            {/* 查看订单详情模态窗 */}
            <ViewOrderModal
                visible={isViewModalVisible}
                order={viewingOrder}
                onClose={handleViewModalClose}
            />
        </div>
    )
}

export default Orders 