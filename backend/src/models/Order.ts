import mongoose, { Document, Schema } from 'mongoose'

// 价格政策快照接口
export interface IPricingPolicySnapshot {
  policyId: string
  policyName: string
  policyType: 'uniform_discount' | 'tiered_discount'
  discountRatio: number
  calculationDetails: string
}

// 订单项目快照接口
export interface IOrderItemSnapshot {
  serviceId: string
  serviceName: string
  categoryName: string
  unitPrice: number
  unit: string
  quantity: number
  originalPrice: number
  discountedPrice: number
  discountAmount: number
  subtotal: number
  priceDescription: string
  pricingPolicies: IPricingPolicySnapshot[]
}

// 订单快照接口
export interface IOrderSnapshot {
  version: number
  createdAt: Date
  updatedBy: string
  clientInfo: {
    clientId: string
    clientName: string
    contactIds: string[]
    contactNames: string[]
    contactPhones: string[]
  }
  projectInfo: {
    projectName: string
    quotationId?: string
  }
  items: IOrderItemSnapshot[]
  totalAmount: number
  totalAmountRMB: string
  calculationSummary: {
    totalItems: number
    totalQuantity: number
    appliedPolicies: string[]
  }
}

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

  // 当前版本信息
  currentVersion: number
  currentAmount: number
  currentAmountRMB: string
  status: 'normal' | 'cancelled' | 'draft'

  // 快照历史
  snapshots: IOrderSnapshot[]

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

// 订单项目快照Schema
const PricingPolicySnapshotSchema = new Schema<IPricingPolicySnapshot>({
  policyId: { type: String, required: true },
  policyName: { type: String, required: true },
  policyType: {
    type: String,
    enum: ['uniform_discount', 'tiered_discount'],
    required: true
  },
  discountRatio: { type: Number, required: true, default: 100 },
  calculationDetails: { type: String, required: true }
}, { _id: false })

const OrderItemSnapshotSchema = new Schema<IOrderItemSnapshot>({
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  categoryName: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discountAmount: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  priceDescription: { type: String, required: true },
  pricingPolicies: [PricingPolicySnapshotSchema]
}, { _id: false })

// 订单快照Schema
const OrderSnapshotSchema = new Schema<IOrderSnapshot>({
  version: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  updatedBy: { type: String, required: true },
  clientInfo: {
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    contactIds: { type: [String], required: true },
    contactNames: { type: [String], required: true },
    contactPhones: { type: [String], required: true }
  },
  projectInfo: {
    projectName: { type: String, required: true },
    quotationId: { type: String }
  },
  items: [OrderItemSnapshotSchema],
  totalAmount: { type: Number, required: true },
  totalAmountRMB: { type: String, required: true },
  calculationSummary: {
    totalItems: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    appliedPolicies: [String]
  }
}, { _id: false })

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

  // 当前版本信息
  currentVersion: { type: Number, required: true, default: 1 },
  currentAmount: { type: Number, required: true },
  currentAmountRMB: { type: String, required: true },
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

  // 快照历史
  snapshots: [OrderSnapshotSchema],

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
OrderSchema.index({ 'snapshots.version': 1 })

// 虚拟字段：获取最新快照
OrderSchema.virtual('latestSnapshot').get(function () {
  if (!this.snapshots || this.snapshots.length === 0) return null
  return this.snapshots[this.snapshots.length - 1]
})

// 方法：添加新快照
OrderSchema.methods.addSnapshot = function (snapshot: IOrderSnapshot) {
  this.snapshots.push(snapshot)
  this.currentVersion = snapshot.version
  this.currentAmount = snapshot.totalAmount
  this.currentAmountRMB = snapshot.totalAmountRMB
  this.updateTime = new Date()
  return this.save()
}

// 方法：获取指定版本快照
OrderSchema.methods.getSnapshot = function (version: number) {
  return this.snapshots.find((s: IOrderSnapshot) => s.version === version)
}

// 方法：获取版本历史
OrderSchema.methods.getVersionHistory = function () {
  return this.snapshots.map((s: IOrderSnapshot) => ({
    version: s.version,
    createdAt: s.createdAt,
    updatedBy: s.updatedBy,
    totalAmount: s.totalAmount,
    totalItems: s.calculationSummary.totalItems
  }))
}

export const Order = mongoose.model<IOrder>('Order', OrderSchema)
export default Order 