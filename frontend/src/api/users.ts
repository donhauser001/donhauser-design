import axios from 'axios'

// 用户接口
export interface User {
  _id: string
  username: string
  realName: string
  email: string
  phone: string
  role: '超级管理员' | '项目经理' | '设计师' | '客户' | '员工'
  department: string
  status: 'active' | 'inactive'
  createTime: string
  lastLogin?: string
}

// 用户列表查询参数
export interface UserQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
  department?: string
}

// 用户列表响应
export interface UserListResponse {
  success: boolean
  data: User[]
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
 * 获取用户列表
 */
export const getUsers = async (params: UserQueryParams = {}): Promise<UserListResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    return response.data
  } catch (error) {
    console.error('获取用户列表失败:', error)
    throw error
  }
}

/**
 * 获取员工列表（角色为员工和系统管理员）
 */
export const getEmployees = async (): Promise<{ success: boolean; data: User[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: {
        status: 'active',
        limit: 100
      },
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    // 过滤出员工、系统管理员和设计师
    const employees = response.data.data.filter((user: User) =>
      user.role === '员工' || user.role === '超级管理员' || user.role === '设计师'
    )
    return {
      success: true,
      data: employees
    }
  } catch (error) {
    console.error('获取员工列表失败:', error)
    throw error
  }
}

/**
 * 获取客户角色用户列表（联系人）
 */
export const getClientUsers = async (): Promise<{ success: boolean; data: User[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: {
        status: 'active',
        limit: 200
      },
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    // 在前端过滤出客户角色的用户
    const clientUsers = response.data.data.filter((user: User) => user.role === '客户')
    return {
      success: true,
      data: clientUsers || []
    }
  } catch (error) {
    console.error('获取客户用户列表失败:', error)
    throw error
  }
} 