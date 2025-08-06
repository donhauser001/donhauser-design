import React, { useState } from 'react';
import {
    Card,
    Button,
    Space,
    message,
    Row,
    Col,
    Statistic,
    Tag
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    FileTextOutlined,
    TeamOutlined,
    DollarOutlined,
    SettingOutlined,
    PauseCircleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CreditCardOutlined,
    WalletOutlined,
    CheckOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// 导入组件
import BasicInfoCard from './components/BasicInfoCard';
import TaskList from './components/TaskList';
import AdditionalInfoCard from './components/AdditionalInfoCard';
import {
    AssignDesignersModal,
    ContactEditModal,
    RemarkEditModal,
    TeamEditModal,
    ProjectNameEditModal
} from './components/Modals';

// 导入类型和工具
import { Task, Enterprise, User } from './types';
import {
    getProgressStatusColor,
    getProgressStatusText,
    getSettlementStatusColor,
    getSettlementStatusText,
    getProgressColor,
    calculateProjectProgress
} from './utils';

// 导入hooks
import { useProjectDetail } from './hooks/useProjectDetail';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // 使用自定义hook获取项目数据
    const { project, tasks, loading, fetchProject, fetchTasks, updateProjectProgress, updateProjectDesigners } = useProjectDetail(id || '');

    // 模态窗状态
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [selectedMainDesigners, setSelectedMainDesigners] = useState<string[]>([]);
    const [selectedAssistantDesigners, setSelectedAssistantDesigners] = useState<string[]>([]);
    const [assignLoading, setAssignLoading] = useState(false);
    const [priorityLoading, setPriorityLoading] = useState(false);
    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [availableContacts, setAvailableContacts] = useState<User[]>([]);
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const [contactLoading, setContactLoading] = useState(false);
    const [remarkModalVisible, setRemarkModalVisible] = useState(false);
    const [remarkValue, setRemarkValue] = useState('');
    const [remarkLoading, setRemarkLoading] = useState(false);
    const [teamModalVisible, setTeamModalVisible] = useState(false);
    const [availableEnterprises, setAvailableEnterprises] = useState<Enterprise[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const [teamLoading, setTeamLoading] = useState(false);
    const [projectNameModalVisible, setProjectNameModalVisible] = useState(false);
    const [projectNameValue, setProjectNameValue] = useState('');
    const [projectNameLoading, setProjectNameLoading] = useState(false);

    // 获取可用用户
    const fetchAvailableUsers = async () => {
        try {
            const response = await fetch('/api/users?role=设计师&limit=100');
            const data = await response.json();
            if (data.success) {
                setAvailableUsers(data.data);
            }
        } catch (error) {
            // 获取用户列表失败
        }
    };

    // 获取客户联系人
    const fetchClientContacts = async () => {
        try {
            const response = await fetch('/api/users?role=客户&limit=100');
            const data = await response.json();
            if (data.success) {
                // 过滤出与当前项目客户相关的联系人
                const filteredContacts = data.data.filter((contact: User) =>
                    contact.company === project?.clientName
                );
                setAvailableContacts(filteredContacts);
            }
        } catch (error) {
            // 获取联系人列表失败
        }
    };

    // 获取企业列表
    const fetchEnterprises = async () => {
        try {
            const response = await fetch('/api/enterprises?limit=100');
            const data = await response.json();
            if (data.success) {
                setAvailableEnterprises(data.data);
            }
        } catch (error) {
            // 获取企业列表失败
        }
    };

    // 处理联系人编辑
    const handleContactEdit = () => {
        const currentContactIds: string[] = [];
        if (project?.contactNames && project?.contactIds) {
            setSelectedContacts(project.contactIds);
        }
        setContactModalVisible(true);
        fetchClientContacts();
    };

    // 确认联系人更新
    const handleContactUpdate = async () => {
        setContactLoading(true);
        try {
            const selectedContactInfo = availableContacts.filter(contact =>
                selectedContacts.includes(contact._id)
            );

            const contactNames = selectedContactInfo.map(contact => contact.realName);
            const contactPhones = selectedContactInfo.map(contact => contact.phone);

            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contactIds: selectedContacts,
                    contactNames: contactNames,
                    contactPhones: contactPhones
                })
            });

            const data = await response.json();
            if (data.success) {
                message.success('联系人更新成功');
                setContactModalVisible(false);
                fetchProject();
            } else {
                message.error(data.message || '联系人更新失败');
            }
        } catch (error) {
            message.error('更新联系人失败');
        } finally {
            setContactLoading(false);
        }
    };

    // 打开备注编辑模态窗
    const handleRemarkEdit = () => {
        setRemarkValue(project?.remark || '');
        setRemarkModalVisible(true);
    };

    // 确认备注更新
    const handleRemarkUpdate = async () => {
        setRemarkLoading(true);
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    remark: remarkValue
                })
            });

            const data = await response.json();
            if (data.success) {
                message.success('备注更新成功');
                setRemarkModalVisible(false);
                fetchProject();
            } else {
                message.error(data.message || '备注更新失败');
            }
        } catch (error) {
            message.error('更新备注失败');
        } finally {
            setRemarkLoading(false);
        }
    };

    // 打开承接团队编辑模态窗
    const handleTeamEdit = () => {
        setSelectedTeam(project?.undertakingTeam || '');
        setTeamModalVisible(true);
        fetchEnterprises();
    };

    // 确认承接团队更新
    const handleTeamUpdate = async () => {
        if (!selectedTeam) {
            message.error('请选择承接团队');
            return;
        }

        setTeamLoading(true);
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    undertakingTeam: selectedTeam
                })
            });

            const data = await response.json();
            if (data.success) {
                message.success('承接团队更新成功');
                setTeamModalVisible(false);
                fetchProject();
            } else {
                message.error(data.message || '承接团队更新失败');
            }
        } catch (error) {
            message.error('更新承接团队失败');
        } finally {
            setTeamLoading(false);
        }
    };

    // 处理项目名称编辑
    const handleProjectNameEdit = () => {
        setProjectNameValue(project?.projectName || '');
        setProjectNameModalVisible(true);
    };

    // 处理项目名称更新
    const handleProjectNameUpdate = async () => {
        if (!projectNameValue.trim()) {
            message.error('项目名称不能为空');
            return;
        }

        setProjectNameLoading(true);
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectName: projectNameValue.trim()
                }),
            });

            const data = await response.json();

            if (data.success) {
                message.success('项目名称更新成功');
                setProjectNameModalVisible(false);
                fetchProject();
            } else {
                message.error(data.message || '项目名称更新失败');
            }
        } catch (error) {
            message.error('项目名称更新失败');
        } finally {
            setProjectNameLoading(false);
        }
    };

    // 处理项目名称编辑取消
    const handleProjectNameCancel = () => {
        setProjectNameModalVisible(false);
        setProjectNameValue('');
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

                // 重新获取任务列表并更新项目设计师信息
                await fetchTasks();
                if (tasks.length > 0) {
                    await updateProjectDesigners(tasks);
                }
            } else {
                message.error(data.message || '设计师分配失败');
            }
        } catch (error) {
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
                fetchTasks();
            } else {
                message.error(data.message || '紧急度修改失败');
            }
        } catch (error) {
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
                fetchTasks();
            } else {
                message.error(data.message || '规格修改失败');
            }
        } catch (error) {
            message.error('修改规格失败');
        }
    };

    // 处理流程状态变更
    const handleProcessStepChange = async (task: Task, stepId: string) => {
        try {
            // 找到选中的流程节点
            const selectedStep = task.processSteps?.find(step => step.id === stepId);

            // 计算截止日期：当前时间 + 周期天数
            let dueDate = null;
            if (selectedStep && selectedStep.cycle) {
                const currentDate = new Date();
                dueDate = new Date(currentDate.getTime() + selectedStep.cycle * 24 * 60 * 60 * 1000);
            }

            const response = await fetch(`/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    processStepId: stepId,
                    dueDate: dueDate ? dueDate.toISOString() : null
                })
            });

            const data = await response.json();

            if (data.success) {
                message.success('流程状态修改成功');
                if (dueDate) {
                    message.info(`截止日期已设置为: ${dayjs(dueDate).format('YYYY-MM-DD')}`);
                }

                // 重新获取任务列表
                await fetchTasks();

                // 计算并更新项目进度（使用最新的任务数据）
                const updatedTasks = await fetch(`/api/projects/${id}/tasks`).then(res => res.json()).then(data => data.data || []);
                const newProjectProgress = calculateProjectProgress(updatedTasks);
                await updateProjectProgress(newProjectProgress);

                // 更新项目设计师信息
                await updateProjectDesigners(updatedTasks);

                // 重新获取项目信息以显示最新进度
                await fetchProject();
            } else {
                message.error(data.message || '流程状态修改失败');
            }
        } catch (error) {
            message.error('修改流程状态失败');
        }
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
            <style>
                {`
                    .ant-table-tbody > tr {
                        position: relative;
                        border-bottom: 1px solid #f0f0f0;
                        margin-bottom: 8px;
                    }
                    .ant-table-tbody > tr > td {
                        padding: 20px 8px !important;
                        border-bottom: 2px solid #f5f5f5 !important;
                    }
                    .ant-table-tbody > tr:hover > td {
                        background-color: #fafafa !important;
                    }
                    .ant-table-tbody > tr::after {
                        content: '';
                        position: absolute;
                        bottom: -1px;
                        left: 0;
                        height: 2px;
                        background: #f0f0f0;
                        transition: width 0.3s ease;
                        z-index: 10;
                        width: 0%;
                        border-radius: 0 1px 1px 0;
                        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    }
                    ${tasks.map(task => {
                    const progressRatio = task.currentProcessStep?.progressRatio || 0;
                    const progressColor = task.currentProcessStep ?
                        getProgressColor(task.currentProcessStep.progressRatio) : '#f0f0f0';
                    return `
                            .task-row-${task._id}::after {
                                width: ${progressRatio}% !important;
                                background: ${progressColor} !important;
                            }
                        `;
                }).join('')}
                `}
            </style>

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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {project.projectName}
                            </span>
                            <Space>
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
                        </div>
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
                            title="项目进度"
                            value={project.progress || calculateProjectProgress(tasks)}
                            suffix="%"
                            precision={1}
                            valueStyle={{ color: getProgressColor(project.progress || calculateProjectProgress(tasks)) }}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="项目成员"
                            value={project.mainDesigners.length + project.assistantDesigners.length}
                            prefix={<TeamOutlined />}
                        />
                    </Col>
                </Row>

                <Row gutter={24}>
                    {/* 左侧：项目信息 */}
                    <Col span={19}>
                        {/* 基本信息卡片 */}
                        <BasicInfoCard
                            project={project}
                            onProjectNameEdit={handleProjectNameEdit}
                            onContactEdit={handleContactEdit}
                            onTeamEdit={handleTeamEdit}
                        />

                        {/* 任务列表 */}
                        <TaskList
                            tasks={tasks}
                            projectId={id || ''}
                            onAssignDesigners={handleAssignDesigners}
                            onPrioritySelect={handlePrioritySelect}
                            onSpecificationChange={handleSpecificationChange}
                            onProcessStepChange={handleProcessStepChange}
                        />
                    </Col>

                    {/* 右侧：附加信息 */}
                    <Col span={5}>
                        <AdditionalInfoCard
                            project={project}
                            onRemarkEdit={handleRemarkEdit}
                        />
                    </Col>
                </Row>
            </Card>

            {/* 模态窗组件 */}
            <AssignDesignersModal
                visible={assignModalVisible}
                task={currentTask}
                availableUsers={availableUsers}
                selectedMainDesigners={selectedMainDesigners}
                selectedAssistantDesigners={selectedAssistantDesigners}
                loading={assignLoading}
                onOk={handleConfirmAssign}
                onCancel={() => setAssignModalVisible(false)}
                onMainDesignersChange={setSelectedMainDesigners}
                onAssistantDesignersChange={setSelectedAssistantDesigners}
            />

            <ContactEditModal
                visible={contactModalVisible}
                clientName={project.clientName}
                availableContacts={availableContacts}
                selectedContacts={selectedContacts}
                loading={contactLoading}
                onOk={handleContactUpdate}
                onCancel={() => setContactModalVisible(false)}
                onContactsChange={setSelectedContacts}
            />

            <RemarkEditModal
                visible={remarkModalVisible}
                value={remarkValue}
                loading={remarkLoading}
                onOk={handleRemarkUpdate}
                onCancel={() => setRemarkModalVisible(false)}
                onValueChange={setRemarkValue}
            />

            <TeamEditModal
                visible={teamModalVisible}
                availableEnterprises={availableEnterprises}
                selectedTeam={selectedTeam}
                loading={teamLoading}
                onOk={handleTeamUpdate}
                onCancel={() => setTeamModalVisible(false)}
                onTeamChange={setSelectedTeam}
            />

            <ProjectNameEditModal
                visible={projectNameModalVisible}
                value={projectNameValue}
                loading={projectNameLoading}
                onOk={handleProjectNameUpdate}
                onCancel={handleProjectNameCancel}
                onValueChange={setProjectNameValue}
            />
        </div>
    );
};

export default ProjectDetail; 