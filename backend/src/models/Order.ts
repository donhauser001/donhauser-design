import mongoose, { Document, Schema } from 'mongoose'

// 订单接口
export interface IOrder extends Document {
  orderNo: string
  clientId: string
  clientName: string
  contactIds: string[]
  contactNames: string[]
  contactPhones: string[]
  projectName: string
  quotationId?: string

  // 当前版本信息（从订单版本表获取）
  currentVersion?: number
  currentAmount?: number
  currentAmountRMB?: string
  latestVersionInfo?: {
    versionNumber: number
    totalAmount: number
    totalItems: number
  }

  status: 'normal' | 'cancelled' | 'draft'

  // 元数据
  createTime: Date
  updateTime: Date
  createdBy: string
  updatedBy: string

  // 业务字段
  paymentMethod?: string
  deliveryDate?: Date
  address?: string
  remark?: string
}

// 订单Schema
const OrderSchema = new Schema<IOrder>({
  orderNo: {
    type: String,
    required: true,
    unique: true,
    default: () => `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
  },
  clientId: { type: String, required: true },
  clientName: { type: String, required: true },
  contactIds: { type: [String], required: true },
  contactNames: { type: [String], required: true },
  contactPhones: { type: [String], required: true },
  projectName: { type: String, required: true },
  quotationId: { type: String },

  // 当前版本信息（从订单版本表获取，不存储快照）
  currentVersion: { type: Number },
  currentAmount: { type: Number },
  currentAmountRMB: { type: String },
  latestVersionInfo: {
    versionNumber: { type: Number },
    totalAmount: { type: Number },
    totalItems: { type: Number }
  },

  status: {
    type: String,
    enum: ['normal', 'cancelled', 'draft'],
    default: 'normal',
    set: function (value: string) {
      // 将旧的状态值转换为新的状态值
      if (value === 'draft') {
        return 'normal'
      }
      return value
    }
  },

  // 元数据
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },

  // 业务字段
  paymentMethod: { type: String },
  deliveryDate: { type: Date },
  address: { type: String },
  remark: { type: String }
}, {
  timestamps: true,
  collection: 'orders'
})

// 索引
OrderSchema.index({ orderNo: 1 })
OrderSchema.index({ clientId: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ createTime: -1 })

export const Order = mongoose.model<IOrder>('Order', OrderSchema)
export default Order 