import mongoose, { Document, Schema } from 'mongoose'

export interface IContractElement extends Document {
    name: string
    type: 'header' | 'signature' | 'order' | 'quotation' | 'short_text' | 'paragraph_text' | 'preset_text' | 'dropdown' | 'radio' | 'checkbox' | 'money' | 'money_cn' | 'number' | 'date' | 'project' | 'task'
    description?: string
    status: 'active' | 'inactive'
    createdBy: string
    createTime: Date
    updateTime: Date
}

const ContractElementSchema = new Schema<IContractElement>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    type: {
        type: String,
        required: true,
        enum: ['header', 'signature', 'order', 'quotation', 'short_text', 'paragraph_text', 'preset_text', 'dropdown', 'radio', 'checkbox', 'money', 'money_cn', 'number', 'date', 'project', 'task']
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdBy: {
        type: String,
        required: true
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
})

// 创建索引
ContractElementSchema.index({ name: 1 })
ContractElementSchema.index({ type: 1 })
ContractElementSchema.index({ status: 1 })
ContractElementSchema.index({ createTime: -1 })

export default mongoose.model<IContractElement>('ContractElement', ContractElementSchema) 