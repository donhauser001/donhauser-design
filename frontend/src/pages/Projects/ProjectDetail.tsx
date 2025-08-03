import React, { useState, useEffect } from 'react'
import {
    Card,
    Row,
    Col,
    Tag,
    Button,
    Space,
    Descriptions,
    Divider,
    List,
    Typography,
    message,
    Spin,
    Tabs,
    Table,
    Progress,
    Tooltip,
    Modal,
    Slider,
    InputNumber,
    Select
} from 'antd'
import {
    ArrowLeftOutlined,
    UserOutlined,
    FileTextOutlined,
    DollarOutlined,
    FileOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    TeamOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { getProjectById, Project as ApiProject } from '../../api/projects'
import { getActiveEnterprises, Enterprise } from '../../api/enterprises'
import { getEmployees, User } from '../../api/users'
import { getTasksByProject, Task } from '../../api/tasks'
import SpecificationSelector, { Specification } from '../../components/SpecificationSelector'
import FileUpload from '../../components/FileUpload'
import type { UploadFile } from 'antd/es/upload/interface'

// 文件信息接口
interface FileInfo {
    path: string
    originalName: string
    size: number
}

const { Title, Text } = Typography





const ProjectDetail: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [project, setProject] = useState<ApiProject | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [enterprises, setEnterprises] = useState<Enterprise[]>([])
    const [employees, setEmployees] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
    const [progressModalVisible, setProgressModalVisible] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [editingProgress, setEditingProgress] = useState(0)
    const [editingPriority, setEditingPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')

    // 文件管理状态
    const [projectFiles, setProjectFiles] = useState<UploadFile[]>([])
    const [clientFiles, setClientFiles] = useState<UploadFile[]>([])

    const statusColors = {
        pending: 'orange',
        'in-progress': 'blue',
        completed: 'green',
        cancelled: 'red',
        'on-hold': 'purple'
    }

    const statusText = {
        pending: '待开始',
        'in-progress': '进行中',
        completed: '已完成',
        cancelled: '已取消',
        'on-hold': '暂停中'
    }







    // 获取项目详情和相关数据
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

            // 初始化文件列表
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



    const handleBack = () => {
        navigate('/projects')
    }

    // 处理规格更新
    const handleSpecificationChange = async (taskId: string, specification: Specification | undefined) => {
        try {
            setUpdatingTaskId(taskId)

            // 导入任务更新API
            const { updateTask } = await import('../../api/tasks')

            // 更新任务规格
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

            // 刷新任务列表
            await fetchProjectData()
            message.success('规格更新成功')
        } catch (error) {
            console.error('更新规格失败:', error)
            message.error('更新规格失败')
        } finally {
            setUpdatingTaskId(null)
        }
    }

    // 打开进度编辑模态框
    const handleOpenProgressModal = (task: Task) => {
        setEditingTask(task)
        setEditingProgress(task.progress || 0)
        setEditingPriority(task.priority || 'medium')
        setProgressModalVisible(true)
    }

    // 处理进度更新
    const handleProgressChange = async (taskId: string, progress: number) => {
        try {
            setUpdatingTaskId(taskId)

            // 导入任务更新API
            const { updateTaskStatus } = await import('../../api/tasks')

            // 更新任务进度
            await updateTaskStatus(taskId, 'in-progress', progress)

            // 刷新任务列表
            await fetchProjectData()
            message.success('进度更新成功')
        } catch (error) {
            console.error('更新进度失败:', error)
            message.error('更新进度失败')
        } finally {
            setUpdatingTaskId(null)
        }
    }

    // 确认进度和紧急度更新
    const handleConfirmProgress = async () => {
        if (!editingTask) return

        try {
            setUpdatingTaskId(editingTask._id)

            // 导入任务更新API
            const { updateTask } = await import('../../api/tasks')

            // 同时更新进度和紧急度
            await updateTask(editingTask._id, {
                progress: editingProgress,
                priority: editingPriority
            })

            // 刷新任务列表
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

    // 处理项目文件变化
    const handleProjectFilesChange = async (fileList: UploadFile[]) => {
        setProjectFiles(fileList)

        // 保存文件列表到项目
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

            if (files.length > 0) {
                // 更新项目文件列表
                const { updateProject } = await import('../../api/projects')
                await updateProject(project!._id, {
                    relatedFiles: files
                })

                message.success('文件列表已保存')
            }
        } catch (error) {
            console.error('保存文件列表失败:', error)
            message.error('保存文件列表失败')
        }
    }

    // 处理客户文件变化
    const handleClientFilesChange = async (fileList: UploadFile[]) => {
        setClientFiles(fileList)
    }

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
                    <Tag color={statusColors[project.status]}>
                        {statusText[project.status]}
                    </Tag>
                </Space>

            </div>

            <Row gutter={16}>
                {/* 基本信息 */}
                <Col span={20}>
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
                            columns={[
                                {
                                    title: '任务名称',
                                    dataIndex: 'taskName',
                                    key: 'taskName',
                                    width: 200,
                                },
                                {
                                    title: '规格信息',
                                    key: 'specification',
                                    width: 300,
                                    render: (_, record: Task) => {
                                        const spec = record.specification

                                        // 如果正在更新该任务，显示加载状态
                                        if (updatingTaskId === record._id) {
                                            return <Spin size="small" />
                                        }

                                        // 转换规格格式以适配 SpecificationSelector
                                        const specification: Specification | undefined = spec ? {
                                            id: spec.id,
                                            name: spec.name,
                                            length: spec.length,
                                            width: spec.width,
                                            height: spec.height,
                                            unit: spec.unit,
                                            resolution: spec.resolution
                                        } : undefined

                                        return (
                                            <SpecificationSelector
                                                value={specification}
                                                onChange={(newSpec) => handleSpecificationChange(record._id, newSpec)}
                                                placeholder="点击选择规格"
                                            />
                                        )
                                    }
                                },
                                {
                                    title: '数量',
                                    dataIndex: 'quantity',
                                    key: 'quantity',
                                    width: 100,
                                    render: (quantity: number, record: Task) => `${quantity} ${record.unit}`
                                },
                                {
                                    title: '紧急度',
                                    key: 'priority',
                                    width: 120,
                                    render: (_, record: Task) => {
                                        const priority = record.priority || 'medium'

                                        const priorityConfig = {
                                            low: { color: '#52c41a', text: '低', icon: '🟢' },
                                            medium: { color: '#faad14', text: '中', icon: '🟡' },
                                            high: { color: '#ff7a45', text: '高', icon: '🟠' },
                                            urgent: { color: '#ff4d4f', text: '紧急', icon: '🔴' }
                                        }

                                        const config = priorityConfig[priority as keyof typeof priorityConfig]

                                        return (
                                            <Tag color={config.color} style={{ margin: 0 }}>
                                                {config.icon} {config.text}
                                            </Tag>
                                        )
                                    }
                                },
                                {
                                    title: '进度',
                                    key: 'progress',
                                    width: 200,
                                    render: (_, record: Task) => {
                                        // 如果正在更新该任务，显示加载状态
                                        if (updatingTaskId === record._id) {
                                            return <Spin size="small" />
                                        }

                                        const progress = record.progress || 0
                                        const status = record.status

                                        // 根据状态和进度确定进度条颜色
                                        let strokeColor = '#1890ff'
                                        let statusText = '进行中'

                                        if (status === 'completed') {
                                            strokeColor = '#52c41a'
                                            statusText = '已完成'
                                        } else if (status === 'cancelled') {
                                            strokeColor = '#ff4d4f'
                                            statusText = '已取消'
                                        } else if (status === 'on-hold') {
                                            strokeColor = '#faad14'
                                            statusText = '暂停中'
                                        } else if (status === 'pending') {
                                            strokeColor = '#d9d9d9'
                                            statusText = '待开始'
                                        }

                                        return (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    cursor: 'pointer',
                                                    padding: '4px',
                                                    borderRadius: '4px',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#f5f5f5'
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent'
                                                }}
                                                onClick={() => handleOpenProgressModal(record)}
                                            >
                                                <Tooltip title={`点击编辑进度 - ${statusText} - ${progress}%`}>
                                                    <Progress
                                                        percent={progress}
                                                        size="small"
                                                        strokeColor={strokeColor}
                                                        showInfo={false}
                                                        style={{ flex: 1, marginRight: 8 }}
                                                    />
                                                </Tooltip>
                                                <span style={{ fontSize: '12px', color: '#666', minWidth: '35px' }}>
                                                    {progress}%
                                                </span>
                                            </div>
                                        )
                                    }
                                }
                            ]}
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
                            items={[
                                {
                                    key: 'requirements',
                                    label: '客户嘱托',
                                    children: <Text>{project.clientRequirements}</Text>
                                },
                                {
                                    key: 'proposals',
                                    label: '项目提案',
                                    children: (
                                        <List
                                            size="small"
                                            dataSource={project.relatedProposals}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <FileTextOutlined style={{ marginRight: 8 }} />
                                                    {item}
                                                </List.Item>
                                            )}
                                        />
                                    )
                                },
                                {
                                    key: 'related',
                                    label: '关联信息',
                                    children: (
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Card size="small" title="合同信息" style={{ marginBottom: 16 }}>
                                                    <List
                                                        size="small"
                                                        dataSource={project.relatedContracts}
                                                        renderItem={(item) => (
                                                            <List.Item>
                                                                <FileTextOutlined style={{ marginRight: 8 }} />
                                                                {item}
                                                            </List.Item>
                                                        )}
                                                    />
                                                </Card>
                                            </Col>
                                            <Col span={12}>
                                                <Card size="small" title="订单信息" style={{ marginBottom: 16 }}>
                                                    <List
                                                        size="small"
                                                        dataSource={project.relatedOrders}
                                                        renderItem={(item) => (
                                                            <List.Item>
                                                                <DollarOutlined style={{ marginRight: 8 }} />
                                                                {item}
                                                            </List.Item>
                                                        )}
                                                    />
                                                </Card>
                                            </Col>
                                            <Col span={12}>
                                                <Card size="small" title="结算单信息" style={{ marginBottom: 16 }}>
                                                    <List
                                                        size="small"
                                                        dataSource={project.relatedSettlements}
                                                        renderItem={(item) => (
                                                            <List.Item>
                                                                <DollarOutlined style={{ marginRight: 8 }} />
                                                                {item}
                                                            </List.Item>
                                                        )}
                                                    />
                                                </Card>
                                            </Col>
                                            <Col span={12}>
                                                <Card size="small" title="发票信息" style={{ marginBottom: 16 }}>
                                                    <List
                                                        size="small"
                                                        dataSource={project.relatedInvoices}
                                                        renderItem={(item) => (
                                                            <List.Item>
                                                                <FileTextOutlined style={{ marginRight: 8 }} />
                                                                {item}
                                                            </List.Item>
                                                        )}
                                                    />
                                                </Card>
                                            </Col>
                                        </Row>
                                    )
                                }
                            ]}
                        />
                    </Card>
                </Col>

                {/* 侧边栏 */}
                <Col span={4}>
                    {/* 文件管理 */}
                    <Card title="文件管理" style={{ marginBottom: 16 }}>
                        <Tabs
                            defaultActiveKey="projectFiles"
                            size="small"
                            items={[
                                {
                                    key: 'projectFiles',
                                    label: '项目文件',
                                    children: (
                                        <FileUpload
                                            value={projectFiles}
                                            onChange={handleProjectFilesChange}
                                            businessType="projects"
                                            subDirectory={project._id}
                                            maxCount={20}
                                            multiple={true}
                                            placeholder="上传项目相关文件"
                                            helpText="支持文档、设计稿、视频等，单个文件不超过50MB"
                                            style={{ marginBottom: 8 }}
                                        />
                                    )
                                },
                                {
                                    key: 'clientFiles',
                                    label: '客户文件',
                                    children: (
                                        <FileUpload
                                            value={clientFiles}
                                            onChange={handleClientFilesChange}
                                            businessType="clients"
                                            subDirectory={project.client}
                                            maxCount={10}
                                            multiple={true}
                                            placeholder="上传客户相关文件"
                                            helpText="支持客户需求文档、品牌手册等，单个文件不超过10MB"
                                            style={{ marginBottom: 8 }}
                                        />
                                    )
                                }
                            ]}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 进度和紧急度编辑模态框 */}
            <Modal
                title="编辑任务进度和紧急度"
                open={progressModalVisible}
                onOk={handleConfirmProgress}
                onCancel={() => {
                    setProgressModalVisible(false)
                    setEditingTask(null)
                    setEditingProgress(0)
                    setEditingPriority('medium')
                }}
                okText="确定"
                cancelText="取消"
                width={500}
            >
                {editingTask && (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>任务：</Text>
                            <Text>{editingTask.taskName}</Text>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>当前进度：</Text>
                            <Text>{editingProgress}%</Text>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>调整进度：</Text>
                            <div style={{ marginTop: 8 }}>
                                <Slider
                                    min={0}
                                    max={100}
                                    value={editingProgress}
                                    onChange={setEditingProgress}
                                    marks={{
                                        0: '0%',
                                        25: '25%',
                                        50: '50%',
                                        75: '75%',
                                        100: '100%'
                                    }}
                                />
                            </div>
                            <div style={{ marginTop: 8, textAlign: 'center' }}>
                                <InputNumber
                                    min={0}
                                    max={100}
                                    value={editingProgress}
                                    onChange={(value) => setEditingProgress(value || 0)}
                                    style={{ width: 80 }}
                                    addonAfter="%"
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>设置紧急度：</Text>
                            <div style={{ marginTop: 8 }}>
                                <Select
                                    value={editingPriority}
                                    onChange={setEditingPriority}
                                    style={{ width: '100%' }}
                                    options={[
                                        { value: 'low', label: '🟢 低' },
                                        { value: 'medium', label: '🟡 中' },
                                        { value: 'high', label: '🟠 高' },
                                        { value: 'urgent', label: '🔴 紧急' }
                                    ]}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <Progress
                                percent={editingProgress}
                                strokeColor={editingProgress === 100 ? '#52c41a' : '#1890ff'}
                                showInfo={false}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default ProjectDetail 