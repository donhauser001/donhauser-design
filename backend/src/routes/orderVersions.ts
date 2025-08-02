import { Router } from 'express'
import { OrderVersionController } from '../controllers/OrderVersionController'

const router = Router()
const orderVersionController = new OrderVersionController()

// 创建订单版本
router.post('/', orderVersionController.createOrderVersion.bind(orderVersionController))

// 获取订单的所有版本
router.get('/:orderId', orderVersionController.getOrderVersions.bind(orderVersionController))

// 获取订单的特定版本
router.get('/:orderId/:versionNumber', orderVersionController.getOrderVersion.bind(orderVersionController))

// 获取订单的最新版本
router.get('/:orderId/latest', orderVersionController.getLatestOrderVersion.bind(orderVersionController))

// 删除订单的所有版本
router.delete('/:orderId', orderVersionController.deleteOrderVersions.bind(orderVersionController))

export default router 