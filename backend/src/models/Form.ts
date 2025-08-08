import mongoose, { Schema, Document } from 'mongoose'

export interface IForm extends Document {
    name: string
    description?: string
    categoryId: mongoose.Types.ObjectId
    content: any // 表单内容，可以是JSON格式
    status: 'draft' | 'published' | 'disabled'
    createdBy: mongoose.Types.ObjectId
    submissions: number
    createTime: Date
    updateTime: Date
}

const FormSchema = new Schema<IForm>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'FormCategory',
        required: true
    },
    content: {
        type: Schema.Types.Mixed,
        default: {}
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'disabled'],
        default: 'draft'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    submissions: {
        type: Number,
        default: 0,
        min: 0
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

// 添加索引
FormSchema.index({ name: 1 })
FormSchema.index({ categoryId: 1 })
FormSchema.index({ status: 1 })
FormSchema.index({ createdBy: 1 })

export default mongoose.model<IForm>('Form', FormSchema) 