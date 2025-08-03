import axios from 'axios'

// 规格接口
export interface Specification {
  _id: string
  name: string
  length: number
  width: number
  height?: number
  unit: string
  resolution?: string
  description?: string
  isDefault: boolean
  category?: string
  createdBy: string
  updatedBy: string
  createTime: string
  updateTime: string
}

// 创建规格请求接口
export interface CreateSpecificationRequest {
  name: string
  length: number
  width: number
  height?: number
  unit: string
  resolution?: string
  description?: string
  isDefault?: boolean
  category?: string
}

// 更新规格请求接口
export interface UpdateSpecificationRequest {
  name?: string
  length?: number
  width?: number
  height?: number
  unit?: string
  resolution?: string
  description?: string
  isDefault?: boolean
  category?: string
}

// 规格列表查询参数
export interface SpecificationQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  isDefault?: boolean
}

// 规格列表响应
export interface SpecificationListResponse {
  success: boolean
  data: Specification[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// 规格详情响应
export interface SpecificationDetailResponse {
  success: boolean
  data: Specification
}

// API基础URL
const API_BASE_URL = 'http://localhost:3000/api'

/**
 * 获取规格列表
 */
export const getSpecifications = async (params: SpecificationQueryParams = {}): Promise<SpecificationListResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/specifications`, { params })
    return response.data
  } catch (error) {
    console.error('获取规格列表失败:', error)
    throw error
  }
}

/**
 * 获取默认规格列表
 */
export const getDefaultSpecifications = async (): Promise<{ success: boolean; data: Specification[] }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/specifications/defaults`)
    return response.data
  } catch (error) {
    console.error('获取默认规格失败:', error)
    throw error
  }
}

/**
 * 获取规格详情
 */
export const getSpecificationById = async (id: string): Promise<SpecificationDetailResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/specifications/${id}`)
    return response.data
  } catch (error) {
    console.error('获取规格详情失败:', error)
    throw error
  }
}

/**
 * 创建规格
 */
export const createSpecification = async (specData: CreateSpecificationRequest): Promise<SpecificationDetailResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/specifications`, specData)
    return response.data
  } catch (error) {
    console.error('创建规格失败:', error)
    throw error
  }
}

/**
 * 更新规格
 */
export const updateSpecification = async (id: string, updateData: UpdateSpecificationRequest): Promise<SpecificationDetailResponse> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/specifications/${id}`, updateData)
    return response.data
  } catch (error) {
    console.error('更新规格失败:', error)
    throw error
  }
}

/**
 * 删除规格
 */
export const deleteSpecification = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/specifications/${id}`)
    return response.data
  } catch (error) {
    console.error('删除规格失败:', error)
    throw error
  }
}

/**
 * 设置默认规格
 */
export const setDefaultSpecification = async (id: string, isDefault: boolean): Promise<SpecificationDetailResponse> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/specifications/${id}/default`, { isDefault })
    return response.data
  } catch (error) {
    console.error('设置默认规格失败:', error)
    throw error
  }
} 