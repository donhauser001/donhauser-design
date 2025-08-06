import React, { useState, useEffect } from 'react';
import {
    Card,
    Descriptions,
    Tag,
    Button,
    Space,
    message,
    Row,
    Col,
    Statistic,
    Divider,
    List,
    Avatar,
    Tabs,
    Table,
    Modal,
    Select,
    Dropdown,
    Menu,
    Tooltip
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    UserOutlined,
    TeamOutlined,
    FileTextOutlined,
    DollarOutlined,
    SettingOutlined,
    PauseCircleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CreditCardOutlined,
    WalletOutlined,
    CheckOutlined,
    CrownOutlined,
    FireOutlined,
    ThunderboltOutlined,
    SmileOutlined,
    MailOutlined,
    PauseOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import SpecificationSelector from '../../components/SpecificationSelector';

interface Project {
    _id: string;
    projectName: string;
    clientName: string;
    undertakingTeam: string;
    undertakingTeamName?: string;
    progressStatus: 'consulting' | 'in-progress' | 'partial-delivery' | 'completed' | 'on-hold' | 'cancelled';
    settlementStatus: 'unpaid' | 'prepaid' | 'partial-paid' | 'fully-paid';
    createdAt: string;
    startedAt?: string;
    deliveredAt?: string;
    settledAt?: string;
    mainDesigners: string[];
    mainDesignerNames?: string[];
    assistantDesigners: string[];
    assistantDesignerNames?: string[];
    taskIds: string[];
    contactNames: string[];
    contactPhones: string[];
    clientRequirements?: string;
    remark?: string;
}

interface Task {
    _id: string;
    taskName: string;
    projectId: string;
    serviceId: string;
    mainDesigners: string[];
    mainDesignerNames?: string[];
    assistantDesigners: string[];
    assistantDesignerNames?: string[];
    specificationId?: string;
    specification?: {
        id: string;
        name: string;
        length: number;
        width: number;
        height?: number;
        unit: string;
        resolution?: string;
    };
    quantity: number;
    unit: string;
    subtotal: number;
    pricingPolicies: Array<{
        policyId: string;
        policyName: string;
        policyType: 'uniform_discount' | 'tiered_discount';
        discountRatio: number;
        calculationDetails: string;
    }>;
    billingDescription: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
    priority: 'low' | 'medium' | 'high' | 'urgent' | 'waiting' | 'on-hold' | 'completed';
    processStepId?: string;
    processStepName?: string;
    processSteps?: Array<{
        id: string;
        name: string;
        description: string;
        order: number;
        progressRatio: number;
    }>;
    currentProcessStep?: {
        id: string;
        name: string;
        description: string;
        order: number;
        progressRatio: number;
    };
    progress: number;
    startDate?: string;
    dueDate?: string;
    completedDate?: string;
    settlementStatus: 'unpaid' | 'prepaid' | 'draft-paid' | 'fully-paid' | 'cancelled';
    settlementTime?: string;
    remarks?: string;
    attachmentIds: string[];
    proposalId?: string;
    createdAt: string;
    updatedAt: string;
}

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [selectedMainDesigners, setSelectedMainDesigners] = useState<string[]>([]);
    const [selectedAssistantDesigners, setSelectedAssistantDesigners] = useState<string[]>([]);
    const [assignLoading, setAssignLoading] = useState(false);
    const [priorityLoading, setPriorityLoading] = useState(false);

    // 获取项目详情
    const fetchProject = async () => {
        if (!id) return;

        try {
            const response = await fetch(`/api/projects/${id}`);
            const data = await response.json();

            if (data.success) {
                setProject(data.data);
            } else {
                message.error('获取项目详情失败');
            }
        } catch (error) {
            console.error('获取项目详情失败:', error);
            message.error('获取项目详情失败');
        }
    };

    // 获取项目任务
    const fetchTasks = async () => {
        if (!id) return;

        try {
            const response = await fetch(`/api/tasks/project/${id}`);
            const data = await response.json();

            if (data.success) {
                setTasks(data.data);
            }
        } catch (error) {
            console.error('获取项目任务失败:', error);
        }
    };

    // 获取员工和管理员用户
    const fetchAvailableUsers = async () => {
        try {
            const response = await fetch('/api/users/employees-admins');
            const data = await response.json();

            if (data.success) {
                setAvailableUsers(data.data);
            }
        } catch (error) {
            console.error('获取用户列表失败:', error);
            message.error('获取用户列表失败');
        }
    };

    // 打开分配设计师模态窗
    const handleAssignDesigners = (task: Task) => {
        setCurrentTask(task);
        setSelectedMainDesigners(task.mainDesigners || []);
        setSelectedAssistantDesigners(task.assistantDesigners || []);
        setAssignModalVisible(true);
        fetchAvailableUsers();
    };

    // 确认分配设计师
    const handleConfirmAssign = async () => {
        if (!currentTask) return;

        setAssignLoading(true);
        try {
            const response = await fetch(`/api/tasks/${currentTask._id}/assign`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mainDesignerIds: selectedMainDesigners,
                    assistantDesignerIds: selectedAssistantDesigners
                })
            });

            const data = await response.json();

            if (data.success) {
                message.success('设计师分配成功');
                setAssignModalVisible(false);
                fetchTasks(); // 重新获取任务列表
            } else {
                message.error(data.message || '设计师分配失败');
            }
        } catch (error) {
            console.error('分配设计师失败:', error);
            message.error('分配设计师失败');
        } finally {
            setAssignLoading(false);
        }
    };

    // 选择紧急度
    const handlePrioritySelect = async (task: Task, priority: string) => {
        setPriorityLoading(true);
        try {
            const response = await fetch(`/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priority: priority
                })
            });

            const data = await response.json();

            if (data.success) {
                message.success('紧急度修改成功');
                fetchTasks(); // 重新获取任务列表
            } else {
                message.error(data.message || '紧急度修改失败');
            }
        } catch (error) {
            console.error('修改紧急度失败:', error);
            message.error('修改紧急度失败');
        } finally {
            setPriorityLoading(false);
        }
    };

    // 处理规格变更
    const handleSpecificationChange = async (task: Task, specification: any) => {
        try {
            const response = await fetch(`/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    specificationId: specification?.id || null
                })
            });

            const data = await response.json();

            if (data.success) {
                message.success('规格修改成功');
                fetchTasks(); // 重新获取任务列表
            } else {
                message.error(data.message || '规格修改失败');
            }
        } catch (error) {
            console.error('修改规格失败:', error);
            message.error('修改规格失败');
        }
    };

    // 处理流程状态变更
    const handleProcessStepChange = async (task: Task, stepId: string) => {
        try {
            const response = await fetch(`/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    processStepId: stepId
                })
            });

            const data = await response.json();

            if (data.success) {
                message.success('流程状态修改成功');
                fetchTasks(); // 重新获取任务列表
            } else {
                message.error(data.message || '流程状态修改失败');
            }
        } catch (error) {
            console.error('修改流程状态失败:', error);
            message.error('修改流程状态失败');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchProject(), fetchTasks()]);
            setLoading(false);
        };
        loadData();
    }, [id]);

    // 状态标签颜色映射
    const getProgressStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'consulting': 'blue',
            'in-progress': 'processing',
            'partial-delivery': 'orange',
            'completed': 'success',
            'on-hold': 'warning',
            'cancelled': 'error'
        };
        return colors[status] || 'default';
    };

    const getSettlementStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'unpaid': 'error',
            'prepaid': 'warning',
            'partial-paid': 'orange',
            'fully-paid': 'success'
        };
        return colors[status] || 'default';
    };

    // 状态文本映射
    const getProgressStatusText = (status: string) => {
        const texts: Record<string, string> = {
            'consulting': '咨询中',
            'in-progress': '进行中',
            'partial-delivery': '部分交付',
            'completed': '已完成',
            'on-hold': '暂停',
            'cancelled': '已取消'
        };
        return texts[status] || status;
    };

    const getSettlementStatusText = (status: string) => {
        const texts: Record<string, string> = {
            'unpaid': '未付款',
            'prepaid': '预付款',
            'draft-paid': '草稿付款',
            'fully-paid': '已付清',
            'cancelled': '已取消'
        };
        return texts[status] || status;
    };

    // 任务状态文本映射
    const getTaskStatusText = (status: string) => {
        const texts: Record<string, string> = {
            'pending': '待处理',
            'in-progress': '进行中',
            'completed': '已完成',
            'cancelled': '已取消',
            'on-hold': '暂停'
        };
        return texts[status] || status;
    };

    // 任务状态颜色映射
    const getTaskStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'pending': 'default',
            'in-progress': 'processing',
            'completed': 'success',
            'cancelled': 'error',
            'on-hold': 'warning'
        };
        return colors[status] || 'default';
    };

    // 优先级文本映射
    const getPriorityText = (priority: string) => {
        const texts: Record<string, string> = {
            'low': '不太着急',
            'medium': '正常进行',
            'high': '尽快完成',
            'urgent': '十万火急',
            'waiting': '等待反馈',
            'on-hold': '暂时搁置',
            'completed': '完工大吉'
        };
        return texts[priority] || priority;
    };

    // 优先级颜色映射
    const getPriorityColor = (priority: string) => {
        const colors: Record<string, string> = {
            'low': 'cyan',
            'medium': 'blue',
            'high': 'orange',
            'urgent': 'red',
            'waiting': 'purple',
            'on-hold': 'default',
            'completed': 'green'
        };
        return colors[priority] || 'default';
    };

    // 优先级图标映射
    const getPriorityIcon = (priority: string) => {
        const icons: Record<string, React.ReactNode> = {
            'urgent': <FireOutlined />,
            'high': <ThunderboltOutlined />,
            'medium': <ClockCircleOutlined />,
            'low': <SmileOutlined />,
            'waiting': <MailOutlined />,
            'on-hold': <PauseOutlined />,
            'completed': <CheckCircleOutlined />
        };
        return icons[priority] || null;
    };

    if (loading) {
        return <div style={{ padding: '24px' }}>加载中...</div>;
    }

    if (!project) {
        return <div style={{ padding: '24px' }}>项目不存在</div>;
    }

    const totalAmount = tasks.reduce((sum, task) => sum + task.subtotal, 0);

    return (
        <div style={{ padding: '24px' }}>
            {/* 页面头部 */}
            <Card
                title={
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/projects')}
                        >
                            返回
                        </Button>
                        <span>
                            {project.projectName}
                            <Space style={{ marginLeft: 8 }}>
                                <Tag color={getProgressStatusColor(project.progressStatus)}>
                                    {getProgressStatusText(project.progressStatus)}
                                    {project.progressStatus === 'consulting' && (
                                        <FileTextOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                                    )}
                                    {project.progressStatus === 'in-progress' && (
                                        <SettingOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                                    )}
                                    {project.progressStatus === 'partial-delivery' && (
                                        <ClockCircleOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                                    )}
                                    {project.progressStatus === 'completed' && (
                                        <CheckCircleOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                                    )}
                                    {project.progressStatus === 'on-hold' && (
                                        <PauseCircleOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                                    )}
                                    {project.progressStatus === 'cancelled' && (
                                        <CloseCircleOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                                    )}
                                </Tag>
                                <Tag color={getSettlementStatusColor(project.settlementStatus)}>
                                    {getSettlementStatusText(project.settlementStatus)}
                                    {project.settlementStatus === 'unpaid' && (
                                        <DollarOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                                    )}
                                    {project.settlementStatus === 'prepaid' && (
                                        <CreditCardOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                                    )}
                                    {project.settlementStatus === 'partial-paid' && (
                                        <WalletOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                                    )}
                                    {project.settlementStatus === 'fully-paid' && (
                                        <CheckOutlined style={{ marginLeft: '4px', fontSize: '12px' }} />
                                    )}
                                </Tag>
                            </Space>
                        </span>
                    </Space>
                }
                extra={
                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/projects/${id}/edit`)}
                        >
                            编辑项目
                        </Button>
                    </Space>
                }
            >
                {/* 项目统计 */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                        <Statistic
                            title="任务总数"
                            value={tasks.length}
                            prefix={<FileTextOutlined />}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="项目金额"
                            value={totalAmount}
                            prefix="¥"
                            precision={2}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="完成进度"
                            value={tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0}
                            suffix="%"
                            precision={1}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="团队成员"
                            value={project.mainDesigners.length + project.assistantDesigners.length}
                            prefix={<TeamOutlined />}
                        />
                    </Col>
                </Row>

                <Row gutter={24}>
                    {/* 左侧：项目信息 */}
                    <Col span={19}>
                        {/* 基本信息 */}
                        <Card title="基本信息" style={{ marginBottom: 16 }}>
                            <Descriptions column={2}>
                                <Descriptions.Item label="项目名称">{project.projectName}</Descriptions.Item>
                                <Descriptions.Item label="客户名称">
                                    {project.clientName}
                                    {project.contactNames && project.contactNames.length > 0 && (
                                        <span style={{ color: '#666', marginLeft: '8px' }}>
                                            - {(() => {
                                                // 处理可能的数据格式：单个字符串或数组
                                                let names: string[] = [];
                                                let phones: string[] = [];

                                                if (Array.isArray(project.contactNames)) {
                                                    // 如果是数组，检查第一个元素是否包含逗号
                                                    if (project.contactNames.length > 0 && project.contactNames[0].includes(',')) {
                                                        names = project.contactNames[0].split(',').map(n => n.trim());
                                                    } else {
                                                        names = project.contactNames;
                                                    }
                                                }

                                                if (Array.isArray(project.contactPhones)) {
                                                    // 如果是数组，检查第一个元素是否包含逗号
                                                    if (project.contactPhones.length > 0 && project.contactPhones[0].includes(',')) {
                                                        phones = project.contactPhones[0].split(',').map(p => p.trim());
                                                    } else {
                                                        phones = project.contactPhones;
                                                    }
                                                }

                                                return names.map((name, index) => {
                                                    const phone = phones[index];
                                                    return (
                                                        <span key={index}>
                                                            {name}
                                                            {phone && (
                                                                <span style={{ color: '#999' }}> {phone}</span>
                                                            )}
                                                            {index < names.length - 1 && '，'}
                                                        </span>
                                                    );
                                                });
                                            })()}
                                        </span>
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="承接团队">{project.undertakingTeamName || project.undertakingTeam}</Descriptions.Item>
                                <Descriptions.Item label="创建时间">{dayjs(project.createdAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
                                <Descriptions.Item label="主创设计师">
                                    {(project.mainDesignerNames || project.mainDesigners).join('，')}
                                </Descriptions.Item>
                                <Descriptions.Item label="助理设计师">
                                    {(project.assistantDesignerNames || project.assistantDesigners).join('，')}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>



                        {/* 任务列表 */}
                        <Card title="任务列表" style={{ marginBottom: 16 }}>
                            <Table
                                dataSource={tasks.slice(0, 5)}
                                pagination={false}
                                size="small"
                                rowKey="_id"
                                columns={[
                                    {
                                        title: '任务名称',
                                        dataIndex: 'taskName',
                                        key: 'taskName',
                                        width: 150,
                                        render: (text: string, record: Task) => (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span>{text}</span>
                                            </div>
                                        )
                                    },
                                    {
                                        title: '状态',
                                        key: 'status',
                                        width: 120,
                                        render: (_, record: Task) => {
                                            if (record.processSteps && record.processSteps.length > 0) {
                                                const menu = (
                                                    <Menu
                                                        onClick={({ key }) => handleProcessStepChange(record, key)}
                                                        items={record.processSteps.map(step => ({
                                                            key: step.id,
                                                            label: (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <span>{step.name}</span>
                                                                    {step.progressRatio > 0 && (
                                                                        <span style={{ fontSize: '10px', color: '#8c8c8c' }}>
                                                                            ({step.progressRatio}%)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )
                                                        }))}
                                                    />
                                                );

                                                return (
                                                    <Dropdown overlay={menu} trigger={['click']}>
                                                        <Tag
                                                            color={record.currentProcessStep ? 'blue' : 'default'}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {record.currentProcessStep?.name || '未设置'}
                                                        </Tag>
                                                    </Dropdown>
                                                );
                                            }

                                            // 如果没有流程信息，显示原来的状态
                                            return (
                                                <Tag color={getTaskStatusColor(record.status)}>
                                                    {getTaskStatusText(record.status)}
                                                </Tag>
                                            );
                                        }
                                    },
                                    {
                                        title: '规格',
                                        key: 'specification',
                                        width: 120,
                                        render: (_, record: Task) => (
                                            <SpecificationSelector
                                                value={record.specification}
                                                onChange={(specification) => handleSpecificationChange(record, specification)}
                                                placeholder="选择规格"
                                            />
                                        )
                                    },
                                    {
                                        title: '紧急度',
                                        key: 'priority',
                                        width: 80,
                                        render: (_, record: Task) => {
                                            const menu = (
                                                <Menu
                                                    onClick={({ key }) => handlePrioritySelect(record, key)}
                                                    items={[
                                                        {
                                                            key: 'urgent',
                                                            label: (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <FireOutlined style={{ color: '#ff4500' }} />
                                                                    <span>十万火急</span>
                                                                </div>
                                                            )
                                                        },
                                                        {
                                                            key: 'high',
                                                            label: (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <ThunderboltOutlined style={{ color: '#ffa500' }} />
                                                                    <span>尽快完成</span>
                                                                </div>
                                                            )
                                                        },
                                                        {
                                                            key: 'medium',
                                                            label: (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <ClockCircleOutlined style={{ color: '#2c65da' }} />
                                                                    <span>正常进行</span>
                                                                </div>
                                                            )
                                                        },
                                                        {
                                                            key: 'low',
                                                            label: (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <SmileOutlined style={{ color: '#159ebb' }} />
                                                                    <span>不太着急</span>
                                                                </div>
                                                            )
                                                        },
                                                        {
                                                            key: 'waiting',
                                                            label: (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <MailOutlined style={{ color: '#9370db' }} />
                                                                    <span>等待反馈</span>
                                                                </div>
                                                            )
                                                        },
                                                        {
                                                            key: 'on-hold',
                                                            label: (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <PauseOutlined style={{ color: '#808080' }} />
                                                                    <span>暂时搁置</span>
                                                                </div>
                                                            )
                                                        },
                                                        {
                                                            key: 'completed',
                                                            label: (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <CheckCircleOutlined style={{ color: '#f35c43' }} />
                                                                    <span>完工大吉</span>
                                                                </div>
                                                            )
                                                        }
                                                    ]}
                                                />
                                            );

                                            return (
                                                <Dropdown overlay={menu} trigger={['click']}>
                                                    <Tag
                                                        color={getPriorityColor(record.priority)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <Space size={4}>
                                                            {getPriorityIcon(record.priority)}
                                                            {getPriorityText(record.priority)}
                                                        </Space>
                                                    </Tag>
                                                </Dropdown>
                                            );
                                        }
                                    },

                                    {
                                        title: '数量',
                                        key: 'quantity',
                                        width: 80,
                                        render: (_, record: Task) => `${record.quantity}${record.unit}`
                                    },
                                    {
                                        title: '进度',
                                        key: 'progress',
                                        width: 80,
                                        render: (_, record: Task) => `${record.progress}%`
                                    },
                                    {
                                        title: '截止日期',
                                        key: 'dueDate',
                                        width: 100,
                                        render: (_, record: Task) =>
                                            record.dueDate ? dayjs(record.dueDate).format('MM-DD') : '-'
                                    },
                                    {
                                        title: '设计师',
                                        key: 'designers',
                                        width: 200,
                                        render: (_, record: Task) => {
                                            const hasMainDesigners = record.mainDesignerNames && record.mainDesignerNames.length > 0;
                                            const hasAssistantDesigners = record.assistantDesignerNames && record.assistantDesignerNames.length > 0;
                                            const hasAnyDesigners = hasMainDesigners || hasAssistantDesigners;

                                            return (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        position: 'relative'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        const target = e.currentTarget;
                                                        const editIcon = target.querySelector('.edit-icon') as HTMLElement;
                                                        if (editIcon) {
                                                            editIcon.style.opacity = '1';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        const target = e.currentTarget;
                                                        const editIcon = target.querySelector('.edit-icon') as HTMLElement;
                                                        if (editIcon) {
                                                            editIcon.style.opacity = '0';
                                                        }
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {hasMainDesigners && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <div style={{
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: '#1890ff',
                                                                    flexShrink: 0
                                                                }} />
                                                                <span>
                                                                    {record.mainDesignerNames!.join('，')}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {hasAssistantDesigners && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <div style={{
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: '#8c8c8c',
                                                                    flexShrink: 0
                                                                }} />
                                                                <span>
                                                                    {record.assistantDesignerNames!.join('，')}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {!hasAnyDesigners && (
                                                            <Button
                                                                type="primary"
                                                                size="small"
                                                                onClick={() => handleAssignDesigners(record)}
                                                            >
                                                                指定
                                                            </Button>
                                                        )}
                                                    </div>
                                                    {hasAnyDesigners && (
                                                        <EditOutlined
                                                            className="edit-icon"
                                                            onClick={() => handleAssignDesigners(record)}
                                                            style={{
                                                                opacity: 0,
                                                                transition: 'opacity 0.2s',
                                                                cursor: 'pointer',
                                                                color: '#1890ff',
                                                                fontSize: '14px',
                                                                marginLeft: '8px'
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        }
                                    },
                                    {
                                        title: '金额',
                                        key: 'amount',
                                        width: 120,
                                        render: (_, record: Task) => (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>¥{record.subtotal.toFixed(2)}</span>
                                                <Tooltip title={getSettlementStatusText(record.settlementStatus)}>
                                                    {record.settlementStatus === 'unpaid' && <WalletOutlined style={{ color: '#ff4d4f' }} />}
                                                    {record.settlementStatus === 'prepaid' && <CreditCardOutlined style={{ color: '#faad14' }} />}
                                                    {record.settlementStatus === 'draft-paid' && <DollarOutlined style={{ color: '#1890ff' }} />}
                                                    {record.settlementStatus === 'fully-paid' && <CheckOutlined style={{ color: '#52c41a' }} />}
                                                    {record.settlementStatus === 'cancelled' && <CloseCircleOutlined style={{ color: '#8c8c8c' }} />}
                                                </Tooltip>
                                            </div>
                                        )
                                    }
                                ]}
                            />
                            {tasks.length > 5 && (
                                <div style={{ textAlign: 'center', marginTop: 8 }}>
                                    <Button type="link" onClick={() => navigate(`/projects/${id}/tasks`)}>
                                        查看全部任务 ({tasks.length})
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </Col>

                    {/* 右侧：客户嘱托和备注 */}
                    <Col span={5}>

                        {/* 客户嘱托和备注选项卡 */}
                        {(project.clientRequirements || project.remark) && (
                            <Card title="项目详情" style={{ marginBottom: 16 }}>
                                <Tabs
                                    size="small"
                                    items={[
                                        ...(project.clientRequirements ? [{
                                            key: 'requirements',
                                            label: '客户嘱托',
                                            children: <p>{project.clientRequirements}</p>
                                        }] : []),
                                        ...(project.remark ? [{
                                            key: 'remark',
                                            label: '备注',
                                            children: <p>{project.remark}</p>
                                        }] : [])
                                    ]}
                                />
                            </Card>
                        )}
                    </Col>
                </Row>
            </Card>

            {/* 分配设计师模态窗 */}
            <Modal
                title={`分配设计师 - ${currentTask?.taskName}`}
                open={assignModalVisible}
                onOk={handleConfirmAssign}
                onCancel={() => setAssignModalVisible(false)}
                confirmLoading={assignLoading}
                width={500}
            >
                <div style={{ marginBottom: 16 }}>
                    <p>请选择要分配给此任务的设计师：</p>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <p style={{ marginBottom: 8, fontWeight: 'bold' }}>主创设计师：</p>
                    <Select
                        mode="multiple"
                        placeholder="请选择主创设计师"
                        value={selectedMainDesigners}
                        onChange={setSelectedMainDesigners}
                        style={{ width: '100%', marginBottom: 16 }}
                        optionFilterProp="children"
                        showSearch
                    >
                        {availableUsers.map(user => (
                            <Select.Option key={user._id} value={user._id}>
                                {user.realName || user.username}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <p style={{ marginBottom: 8, fontWeight: 'bold' }}>助理设计师：</p>
                    <Select
                        mode="multiple"
                        placeholder="请选择助理设计师"
                        value={selectedAssistantDesigners}
                        onChange={setSelectedAssistantDesigners}
                        style={{ width: '100%' }}
                        optionFilterProp="children"
                        showSearch
                    >
                        {availableUsers.map(user => (
                            <Select.Option key={user._id} value={user._id}>
                                {user.realName || user.username}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </Modal>


        </div>
    );
};

export default ProjectDetail; 