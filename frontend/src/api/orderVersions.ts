import axios from 'axios'

// 价格政策快照接口
export interface PricingPolicySnapshot {
    policyId: string
    policyName: string
    policyType: 'uniform_discount' | 'tiered_discount'
    discountRatio: number
    calculationDetails: string
}

// 订单项目快照接口
export interface OrderItemSnapshot {
    serviceId: string
    serviceName: string
    categoryName: string
    unitPrice: number
    unit: string
    quantity: number
    originalPrice: number
    discountedPrice: number
    discountAmount: number
    subtotal: number
    priceDescription: string
    pricingPolicies: PricingPolicySnapshot[]
}

// 订单版本接口
export interface OrderVersion {
    _id: string
    orderId: string
    versionNumber: number
    iterationTime: string
    
    // 客户信息
    clientId: string
    clientName: string
    contactIds: string[]
    contactNames: string[]
    contactPhones: string[]
    
    // 项目信息
    projectName: string
    quotationId?: string
    
    // 服务项目
    items: OrderItemSnapshot[]
    
    // 金额信息
    totalAmount: number
    totalAmountRMB: string
    
    // 计算摘要
    calculationSummary: {
        totalItems: number
        totalQuantity: number
        appliedPolicies: string[]
    }
    
    // 元数据
    createdBy: string
    createdAt: string
    updatedAt: string
}

// 创建订单版本请求接口
export interface CreateOrderVersionRequest {
    orderId: string
    clientId: string
    clientName: string
    contactIds: string[]
    contactNames: string[]
    contactPhones: string[]
    projectName: string
    quotationId?: string
    selectedServices: string[]
    serviceDetails: any[]
    policies: any[]
}

// 订单版本列表响应
export interface OrderVersionListResponse {
    success: boolean
    data: OrderVersion[]
    message: string
}

// 订单版本详情响应
export interface OrderVersionDetailResponse {
    success: boolean
    data: OrderVersion
    message: string
}

// 创建订单版本
export const createOrderVersion = async (versionData: CreateOrderVersionRequest): Promise<OrderVersionDetailResponse> => {
    const response = await axios.post('/api/order-versions', versionData)
    return response.data
}

// 获取订单的所有版本
export const getOrderVersions = async (orderId: string): Promise<OrderVersionListResponse> => {
    const response = await axios.get(`/api/order-versions/${orderId}`)
    return response.data
}

// 获取订单的特定版本
export const getOrderVersion = async (orderId: string, versionNumber: number): Promise<OrderVersionDetailResponse> => {
    const response = await axios.get(`/api/order-versions/${orderId}/${versionNumber}`)
    return response.data
}

// 获取订单的最新版本
export const getLatestOrderVersion = async (orderId: string): Promise<OrderVersionDetailResponse> => {
    const response = await axios.get(`/api/order-versions/${orderId}/latest`)
    return response.data
}

// 删除订单的所有版本
export const deleteOrderVersions = async (orderId: string): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`/api/order-versions/${orderId}`)
    return response.data
} 