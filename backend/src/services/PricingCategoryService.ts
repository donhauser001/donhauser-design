import { PricingCategory, CreatePricingCategoryRequest, UpdatePricingCategoryRequest } from '../models/PricingCategory'
import { v4 as uuidv4 } from 'uuid'

let categories: PricingCategory[] = [
    {
        id: uuidv4(),
        name: '设计服务',
        description: '平面设计、UI设计、品牌设计等服务',
        status: 'active',
        serviceCount: 15,
        createTime: '2024-01-01'
    },
    {
        id: uuidv4(),
        name: '开发服务',
        description: '网站开发、小程序开发、APP开发等服务',
        status: 'active',
        serviceCount: 28,
        createTime: '2024-01-01'
    },
    {
        id: uuidv4(),
        name: '营销服务',
        description: 'SEO优化、SEM推广、社交媒体营销等服务',
        status: 'active',
        serviceCount: 12,
        createTime: '2024-01-01'
    },
    {
        id: uuidv4(),
        name: '咨询服务',
        description: '技术咨询、项目规划、方案设计等服务',
        status: 'inactive',
        serviceCount: 5,
        createTime: '2024-01-01'
    }
]

export class PricingCategoryService {
    getCategories() {
        return categories
    }

    getCategoryById(id: string) {
        return categories.find(c => c.id === id)
    }

    createCategory(data: CreatePricingCategoryRequest) {
        if (categories.some(c => c.name === data.name)) {
            throw new Error('分类名称已存在')
        }
        const newCategory: PricingCategory = {
            id: uuidv4(),
            name: data.name,
            description: data.description || '',
            status: data.status || 'active',
            serviceCount: 0,
            createTime: new Date().toISOString().slice(0, 10)
        }
        categories.unshift(newCategory)
        return newCategory
    }

    updateCategory(id: string, data: UpdatePricingCategoryRequest) {
        const idx = categories.findIndex(c => c.id === id)
        if (idx === -1) return null
        if (data.name && categories.some(c => c.name === data.name && c.id !== id)) {
            throw new Error('分类名称已存在')
        }
        categories[idx] = { ...categories[idx], ...data }
        return categories[idx]
    }

    deleteCategory(id: string) {
        const idx = categories.findIndex(c => c.id === id)
        if (idx === -1) return false
        categories.splice(idx, 1)
        return true
    }
} 