import { useState, useEffect } from 'react'
import axios from 'axios'
import { message } from 'antd'
import { Order, createOrder, updateOrder } from '../../../api/orders'
import { Client, Contact, Quotation, ServiceDetail } from './types'
import { PricingPolicy } from '../../../api/pricingPolicy'

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(false)

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const response = await axios.get('/api/orders', {
                params: {
                    page: 1,
                    limit: 100
                }
            })
            if (response.data.success) {
                setOrders(response.data.data)
            }
        } catch (error) {
            console.error('获取订单列表失败:', error)
            message.error('获取订单列表失败')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return { orders, loading, fetchOrders }
}

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(false)

    const fetchClients = async (search?: string) => {
        setLoading(true)
        try {
            const params = search ? { search } : {}
            const response = await axios.get('/api/clients', { params })
            if (response.data.success) {
                setClients(response.data.data)
            }
        } catch (error) {
            console.error('获取客户列表失败:', error)
            message.error('获取客户列表失败')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    return { clients, loading, fetchClients }
}

export const useOrderModal = (clients: Client[], fetchServiceDetails: (serviceIds: string[]) => Promise<void>, fetchOrders?: () => Promise<void>) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
    const [selectedClientId, setSelectedClientId] = useState<string>('')
    const [projectName, setProjectName] = useState<string>('')
    const [serviceDetails, setServiceDetails] = useState<ServiceDetail[]>([])
    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [contacts, setContacts] = useState<Contact[]>([])
    const [quotations, setQuotations] = useState<Quotation[]>([])
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
    const [policies, setPolicies] = useState<PricingPolicy[]>([])

    // 加载价格政策
    const fetchPolicies = async () => {
        try {
            const response = await axios.get('/api/pricing-policies')
            if (response.data.success) {
                const allPolicies = response.data.data
                setPolicies(allPolicies.filter((policy: PricingPolicy) => policy.status === 'active'))
            }
        } catch (error) {
            console.error('加载价格政策失败:', error)
        }
    }

    useEffect(() => {
        fetchPolicies()
    }, [])

    const showAddModal = () => {
        setSelectedClientId('')
        setSelectedContactIds([])
        setProjectName('')
        setServiceDetails([])
        setSelectedServices([])
        setCurrentStep(1)
        setIsModalVisible(true)
    }

    const handleModalCancel = () => {
        setIsModalVisible(false)
        setCurrentStep(1)
        setContacts([])
        setQuotations([])
        setSelectedQuotation(null)
        setServiceDetails([])
        setSelectedServices([])
        setSelectedClientId('')
        setSelectedContactIds([])
        setProjectName('')
    }

    const resetModalState = () => {
        setSelectedClientId('')
        setSelectedContactIds([])
        setProjectName('')
        setServiceDetails([])
        setSelectedServices([])
        setCurrentStep(1)
        setContacts([])
        setQuotations([])
        setSelectedQuotation(null)
    }

    const handleCreateOrder = async () => {
        try {
            // 验证必填字段
            if (!selectedClientId) {
                message.error('请选择客户')
                return
            }
            if (selectedContactIds.length === 0) {
                message.error('请选择联系人')
                return
            }
            if (!projectName.trim()) {
                message.error('请输入项目名称')
                return
            }
            if (selectedServices.length === 0) {
                message.error('请选择至少一个服务项目')
                return
            }

            // 获取选中的客户信息
            const selectedClient = clients.find(client => client._id === selectedClientId)
            if (!selectedClient) {
                message.error('客户信息不存在')
                return
            }

            // 获取选中的联系人信息（取第一个）
            const selectedContact = contacts.find(contact => (contact._id || contact.id) === selectedContactIds[0])
            if (!selectedContact) {
                message.error('联系人信息不存在')
                return
            }

            // 准备订单数据
            const filteredServiceDetails = serviceDetails.filter(service => selectedServices.includes(service._id || service.id || ''))

            // 构建价格政策数据 - 只包含用户选择的政策
            const selectedPolicies: any[] = []

            filteredServiceDetails.forEach(service => {
                if (service.selectedPolicies && service.selectedPolicies.length > 0) {
                    // 为这个服务添加其选择的政策
                    service.selectedPolicies.forEach(policyId => {
                        const policy = policies.find(p => p._id === policyId)
                        if (policy) {
                            selectedPolicies.push({
                                policyId: policy._id,
                                _id: policy._id, // Ensure _id is present for backend calculation
                                name: policy.name,
                                type: policy.type,
                                discountRatio: policy.discountRatio,
                                tierSettings: policy.tierSettings,
                                serviceId: service._id || service.id // 关联到具体的服务
                            })
                        }
                    })
                }
            })

            const orderData = {
                clientId: selectedClientId,
                clientName: selectedClient.companyName || selectedClient.name || '',
                contactIds: selectedContactIds,
                contactNames: selectedContactIds.map(contactId => {
                    const contact = contacts.find(c => (c._id || c.id) === contactId)
                    return contact?.realName || ''
                }),
                contactPhones: selectedContactIds.map(contactId => {
                    const contact = contacts.find(c => (c._id || c.id) === contactId)
                    return contact?.phone || ''
                }),
                projectName: projectName.trim(),
                quotationId: selectedQuotation?._id || undefined,
                selectedServices: selectedServices,
                serviceDetails: filteredServiceDetails,
                policies: selectedPolicies, // 传递用户选择的政策
                updatedBy: 'system' // 这里应该使用当前登录用户
            }



            console.log('🔍 即将创建订单，数据:', orderData)
            console.log('🔍 构建的政策数据:', selectedPolicies)
            console.log('🔍 服务详情:', filteredServiceDetails.map(s => ({
                serviceName: s.serviceName,
                selectedPolicies: s.selectedPolicies
            })))

            // 调用API创建订单
            const response = await createOrder(orderData)

            if (response.success) {
                message.success('订单创建成功')
                setIsModalVisible(false)
                resetModalState()
                // 刷新订单列表
                if (fetchOrders) {
                    await fetchOrders()
                }
            } else {
                message.error('订单创建失败')
            }
        } catch (error) {
            console.error('创建订单失败:', error)
            message.error('创建订单失败')
        }
    }

    const handleUpdateOrder = async (orderId: string) => {
        try {
            // 验证必填字段
            if (!selectedClientId) {
                message.error('请选择客户')
                return
            }
            if (selectedContactIds.length === 0) {
                message.error('请选择联系人')
                return
            }
            if (!projectName.trim()) {
                message.error('请输入项目名称')
                return
            }
            if (selectedServices.length === 0) {
                message.error('请选择至少一个服务项目')
                return
            }

            // 获取选中的客户信息
            const selectedClient = clients.find(client => client._id === selectedClientId)
            if (!selectedClient) {
                message.error('客户信息不存在')
                return
            }

            // 准备更新数据
            const filteredServiceDetails = serviceDetails.filter(service => selectedServices.includes(service._id || service.id || ''))

            // 构建价格政策数据 - 只包含用户选择的政策
            const selectedPolicies: any[] = []

            filteredServiceDetails.forEach(service => {
                if (service.selectedPolicies && service.selectedPolicies.length > 0) {
                    // 为这个服务添加其选择的政策
                    service.selectedPolicies.forEach(policyId => {
                        const policy = policies.find(p => p._id === policyId)
                        if (policy) {
                            selectedPolicies.push({
                                policyId: policy._id,
                                _id: policy._id, // Ensure _id is present for backend calculation
                                name: policy.name,
                                type: policy.type,
                                discountRatio: policy.discountRatio,
                                tierSettings: policy.tierSettings,
                                serviceId: service._id || service.id // 关联到具体的服务
                            })
                        }
                    })
                }
            })

            const updateData = {
                clientId: selectedClientId,
                clientName: selectedClient.companyName || selectedClient.name || '',
                contactIds: selectedContactIds,
                contactNames: selectedContactIds.map(contactId => {
                    const contact = contacts.find(c => (c._id || c.id) === contactId)
                    return contact?.realName || ''
                }),
                contactPhones: selectedContactIds.map(contactId => {
                    const contact = contacts.find(c => (c._id || c.id) === contactId)
                    return contact?.phone || ''
                }),
                projectName: projectName.trim(),
                quotationId: selectedQuotation?._id || undefined,
                selectedServices: selectedServices,
                serviceDetails: filteredServiceDetails,
                policies: selectedPolicies, // 传递用户选择的政策
                updatedBy: 'system' // 这里应该使用当前登录用户
            }



            // 调用API更新订单
            const response = await updateOrder(orderId, updateData)

            if (response.success) {
                message.success('订单更新成功')
                setIsModalVisible(false)
                resetModalState()
                // 刷新订单列表
                if (fetchOrders) {
                    await fetchOrders()
                }
            } else {
                message.error('订单更新失败')
            }
        } catch (error) {
            console.error('更新订单失败:', error)
            message.error('更新订单失败')
        }
    }

    return {
        isModalVisible,
        currentStep,
        selectedContactIds,
        selectedClientId,
        projectName,
        serviceDetails,
        selectedServices,
        contacts,
        quotations,
        selectedQuotation,
        policies,
        setServiceDetails,
        setSelectedServices,
        setContacts,
        setQuotations,
        setSelectedQuotation,
        setSelectedClientId,
        setSelectedContactIds,
        setProjectName,
        setCurrentStep,
        setIsModalVisible,
        setPolicies,
        showAddModal,
        handleModalCancel,
        resetModalState,
        handleCreateOrder,
        handleUpdateOrder
    }
}

export const useServiceSelection = (serviceDetails: ServiceDetail[], selectedServices: string[], setSelectedServices: React.Dispatch<React.SetStateAction<string[]>>) => {
    const handleServiceSelect = (serviceId: string, checked: boolean) => {
        // 检查服务是否被禁用
        const service = serviceDetails.find(s => (s._id || s.id) === serviceId)
        if (service && service.status === 'inactive') {
            return // 已禁用的服务无法选择
        }

        if (checked) {
            setSelectedServices(prev => [...prev, serviceId])
        } else {
            setSelectedServices(prev => prev.filter(id => id !== serviceId))
        }
    }

    const handleCategorySelectAll = (categoryName: string, checked: boolean) => {
        // 只获取该分类下未禁用的服务
        const categoryServices = serviceDetails.filter(service =>
            service.categoryName === categoryName && service.status !== 'inactive'
        )
        const categoryServiceIds = categoryServices.map(service => service._id || service.id || '')

        if (checked) {
            // 全选：添加该分类下所有未选中且未禁用的服务
            setSelectedServices(prev => {
                const newSelected = [...prev]
                categoryServiceIds.forEach(id => {
                    if (!newSelected.includes(id)) {
                        newSelected.push(id)
                    }
                })
                return newSelected
            })
        } else {
            // 取消全选：移除该分类下所有已选中的服务
            setSelectedServices(prev => prev.filter(id => !categoryServiceIds.includes(id)))
        }
    }

    const isCategoryAllSelected = (categoryName: string) => {
        // 只考虑未禁用的服务
        const categoryServices = serviceDetails.filter(service =>
            service.categoryName === categoryName && service.status !== 'inactive'
        )
        return categoryServices.length > 0 && categoryServices.every(service =>
            selectedServices.includes(service._id || service.id || '')
        )
    }

    const isCategoryIndeterminate = (categoryName: string) => {
        // 只考虑未禁用的服务
        const categoryServices = serviceDetails.filter(service =>
            service.categoryName === categoryName && service.status !== 'inactive'
        )
        const selectedCount = categoryServices.filter(service =>
            selectedServices.includes(service._id || service.id || '')
        ).length
        return selectedCount > 0 && selectedCount < categoryServices.length
    }

    return {
        handleServiceSelect,
        handleCategorySelectAll,
        isCategoryAllSelected,
        isCategoryIndeterminate
    }
} 