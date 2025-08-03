import ContractElement, { IContractElement } from '../models/ContractElement'

export interface CreateContractElementData {
    name: string
    type: IContractElement['type']
    description?: string
    status?: 'active' | 'inactive'
    createdBy: string
}

export interface UpdateContractElementData {
    name?: string
    type?: IContractElement['type']
    description?: string
    status?: 'active' | 'inactive'
}

export interface ContractElementQuery {
    page?: number
    limit?: number
    search?: string
    type?: string
    status?: string
}

class ContractElementService {
    // 创建合同元素
    async create(data: CreateContractElementData): Promise<IContractElement> {
        const element = new ContractElement(data)
        return await element.save()
    }

    // 更新合同元素
    async update(id: string, data: UpdateContractElementData): Promise<IContractElement | null> {
        return await ContractElement.findByIdAndUpdate(
            id,
            { ...data, updateTime: new Date() },
            { new: true, runValidators: true }
        )
    }

    // 删除合同元素
    async delete(id: string): Promise<boolean> {
        const result = await ContractElement.findByIdAndDelete(id)
        return !!result
    }

    // 根据ID获取合同元素
    async getById(id: string): Promise<IContractElement | null> {
        return await ContractElement.findById(id)
    }

    // 获取合同元素列表
    async getList(query: ContractElementQuery = {}): Promise<{
        elements: IContractElement[]
        total: number
        page: number
        limit: number
    }> {
        const { page = 1, limit = 100, search, type, status } = query
        const skip = (page - 1) * limit

        // 构建查询条件
        const filter: any = {}
        
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }
        
        if (type && type !== 'all') {
            filter.type = type
        }
        
        if (status && status !== 'all') {
            filter.status = status
        }

        const [elements, total] = await Promise.all([
            ContractElement.find(filter)
                .sort({ createTime: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            ContractElement.countDocuments(filter)
        ])

        return {
            elements,
            total,
            page,
            limit
        }
    }

    // 获取所有启用的合同元素
    async getActiveElements(): Promise<IContractElement[]> {
        return await ContractElement.find({ status: 'active' })
            .sort({ createTime: -1 })
            .lean()
    }

    // 检查名称是否已存在
    async isNameExists(name: string, excludeId?: string): Promise<boolean> {
        const filter: any = { name }
        if (excludeId) {
            filter._id = { $ne: excludeId }
        }
        const count = await ContractElement.countDocuments(filter)
        return count > 0
    }
}

export default new ContractElementService() 