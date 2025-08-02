import express from 'express'
import OrderController from '../controllers/OrderController'

const router = express.Router()

// 获取订单列表
router.get('/', OrderController.getOrders)

// 创建订单
router.post('/', OrderController.createOrder)

// 获取订单详情
router.get('/:orderId', OrderController.getOrderById)

// 更新订单
router.put('/:orderId', OrderController.updateOrder)

// 获取订单版本历史
router.get('/:orderId/versions', OrderController.getOrderVersionHistory)

// 获取指定版本快照
router.get('/:orderId/versions/:version', OrderController.getOrderSnapshot)

// 更新订单状态
router.patch('/:orderId/status', OrderController.updateOrderStatus)

// 删除订单
router.delete('/:orderId', OrderController.deleteOrder)

export default router 