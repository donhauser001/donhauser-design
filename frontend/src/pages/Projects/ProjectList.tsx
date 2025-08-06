import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Input,
    Select,
    Space,
    Card,
    Tag,
    Modal,
    message,
    Popconfirm,
    Tooltip,
    Badge,
    Row,
    Col,
    Statistic,
    Progress
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    ReloadOutlined,
    FilterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

interface Project {
    _id: string;
    projectName: string;
    clientName: string;
    undertakingTeam: string;
    progressStatus: 'consulting' | 'in-progress' | 'partial-delivery' | 'completed' | 'on-hold' | 'cancelled';
    settlementStatus: 'unpaid' | 'prepaid' | 'partial-paid' | 'fully-paid';
    createdAt: string;
    startedAt?: string;
    deliveredAt?: string;
    settledAt?: string;
    mainDesigners: string[];
    assistantDesigners: string[];
    taskIds: string[];
    remark?: string;
}

interface ProjectStats {
    total: number;
    consulting: number;
    inProgress: number;
    partialDelivery: number;
    completed: number;
    onHold: number;
    cancelled: number;
    unpaid: number;
    prepaid: number;
    partialPaid: number;
    fullyPaid: number;
}

const ProjectList: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [stats, setStats] = useState<ProjectStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState('');
    const [progressFilter, setProgressFilter] = useState<string>('');
    const [settlementFilter, setSettlementFilter] = useState<string>('');
    const [teamFilter, setTeamFilter] = useState<string>('');

    // 获取项目列表
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: pageSize.toString(),
                ...(searchText && { search: searchText }),
                ...(progressFilter && { progressStatus: progressFilter }),
                ...(settlementFilter && { settlementStatus: settlementFilter }),
                ...(teamFilter && { undertakingTeam: teamFilter })
            });

            const response = await fetch(`/api/projects?${params}`);
            const data = await response.json();

            if (data.success) {
                setProjects(data.data);
                setTotal(data.total);
            } else {
                message.error('获取项目列表失败');
            }
        } catch (error) {
            console.error('获取项目列表失败:', error);
            message.error('获取项目列表失败');
        } finally {
            setLoading(false);
        }
    };

    // 获取项目统计
    const fetchStats = async () => {
        try {
            const response = await fetch('/api/projects/stats');
            const data = await response.json();

            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('获取项目统计失败:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchStats();
    }, [currentPage, pageSize, searchText, progressFilter, settlementFilter, teamFilter]);

    // 删除项目
    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                message.success('项目删除成功');
                fetchProjects();
                fetchStats();
            } else {
                message.error(data.message || '删除失败');
            }
        } catch (error) {
            console.error('删除项目失败:', error);
            message.error('删除项目失败');
        }
    };

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

    // 表格列定义
    const columns = [
        {
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',
            width: 200,
            render: (text: string, record: Project) => (
                <Button
                    type="link"
                    onClick={() => navigate(`/projects/${record._id}`)}
                    style={{ padding: 0, height: 'auto' }}
                >
                    {text}
                </Button>
            )
        },
        {
            title: '客户名称',
            dataIndex: 'clientName',
            key: 'clientName',
            width: 150
        },
        {
            title: '进度状态',
            dataIndex: 'progressStatus',
            key: 'progressStatus',
            width: 120,
            render: (status: string) => (
                <Tag color={getProgressStatusColor(status)}>
                    {getProgressStatusText(status)}
                </Tag>
            )
        },
        {
            title: '结算状态',
            dataIndex: 'settlementStatus',
            key: 'settlementStatus',
            width: 120,
            render: (status: string) => (
                <Tag color={getSettlementStatusColor(status)}>
                    {getSettlementStatusText(status)}
                </Tag>
            )
        },
        {
            title: '任务数量',
            dataIndex: 'taskIds',
            key: 'taskCount',
            width: 100,
            render: (taskIds: string[]) => (
                <Badge count={taskIds?.length || 0} showZero />
            )
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date: string) => dayjs(date).format('YYYY-MM-DD')
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_, record: Project) => (
                <Space size="small">
                    <Tooltip title="查看详情">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/projects/${record._id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="编辑项目">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/projects/${record._id}/edit`)}
                        />
                    </Tooltip>
                    <Tooltip title="删除项目">
                        <Popconfirm
                            title="确定要删除这个项目吗？"
                            onConfirm={() => handleDelete(record._id)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* 统计卡片 */}
            {stats && (
                <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="总项目数"
                                value={stats.total}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="进行中"
                                value={stats.inProgress}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="已完成"
                                value={stats.completed}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="未付款"
                                value={stats.unpaid}
                                valueStyle={{ color: '#ff4d4f' }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* 操作栏 */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col flex="auto">
                        <Space size="middle">
                            <Search
                                placeholder="搜索项目名称或客户名称"
                                allowClear
                                style={{ width: 300 }}
                                onSearch={setSearchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <Select
                                placeholder="进度状态"
                                allowClear
                                style={{ width: 120 }}
                                onChange={setProgressFilter}
                            >
                                <Option value="consulting">咨询中</Option>
                                <Option value="in-progress">进行中</Option>
                                <Option value="partial-delivery">部分交付</Option>
                                <Option value="completed">已完成</Option>
                                <Option value="on-hold">暂停</Option>
                                <Option value="cancelled">已取消</Option>
                            </Select>
                            <Select
                                placeholder="结算状态"
                                allowClear
                                style={{ width: 120 }}
                                onChange={setSettlementFilter}
                            >
                                <Option value="unpaid">未付款</Option>
                                <Option value="prepaid">预付款</Option>
                                <Option value="partial-paid">部分付款</Option>
                                <Option value="fully-paid">已付清</Option>
                            </Select>
                        </Space>
                    </Col>
                    <Col>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => {
                                    fetchProjects();
                                    fetchStats();
                                }}
                            >
                                刷新
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/projects/create')}
                            >
                                新建项目
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* 项目表格 */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={projects}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>
        </div>
    );
};

export default ProjectList; 