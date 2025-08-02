import mongoose, { Schema, Document } from 'mongoose'

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

// 订单版本接口
export interface IOrderVersion extends Document {
    orderId: string
    versionNumber: number
    iterationTime: Date
    
    // 客户信息
    clientId: string
    clientName: string
    contactIds: string[]
    contactNames: string[]
    contactPhones: string[]
    
    // 项目信息
    projectName: string
    quotationId?: string
    
    // 服务项目
    items: IOrderItemSnapshot[]
    
    // 金额信息
    totalAmount: number
    totalAmountRMB: string
    
    // 计算摘要
    calculationSummary: {
        totalItems: number
        totalQuantity: number
        appliedPolicies: string[]
    }
    
    // 元数据
    createdBy: string
    createdAt: Date
    updatedAt: Date
}

// 价格政策快照Schema
const PricingPolicySnapshotSchema = new Schema<IPricingPolicySnapshot>({
    policyId: { type: String, required: true },
    policyName: { type: String, required: true },
    policyType: { 
        type: String, 
        enum: ['uniform_discount', 'tiered_discount'], 
        required: true 
    },
    discountRatio: { type: Number, required: true },
    calculationDetails: { type: String, required: true }
}, { _id: false })

// 订单项目快照Schema
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

// 订单版本Schema
const OrderVersionSchema = new Schema<IOrderVersion>({
    orderId: { type: String, required: true, index: true },
    versionNumber: { type: Number, required: true },
    iterationTime: { type: Date, required: true, default: Date.now },
    
    // 客户信息
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    contactIds: { type: [String], required: true },
    contactNames: { type: [String], required: true },
    contactPhones: { type: [String], required: true },
    
    // 项目信息
    projectName: { type: String, required: true },
    quotationId: { type: String },
    
    // 服务项目
    items: [OrderItemSnapshotSchema],
    
    // 金额信息
    totalAmount: { type: Number, required: true },
    totalAmountRMB: { type: String, required: true },
    
    // 计算摘要
    calculationSummary: {
        totalItems: { type: Number, required: true },
        totalQuantity: { type: Number, required: true },
        appliedPolicies: [String]
    },
    
    // 元数据
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

// 创建复合索引，确保每个订单的版本号唯一
OrderVersionSchema.index({ orderId: 1, versionNumber: 1 }, { unique: true })

// 更新时间中间件
OrderVersionSchema.pre('save', function(next) {
    this.updatedAt = new Date()
    next()
})

export const OrderVersion = mongoose.model<IOrderVersion>('OrderVersion', OrderVersionSchema) 