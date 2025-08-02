export interface OrderData {
  id?: string
  _id?: string
  orderNo: string
  clientName: string
  clientId: string
  amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'
  createTime: string
  updateTime?: string
  description?: string
  projectName?: string
  quotationId?: string
  selectedServices?: string[]
  paymentMethod?: string
  deliveryDate?: string
  contactPerson?: string
  contactPhone?: string
  contactId?: string  // 单个联系人ID
  address?: string
  remark?: string
}

export interface ServiceDetail {
  _id?: string
  id?: string
  serviceName: string
  alias?: string
  categoryName?: string
  unitPrice: number
  unit: string
  pricingPolicyNames?: string[]
  pricingPolicyIds?: string[]
  priceDescription?: string
  quantity?: number
  selectedPolicies?: string[]           // 选中的政策ID（单选，最多一个）
  calculationResult?: {
    originalPrice: number
    discountedPrice: number
    discountAmount: number
    discountRatio: number
    calculationDetails: string
  }
}

export interface Client {
  id?: string
  _id?: string
  companyName?: string
  name?: string
  status: string
  quotationId?: string
}

export interface Contact {
  id?: string
  _id?: string
  realName: string
  phone: string
  status: string
  company: string
}

export interface Quotation {
  _id?: string
  id?: string
  name: string
  description?: string
  selectedServices?: string[]
} 