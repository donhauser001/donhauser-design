import { Request, Response } from 'express'
import { OrderVersionService } from '../services/OrderVersionService'

const orderVersionService = new OrderVersionService()

export class OrderVersionController {
    /**
     * 创建订单版本
     */
    async createOrderVersion(req: Request, res: Response) {
        try {
            const {
                orderId,
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

            const orderVersion = await orderVersionService.createOrderVersion({
                orderId,
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
                message: '订单版本创建成功',
                data: orderVersion
            })
        } catch (error: any) {
            console.error('创建订单版本失败:', error)
            res.status(500).json({
                success: false,
                message: '创建订单版本失败',
                error: error.message
            })
        }
    }

    /**
     * 获取订单的所有版本
     */
    async getOrderVersions(req: Request, res: Response) {
        try {
            const { orderId } = req.params

            const versions = await orderVersionService.getOrderVersions(orderId)

            res.json({
                success: true,
                message: '获取订单版本成功',
                data: versions
            })
        } catch (error: any) {
            console.error('获取订单版本失败:', error)
            res.status(500).json({
                success: false,
                message: '获取订单版本失败',
                error: error.message
            })
        }
    }

    /**
     * 获取订单的特定版本
     */
    async getOrderVersion(req: Request, res: Response) {
        try {
            const { orderId, versionNumber } = req.params

            const version = await orderVersionService.getOrderVersion(
                orderId,
                parseInt(versionNumber)
            )

            if (!version) {
                return res.status(404).json({
                    success: false,
                    message: '订单版本不存在'
                })
            }

            res.json({
                success: true,
                message: '获取订单版本成功',
                data: version
            })
        } catch (error: any) {
            console.error('获取订单版本失败:', error)
            res.status(500).json({
                success: false,
                message: '获取订单版本失败',
                error: error.message
            })
        }
    }

    /**
     * 获取订单的最新版本
     */
    async getLatestOrderVersion(req: Request, res: Response) {
        try {
            const { orderId } = req.params

            const version = await orderVersionService.getLatestOrderVersion(orderId)

            if (!version) {
                return res.status(404).json({
                    success: false,
                    message: '订单版本不存在'
                })
            }

            res.json({
                success: true,
                message: '获取最新订单版本成功',
                data: version
            })
        } catch (error: any) {
            console.error('获取最新订单版本失败:', error)
            res.status(500).json({
                success: false,
                message: '获取最新订单版本失败',
                error: error.message
            })
        }
    }

    /**
     * 删除订单的所有版本
     */
    async deleteOrderVersions(req: Request, res: Response) {
        try {
            const { orderId } = req.params

            await orderVersionService.deleteOrderVersions(orderId)

            res.json({
                success: true,
                message: '删除订单版本成功'
            })
        } catch (error: any) {
            console.error('删除订单版本失败:', error)
            res.status(500).json({
                success: false,
                message: '删除订单版本失败',
                error: error.message
            })
        }
    }
} 