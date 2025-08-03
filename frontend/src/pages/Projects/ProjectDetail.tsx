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
    Avatar,
    Typography,
    message,
    Spin,
    Tabs,
    Table
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

const { Title, Text } = Typography
const { TabPane } = Tabs

interface Project {
    id: string
    projectName: string
    client: string
    contact: string
    mainDesigner: string
    assistantDesigners: string[]
    relatedContracts: string[]
    relatedOrders: string[]
    relatedSettlements: string[]
    relatedInvoices: string[]
    relatedFiles: string[]
    relatedTasks: string[]
    relatedProposals: string[]
    clientRequirements: string
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold'
    startDate: string
    endDate?: string
    createdAt: string
}

interface Task {
    id: string
    taskName: string
    specification: string
    quantity: number
    urgency: 'low' | 'medium' | 'high' | 'urgent'
    orderTime: string
    designer: string
}

const ProjectDetail: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)

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

    const urgencyColors = {
        low: 'green',
        medium: 'blue',
        high: 'orange',
        urgent: 'red'
    }

    const urgencyText = {
        low: '低',
        medium: '中',
        high: '高',
        urgent: '紧急'
    }

    // 模拟任务数据
    const mockTasks: Task[] = [
        {
            id: '1',
            taskName: '首页设计',
            specification: '1920x1080px',
            quantity: 1,
            urgency: 'high',
            orderTime: '2024-01-15',
            designer: '设计师A'
        },
        {
            id: '2',
            taskName: '产品页面设计',
            specification: '1920x1080px',
            quantity: 5,
            urgency: 'medium',
            orderTime: '2024-01-16',
            designer: '设计师B'
        },
        {
            id: '3',
            taskName: '移动端适配',
            specification: '375x667px',
            quantity: 3,
            urgency: 'urgent',
            orderTime: '2024-01-17',
            designer: '设计师C'
        }
    ]

    // 模拟数据
    const mockProjects: Project[] = [
        {
            id: '1',
            projectName: '企业官网设计',
            client: 'ABC科技有限公司',
            contact: '张三',
            mainDesigner: '设计师A',
            assistantDesigners: ['设计师B', '设计师C'],
            relatedContracts: ['合同001'],
            relatedOrders: ['订单001'],
            relatedSettlements: ['结算单001'],
            relatedInvoices: ['发票001'],
            relatedFiles: ['设计稿.pdf', '需求文档.docx'],
            relatedTasks: ['任务1', '任务2', '任务3'],
            relatedProposals: ['提案001'],
            clientRequirements: '需要现代化的企业官网设计，突出公司科技感和专业性',
            status: 'in-progress',
            startDate: '2024-01-15',
            endDate: '2024-02-15',
            createdAt: '2024-01-10'
        },
        {
            id: '2',
            projectName: '品牌设计项目',
            client: 'XYZ设计工作室',
            contact: '李四',
            mainDesigner: '设计师B',
            assistantDesigners: ['设计师D'],
            relatedContracts: ['合同002'],
            relatedOrders: ['订单002'],
            relatedSettlements: ['结算单002'],
            relatedInvoices: ['发票002'],
            relatedFiles: ['品牌手册.pdf'],
            relatedTasks: ['任务4', '任务5'],
            relatedProposals: ['提案002'],
            clientRequirements: '完整的品牌视觉识别系统设计，包括logo、色彩、字体等',
            status: 'completed',
            startDate: '2024-01-01',
            endDate: '2024-01-30',
            createdAt: '2023-12-25'
        },
        {
            id: '3',
            projectName: '移动应用UI设计',
            client: '创新科技公司',
            contact: '王五',
            mainDesigner: '设计师C',
            assistantDesigners: ['设计师A'],
            relatedContracts: ['合同003'],
            relatedOrders: ['订单003'],
            relatedSettlements: ['结算单003'],
            relatedInvoices: ['发票003'],
            relatedFiles: ['UI设计稿.sketch', '原型图.fig'],
            relatedTasks: ['任务6', '任务7', '任务8'],
            relatedProposals: ['提案003'],
            clientRequirements: '设计一套现代化的移动应用UI，注重用户体验和视觉美感',
            status: 'pending',
            startDate: '2024-02-01',
            endDate: '2024-03-01',
            createdAt: '2024-01-20'
        }
    ]

    useEffect(() => {
        // 模拟API调用
        setLoading(true)
        setTimeout(() => {
            const foundProject = mockProjects.find(p => p.id === id)
            if (foundProject) {
                setProject(foundProject)
            } else {
                message.error('项目不存在')
                navigate('/projects')
            }
            setLoading(false)
        }, 500)
    }, [id, navigate])



    const handleBack = () => {
        navigate('/projects')
    }

    const taskColumns = [
        {
            title: '任务名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: 150,
        },
        {
            title: '规格',
            dataIndex: 'specification',
            key: 'specification',
            width: 120,
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80,
        },
        {
            title: '紧急度',
            dataIndex: 'urgency',
            key: 'urgency',
            width: 100,
            render: (urgency: keyof typeof urgencyColors) => (
                <Tag color={urgencyColors[urgency]}>{urgencyText[urgency]}</Tag>
            )
        },
        {
            title: '下单时间',
            dataIndex: 'orderTime',
            key: 'orderTime',
            width: 120,
        },
        {
            title: '设计师',
            dataIndex: 'designer',
            key: 'designer',
            width: 120,
            render: (designer: string) => {
                const isMainDesigner = project?.mainDesigner === designer
                const isAssistantDesigner = project?.assistantDesigners?.includes(designer)

                return (
                    <Space>
                        <span>{designer}</span>
                        {isMainDesigner && <Tag color="blue" size="small">主创</Tag>}
                        {isAssistantDesigner && <Tag color="green" size="small">助理</Tag>}
                    </Space>
                )
            }
        }
    ]

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
                    <Tag color={statusColors[project.status]} size="large">
                        {statusText[project.status]}
                    </Tag>
                </Space>

            </div>

            <Row gutter={16}>
                {/* 基本信息 */}
                <Col span={16}>
                    <Card title="基本信息" style={{ marginBottom: 16 }}>
                        <Descriptions column={2} bordered>
                            <Descriptions.Item label="客户">
                                <Text>{project.client}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="联系人">
                                <Text>{project.contact}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="主创设计师">
                                <Text>{project.mainDesigner}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="助理设计师">
                                <Text>{project.assistantDesigners?.join(', ') || '无'}</Text>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* 任务列表 */}
                    <Card title="任务列表" style={{ marginBottom: 16 }}>
                        <Table
                            columns={taskColumns}
                            dataSource={mockTasks}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            scroll={{ x: 700 }}
                        />
                    </Card>

                    {/* 选项卡 */}
                    <Card>
                        <Tabs defaultActiveKey="requirements">
                            <TabPane tab="客户嘱托" key="requirements">
                                <Text>{project.clientRequirements}</Text>
                            </TabPane>
                            <TabPane tab="项目提案" key="proposals">
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
                            </TabPane>
                            <TabPane tab="关联信息" key="related">
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
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>

                {/* 侧边栏 */}
                <Col span={8}>
                    {/* 文件选项卡 */}
                    <Card title="文件管理">
                        <Tabs defaultActiveKey="projectFiles">
                            <TabPane tab="项目文件" key="projectFiles">
                                <List
                                    size="small"
                                    dataSource={project.relatedFiles}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <FileOutlined style={{ marginRight: 8 }} />
                                            {item}
                                        </List.Item>
                                    )}
                                />
                            </TabPane>
                            <TabPane tab="客户常驻文件" key="clientFiles">
                                <List
                                    size="small"
                                    dataSource={['客户需求文档.pdf', '客户品牌手册.pdf', '客户联系方式.docx']}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <FileOutlined style={{ marginRight: 8 }} />
                                            {item}
                                        </List.Item>
                                    )}
                                />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProjectDetail 