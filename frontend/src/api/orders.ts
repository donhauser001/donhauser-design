import axios from 'axios'

// 订单状态类型
export type OrderStatus = 'normal' | 'cancelled' | 'draft'

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

// 订单快照接口
export interface OrderSnapshot {
    version: number
    createdAt: string
    updatedBy: string
    clientInfo: {
        clientId: string
        clientName: string
        contactIds: string[]
        contactNames: string[]
        contactPhones: string[]
    }
    projectInfo: {
        projectName: string
        quotationId?: string
    }
    items: OrderItemSnapshot[]
    totalAmount: number
    totalAmountRMB: string
    calculationSummary: {
        totalItems: number
        totalQuantity: number
        appliedPolicies: string[]
    }
}

// 订单接口
export interface Order {
    _id: string
    orderNo: string
    clientId: string
    clientName: string
    contactIds: string[]
    contactNames: string[]
    contactPhones: string[]
    projectName: string
    quotationId?: string

    // 当前版本信息
    currentVersion: number
    currentAmount: number
    currentAmountRMB: string
    status: OrderStatus

    // 快照历史
    snapshots: OrderSnapshot[]

    // 元数据
    createTime: string
    updateTime: string
    createdBy: string
    updatedBy: string

    // 业务字段
    paymentMethod?: string
    deliveryDate?: string
    address?: string
    remark?: string
}

// 创建订单请求接口
export interface CreateOrderRequest {
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

// 更新订单请求接口
export interface UpdateOrderRequest {
    clientId?: string
    clientName?: string
    contactIds?: string[]
    contactNames?: string[]
    contactPhones?: string[]
    projectName?: string
    quotationId?: string
    selectedServices?: string[]
    serviceDetails?: any[]
    policies?: any[]
    updatedBy?: string
}

// 订单列表查询参数
export interface OrderQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: OrderStatus
    clientId?: string
}

// 订单列表响应
export interface OrderListResponse {
    success: boolean
    data: Order[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

// 订单详情响应
export interface OrderDetailResponse {
    success: boolean
    data: Order
}

// 版本历史响应
export interface VersionHistoryResponse {
    success: boolean
    data: {
        version: number
        createdAt: string
        updatedBy: string
        totalAmount: number
        totalItems: number
    }[]
}

// 快照详情响应
export interface SnapshotResponse {
    success: boolean
    data: OrderSnapshot
}

// API基础URL
const API_BASE_URL = 'http://localhost:3000/api'

/**
 * 获取订单列表
 */
export const getOrders = async (params: OrderQueryParams = {}): Promise<OrderListResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders`, { params })
        return response.data
    } catch (error) {
        console.error('获取订单列表失败:', error)
        throw error
    }
}

/**
 * 创建订单
 */
export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderDetailResponse> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/orders`, orderData)
        return response.data
    } catch (error) {
        console.error('创建订单失败:', error)
        throw error
    }
}

/**
 * 获取订单详情
 */
export const getOrderById = async (orderId: string): Promise<OrderDetailResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`)
        return response.data
    } catch (error) {
        console.error('获取订单详情失败:', error)
        throw error
    }
}

/**
 * 更新订单
 */
export const updateOrder = async (orderId: string, updateData: UpdateOrderRequest): Promise<OrderDetailResponse> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/orders/${orderId}`, updateData)
        return response.data
    } catch (error) {
        console.error('更新订单失败:', error)
        throw error
    }
}

/**
 * 获取订单版本历史
 */
export const getOrderVersionHistory = async (orderId: string): Promise<VersionHistoryResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders/${orderId}/versions`)
        return response.data
    } catch (error) {
        console.error('获取订单版本历史失败:', error)
        throw error
    }
}

/**
 * 获取指定版本快照
 */
export const getOrderSnapshot = async (orderId: string, version: number): Promise<SnapshotResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders/${orderId}/versions/${version}`)
        return response.data
    } catch (error) {
        console.error('获取订单快照失败:', error)
        throw error
    }
}

/**
 * 更新订单状态
 */
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<{ success: boolean; message: string; data?: Order }> => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status })
        return response.data
    } catch (error) {
        console.error('更新订单状态失败:', error)
        throw error
    }
}

/**
 * 删除订单
 */
export const deleteOrder = async (orderId: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/orders/${orderId}`)
        return response.data
    } catch (error) {
        console.error('删除订单失败:', error)
        throw error
    }
} 