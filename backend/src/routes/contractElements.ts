import express from 'express'
import ContractElementController from '../controllers/ContractElementController'

const router = express.Router()

// 获取合同元素列表
router.get('/', ContractElementController.getList)

// 获取所有启用的合同元素
router.get('/active', ContractElementController.getActiveElements)

// 根据ID获取合同元素
router.get('/:id', ContractElementController.getById)

// 创建合同元素
router.post('/', ContractElementController.create)

// 更新合同元素
router.put('/:id', ContractElementController.update)

// 删除合同元素
router.delete('/:id', ContractElementController.delete)

export default router 