import axios from 'axios'

// 报价单接口
export interface Quotation {
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

// 创建报价单数据
export interface CreateQuotationData {
    name: string
    description: string
    isDefault: boolean
    selectedServices: string[]
    validUntil?: string
}

// 更新报价单数据
export interface UpdateQuotationData {
    name: string
    description: string
    isDefault: boolean
    selectedServices: string[]
    validUntil?: string
}

// API基础URL
const API_BASE_URL = 'http://localhost:3000/api'

// 获取所有报价单
export const getAllQuotations = async (): Promise<Quotation[]> => {
    const response = await axios.get(`${API_BASE_URL}/quotations`)
    return response.data.data
}

// 根据ID获取报价单
export const getQuotationById = async (id: string): Promise<Quotation> => {
    const response = await axios.get(`${API_BASE_URL}/quotations/${id}`)
    return response.data.data
}

// 创建报价单
export const createQuotation = async (data: CreateQuotationData): Promise<Quotation> => {
    const response = await axios.post(`${API_BASE_URL}/quotations`, data)
    return response.data.data
}

// 更新报价单
export const updateQuotation = async (id: string, data: UpdateQuotationData): Promise<Quotation> => {
    console.log('API调用 - 更新报价单:', { id, data })
    const response = await axios.put(`${API_BASE_URL}/quotations/${id}`, data)
    console.log('API响应:', response.data)
    return response.data.data
}

// 删除报价单
export const deleteQuotation = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/quotations/${id}`)
}

// 切换报价单状态
export const toggleQuotationStatus = async (id: string): Promise<Quotation> => {
    const response = await axios.patch(`${API_BASE_URL}/quotations/${id}/toggle-status`)
    return response.data.data
}

// 搜索报价单
export const searchQuotations = async (searchText: string): Promise<Quotation[]> => {
    const response = await axios.get(`${API_BASE_URL}/quotations/search`, {
        params: { q: searchText }
    })
    return response.data.data
}

// 根据客户ID获取关联的报价单
export const getQuotationsByClientId = async (clientId: string): Promise<Quotation[]> => {
    const response = await axios.get(`${API_BASE_URL}/quotations/client/${clientId}`)
    return response.data.data
} 