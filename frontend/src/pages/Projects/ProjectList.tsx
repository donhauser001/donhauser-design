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
    FilterOutlined,
    ClearOutlined
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
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [updatingProject, setUpdatingProject] = useState<Project | null>(null);
    const [updatingLoading, setUpdatingLoading] = useState(false);
    const [statusChangeModalVisible, setStatusChangeModalVisible] = useState(false);
    const [statusChangeProject, setStatusChangeProject] = useState<Project | null>(null);
    const [selectedNewStatus, setSelectedNewStatus] = useState<string>('');
    const [statusChangeLoading, setStatusChangeLoading] = useState(false);

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

            // 如果没有选择进度状态筛选，默认排除已取消的项目
            if (!progressFilter) {
                params.append('excludeStatus', 'cancelled');
            }

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

    // 处理项目状态更新
    const handleStartProject = async (project: Project) => {
        setUpdatingProject(project);
        setUpdateModalVisible(true);
    };

    const handleConfirmStartProject = async () => {
        if (!updatingProject) return;

        setUpdatingLoading(true);
        try {
            const response = await fetch(`/api/projects/${updatingProject._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    progressStatus: 'in-progress',
                    startedAt: new Date().toISOString()
                })
            });

            const data = await response.json();

            if (data.success) {
                message.success('项目已正式开启并开始计时');
                setUpdateModalVisible(false);
                setUpdatingProject(null);
                fetchProjects();
                fetchStats();
            } else {
                message.error(data.message || '更新失败');
            }
        } catch (error) {
            console.error('更新项目状态失败:', error);
            message.error('更新项目状态失败');
        } finally {
            setUpdatingLoading(false);
        }
    };

    const handleCancelStartProject = () => {
        setUpdateModalVisible(false);
        setUpdatingProject(null);
    };

    // 处理进行中项目的状态变更
    const handleChangeProjectStatus = async (project: Project) => {
        setStatusChangeProject(project);
        setSelectedNewStatus('');
        setStatusChangeModalVisible(true);
    };

    const handleConfirmStatusChange = async () => {
        if (!statusChangeProject || !selectedNewStatus) return;

        setStatusChangeLoading(true);
        try {
            const updateData: any = {
                progressStatus: selectedNewStatus
            };

            // 根据新状态设置相应的时间字段
            if (selectedNewStatus === 'on-hold') {
                // 暂停项目，不需要额外时间字段
            } else if (selectedNewStatus === 'cancelled') {
                // 取消项目，可以设置取消时间
                updateData.cancelledAt = new Date().toISOString();
            } else if (selectedNewStatus === 'consulting') {
                // 回到咨询状态，清除开始时间
                updateData.startedAt = null;
            }

            const response = await fetch(`/api/projects/${statusChangeProject._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (data.success) {
                const statusText = getProgressStatusText(selectedNewStatus);
                message.success(`项目状态已更新为：${statusText}`);
                setStatusChangeModalVisible(false);
                setStatusChangeProject(null);
                setSelectedNewStatus('');
                fetchProjects();
                fetchStats();
            } else {
                message.error(data.message || '更新失败');
            }
        } catch (error) {
            console.error('更新项目状态失败:', error);
            message.error('更新项目状态失败');
        } finally {
            setStatusChangeLoading(false);
        }
    };

    const handleCancelStatusChange = () => {
        setStatusChangeModalVisible(false);
        setStatusChangeProject(null);
        setSelectedNewStatus('');
    };

    // 清除所有筛选条件，查看全部项目
    const handleViewAll = () => {
        setSearchText('');
        setProgressFilter('');
        setSettlementFilter('');
        setTeamFilter('');
        setCurrentPage(1); // 重置到第一页
    };

    // 状态标签颜色映射
    const getProgressStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'consulting': 'orange',      // 咨询中，橙色
            'in-progress': 'blue',       // 进行中，蓝色
            'on-hold': 'purple',         // 搁置，紫色
            'cancelled': 'default',      // 已取消，灰色
            'partial-delivery': 'cyan',  // 部分交付，蓝绿色
            'completed': 'green'         // 完全交付，绿色
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
            width: 250,
            render: (text: string, record: Project) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button
                        type="link"
                        onClick={() => navigate(`/projects/${record._id}`)}
                        style={{ padding: 0, height: 'auto' }}
                    >
                        {text}
                    </Button>
                    <Tag
                        color={getProgressStatusColor(record.progressStatus)}
                        style={{
                            cursor: (record.progressStatus === 'consulting' || record.progressStatus === 'in-progress') ? 'pointer' : 'default',
                            userSelect: 'none'
                        }}
                        onClick={
                            record.progressStatus === 'consulting'
                                ? () => handleStartProject(record)
                                : record.progressStatus === 'in-progress'
                                    ? () => handleChangeProjectStatus(record)
                                    : undefined
                        }
                    >
                        {getProgressStatusText(record.progressStatus)}
                        {record.progressStatus === 'consulting' && (
                            <span style={{ marginLeft: '4px', fontSize: '12px' }}>📋</span>
                        )}
                        {record.progressStatus === 'in-progress' && (
                            <span style={{ marginLeft: '4px', fontSize: '12px' }}>⚙️</span>
                        )}
                    </Tag>
                </div>
            )
        },
        {
            title: '客户名称',
            dataIndex: 'clientName',
            key: 'clientName',
            width: 150
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
            render: (_: any, record: Project) => (
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
                            <Button
                                icon={<ClearOutlined />}
                                onClick={handleViewAll}
                                disabled={!searchText && !progressFilter && !settlementFilter && !teamFilter}
                            >
                                查看全部
                            </Button>
                            <Select
                                placeholder="进度状态"
                                allowClear
                                style={{ width: 120 }}
                                value={progressFilter}
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
                                value={settlementFilter}
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
                                onClick={() => {
                                    // 清空暂存数据后跳转
                                    localStorage.removeItem('createProject_currentStep');
                                    localStorage.removeItem('createProject_selectedServices');
                                    localStorage.removeItem('createProject_selectedServiceIds');
                                    localStorage.removeItem('createProject_serviceQuantities');
                                    localStorage.removeItem('createProject_formData');
                                    localStorage.removeItem('createProject_selectedClientId');
                                    navigate('/projects/create');
                                }}
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

            {/* 确认开启项目对话框 */}
            <Modal
                title="确认开启项目"
                open={updateModalVisible}
                onOk={handleConfirmStartProject}
                onCancel={handleCancelStartProject}
                confirmLoading={updatingLoading}
                okText="确定开启"
                cancelText="取消"
            >
                <div style={{ padding: '16px 0' }}>
                    <p>您确定要正式开启以下项目吗？</p>
                    <div style={{
                        background: '#f5f5f5',
                        padding: '12px',
                        borderRadius: '6px',
                        margin: '12px 0'
                    }}>
                        <p><strong>项目名称：</strong>{updatingProject?.projectName}</p>
                        <p><strong>客户：</strong>{updatingProject?.clientName}</p>
                        <p><strong>当前状态：</strong>
                            <Tag color="orange">咨询中</Tag>
                        </p>
                        <p><strong>开启后状态：</strong>
                            <Tag color="blue">进行中</Tag>
                        </p>
                    </div>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        ⚠️ 开启后项目将直接进入执行阶段，并开始计时。
                    </p>
                </div>
            </Modal>

            {/* 项目状态变更对话框 */}
            <Modal
                title="变更项目状态"
                open={statusChangeModalVisible}
                onOk={handleConfirmStatusChange}
                onCancel={handleCancelStatusChange}
                confirmLoading={statusChangeLoading}
                okText="确定"
                cancelText="取消"
                okButtonProps={{ disabled: !selectedNewStatus }}
            >
                <div style={{ padding: '16px 0' }}>
                    <p>要将项目切换到以下状态吗？</p>
                    <div style={{
                        background: '#f5f5f5',
                        padding: '12px',
                        borderRadius: '6px',
                        margin: '12px 0'
                    }}>
                        <p><strong>项目名称：</strong>{statusChangeProject?.projectName}</p>
                        <p><strong>客户：</strong>{statusChangeProject?.clientName}</p>
                        <p><strong>当前状态：</strong>
                            <Tag color="blue">进行中</Tag>
                        </p>
                    </div>

                    <div style={{ margin: '16px 0' }}>
                        <p style={{ marginBottom: '12px', fontWeight: 'bold' }}>选择新状态：</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div
                                style={{
                                    padding: '12px',
                                    border: selectedNewStatus === 'on-hold' ? '2px solid #722ed1' : '1px solid #d9d9d9',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedNewStatus === 'on-hold' ? '#f9f0ff' : '#fff'
                                }}
                                onClick={() => setSelectedNewStatus('on-hold')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag color="purple">暂停项目</Tag>
                                    <span style={{ fontSize: '14px', color: '#666' }}>项目暂时搁置，可随时恢复</span>
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: '12px',
                                    border: selectedNewStatus === 'cancelled' ? '2px solid #d9d9d9' : '1px solid #d9d9d9',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedNewStatus === 'cancelled' ? '#f5f5f5' : '#fff'
                                }}
                                onClick={() => setSelectedNewStatus('cancelled')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag color="default">取消项目</Tag>
                                    <span style={{ fontSize: '14px', color: '#666' }}>项目终止，不可恢复</span>
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: '12px',
                                    border: selectedNewStatus === 'consulting' ? '2px solid #fa8c16' : '1px solid #d9d9d9',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedNewStatus === 'consulting' ? '#fff7e6' : '#fff'
                                }}
                                onClick={() => setSelectedNewStatus('consulting')}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag color="orange">回到咨询状态</Tag>
                                    <span style={{ fontSize: '14px', color: '#666' }}>项目回到咨询阶段，重新确认需求</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedNewStatus && (
                        <div style={{
                            background: '#e6f7ff',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #91d5ff'
                        }}>
                            <p style={{ margin: 0, color: '#1890ff' }}>
                                <strong>即将变更：</strong>进行中 → {getProgressStatusText(selectedNewStatus)}
                            </p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default ProjectList; 