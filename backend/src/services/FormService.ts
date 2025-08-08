import Form, { IForm } from '../models/Form'
import FormCategory from '../models/FormCategory'

export interface CreateFormData {
    name: string
    description?: string
    categoryId: string
    content?: any
    status?: 'draft' | 'published' | 'disabled'
    createdBy?: string
}

export interface UpdateFormData {
    name?: string
    description?: string
    categoryId?: string
    content?: any
    status?: 'draft' | 'published' | 'disabled'
}

export interface FormQuery {
    search?: string
    categoryId?: string
    status?: string
    createdBy?: string
    page?: number
    limit?: number
}

export interface FormListResponse {
    forms: IForm[]
    total: number
    page: number
    limit: number
    totalPages: number
}

class FormService {
    // 获取表单列表
    async getForms(query: FormQuery): Promise<FormListResponse> {
        const { search, categoryId, status, createdBy, page = 1, limit = 10 } = query

        const filter: any = {}

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        if (categoryId) {
            filter.categoryId = categoryId
        }

        if (status) {
            filter.status = status
        }

        if (createdBy) {
            filter.createdBy = createdBy
        }

        const skip = (page - 1) * limit

        const [forms, total] = await Promise.all([
            Form.find(filter)
                .populate('categoryId', 'name color')
                .populate('createdBy', 'username realName')
                .sort({ updateTime: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Form.countDocuments(filter)
        ])

        return {
            forms,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }

    // 根据ID获取表单
    async getFormById(id: string): Promise<IForm | null> {
        return Form.findById(id)
            .populate('categoryId', 'name color')
            .populate('createdBy', 'username realName')
    }

    // 创建表单
    async createForm(data: CreateFormData): Promise<IForm> {
        // 如果createdBy为空，则不设置该字段
        const formData = { ...data }
        if (!formData.createdBy) {
            delete formData.createdBy
        }

        const form = new Form(formData)
        const savedForm = await form.save()

        // 更新分类的表单数量
        await this.updateCategoryFormCount(data.categoryId, 1)

        return savedForm
    }

    // 更新表单
    async updateForm(id: string, data: UpdateFormData): Promise<IForm | null> {
        const form = await Form.findById(id)
        if (!form) return null

        // 如果分类发生变化，需要更新两个分类的表单数量
        if (data.categoryId && data.categoryId !== form.categoryId.toString()) {
            await this.updateCategoryFormCount(form.categoryId.toString(), -1)
            await this.updateCategoryFormCount(data.categoryId, 1)
        }

        return Form.findByIdAndUpdate(id, data, { new: true })
            .populate('categoryId', 'name color')
            .populate('createdBy', 'username realName')
    }

    // 删除表单
    async deleteForm(id: string): Promise<boolean> {
        const form = await Form.findById(id)
        if (!form) return false

        await Form.findByIdAndDelete(id)

        // 更新分类的表单数量
        await this.updateCategoryFormCount(form.categoryId.toString(), -1)

        return true
    }

    // 切换表单状态
    async toggleFormStatus(id: string): Promise<IForm | null> {
        const form = await Form.findById(id)
        if (!form) return null

        const newStatus = form.status === 'published' ? 'disabled' : 'published'

        return Form.findByIdAndUpdate(id, { status: newStatus }, { new: true })
            .populate('categoryId', 'name color')
            .populate('createdBy', 'username realName')
    }

    // 更新分类的表单数量
    private async updateCategoryFormCount(categoryId: string, increment: number): Promise<void> {
        await FormCategory.findByIdAndUpdate(categoryId, {
            $inc: { formCount: increment }
        })
    }
}

export default new FormService() 