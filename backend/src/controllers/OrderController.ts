import { Request, Response } from 'express'
import { OrderService } from '../services/OrderService'

const orderService = new OrderService()

export class OrderController {
  /**
   * 创建订单
   */
  async createOrder(req: Request, res: Response) {
    try {
      const {
        clientId,
        clientName,
        contactIds,
        contactNames,
        contactPhones,
        projectName,
        quotationId,
        selectedServices,
        serviceDetails,
        policies
      } = req.body

      const createdBy = req.user?.id || 'system'

      const order = await orderService.createOrder({
        clientId,
        clientName,
        contactIds,
        contactNames,
        contactPhones,
        projectName,
        quotationId,
        selectedServices,
        serviceDetails,
        policies,
        createdBy
      })

      res.status(201).json({
        success: true,
        data: order,
        message: '订单创建成功'
      })
    } catch (error) {
      console.error('创建订单失败:', error)
      res.status(500).json({
        success: false,
        message: '创建订单失败',
        error: error instanceof Error ? error.message : '未知错误'
      })
    }
  }

  /**
   * 更新订单
   */
  async updateOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params
      const updateData = req.body
      const updatedBy = req.user?.id || 'system'

      console.log('更新订单请求数据:', {
        orderId,
        updateData,
        updatedBy
      })

      const order = await orderService.updateOrder(orderId, {
        ...updateData,
        updatedBy
      })

      res.json({
        success: true,
        data: order,
        message: '订单更新成功'
      })
    } catch (error) {
      console.error('更新订单失败:', error)
      console.error('错误堆栈:', error instanceof Error ? error.stack : '未知错误')
      res.status(500).json({
        success: false,
        message: '更新订单失败',
        error: error instanceof Error ? error.message : '未知错误'
      })
    }
  }

  /**
   * 获取订单列表
   */
  async getOrders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, status, clientId } = req.query

      const result = await orderService.getOrders({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        status: status as string,
        clientId: clientId as string
      })

      res.json({
        success: true,
        data: result.orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: result.total,
          pages: Math.ceil(result.total / Number(limit))
        }
      })
    } catch (error) {
      console.error('获取订单列表失败:', error)
      res.status(500).json({
        success: false,
        message: '获取订单列表失败',
        error: error instanceof Error ? error.message : '未知错误'
      })
    }
  }

  /**
   * 获取订单详情
   */
  async getOrderById(req: Request, res: Response) {
    try {
      const { orderId } = req.params

      const order = await orderService.getOrderById(orderId)
      if (!order) {
        return res.status(404).json({
          success: false,
          message: '订单不存在'
        })
      }

      res.json({
        success: true,
        data: order
      })
    } catch (error) {
      console.error('获取订单详情失败:', error)
      res.status(500).json({
        success: false,
        message: '获取订单详情失败',
        error: error instanceof Error ? error.message : '未知错误'
      })
    }
  }

  /**
   * 获取订单版本历史
   */
  async getOrderVersionHistory(req: Request, res: Response) {
    try {
      const { orderId } = req.params

      const history = await orderService.getOrderVersionHistory(orderId)

      res.json({
        success: true,
        data: history
      })
    } catch (error) {
      console.error('获取订单版本历史失败:', error)
      res.status(500).json({
        success: false,
        message: '获取订单版本历史失败',
        error: error instanceof Error ? error.message : '未知错误'
      })
    }
  }

  /**
   * 获取指定版本快照
   */
  async getOrderSnapshot(req: Request, res: Response) {
    try {
      const { orderId, version } = req.params

      const snapshot = await orderService.getOrderSnapshot(orderId, Number(version))
      if (!snapshot) {
        return res.status(404).json({
          success: false,
          message: '快照不存在'
        })
      }

      res.json({
        success: true,
        data: snapshot
      })
    } catch (error) {
      console.error('获取订单快照失败:', error)
      res.status(500).json({
        success: false,
        message: '获取订单快照失败',
        error: error instanceof Error ? error.message : '未知错误'
      })
    }
  }

  /**
   * 更新订单状态
   */
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params
      const { status } = req.body
      const updatedBy = req.user?.id || 'system'

      // 验证状态值
      if (!['normal', 'cancelled', 'draft'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: '无效的状态值'
        })
      }

      const updatedOrder = await orderService.updateOrderStatus(orderId, status, updatedBy)

      res.json({
        success: true,
        message: '订单状态更新成功',
        data: updatedOrder
      })
    } catch (error) {
      console.error('更新订单状态失败:', error)
      res.status(500).json({
        success: false,
        message: '更新订单状态失败',
        error: error instanceof Error ? error.message : '未知错误'
      })
    }
  }

  /**
   * 删除订单
   */
  async deleteOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params

      await orderService.deleteOrder(orderId)

      res.json({
        success: true,
        message: '订单删除成功'
      })
    } catch (error) {
      console.error('删除订单失败:', error)
      res.status(500).json({
        success: false,
        message: '删除订单失败',
        error: error instanceof Error ? error.message : '未知错误'
      })
    }
  }
}

export default new OrderController() 