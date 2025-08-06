import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export interface Task {
    _id: string
    taskName: string
    serviceId: string
    projectId: string
    orderId: string
    assignedDesigners: string[]
    specification?: {
        id: string
        name: string
        length: number
        width: number
        height?: number
        unit: string
        resolution?: string
    }
    quantity: number
    unit: string
    subtotal: number
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    startDate?: string
    dueDate?: string
    completedDate?: string
    progress: number
    remarks?: string
    attachments: string[]
    createdAt: string
    updatedAt: string
}

export interface CreateTaskRequest {
    taskName: string
    serviceId: string
    projectId: string
    orderId?: string // 改为可选
    assignedDesigners: string[]
    specification?: {
        id: string
        name: string
        length: number
        width: number
        height?: number
        unit: string
        resolution?: string
    }
    quantity: number
    unit: string
    subtotal: number
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    dueDate?: string
    remarks?: string
}

export interface UpdateTaskRequest {
    taskName?: string
    assignedDesigners?: string[]
    specification?: {
        id: string
        name: string
        length: number
        width: number
        height?: number
        unit: string
        resolution?: string
    } | undefined
    status?: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold'
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    progress?: number
    startDate?: string
    dueDate?: string
    remarks?: string
    attachments?: string[]
}

export interface TaskQuery {
    page?: number
    limit?: number
    projectId?: string
    designerId?: string
    status?: string
    priority?: string
    search?: string
}

// 获取任务列表
export const getTasks = async (params?: TaskQuery) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tasks`, { params })
        return response.data
    } catch (error) {
        console.error('获取任务列表失败:', error)
        throw error
    }
}

// 根据ID获取任务详情
export const getTaskById = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tasks/${id}`)
        return response.data
    } catch (error) {
        console.error('获取任务详情失败:', error)
        throw error
    }
}

// 创建任务
export const createTask = async (data: CreateTaskRequest) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/tasks`, data)
        return response.data
    } catch (error: any) {
        console.error('创建任务失败:', error)
        
        // 提取更详细的错误信息
        let errorMessage = '创建任务失败'
        
        if (error.response) {
            // 服务器返回了错误响应
            const status = error.response.status
            const serverMessage = error.response.data?.message || error.response.data?.error || '服务器错误'
            errorMessage = `创建任务失败 (${status}): ${serverMessage}`
        } else if (error.request) {
            // 请求已发出但没有收到响应
            errorMessage = '创建任务失败: 无法连接到服务器'
        } else {
            // 其他错误
            errorMessage = `创建任务失败: ${error.message || '未知错误'}`
        }
        
        // 创建一个新的错误对象，包含详细信息
        const detailedError = new Error(errorMessage)
        detailedError.name = 'TaskCreationError'
        
        throw detailedError
    }
}

// 批量创建任务
export const createTasks = async (tasks: CreateTaskRequest[]) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/tasks/batch`, { tasks })
        return response.data
    } catch (error) {
        console.error('批量创建任务失败:', error)
        throw error
    }
}

// 更新任务
export const updateTask = async (id: string, data: UpdateTaskRequest) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, data)
        return response.data
    } catch (error) {
        console.error('更新任务失败:', error)
        throw error
    }
}

// 更新任务状态
export const updateTaskStatus = async (id: string, status: string, progress?: number) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/tasks/${id}/status`, { status, progress })
        return response.data
    } catch (error) {
        console.error('更新任务状态失败:', error)
        throw error
    }
}

// 分配设计师
export const assignDesigners = async (id: string, designerIds: string[]) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/tasks/${id}/assign`, { designerIds })
        return response.data
    } catch (error) {
        console.error('分配设计师失败:', error)
        throw error
    }
}

// 删除任务
export const deleteTask = async (id: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/tasks/${id}`)
        return response.data
    } catch (error) {
        console.error('删除任务失败:', error)
        throw error
    }
}

// 获取项目相关的任务
export const getTasksByProject = async (projectId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tasks/project/${projectId}`)
        return response.data
    } catch (error) {
        console.error('获取项目任务失败:', error)
        throw error
    }
}

// 获取设计师的任务
export const getTasksByDesigner = async (designerId: string, status?: string) => {
    try {
        const params = status ? { status } : {}
        const response = await axios.get(`${API_BASE_URL}/tasks/designer/${designerId}`, { params })
        return response.data
    } catch (error) {
        console.error('获取设计师任务失败:', error)
        throw error
    }
}

// 获取任务统计
export const getTaskStats = async (projectId?: string, designerId?: string) => {
    try {
        const params: any = {}
        if (projectId) params.projectId = projectId
        if (designerId) params.designerId = designerId

        const response = await axios.get(`${API_BASE_URL}/tasks/stats`, { params })
        return response.data
    } catch (error) {
        console.error('获取任务统计失败:', error)
        throw error
    }
} 