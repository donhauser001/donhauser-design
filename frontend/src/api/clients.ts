import axios from 'axios'

// 客户接口定义
export interface Client {
  _id: string
  name: string
  address: string
  invoiceType: string
  invoiceInfo: string
  category: string
  quotationId?: string
  rating: number
  files: Array<{
    path: string
    originalName: string
    size: number
  }>
  summary: string
  status: 'active' | 'inactive'
  createTime: string
  updateTime: string
}

// 获取客户列表
export const getClients = async (): Promise<{ success: boolean; data: Client[] }> => {
  try {
    const response = await axios.get('http://localhost:3000/api/clients')
    return {
      success: true,
      data: response.data.data || []
    }
  } catch (error) {
    console.error('获取客户列表失败:', error)
    throw error
  }
}

// 获取客户详情
export const getClientById = async (id: string) => {
  const response = await axios.get(`/api/clients/${id}`)
  return response.data
}

// 创建客户
export const createClient = async (clientData: Partial<Client>) => {
  const response = await axios.post('/api/clients', clientData)
  return response.data
}

// 更新客户
export const updateClient = async (id: string, clientData: Partial<Client>) => {
  const response = await axios.put(`/api/clients/${id}`, clientData)
  return response.data
}

// 删除客户
export const deleteClient = async (id: string) => {
  const response = await axios.delete(`/api/clients/${id}`)
  return response.data
} 