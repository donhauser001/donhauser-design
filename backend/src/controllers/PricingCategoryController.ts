import { Request, Response } from 'express'
import { PricingCategoryService } from '../services/PricingCategoryService'

export class PricingCategoryController {
    private service = new PricingCategoryService()

    getCategories = (req: Request, res: Response) => {
        res.json({ success: true, data: this.service.getCategories() })
    }

    createCategory = (req: Request, res: Response) => {
        try {
            const category = this.service.createCategory(req.body)
            res.json({ success: true, data: category })
        } catch (e: any) {
            res.status(400).json({ success: false, message: e.message })
        }
    }

    updateCategory = (req: Request, res: Response) => {
        try {
            const category = this.service.updateCategory(req.params.id, req.body)
            if (!category) {
                res.status(404).json({ success: false, message: '分类不存在' })
                return
            }
            res.json({ success: true, data: category })
        } catch (e: any) {
            res.status(400).json({ success: false, message: e.message })
        }
    }

    deleteCategory = (req: Request, res: Response) => {
        const ok = this.service.deleteCategory(req.params.id)
        if (!ok) {
            res.status(404).json({ success: false, message: '分类不存在' })
            return
        }
        res.json({ success: true })
    }
} 