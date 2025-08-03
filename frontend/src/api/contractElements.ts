import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export interface ContractElement {
    _id: string
    name: string
    type: 'header' | 'signature' | 'order' | 'quotation' | 'short_text' | 'paragraph_text' | 'preset_text' | 'dropdown' | 'radio' | 'checkbox' | 'money' | 'money_cn' | 'number' | 'date' | 'project' | 'task'
    description?: string
    status: 'active' | 'inactive'
    createdBy: string
    createTime: string
    updateTime: string
}

export interface CreateContractElementData {
    name: string
    type: ContractElement['type']
    description?: string
    status?: 'active' | 'inactive'
}

export interface UpdateContractElementData {
    name?: string
    type?: ContractElement['type']
    description?: string
    status?: 'active' | 'inactive'
}

export interface ContractElementQuery {
    page?: number
    limit?: number
    search?: string
    type?: string
    status?: string
}

export interface ContractElementListResponse {
    success: boolean
    data: ContractElement[]
    pagination: {
        total: number
        page: number
        limit: number
        pages: number
    }
}

export interface ContractElementResponse {
    success: boolean
    data: ContractElement
    message?: string
}

// 获取合同元素列表
export const getContractElements = async (params: ContractElementQuery = {}): Promise<ContractElementListResponse> => {
    const response = await axios.get(`${API_BASE_URL}/contract-elements`, { params })
    return response.data
}

// 根据ID获取合同元素
export const getContractElementById = async (id: string): Promise<ContractElementResponse> => {
    const response = await axios.get(`${API_BASE_URL}/contract-elements/${id}`)
    return response.data
}

// 创建合同元素
export const createContractElement = async (data: CreateContractElementData): Promise<ContractElementResponse> => {
    const response = await axios.post(`${API_BASE_URL}/contract-elements`, data)
    return response.data
}

// 更新合同元素
export const updateContractElement = async (id: string, data: UpdateContractElementData): Promise<ContractElementResponse> => {
    const response = await axios.put(`${API_BASE_URL}/contract-elements/${id}`, data)
    return response.data
}

// 删除合同元素
export const deleteContractElement = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete(`${API_BASE_URL}/contract-elements/${id}`)
    return response.data
}

// 获取所有启用的合同元素
export const getActiveContractElements = async (): Promise<{ success: boolean; data: ContractElement[] }> => {
    const response = await axios.get(`${API_BASE_URL}/contract-elements/active`)
    return response.data
} 