import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export interface Project {
    _id: string
    projectName: string
    client: string
    contact: string
    team: string
    mainDesigner: string[]
    assistantDesigners: string[]
    relatedContracts: string[]
    relatedOrders: string[]
    relatedSettlements: string[]
    relatedInvoices: string[]
    relatedFiles: Array<{ path: string; originalName: string; size: number }>
    relatedTaskIds: string[] // 关联的任务ID数组
    relatedProposals: string[]
    clientRequirements?: string
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold'
    startDate: string
    endDate?: string
    createdAt: string
    updatedAt: string
}

export interface CreateProjectRequest {
    projectName: string
    client: string
    contact: string
    team: string
    mainDesigner: string[]
    assistantDesigners: string[]
    relatedOrders: string[]
    relatedTasks: Array<{
        serviceId: string
        serviceName: string
        quantity: number
        unit: string
        subtotal: number
        specification?: {
            id: string
            name: string
            length: number
            width: number
            height?: number
            unit: string
            resolution?: string
        }
    }>
    clientRequirements?: string
    startDate: string
}

export interface UpdateProjectRequest {
    projectName?: string
    client?: string
    contact?: string
    team?: string
    mainDesigner?: string[]
    assistantDesigners?: string[]
    relatedTaskIds?: string[]
    relatedFiles?: Array<{ path: string; originalName: string; size: number }>
    clientRequirements?: string
    status?: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold'
    startDate?: string
    endDate?: string
}

export interface ProjectQuery {
    page?: number
    limit?: number
    search?: string
    status?: string
    team?: string
    client?: string
}

// 获取项目列表
export const getProjects = async (params?: ProjectQuery) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/projects`, { params })
        return response.data
    } catch (error) {
        console.error('获取项目列表失败:', error)
        throw error
    }
}

// 根据ID获取项目详情
export const getProjectById = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/projects/${id}`)
        return response.data
    } catch (error) {
        console.error('获取项目详情失败:', error)
        throw error
    }
}

// 创建项目
export const createProject = async (data: CreateProjectRequest) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/projects`, data)
        return response.data
    } catch (error) {
        console.error('创建项目失败:', error)
        throw error
    }
}

// 更新项目
export const updateProject = async (id: string, data: UpdateProjectRequest) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/projects/${id}`, data)
        return response.data
    } catch (error) {
        console.error('更新项目失败:', error)
        throw error
    }
}

// 删除项目
export const deleteProject = async (id: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/projects/${id}`)
        return response.data
    } catch (error) {
        console.error('删除项目失败:', error)
        throw error
    }
}

// 获取项目统计信息
export const getProjectStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/projects/stats`)
        return response.data
    } catch (error) {
        console.error('获取项目统计失败:', error)
        throw error
    }
}

// 关联项目与其他模块数据
export const linkProjectToModule = async (
    projectId: string,
    moduleType: 'contract' | 'order' | 'settlement' | 'invoice' | 'task' | 'proposal',
    relatedId: string
) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/projects/${projectId}/links`, {
            moduleType,
            relatedId
        })
        return response.data
    } catch (error) {
        console.error('关联项目数据失败:', error)
        throw error
    }
}

// 解除项目与其他模块数据的关联
export const unlinkProjectFromModule = async (
    projectId: string,
    moduleType: 'contract' | 'order' | 'settlement' | 'invoice' | 'task' | 'proposal',
    relatedId: string
) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/projects/${projectId}/links`, {
            data: { moduleType, relatedId }
        })
        return response.data
    } catch (error) {
        console.error('解除项目关联失败:', error)
        throw error
    }
}

// 获取项目关联的所有数据
export const getProjectLinks = async (projectId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/projects/${projectId}/links`)
        return response.data
    } catch (error) {
        console.error('获取项目关联数据失败:', error)
        throw error
    }
} 