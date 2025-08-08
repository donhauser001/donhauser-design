import axios from 'axios'

export interface FormCategory {
    _id: string
    name: string
    description?: string
    color: string
    formCount: number
    isActive: boolean
    createTime: string
    updateTime: string
}

export interface CreateFormCategoryRequest {
    name: string
    description?: string
    color: string
    isActive?: boolean
}

export interface UpdateFormCategoryRequest {
    name?: string
    description?: string
    color?: string
    isActive?: boolean
}

export interface FormCategoryQuery {
    search?: string
    isActive?: boolean
    page?: number
    limit?: number
}

export interface FormCategoryListResponse {
    categories: FormCategory[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface FormCategoryStats {
    total: number
    active: number
    totalForms: number
}

// 获取表单分类列表
export const getFormCategories = async (query?: FormCategoryQuery): Promise<FormCategoryListResponse> => {
    const params = new URLSearchParams()
    if (query?.search) params.append('search', query.search)
    if (query?.isActive !== undefined) params.append('isActive', query.isActive.toString())
    if (query?.page) params.append('page', query.page.toString())
    if (query?.limit) params.append('limit', query.limit.toString())

    const response = await axios.get(`/api/form-categories?${params.toString()}`)
    return response.data.data
}

// 获取所有启用的分类
export const getActiveFormCategories = async (): Promise<FormCategory[]> => {
    const response = await axios.get('/api/form-categories/active')
    return response.data.data
}

// 根据ID获取表单分类
export const getFormCategoryById = async (id: string): Promise<FormCategory> => {
    const response = await axios.get(`/api/form-categories/${id}`)
    return response.data.data
}

// 创建表单分类
export const createFormCategory = async (data: CreateFormCategoryRequest): Promise<FormCategory> => {
    const response = await axios.post('/api/form-categories', data)
    return response.data.data
}

// 更新表单分类
export const updateFormCategory = async (id: string, data: UpdateFormCategoryRequest): Promise<FormCategory> => {
    const response = await axios.put(`/api/form-categories/${id}`, data)
    return response.data.data
}

// 删除表单分类
export const deleteFormCategory = async (id: string): Promise<void> => {
    await axios.delete(`/api/form-categories/${id}`)
}

// 切换分类状态
export const toggleFormCategoryStatus = async (id: string): Promise<FormCategory> => {
    const response = await axios.patch(`/api/form-categories/${id}/toggle-status`)
    return response.data.data
}

// 获取分类统计信息
export const getFormCategoryStats = async (): Promise<FormCategoryStats> => {
    const response = await axios.get('/api/form-categories/stats')
    return response.data.data
} 