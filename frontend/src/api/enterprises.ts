import axios from 'axios'

// 企业接口
export interface Enterprise {
    id: string
    enterpriseName: string
    enterpriseAlias?: string
    creditCode: string
    businessLicense: string
    legalRepresentative: string
    legalRepresentativeId: string
    companyAddress: string
    shippingAddress: string
    contactPerson: string
    contactPhone: string
    invoiceInfo: string
    status: 'active' | 'inactive'
    createTime: string
}

// 企业列表查询参数
export interface EnterpriseQueryParams {
    page?: number
    limit?: number
    search?: string
    status?: string
}

// 企业列表响应
export interface EnterpriseListResponse {
    success: boolean
    data: Enterprise[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

// API基础URL
const API_BASE_URL = 'http://localhost:3000/api'

/**
 * 获取企业列表
 */
export const getEnterprises = async (params: EnterpriseQueryParams = {}): Promise<EnterpriseListResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/enterprises`, { params })
        return response.data
    } catch (error) {
        console.error('获取企业列表失败:', error)
        throw error
    }
}

/**
 * 获取活跃企业列表
 */
export const getActiveEnterprises = async (): Promise<{ success: boolean; data: Enterprise[] }> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/enterprises`, {
            params: {
                status: 'active',
                limit: 100
            }
        })
        return response.data
    } catch (error) {
        console.error('获取活跃企业列表失败:', error)
        throw error
    }
} 