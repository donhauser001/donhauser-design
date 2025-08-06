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
    Tabs
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    UserOutlined,
    TeamOutlined,
    FileTextOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

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
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    progress: number;
    quantity: number;
    unit: string;
    subtotal: number;
    dueDate?: string;
    assignedDesigners: string[];
    billingDescription: string;
}

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

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
            'partial-paid': '部分付款',
            'fully-paid': '已付清'
        };
        return texts[status] || status;
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
                        <span>{project.projectName}</span>
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
                                <Descriptions.Item label="进度状态">
                                    <Tag color={getProgressStatusColor(project.progressStatus)}>
                                        {getProgressStatusText(project.progressStatus)}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="结算状态">
                                    <Tag color={getSettlementStatusColor(project.settlementStatus)}>
                                        {getSettlementStatusText(project.settlementStatus)}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="主创设计师">
                                    {(project.mainDesignerNames || project.mainDesigners).join('，')}
                                </Descriptions.Item>
                                <Descriptions.Item label="助理设计师">
                                    {(project.assistantDesignerNames || project.assistantDesigners).join('，')}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>



                        {/* 任务概览 */}
                        <Card title="任务概览" style={{ marginBottom: 16 }}>
                            <List
                                size="small"
                                dataSource={tasks.slice(0, 5)}
                                renderItem={(task) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={task.taskName}
                                            description={
                                                <Space direction="vertical" size="small">
                                                    <div>状态: <Tag size="small">{task.status}</Tag></div>
                                                    <div>金额: ¥{task.subtotal}</div>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
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
        </div>
    );
};

export default ProjectDetail; 