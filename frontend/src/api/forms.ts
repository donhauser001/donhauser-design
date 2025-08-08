import axios from 'axios'

export interface Form {
    _id: string
    name: string
    description?: string
    categoryId: {
        _id: string
        name: string
        color: string
    }
    content: any
    status: 'draft' | 'published' | 'disabled'
    createdBy?: {
        _id: string
        username: string
        realName: string
    }
    submissions: number
    createTime: string
    updateTime: string
}

export interface CreateFormRequest {
    name: string
    description?: string
    categoryId: string
    content?: any
    status?: 'draft' | 'published' | 'disabled'
}

export interface UpdateFormRequest {
    name?: string
    description?: string
    categoryId?: string
    content?: any
    status?: 'draft' | 'published' | 'disabled'
}

export interface FormQuery {
    search?: string
    categoryId?: string
    status?: string
    createdBy?: string
    page?: number
    limit?: number
}

export interface FormListResponse {
    forms: Form[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// 获取表单列表
export const getForms = async (query?: FormQuery): Promise<FormListResponse> => {
    const params = new URLSearchParams()
    if (query?.search) params.append('search', query.search)
    if (query?.categoryId) params.append('categoryId', query.categoryId)
    if (query?.status) params.append('status', query.status)
    if (query?.createdBy) params.append('createdBy', query.createdBy)
    if (query?.page) params.append('page', query.page.toString())
    if (query?.limit) params.append('limit', query.limit.toString())

    const response = await axios.get(`/api/forms?${params.toString()}`)
    return response.data.data
}

// 根据ID获取表单
export const getFormById = async (id: string): Promise<Form> => {
    const response = await axios.get(`/api/forms/${id}`)
    return response.data.data
}

// 创建表单
export const createForm = async (data: CreateFormRequest): Promise<Form> => {
    const response = await axios.post('/api/forms', data)
    return response.data.data
}

// 更新表单
export const updateForm = async (id: string, data: UpdateFormRequest): Promise<Form> => {
    const response = await axios.put(`/api/forms/${id}`, data)
    return response.data.data
}

// 删除表单
export const deleteForm = async (id: string): Promise<void> => {
    await axios.delete(`/api/forms/${id}`)
}

// 切换表单状态
export const toggleFormStatus = async (id: string): Promise<Form> => {
    const response = await axios.patch(`/api/forms/${id}/toggle-status`)
    return response.data.data
} 