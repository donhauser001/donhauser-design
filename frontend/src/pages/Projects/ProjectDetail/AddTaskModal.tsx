import React, { useState, useEffect } from 'react'
import { Modal, Select, InputNumber, Checkbox, Card, Table, message, Spin, Tag, Button, Space, Input, Tooltip } from 'antd'
import { Client } from '../../../api/clients'
import { Quotation } from '../../../api/quotations'
import { ServicePricing } from '../../../api/servicePricing'
import { PricingPolicy } from '../../../api/pricingPolicy'
import { Priority } from './types'
import { PRIORITY_OPTIONS } from './constants'
import { calculatePriceWithPolicies, formatCalculationDetails } from '../../../components/PricePolicyCalculator'
import RMBAmountConverter from '../../../components/RMBAmountConverter'

const { Option } = Select

interface AddTaskModalProps {
    visible: boolean
    projectId?: string
    projectClient?: string
    projectContacts?: string[] // 项目中已有的联系人ID列表
    onOk: (taskData: CreateTaskData[]) => Promise<void>
    onCancel: () => void
    loading?: boolean
}

export interface CreateTaskData {
    taskName: string
    serviceId: string
    quantity: number
    unit: string
    priority: Priority
    dueDate?: string
    remarks?: string
    subtotal: number
    pricingPolicies: string[]
    contactIds?: string[]
}

interface ServiceDetail {
    _id: string
    serviceName: string
    categoryName: string
    unitPrice: number
    unit: string
    status: 'active' | 'inactive'
    pricingPolicyIds?: string[]
    quantity: number
    selectedPolicies: string[]
    priceDescription?: string
}

interface Contact {
    _id: string
    name: string
    phone?: string
    email?: string
    position?: string
}

interface ExistingTask {
    _id: string
    taskName: string
    serviceId: string
    serviceName: string
    categoryName: string
    unitPrice: number
    unit: string
    quantity: number
    subtotal: number
    pricingPolicies: string[]
    priceDescription?: string
    status: 'active' | 'inactive'
    isExisting: true // 标记为已有任务
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
    visible,
    projectId,
    projectClient,
    projectContacts = [],
    onOk,
    onCancel,
    loading = false
}) => {
    const [confirmLoading, setConfirmLoading] = useState(false)

    // 数据状态
    const [client, setClient] = useState<Client | null>(null)
    const [contacts, setContacts] = useState<Contact[]>([])
    const [quotations, setQuotations] = useState<Quotation[]>([])
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
    const [serviceDetails, setServiceDetails] = useState<ServiceDetail[]>([])
    const [policies, setPolicies] = useState<PricingPolicy[]>([])
    const [selectedServices, setSelectedServices] = useState<string[]>([])
    const [selectedContactIds, setSelectedContactIds] = useState<string[]>([])
    const [assignedContactIds, setAssignedContactIds] = useState<string[]>([])
    const [existingTasks, setExistingTasks] = useState<ExistingTask[]>([])

    // 加载状态
    const [clientLoading, setClientLoading] = useState(false)
    const [contactLoading, setContactLoading] = useState(false)
    const [quotationLoading, setQuotationLoading] = useState(false)
    const [serviceLoading, setServiceLoading] = useState(false)
    const [existingTasksLoading, setExistingTasksLoading] = useState(false)

    // 当前步骤
    const [currentStep, setCurrentStep] = useState(1)

    // 计算总金额
    const calculateTotalAmount = () => {
        // 计算新追加任务的金额
        const newTasksAmount = serviceDetails
            .filter(service => selectedServices.includes(service._id))
            .reduce((sum, service) => {
                const quantity = service.quantity || 1
                const originalPrice = (service.unitPrice || 0) * quantity

                // 如果有选中的价格政策，计算折扣价格
                if (service.selectedPolicies && service.selectedPolicies.length > 0) {
                    const calculationResult = calculatePriceWithPolicies(
                        originalPrice,
                        quantity,
                        policies,
                        service.selectedPolicies,
                        service.unit || '件'
                    )
                    return sum + calculationResult.discountedPrice
                }

                return sum + originalPrice
            }, 0)

        // 计算已有任务的金额
        const existingTasksAmount = existingTasks.reduce((sum, task) => {
            return sum + (task.subtotal || 0)
        }, 0)

        return newTasksAmount + existingTasksAmount
    }

    // 获取客户信息
    const fetchClient = async () => {
        if (!projectClient) return

        try {
            setClientLoading(true)

            // 先尝试通过名称搜索客户
            const searchResponse = await fetch(`http://localhost:3000/api/clients?search=${encodeURIComponent(projectClient)}`)
            const searchData = await searchResponse.json()

            if (searchData.success && searchData.data.length > 0) {
                // 找到匹配的客户
                const matchedClient = searchData.data.find((client: any) =>
                    client.companyName === projectClient || client.name === projectClient
                )

                if (matchedClient) {
                    setClient(matchedClient)
                } else {
                    // 如果没有找到完全匹配的，使用第一个结果
                    setClient(searchData.data[0])
                }
            } else {
                // 如果搜索失败，尝试直接通过ID获取（可能是ID格式）
                try {
                    const response = await fetch(`http://localhost:3000/api/clients/${projectClient}`)
                    const data = await response.json()

                    if (data.success) {
                        setClient(data.data)
                    } else {
                        message.warning('无法找到对应的客户信息')
                    }
                } catch (idError) {
                    message.warning('无法找到对应的客户信息')
                }
            }
        } catch (error) {
            console.error('获取客户信息失败:', error)
            message.error('获取客户信息失败')
        } finally {
            setClientLoading(false)
        }
    }

    // 获取客户联系人
    const fetchContacts = async () => {
        if (!client) return

        try {
            setContactLoading(true)
            console.log('正在获取联系人，客户名称:', client.name)

            // 从用户表中获取联系人，通过company字段关联
            const response = await fetch('http://localhost:3000/api/users/all')
            const data = await response.json()

            console.log('用户API响应:', data)

            if (data.success) {
                // 过滤出属于当前客户的联系人
                const clientContacts = data.data.filter((user: any) =>
                    user.company === client.name ||
                    user.contactPerson === client.name
                ).map((user: any) => ({
                    _id: user._id || user.id,
                    name: user.realName || user.username,
                    phone: user.phone,
                    email: user.email,
                    position: user.position || user.role
                }))

                setContacts(clientContacts)
                console.log('获取到的联系人:', clientContacts)
            } else {
                console.warn('获取用户数据失败:', data.message)
            }
        } catch (error) {
            console.error('获取联系人失败:', error)
        } finally {
            setContactLoading(false)
        }
    }

    // 获取报价单
    const fetchQuotations = async () => {
        if (!client) return

        try {
            setQuotationLoading(true)

            if (client.quotationId) {
                // 如果客户有关联的报价单，获取该报价单
                const response = await fetch(`http://localhost:3000/api/quotations/${client.quotationId}`)
                const data = await response.json()

                if (data.success) {
                    setQuotations([data.data])
                    setSelectedQuotation(data.data)
                }
            } else {
                // 获取所有活跃的报价单
                const response = await fetch('http://localhost:3000/api/quotations?status=active')
                const data = await response.json()

                if (data.success) {
                    setQuotations(data.data)
                    if (data.data.length > 0) {
                        setSelectedQuotation(data.data[0])
                    }
                }
            }
        } catch (error) {
            console.error('获取报价单失败:', error)
            message.error('获取报价单失败')
        } finally {
            setQuotationLoading(false)
        }
    }

    // 获取服务项目详情
    const fetchServiceDetails = async (serviceIds: string[]) => {
        if (!selectedQuotation || serviceIds.length === 0) {
            setServiceDetails([])
            return
        }

        try {
            setServiceLoading(true)
            const response = await fetch(`http://localhost:3000/api/service-pricing/by-ids?ids=${serviceIds.join(',')}`)
            const data = await response.json()

            if (data.success) {
                const servicesWithQuantity = data.data.map((service: any) => ({
                    ...service,
                    quantity: 1,
                    selectedPolicies: []
                }))
                setServiceDetails(servicesWithQuantity)
            }
        } catch (error) {
            console.error('获取服务项目详情失败:', error)
            message.error('获取服务项目详情失败')
        } finally {
            setServiceLoading(false)
        }
    }

    // 获取价格政策
    const fetchPolicies = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/pricing-policies')
            const data = await response.json()

            if (data.success) {
                setPolicies(data.data)
            }
        } catch (error) {
            console.error('获取价格政策失败:', error)
        }
    }

    // 获取项目中已有的任务（从订单的快照获取）
    const fetchExistingTasks = async () => {
        if (!projectId) return

        try {
            setExistingTasksLoading(true)

            // 1. 获取项目详情，找到关联的订单
            const projectResponse = await fetch(`http://localhost:3000/api/projects/${projectId}`)
            const projectData = await projectResponse.json()

            if (!projectData.success) {
                console.error('获取项目详情失败:', projectData)
                setExistingTasks([])
                return
            }

            if (!projectData.data.relatedOrders || projectData.data.relatedOrders.length === 0) {
                console.log('项目没有关联的订单')
                setExistingTasks([])
                return
            }

            const orderIds = projectData.data.relatedOrders
            console.log('项目关联的订单ID:', orderIds)

            // 2. 获取每个订单的详情和快照
            const existingTasks: ExistingTask[] = []

            for (const orderId of orderIds) {
                try {
                    // 获取订单详情（包含快照历史）
                    const orderResponse = await fetch(`http://localhost:3000/api/orders/${orderId}`)
                    const orderData = await orderResponse.json()

                    if (orderData.success && orderData.data) {
                        const order = orderData.data
                        console.log(`订单 ${orderId} 详情:`, order)

                        // 从订单版本中获取最新版本
                        const orderVersionsResponse = await fetch(`http://localhost:3000/api/order-versions/${orderId}`)
                        const orderVersionsData = await orderVersionsResponse.json()

                        if (orderVersionsData.success && orderVersionsData.data.length > 0) {
                            // 获取最新版本的订单版本（按版本号排序）
                            const latestVersion = orderVersionsData.data.sort((a: any, b: any) => b.versionNumber - a.versionNumber)[0]
                            console.log(`订单 ${orderId} 的最新版本:`, latestVersion)

                            // 从最新版本中提取任务信息
                            if (latestVersion.items && latestVersion.items.length > 0) {
                                const tasksFromOrder = latestVersion.items.map((item: any, index: number) => {
                                    // 构建完整的描述，包含价格政策计算详情
                                    let fullDescription = item.priceDescription || ''

                                    // 如果有价格政策，添加计算详情
                                    if (item.pricingPolicies && item.pricingPolicies.length > 0) {
                                        // 从订单版本中获取计算详情
                                        const calculationDetails = item.pricingPolicies.map((policy: any) => {
                                            if (policy.calculationDetails) {
                                                return policy.calculationDetails
                                            } else {
                                                // 如果没有预保存的计算详情，尝试重新计算
                                                const quantity = item.quantity || 1
                                                const originalPrice = (item.unitPrice || 0) * quantity

                                                try {
                                                    const mockPolicy = {
                                                        _id: policy.policyId || policy._id,
                                                        name: policy.name || policy.policyName,
                                                        type: (policy.type === 'tiered_discount' ? 'tiered_discount' : 'uniform_discount') as 'tiered_discount' | 'uniform_discount',
                                                        discountRatio: policy.discountRatio,
                                                        status: 'active' as const,
                                                        alias: '',
                                                        summary: '',
                                                        validUntil: new Date().toISOString(),
                                                        createTime: new Date().toISOString(),
                                                        updateTime: new Date().toISOString()
                                                    }

                                                    const calculationResult = calculatePriceWithPolicies(
                                                        originalPrice,
                                                        quantity,
                                                        [mockPolicy],
                                                        [policy.policyId || policy._id],
                                                        item.unit || '件'
                                                    )

                                                    if (calculationResult.appliedPolicy) {
                                                        return formatCalculationDetails(calculationResult)
                                                    }
                                                } catch (error) {
                                                    console.warn('重新计算失败:', error)
                                                }

                                                // 备用方案
                                                return `${policy.name || policy.policyName}: 按${policy.discountRatio}%计费`
                                            }
                                        }).join('<br/><br/>')

                                        if (calculationDetails) {
                                            fullDescription += `<br/><br/>${calculationDetails}`
                                        }
                                    }

                                    return {
                                        _id: `order-task-${orderId}-${index}`, // 生成唯一ID
                                        taskName: item.serviceName,
                                        serviceId: item.serviceId,
                                        serviceName: item.serviceName,
                                        categoryName: item.categoryName || '未分类',
                                        unitPrice: item.unitPrice || 0,
                                        unit: item.unit || '件',
                                        quantity: item.quantity || 1,
                                        subtotal: item.subtotal || 0,
                                        pricingPolicies: item.pricingPolicies ? item.pricingPolicies.map((policy: any) => policy.policyId || policy._id) : [],
                                        priceDescription: fullDescription, // 使用完整的描述
                                        status: 'active' as const,
                                        isExisting: true as const
                                    }
                                })

                                existingTasks.push(...tasksFromOrder)
                            }
                        } else {
                            console.log(`订单 ${orderId} 没有版本数据`)
                        }
                    }
                } catch (orderError) {
                    console.error(`获取订单 ${orderId} 详情失败:`, orderError)
                    // 继续处理其他订单，不中断整个流程
                }
            }

            console.log('从订单最新版本获取的已有任务:', existingTasks)
            setExistingTasks(existingTasks)

        } catch (error) {
            console.error('获取已有任务失败:', error)
            message.error('获取已有任务失败')
        } finally {
            setExistingTasksLoading(false)
        }
    }

    // 获取项目中已分配的联系人
    const fetchAssignedContacts = async () => {
        if (!projectId) return

        try {
            console.log('正在获取项目中已分配的联系人，项目ID:', projectId)

            // 获取项目详情
            const projectResponse = await fetch(`http://localhost:3000/api/projects/${projectId}`)
            const projectData = await projectResponse.json()

            if (projectData.success) {
                const project = projectData.data
                console.log('项目详情:', project)

                // 从项目详情中获取已分配的联系人
                const projectContacts = project.contact || ''
                console.log('项目已分配的联系人:', projectContacts)

                if (projectContacts) {
                    // 解析联系人字符串（格式可能是 "李婕婷, 丁媛媛"）
                    const contactNames = projectContacts.split(',').map((name: string) => name.trim())
                    console.log('解析出的联系人姓名:', contactNames)

                    const assignedContactIds = new Set<string>()

                    // 在联系人列表中查找匹配的联系人
                    console.log('当前联系人列表:', contacts.map(c => ({ id: c._id, name: c.name })))
                    contactNames.forEach((contactName: string) => {
                        const contact = contacts.find((c: any) => c.name === contactName)
                        if (contact) {
                            assignedContactIds.add(contact._id)
                            console.log(`标记联系人 ${contact.name} 为已分配`)
                        } else {
                            console.log(`未找到联系人: ${contactName}`)
                            console.log('可用联系人:', contacts.map(c => c.name))
                        }
                    })

                    const assignedIds = Array.from(assignedContactIds)
                    setAssignedContactIds(assignedIds)

                    // 将项目已有的联系人设置为勾选状态
                    setSelectedContactIds(assignedIds)
                    console.log('已将项目已有的联系人设置为勾选状态:', assignedIds)
                } else {
                    console.log('项目没有已分配的联系人')
                    setAssignedContactIds([])
                    setSelectedContactIds([])
                }
            }
        } catch (error) {
            console.error('获取已分配联系人失败:', error)
        }
    }

    // 监听客户变化
    useEffect(() => {
        if (visible && projectClient) {
            fetchClient()
        }
    }, [visible, projectClient])

    // 监听客户信息变化
    useEffect(() => {
        if (client) {
            console.log('客户信息变化，开始获取相关数据')
            fetchContacts()
            fetchQuotations()
            fetchPolicies()
            fetchExistingTasks()
        }
    }, [client])

    // 监听联系人列表变化，当联系人加载完成后执行匹配
    useEffect(() => {
        if (client && contacts.length > 0) {
            console.log('联系人列表已加载，开始匹配项目联系人')
            fetchAssignedContacts()
        }
    }, [client, contacts])

    // 监听报价单变化
    useEffect(() => {
        if (selectedQuotation && selectedQuotation.selectedServices) {
            fetchServiceDetails(selectedQuotation.selectedServices)
        }
    }, [selectedQuotation])

    // 处理联系人选择
    const handleContactSelect = (contactIds: string[]) => {
        setSelectedContactIds(contactIds)
    }

    // 处理服务选择
    const handleServiceSelect = (serviceId: string, checked: boolean) => {
        if (checked) {
            setSelectedServices([...selectedServices, serviceId])
        } else {
            setSelectedServices(selectedServices.filter(id => id !== serviceId))
        }
    }

    // 处理数量变化
    const handleQuantityChange = (serviceId: string, quantity: number) => {
        setServiceDetails(prev => prev.map(service =>
            service._id === serviceId ? { ...service, quantity } : service
        ))
    }

    // 处理价格政策变化
    const handlePolicyChange = (serviceId: string, policyIds: string[]) => {
        console.log('🔧 价格政策变化:', { serviceId, policyIds })
        setServiceDetails(prev => {
            const updated = prev.map(service =>
                service._id === serviceId ? { ...service, selectedPolicies: policyIds } : service
            )
            console.log('🔧 更新后的serviceDetails:', updated)
            return updated
        })
    }

    // 删除已有任务
    const handleDeleteExistingTask = (taskId: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个已有任务吗？删除后该任务将从项目中移除。',
            okText: '确定删除',
            cancelText: '取消',
            okType: 'danger',
            onOk: () => {
                setExistingTasks(prev => prev.filter(task => task._id !== taskId))
                message.success('任务已删除')
            }
        })
    }

    // 处理下一步
    const handleNext = () => {
        if (currentStep === 1) {
            // 步骤1：联系人选择是可选的，可以直接跳过
            setCurrentStep(2)
        } else if (currentStep === 2) {
            if (selectedServices.length === 0) {
                message.warning('请至少选择一个服务项目')
                return
            }
            setCurrentStep(3)
        }
    }

    // 处理上一步
    const handlePrevious = () => {
        setCurrentStep(currentStep - 1)
    }

    // 处理确认提交
    const handleOk = async () => {
        try {
            setConfirmLoading(true)

            // 构建任务数据
            const taskDataList: CreateTaskData[] = selectedServices.map(serviceId => {
                const service = serviceDetails.find(s => s._id === serviceId)
                if (!service) return null

                // 计算小计（考虑价格政策）
                const quantity = service.quantity || 1
                const originalPrice = (service.unitPrice || 0) * quantity
                let subtotal = originalPrice

                // 如果有选中的价格政策，计算折扣价格
                if (service.selectedPolicies && service.selectedPolicies.length > 0) {
                    const calculationResult = calculatePriceWithPolicies(
                        originalPrice,
                        quantity,
                        policies,
                        service.selectedPolicies,
                        service.unit || '件'
                    )
                    subtotal = calculationResult.discountedPrice
                }

                return {
                    taskName: service.serviceName,
                    serviceId: service._id,
                    quantity: service.quantity,
                    unit: service.unit,
                    priority: 'medium', // 使用默认优先级
                    dueDate: undefined,
                    remarks: undefined,
                    subtotal: subtotal,
                    pricingPolicies: service.selectedPolicies,
                    contactIds: selectedContactIds
                }
            }).filter(Boolean) as CreateTaskData[]

            if (taskDataList.length === 0) {
                message.warning('请至少选择一个服务项目')
                return
            }

            // 1. 创建新的订单版本（如果项目有关联订单）
            if (projectId) {
                try {
                    // 获取项目信息
                    const projectResponse = await fetch(`http://localhost:3000/api/projects/${projectId}`)
                    const projectData = await projectResponse.json()

                    if (projectData.success && projectData.data.relatedOrders?.[0]) {
                        console.log('开始创建订单版本，订单ID:', projectData.data.relatedOrders[0])

                        // 导入订单版本API
                        const { createOrderVersion } = await import('../../../api/orderVersions')

                        // 获取订单的最新版本信息
                        const orderResponse = await fetch(`http://localhost:3000/api/orders/${projectData.data.relatedOrders[0]}`)
                        const orderData = await orderResponse.json()

                        if (!orderData.success) {
                            console.error('获取订单信息失败:', orderData.message)
                            return
                        }

                        const order = orderData.data
                        console.log('订单信息:', order)

                        // 合并已有服务和新选择的服务
                        const allSelectedServices = [...new Set([...selectedServices])]

                        // 从订单的最新版本中获取已有服务
                        try {
                            const orderVersionsResponse = await fetch(`http://localhost:3000/api/order-versions/${projectData.data.relatedOrders[0]}`)
                            const orderVersionsData = await orderVersionsResponse.json()

                            if (orderVersionsData.success && orderVersionsData.data.length > 0) {
                                // 获取最新版本
                                const latestVersion = orderVersionsData.data.sort((a: any, b: any) => b.versionNumber - a.versionNumber)[0]
                                console.log('最新订单版本:', latestVersion)

                                // 将未被删除的已有服务的ID添加到选择列表中
                                const existingServiceIds = latestVersion.items
                                    .filter((item: any) => existingTasks.some(task => task.serviceId === item.serviceId))
                                    .map((item: any) => item.serviceId)
                                allSelectedServices.push(...existingServiceIds)

                                // 去重
                                const uniqueServiceIds = [...new Set(allSelectedServices)]
                                console.log('合并后的服务ID列表:', uniqueServiceIds)
                            } else {
                                console.log('订单版本表为空，只使用新选择的服务')
                            }
                        } catch (versionError) {
                            console.error('获取订单版本信息失败:', versionError)
                            console.log('使用新选择的服务创建版本')
                        }

                        // 构建完整的服务详情列表
                        const allServiceDetails = []

                        console.log('🔍 构建服务详情列表...')
                        console.log('🔍 selectedServices:', selectedServices)
                        console.log('🔍 existingTasks:', existingTasks)

                        // 添加新选择的服务
                        for (const serviceId of selectedServices) {
                            const service = serviceDetails.find(s => s._id === serviceId)
                            if (service) {
                                allServiceDetails.push({
                                    _id: service._id,
                                    serviceName: service.serviceName,
                                    categoryName: service.categoryName,
                                    unitPrice: service.unitPrice,
                                    unit: service.unit,
                                    quantity: service.quantity,
                                    priceDescription: service.priceDescription
                                })
                                console.log('🔍 添加新服务:', service.serviceName)
                            }
                        }

                        // 添加未被删除的已有服务（从existingTasks中获取）
                        existingTasks.forEach(existingTask => {
                            allServiceDetails.push({
                                _id: existingTask.serviceId,
                                serviceName: existingTask.serviceName,
                                categoryName: existingTask.categoryName,
                                unitPrice: existingTask.unitPrice,
                                unit: existingTask.unit,
                                quantity: existingTask.quantity,
                                priceDescription: existingTask.priceDescription
                            })
                            console.log('🔍 添加已有服务:', existingTask.serviceName)
                        })

                        console.log('🔍 最终 allServiceDetails:', allServiceDetails)

                        // 构建价格政策数据 - 使用与订单更新相同的逻辑
                        const servicePolicies: any[] = []

                        console.log('🔍 开始构建价格政策数据...')
                        console.log('🔍 allServiceDetails:', allServiceDetails)

                        // 使用与订单更新相同的逻辑：为每个服务添加其选择的政策
                        allServiceDetails.forEach(service => {
                            console.log(`🔍 服务 ${service.serviceName} (${service._id}):`)

                            // 检查是新任务还是已有任务
                            const serviceFromDetails = serviceDetails.find(s => s._id === service._id)
                            const existingTask = existingTasks.find(t => t.serviceId === service._id)

                            if (serviceFromDetails && serviceFromDetails.selectedPolicies && serviceFromDetails.selectedPolicies.length > 0) {
                                // 新任务，使用selectedPolicies
                                console.log('   - 新任务，selectedPolicies:', serviceFromDetails.selectedPolicies)
                                serviceFromDetails.selectedPolicies.forEach(policyId => {
                                    const policy = policies.find(p => p._id === policyId)
                                    console.log(`   - 找到政策 ${policyId}:`, policy)
                                    if (policy) {
                                        const policyData = {
                                            policyId: policy._id,
                                            _id: policy._id,
                                            name: policy.name,
                                            type: policy.type,
                                            discountRatio: policy.discountRatio,
                                            tierSettings: policy.tierSettings,
                                            serviceId: service._id
                                        }
                                        servicePolicies.push(policyData)
                                        console.log('   - 添加政策数据:', policyData)
                                    }
                                })
                            } else if (existingTask && existingTask.pricingPolicies && existingTask.pricingPolicies.length > 0) {
                                // 已有任务，使用pricingPolicies
                                console.log('   - 已有任务，pricingPolicies:', existingTask.pricingPolicies)
                                existingTask.pricingPolicies.forEach(policyId => {
                                    const policy = policies.find(p => p._id === policyId)
                                    console.log(`   - 找到政策 ${policyId}:`, policy)
                                    if (policy) {
                                        const policyData = {
                                            policyId: policy._id,
                                            _id: policy._id,
                                            name: policy.name,
                                            type: policy.type,
                                            discountRatio: policy.discountRatio,
                                            tierSettings: policy.tierSettings,
                                            serviceId: service._id
                                        }
                                        servicePolicies.push(policyData)
                                        console.log('   - 添加政策数据:', policyData)
                                    }
                                })
                            } else {
                                console.log('   - 无价格政策')
                            }
                        })

                        console.log('🔍 最终构建的价格政策列表:', servicePolicies)

                        // 对价格政策进行全局去重，避免重复显示
                        const uniqueServicePolicies = servicePolicies.filter((policy, index, self) =>
                            index === self.findIndex(p => p.policyId === policy.policyId && p.serviceId === policy.serviceId)
                        )

                        console.log('🔍 去重后的价格政策列表:', uniqueServicePolicies)

                        // 构建订单版本数据
                        const orderVersionData = {
                            orderId: projectData.data.relatedOrders[0],
                            clientId: client?._id || '',
                            clientName: client?.name || projectClient || '',
                            contactIds: selectedContactIds,
                            contactNames: contacts.filter(c => selectedContactIds.includes(c._id)).map(c => c.name),
                            contactPhones: contacts.filter(c => selectedContactIds.includes(c._id)).map(c => c.phone || ''),
                            projectName: projectData.data.projectName || '',
                            quotationId: selectedQuotation?._id,
                            selectedServices: allSelectedServices,
                            serviceDetails: allServiceDetails,
                            policies: uniqueServicePolicies
                        }

                        console.log('订单版本数据:', orderVersionData)

                        const orderVersionResult = await createOrderVersion(orderVersionData)
                        console.log('订单版本创建成功:', orderVersionResult)

                        if (orderVersionResult.success) {
                            console.log('✅ 订单版本创建成功，版本号:', orderVersionResult.data.versionNumber)
                        } else {
                            console.error('❌ 订单版本创建失败:', orderVersionResult.message)
                        }
                    } else {
                        console.log('项目没有关联的订单，跳过订单版本创建')
                    }
                } catch (orderVersionError) {
                    console.error('创建订单版本失败:', orderVersionError)
                    // 订单版本创建失败不影响任务创建，只记录错误
                }
            }

            // 2. 更新项目联系人信息
            if (projectId && selectedContactIds.length > 0) {
                try {
                    console.log('🔄 开始更新项目联系人...')
                    console.log('🔄 选中的联系人ID:', selectedContactIds)
                    console.log('🔄 所有联系人:', contacts.map(c => ({ id: c._id, name: c.name })))

                    const contactNames = contacts
                        .filter(c => selectedContactIds.includes(c._id))
                        .map(c => c.name)
                        .join(', ')

                    console.log('🔄 要更新的联系人姓名:', contactNames)

                    const updateProjectResponse = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contact: contactNames
                        })
                    })

                    console.log('🔄 项目更新响应状态:', updateProjectResponse.status)
                    const updateResult = await updateProjectResponse.json()
                    console.log('🔄 项目更新响应:', updateResult)

                    if (updateResult.success) {
                        console.log('✅ 项目联系人更新成功:', contactNames)
                    } else {
                        console.error('❌ 项目联系人更新失败:', updateResult.message)
                    }
                } catch (error) {
                    console.error('更新项目联系人失败:', error)
                }
            } else {
                console.log('⚠️ 跳过项目联系人更新:', { projectId, selectedContactIds: selectedContactIds.length })
            }

            // 3. 将任务添加到项目中
            await onOk(taskDataList)

            // 注意：成功提示现在由父组件的 handleAddTask 函数处理
            // 这里不再显示成功提示，避免重复显示

            // 3. 重置状态
            setSelectedServices([])
            setSelectedContactIds([])
            setCurrentStep(1)
            setServiceDetails(prev => prev.map(service => ({
                ...service,
                quantity: 1,
                selectedPolicies: []
            })))
        } catch (error) {
            console.error('任务添加失败:', error)
            // 不在这里显示错误提示，让父组件处理
            throw error // 重新抛出异常，让父组件处理
        } finally {
            setConfirmLoading(false)
        }
    }

    // 处理取消
    const handleCancel = () => {
        setSelectedServices([])
        setSelectedContactIds([])
        setCurrentStep(1)
        setServiceDetails(prev => prev.map(service => ({
            ...service,
            quantity: 1,
            selectedPolicies: []
        })))
        setExistingTasks([])
        onCancel()
    }

    // 模态窗关闭时的处理
    const handleAfterClose = () => {
        setSelectedServices([])
        setSelectedContactIds([])
        setCurrentStep(1)
        setServiceDetails(prev => prev.map(service => ({
            ...service,
            quantity: 1,
            selectedPolicies: []
        })))
        setExistingTasks([])
    }

    // 渲染步骤1：联系人选择
    const renderStepOne = () => (
        <div>
            <Card
                size="small"
                style={{
                    marginBottom: 16,
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef'
                }}
                bodyStyle={{ padding: '12px 16px' }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
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
                        flexShrink: 0
                    }}>
                        1
                    </div>
                    <div>
                        <h4 style={{ margin: 0, marginBottom: 4, color: '#262626', fontSize: '14px' }}>
                            调整项目联系人
                        </h4>
                        <p style={{
                            color: '#666',
                            fontSize: '12px',
                            margin: 0,
                            lineHeight: '1.5'
                        }}>
                            项目已有的联系人已自动勾选，您可以在这里调整联系人选择，添加或移除联系人
                        </p>
                    </div>
                </div>
            </Card>

            {contactLoading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <Spin /> 加载联系人...
                </div>
            ) : contacts.length > 0 ? (
                <div>
                    <div style={{ marginBottom: 8 }}>
                        <span>已选择 {selectedContactIds.length} 个联系人</span>
                    </div>
                    <div style={{
                        display: 'grid',
                        gap: 12,
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
                    }}>
                        {contacts.map(contact => {
                            const isAlreadyAssigned = assignedContactIds.includes(contact._id)
                            const isSelected = selectedContactIds.includes(contact._id)
                            return (
                                <Card
                                    key={contact._id}
                                    size="small"
                                    style={{
                                        border: isSelected ? '2px solid #1890ff' : '1px solid #e8e8e8',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        opacity: 1,
                                        backgroundColor: isSelected ? '#e6f7ff' : 'white'
                                    }}
                                    onClick={() => {
                                        const newSelected = isSelected
                                            ? selectedContactIds.filter(id => id !== contact._id)
                                            : [...selectedContactIds, contact._id]
                                        handleContactSelect(newSelected)
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span>{contact.name}</span>
                                            {isAlreadyAssigned && (
                                                <Tag color="orange" style={{ fontSize: '10px' }}>项目已有</Tag>
                                            )}
                                        </div>
                                        {contact.position && (
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
                                                {contact.position}
                                            </div>
                                        )}
                                        {contact.phone && (
                                            <div style={{ fontSize: '12px', color: '#666', marginBottom: 2 }}>
                                                📞 {contact.phone}
                                            </div>
                                        )}
                                        {contact.email && (
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                📧 {contact.email}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <div style={{ marginBottom: 16 }}>
                        <h4>该客户暂无联系人</h4>
                        <p style={{ color: '#666' }}>请先为客户添加联系人信息，或点击下方按钮跳过联系人选择。</p>
                    </div>
                    <Button
                        type="primary"
                        onClick={() => {
                            setSelectedContactIds([])
                            setCurrentStep(2)
                        }}
                    >
                        跳过联系人选择，继续下一步
                    </Button>
                </div>
            )}
        </div>
    )

    // 渲染步骤2：服务项目选择
    const renderStepTwo = () => (
        <div>
            <Card
                size="small"
                style={{
                    marginBottom: 16,
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef'
                }}
                bodyStyle={{ padding: '12px 16px' }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
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
                        flexShrink: 0
                    }}>
                        2
                    </div>
                    <div>
                        <h4 style={{ margin: 0, marginBottom: 4, color: '#262626', fontSize: '14px' }}>
                            选择服务项目
                        </h4>
                        <p style={{
                            color: '#666',
                            fontSize: '12px',
                            margin: 0,
                            lineHeight: '1.5'
                        }}>
                            请选择要追加的服务项目
                        </p>
                    </div>
                </div>
            </Card>

            {quotationLoading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <Spin /> 加载报价单...
                </div>
            ) : serviceLoading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <Spin /> 加载服务项目...
                </div>
            ) : selectedQuotation ? (
                <div>
                    <div style={{ marginBottom: 8 }}>
                        <span>已选择 {selectedServices.length} 项服务</span>
                    </div>
                    <Table
                        columns={[
                            {
                                title: '选择',
                                key: 'select',
                                width: 60,
                                render: (_: any, record: ServiceDetail) => (
                                    <Checkbox
                                        checked={selectedServices.includes(record._id)}
                                        onChange={(e) => handleServiceSelect(record._id, e.target.checked)}
                                        disabled={record.status === 'inactive'}
                                    />
                                )
                            },
                            {
                                title: '服务名称',
                                dataIndex: 'serviceName',
                                key: 'serviceName',
                                width: 150,
                                render: (name: string, record: ServiceDetail) => (
                                    <div>
                                        {name}
                                        {record.status === 'inactive' && (
                                            <Tag color="red" style={{ marginLeft: 4 }}>已禁用</Tag>
                                        )}
                                    </div>
                                )
                            },
                            {
                                title: '分类',
                                dataIndex: 'categoryName',
                                key: 'categoryName',
                                width: 100
                            },
                            {
                                title: '单价',
                                dataIndex: 'unitPrice',
                                key: 'unitPrice',
                                width: 100,
                                render: (price: number, record: ServiceDetail) => (
                                    <span>¥{price?.toLocaleString()}/{record.unit}</span>
                                )
                            }
                        ]}
                        dataSource={serviceDetails}
                        rowKey="_id"
                        pagination={false}
                        size="small"
                    />
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <div style={{ marginBottom: 16 }}>
                        <h4>该客户暂无关联的报价单</h4>
                        <p style={{ color: '#666' }}>请先为客户创建报价单，或联系管理员设置客户关联的报价单。</p>
                    </div>
                </div>
            )}
        </div>
    )

    // 渲染步骤3：数量和价格政策设置
    const renderStepThree = () => (
        <div>
            <Card
                size="small"
                style={{
                    marginBottom: 16,
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef'
                }}
                bodyStyle={{ padding: '12px 16px' }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
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
                        flexShrink: 0
                    }}>
                        3
                    </div>
                    <div>
                        <h4 style={{ margin: 0, marginBottom: 4, color: '#262626', fontSize: '14px' }}>
                            设置数量和价格政策
                        </h4>
                        <p style={{
                            color: '#666',
                            fontSize: '12px',
                            margin: 0,
                            lineHeight: '1.5'
                        }}>
                            为选中的服务项目设置数量和适用的价格政策
                        </p>
                    </div>
                </div>
            </Card>



            {existingTasksLoading ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                    <Spin /> 正在从订单快照中加载已有任务...
                </div>
            ) : (
                <Table
                    columns={[
                        {
                            title: '类型',
                            key: 'type',
                            width: 80,
                            render: (_: any, record: ServiceDetail | ExistingTask) => {
                                if ('isExisting' in record) {
                                    return <Tag color="blue">已有</Tag>
                                } else {
                                    return <Tag color="green">新增</Tag>
                                }
                            }
                        },
                        {
                            title: '服务名称',
                            dataIndex: 'serviceName',
                            key: 'serviceName',
                            width: 180,
                            render: (name: string, record: ServiceDetail | ExistingTask) => (
                                <div>
                                    {name}
                                    {record.status === 'inactive' && (
                                        <Tag color="red" style={{ marginLeft: 4 }}>已禁用</Tag>
                                    )}
                                </div>
                            )
                        },
                        {
                            title: '分类',
                            dataIndex: 'categoryName',
                            key: 'categoryName',
                            width: 100
                        },
                        {
                            title: '单价',
                            dataIndex: 'unitPrice',
                            key: 'unitPrice',
                            width: 100,
                            render: (price: number, record: ServiceDetail | ExistingTask) => (
                                <span>¥{price?.toLocaleString()}/{record.unit}</span>
                            )
                        },
                        {
                            title: '数量',
                            key: 'quantity',
                            width: 80,
                            render: (_: any, record: ServiceDetail | ExistingTask) => {
                                if ('isExisting' in record) {
                                    // 已有任务，显示固定数量
                                    return <span>{record.quantity}</span>
                                } else {
                                    // 新任务，显示可编辑的数量输入框
                                    return (
                                        <InputNumber
                                            min={1}
                                            max={9999}
                                            value={record.quantity}
                                            style={{ width: '60px' }}
                                            onChange={(value) => {
                                                if (value) {
                                                    handleQuantityChange(record._id, value)
                                                }
                                            }}
                                        />
                                    )
                                }
                            }
                        },
                        {
                            title: '价格政策',
                            key: 'pricingPolicies',
                            width: 200,
                            render: (_: any, record: ServiceDetail | ExistingTask) => {
                                if ('isExisting' in record) {
                                    // 已有任务，显示固定的价格政策
                                    if (record.pricingPolicies && record.pricingPolicies.length > 0) {
                                        return (
                                            <div>
                                                {record.pricingPolicies.map((policyId, index) => {
                                                    // 从订单版本获取的价格政策可能是policyId或policyName
                                                    let policyName = policyId

                                                    // 如果是policyId，尝试从policies中找到对应的名称
                                                    if (typeof policyId === 'string' && policyId.length > 0) {
                                                        const policy = policies.find(p => p._id === policyId)
                                                        if (policy) {
                                                            policyName = policy.name
                                                        }
                                                    }

                                                    return (
                                                        <div key={index} style={{ marginBottom: 4 }}>
                                                            <span style={{ fontSize: '12px' }}>
                                                                {policyName}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    } else {
                                        return <span style={{ color: '#999' }}>无政策</span>
                                    }
                                } else {
                                    // 新任务，显示可选择的价格政策
                                    const servicePolicyIds = record.pricingPolicyIds || []

                                    // 如果服务项目没有关联的价格政策，显示"无政策"
                                    if (servicePolicyIds.length === 0) {
                                        return <span style={{ color: '#999' }}>无政策</span>
                                    }

                                    // 获取该服务关联的价格政策
                                    const availablePolicies = policies.filter(policy => servicePolicyIds.includes(policy._id))

                                    if (availablePolicies.length === 0) {
                                        return <span style={{ color: '#999' }}>无可用政策</span>
                                    }

                                    return (
                                        <div>
                                            {availablePolicies.map(policy => (
                                                <div key={policy._id} style={{ marginBottom: 4 }}>
                                                    <Checkbox
                                                        checked={(record.selectedPolicies || []).includes(policy._id)}
                                                        onChange={(e) => {
                                                            const currentPolicies = record.selectedPolicies || []
                                                            const newPolicies = e.target.checked
                                                                ? [...currentPolicies, policy._id]
                                                                : currentPolicies.filter(id => id !== policy._id)
                                                            handlePolicyChange(record._id, newPolicies)
                                                        }}
                                                    >
                                                        {policy.name}
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            }
                        },
                        {
                            title: '小计',
                            key: 'subtotal',
                            width: 150,
                            render: (_: any, record: ServiceDetail | ExistingTask) => {
                                if ('isExisting' in record) {
                                    // 已有任务，显示固定的小计
                                    return (
                                        <span style={{ fontWeight: 'bold' }}>
                                            ¥{record.subtotal.toLocaleString()}
                                        </span>
                                    )
                                } else {
                                    // 新任务，计算小计
                                    const quantity = record.quantity || 1
                                    const originalPrice = (record.unitPrice || 0) * quantity

                                    // 如果有选中的价格政策，计算折扣价格
                                    if (record.selectedPolicies && record.selectedPolicies.length > 0) {
                                        const calculationResult = calculatePriceWithPolicies(
                                            originalPrice,
                                            quantity,
                                            policies,
                                            record.selectedPolicies,
                                            record.unit || '件'
                                        )

                                        return (
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    ¥{calculationResult.discountedPrice.toLocaleString()}
                                                </div>
                                                {calculationResult.discountRatio < 100 && (
                                                    <div style={{ fontSize: '10px', color: '#666' }}>
                                                        优惠: ¥{calculationResult.discountAmount.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }

                                    return (
                                        <span style={{ fontWeight: 'bold' }}>
                                            ¥{originalPrice.toLocaleString()}
                                        </span>
                                    )
                                }
                            }
                        },
                        {
                            title: '描述',
                            key: 'description',
                            width: 200,
                            render: (_: any, record: ServiceDetail | ExistingTask) => {
                                if ('isExisting' in record) {
                                    // 已有任务，显示固定的描述
                                    const description = record.priceDescription || '无描述'
                                    return (
                                        <Tooltip title={description.replace(/<br\/?>/g, '\n')}>
                                            <div style={{
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-all',
                                                fontSize: '12px'
                                            }}
                                                dangerouslySetInnerHTML={{ __html: description || '无描述' }}
                                            />
                                        </Tooltip>
                                    )
                                } else {
                                    // 新任务，显示动态描述
                                    const quantity = record.quantity || 1
                                    const originalPrice = (record.unitPrice || 0) * quantity
                                    let description = record.priceDescription || ''

                                    // 如果有选中的价格政策，使用PricePolicyCalculator组件的计算详情
                                    if (record.selectedPolicies && record.selectedPolicies.length > 0) {
                                        const calculationResult = calculatePriceWithPolicies(
                                            originalPrice,
                                            quantity,
                                            policies,
                                            record.selectedPolicies,
                                            record.unit || '件'
                                        )

                                        if (calculationResult.appliedPolicy) {
                                            // 使用formatCalculationDetails格式化详情
                                            const formattedDetails = formatCalculationDetails(calculationResult)
                                            description += `<br/><br/>${formattedDetails}`
                                        }
                                    }

                                    return (
                                        <Tooltip title={description.replace(/<br\/?>/g, '\n')}>
                                            <div style={{
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-all',
                                                fontSize: '12px'
                                            }}
                                                dangerouslySetInnerHTML={{ __html: description || '无描述' }}
                                            />
                                        </Tooltip>
                                    )
                                }
                            }
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 80,
                            render: (_: any, record: ServiceDetail | ExistingTask) => {
                                if ('isExisting' in record) {
                                    // 已有任务，显示删除按钮
                                    return (
                                        <Button
                                            type="text"
                                            size="small"
                                            danger
                                            onClick={() => handleDeleteExistingTask(record._id)}
                                            style={{ padding: '4px 8px' }}
                                        >
                                            删除
                                        </Button>
                                    )
                                } else {
                                    // 新任务，不显示操作按钮
                                    return null
                                }
                            }
                        }
                    ]}
                    dataSource={[
                        // 已有任务（冻结）
                        ...existingTasks,
                        // 新追加的任务
                        ...serviceDetails.filter(service => selectedServices.includes(service._id))
                    ]}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                />
            )}

            {/* 总计信息 */}
            <div style={{
                padding: '16px 20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                marginTop: '16px',
                border: '1px solid #e9ecef'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#000',
                    gap: 32
                }}>
                    <span>共 {existingTasks.length + selectedServices.length} 项服务</span>
                    <span>总计：¥{calculateTotalAmount().toLocaleString()}</span>
                    <span>
                        大写：<RMBAmountConverter
                            amount={calculateTotalAmount()}
                            showSymbol={false}
                            showPrefix={true}
                            style={{
                                fontSize: '14px',
                                color: '#000',
                                fontWeight: 'bold'
                            }}
                        />
                    </span>
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            title={`追加任务 - 步骤 ${currentStep}/3`}
            open={visible}
            onOk={currentStep === 3 ? handleOk : handleNext}
            onCancel={handleCancel}
            afterClose={handleAfterClose}
            width={1200}
            okText={currentStep === 3 ? '确定' : '下一步'}
            cancelText="取消"
            confirmLoading={confirmLoading || loading}
            destroyOnHidden
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    取消
                </Button>,
                currentStep > 1 && (
                    <Button key="previous" onClick={handlePrevious}>
                        上一步
                    </Button>
                ),
                <Button
                    key="next"
                    type="primary"
                    loading={confirmLoading || loading}
                    onClick={currentStep === 3 ? handleOk : handleNext}
                >
                    {currentStep === 3 ? '确定' : '下一步'}
                </Button>
            ].filter(Boolean)}
        >
            {currentStep === 1 && renderStepOne()}
            {currentStep === 2 && renderStepTwo()}
            {currentStep === 3 && renderStepThree()}
        </Modal>
    )
}

export default AddTaskModal