import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Antd 组件导入
import {
    Card,
    Row,
    Col,
    Tag,
    Button,
    Space,
    Descriptions,
    Typography,
    message,
    Spin,
    Tabs,
    Table
} from 'antd'

// Antd 图标导入
import { ArrowLeftOutlined } from '@ant-design/icons'

// 类型导入
import type { UploadFile } from 'antd/es/upload/interface'

// API 导入
import { getProjectById, Project as ApiProject } from '../../../api/projects'
import { getActiveEnterprises, Enterprise } from '../../../api/enterprises'
import { getEmployees, User } from '../../../api/users'
import { getTasksByProject, Task } from '../../../api/tasks'
import { getClients, Client } from '../../../api/clients'
import { Specification } from '../../../components/SpecificationSelector'

// 本地模块导入
import { FileInfo, Priority } from './types'
import { STATUS_COLORS, STATUS_TEXT } from './constants'
import { createTableColumns } from './tableColumns'
import { createMainTabsItems, createFileTabsItems } from './tabConfigs'

import { ProgressModal } from './ProgressModal'

const { Title, Text } = Typography

const ProjectDetail: React.FC = () => {
    // ==================== 状态管理 ====================

    // 基础数据状态
    const [project, setProject] = useState<ApiProject | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [enterprises, setEnterprises] = useState<Enterprise[]>([])
    const [employees, setEmployees] = useState<User[]>([])

    // UI 状态
    const [loading, setLoading] = useState(true)
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
    const [progressModalVisible, setProgressModalVisible] = useState(false)

    // 编辑状态
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [editingProgress, setEditingProgress] = useState(0)
    const [editingPriority, setEditingPriority] = useState<Priority>('medium')

    // 文件管理状态
    const [projectFiles, setProjectFiles] = useState<UploadFile[]>([])
    const [clientFiles, setClientFiles] = useState<UploadFile[]>([])

    // ==================== 路由参数 ====================

    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()

    // ==================== 数据获取 ====================

    const fetchProjectData = async () => {
        if (!id) return

        try {
            setLoading(true)
            const [projectResponse, tasksResponse, enterprisesResponse, employeesResponse] = await Promise.all([
                getProjectById(id),
                getTasksByProject(id),
                getActiveEnterprises(),
                getEmployees()
            ])

            setProject(projectResponse.data)
            setTasks(tasksResponse.data)
            setEnterprises(enterprisesResponse.data)
            setEmployees(employeesResponse.data)

            // 初始化项目文件列表
            if (projectResponse.data.relatedFiles && Array.isArray(projectResponse.data.relatedFiles)) {
                const files = projectResponse.data.relatedFiles.map((file: FileInfo, index: number) => ({
                    uid: `project-file-${Date.now()}-${index}`,
                    name: file.originalName,
                    status: 'done' as const,
                    url: file.path,
                    size: file.size,
                    type: file.path.split('.').pop()?.toLowerCase() || '',
                    response: {
                        data: {
                            url: file.path,
                            originalname: file.originalName,
                            size: file.size
                        }
                    }
                }))
                setProjectFiles(files)
            } else {
                setProjectFiles([])
            }

            // 初始化客户文件列表 - 从客户API获取真实的客户文件数据
            if (projectResponse.data.client) {
                try {
                    const clientsResponse = await getClients()

                    if (clientsResponse.success && clientsResponse.data) {
                        const client = clientsResponse.data.find((c: Client) => c.name === projectResponse.data.client)

                        if (client && client.files && Array.isArray(client.files)) {
                            const clientFiles = client.files.map((file: { path: string; originalName: string; size: number }, index: number) => ({
                                uid: `client-file-${index}-${Date.now()}`,
                                name: file.originalName,
                                status: 'done' as const,
                                url: file.path,
                                size: file.size,
                                type: file.path.split('.').pop()?.toLowerCase() || '',
                                response: {
                                    data: {
                                        url: file.path,
                                        originalname: file.originalName,
                                        size: file.size
                                    }
                                }
                            }))
                            setClientFiles(clientFiles)
                        } else {
                            setClientFiles([])
                        }
                    } else {
                        setClientFiles([])
                    }
                } catch (error) {
                    console.error('获取客户文件失败:', error)
                    setClientFiles([])
                }
            } else {
                setClientFiles([])
            }
        } catch (error) {
            console.error('获取项目详情失败:', error)
            message.error('项目不存在或获取失败')
            navigate('/projects')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjectData()
    }, [id])

    // ==================== 事件处理函数 ====================

    const handleBack = () => {
        navigate('/projects')
    }

    const handleSpecificationChange = async (taskId: string, specification: Specification | undefined) => {
        try {
            setUpdatingTaskId(taskId)

            const { updateTask } = await import('../../../api/tasks')

            await updateTask(taskId, {
                specification: specification ? {
                    id: specification.id,
                    name: specification.name,
                    length: specification.length,
                    width: specification.width,
                    height: specification.height,
                    unit: specification.unit,
                    resolution: specification.resolution
                } : undefined
            })

            await fetchProjectData()
            message.success('规格更新成功')
        } catch (error) {
            console.error('更新规格失败:', error)
            message.error('更新规格失败')
        } finally {
            setUpdatingTaskId(null)
        }
    }

    const handleOpenProgressModal = (task: Task) => {
        setEditingTask(task)
        setEditingProgress(task.progress || 0)
        setEditingPriority(task.priority || 'medium')
        setProgressModalVisible(true)
    }



    const handleConfirmProgress = async () => {
        if (!editingTask) return

        try {
            setUpdatingTaskId(editingTask._id)

            const { updateTask } = await import('../../../api/tasks')

            await updateTask(editingTask._id, {
                progress: editingProgress,
                priority: editingPriority
            })

            await fetchProjectData()
            message.success('更新成功')

            setProgressModalVisible(false)
            setEditingTask(null)
            setEditingProgress(0)
            setEditingPriority('medium')
        } catch (error) {
            console.error('更新失败:', error)
            message.error('更新失败')
        } finally {
            setUpdatingTaskId(null)
        }
    }

    const handleProjectFilesChange = async (fileList: UploadFile[]) => {
        setProjectFiles(fileList)

        try {
            const files = fileList
                .filter(file => file.status === 'done')
                .map(file => {
                    const fileInfo: FileInfo = {
                        path: file.response?.data?.url || file.url || '',
                        originalName: file.name || '未知文件',
                        size: file.size || 0
                    }
                    return fileInfo
                })
                .filter(file => file.path !== '')

            // 无论文件列表是否为空，都要更新数据库
            const { updateProject } = await import('../../../api/projects')
            await updateProject(project!._id, {
                relatedFiles: files
            })
        } catch (error) {
            console.error('保存文件列表失败:', error)
            message.error('保存文件列表失败')
        }
    }

    // ==================== 表格列定义 ====================

    const tableColumns = createTableColumns({
        updatingTaskId,
        onSpecificationChange: handleSpecificationChange,
        onOpenProgressModal: handleOpenProgressModal
    })

    // ==================== 选项卡配置 ====================

    const mainTabsItems = createMainTabsItems(project)
    const fileTabsItems = createFileTabsItems({
        project,
        projectFiles,
        clientFiles,
        onProjectFilesChange: handleProjectFilesChange
    })

    // ==================== 加载状态 ====================

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>加载中...</div>
            </div>
        )
    }

    if (!project) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Text type="secondary">项目不存在</Text>
            </div>
        )
    }

    // ==================== 主渲染 ====================

    return (
        <div>
            {/* 页面头部 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                        返回
                    </Button>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                            {project.projectName}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            创建时间: {project.createdAt}
                        </Text>
                    </div>
                    <Tag color={STATUS_COLORS[project.status]}>
                        {STATUS_TEXT[project.status]}
                    </Tag>
                </Space>
            </div>

            <Row gutter={16}>
                {/* 主要内容区域 */}
                <Col span={18}>
                    {/* 基本信息 */}
                    <Card title="基本信息" style={{ marginBottom: 16 }}>
                        <Descriptions column={2} bordered>
                            <Descriptions.Item label="客户">
                                <Text>{project.client}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="联系人">
                                <Text>{project.contact}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="团队">
                                <Text>{(() => {
                                    const team = enterprises.find(enterprise => enterprise.id === project.team)
                                    return team ? team.enterpriseName : '未选择'
                                })()}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="主创设计师">
                                <Text>{(() => {
                                    const mainDesigners = employees.filter(emp => project.mainDesigner?.includes(emp._id))
                                    return mainDesigners.length > 0
                                        ? mainDesigners.map(emp => emp.realName).join(', ')
                                        : '未选择'
                                })()}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="助理设计师">
                                <Text>{(() => {
                                    const assistantDesigners = employees.filter(emp => project.assistantDesigners?.includes(emp._id))
                                    return assistantDesigners.length > 0
                                        ? assistantDesigners.map(emp => emp.realName).join(', ')
                                        : '无'
                                })()}</Text>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* 任务列表 */}
                    <Card title="任务列表" style={{ marginBottom: 16 }}>
                        <Table
                            columns={tableColumns}
                            dataSource={tasks}
                            rowKey="_id"
                            pagination={false}
                            size="small"
                            scroll={{ x: 800 }}
                        />
                    </Card>

                    {/* 选项卡 */}
                    <Card>
                        <Tabs
                            defaultActiveKey="requirements"
                            items={mainTabsItems}
                        />
                    </Card>
                </Col>

                {/* 文件管理区域 */}
                <Col span={6}>
                    {/* 文件管理 */}
                    <Card title="文件管理" style={{ marginBottom: 16 }}>
                        <Tabs
                            defaultActiveKey="projectFiles"
                            size="small"
                            items={fileTabsItems}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 进度编辑模态框 */}
            <ProgressModal
                visible={progressModalVisible}
                editingTask={editingTask}
                editingProgress={editingProgress}
                editingPriority={editingPriority}
                updatingTaskId={updatingTaskId}
                onOk={handleConfirmProgress}
                onCancel={() => {
                    setProgressModalVisible(false)
                    setEditingTask(null)
                    setEditingProgress(0)
                    setEditingPriority('medium')
                }}
                onProgressChange={setEditingProgress}
                onPriorityChange={setEditingPriority}
            />
        </div>
    )
}

export default ProjectDetail 