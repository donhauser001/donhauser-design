import { Router } from 'express'
import { PricingCategoryController } from '../controllers/PricingCategoryController'

const router = Router()
const controller = new PricingCategoryController()

router.get('/', controller.getCategories)
router.post('/', controller.createCategory)
router.put('/:id', controller.updateCategory)
router.delete('/:id', controller.deleteCategory)

export default router 