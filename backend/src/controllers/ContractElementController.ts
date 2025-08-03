import { Request, Response } from 'express'
import ContractElementService from '../services/ContractElementService'

class ContractElementController {
    // 获取合同元素列表
    async getList(req: Request, res: Response) {
        try {
            const { page, limit, search, type, status } = req.query

            const result = await ContractElementService.getList({
                page: page ? parseInt(page as string) : 1,
                limit: limit ? parseInt(limit as string) : 100,
                search: search as string,
                type: type as string,
                status: status as string
            })

            res.json({
                success: true,
                data: result.elements,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    pages: Math.ceil(result.total / result.limit)
                }
            })
        } catch (error) {
            console.error('获取合同元素列表失败:', error)
            res.status(500).json({
                success: false,
                message: '获取合同元素列表失败'
            })
        }
    }

    // 根据ID获取合同元素
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params

            const element = await ContractElementService.getById(id)

            if (!element) {
                return res.status(404).json({
                    success: false,
                    message: '合同元素不存在'
                })
            }

            res.json({
                success: true,
                data: element
            })
        } catch (error) {
            console.error('获取合同元素失败:', error)
            res.status(500).json({
                success: false,
                message: '获取合同元素失败'
            })
        }
    }

    // 创建合同元素
    async create(req: Request, res: Response) {
        try {
            const { name, type, description, status } = req.body

            // 验证必填字段
            if (!name || !type) {
                return res.status(400).json({
                    success: false,
                    message: '元素名称和类型为必填项'
                })
            }

            // 检查名称是否已存在
            const nameExists = await ContractElementService.isNameExists(name)
            if (nameExists) {
                return res.status(400).json({
                    success: false,
                    message: '元素名称已存在'
                })
            }

            const element = await ContractElementService.create({
                name,
                type,
                description,
                status: status || 'active',
                createdBy: req.user?.username || 'system'
            })

            // 格式化时间显示
            const formattedElement = element.toObject()
            formattedElement.createTime = element.createTime
            formattedElement.updateTime = element.updateTime

            res.status(201).json({
                success: true,
                data: formattedElement,
                message: '合同元素创建成功'
            })
        } catch (error) {
            console.error('创建合同元素失败:', error)
            res.status(500).json({
                success: false,
                message: '创建合同元素失败'
            })
        }
    }

    // 更新合同元素
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { name, type, description, status } = req.body

            // 检查元素是否存在
            const existingElement = await ContractElementService.getById(id)
            if (!existingElement) {
                return res.status(404).json({
                    success: false,
                    message: '合同元素不存在'
                })
            }

            // 如果更新名称，检查是否重复
            if (name && name !== existingElement.name) {
                const nameExists = await ContractElementService.isNameExists(name, id)
                if (nameExists) {
                    return res.status(400).json({
                        success: false,
                        message: '元素名称已存在'
                    })
                }
            }

            const updatedElement = await ContractElementService.update(id, {
                name,
                type,
                description,
                status
            })

            // 格式化时间显示
            const formattedElement = updatedElement?.toObject()
            if (formattedElement) {
                formattedElement.createTime = updatedElement.createTime
                formattedElement.updateTime = updatedElement.updateTime
            }

            res.json({
                success: true,
                data: formattedElement,
                message: '合同元素更新成功'
            })
        } catch (error) {
            console.error('更新合同元素失败:', error)
            res.status(500).json({
                success: false,
                message: '更新合同元素失败'
            })
        }
    }

    // 删除合同元素
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params

            // 检查元素是否存在
            const existingElement = await ContractElementService.getById(id)
            if (!existingElement) {
                return res.status(404).json({
                    success: false,
                    message: '合同元素不存在'
                })
            }

            const deleted = await ContractElementService.delete(id)

            if (deleted) {
                res.json({
                    success: true,
                    message: '合同元素删除成功'
                })
            } else {
                res.status(500).json({
                    success: false,
                    message: '删除失败'
                })
            }
        } catch (error) {
            console.error('删除合同元素失败:', error)
            res.status(500).json({
                success: false,
                message: '删除合同元素失败'
            })
        }
    }

    // 获取所有启用的合同元素
    async getActiveElements(req: Request, res: Response) {
        try {
            const elements = await ContractElementService.getActiveElements()

            res.json({
                success: true,
                data: elements
            })
        } catch (error) {
            console.error('获取启用合同元素失败:', error)
            res.status(500).json({
                success: false,
                message: '获取启用合同元素失败'
            })
        }
    }
}

export default new ContractElementController() 