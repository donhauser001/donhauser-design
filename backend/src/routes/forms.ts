import express from 'express'
import FormController from '../controllers/FormController'

const router = express.Router()

// 获取表单列表
router.get('/', FormController.getForms)

// 根据ID获取表单
router.get('/:id', FormController.getFormById)

// 创建表单
router.post('/', FormController.createForm)

// 更新表单
router.put('/:id', FormController.updateForm)

// 删除表单
router.delete('/:id', FormController.deleteForm)

// 切换表单状态
router.patch('/:id/toggle-status', FormController.toggleFormStatus)

export default router 