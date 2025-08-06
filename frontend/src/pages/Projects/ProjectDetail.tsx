import React, { useState, useEffect, useRef } from 'react';
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
    Tooltip,
    Input
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
    PauseOutlined,
    ProjectOutlined,
    CustomerServiceOutlined,
    CalendarOutlined,
    UserSwitchOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import SpecificationSelector from '../../components/SpecificationSelector';

interface Project {
    _id: string;
    projectName: string;
    clientName: string;
    clientId?: string; // 客户ID
    undertakingTeam: string;
    undertakingTeamName?: string;
    progressStatus: 'consulting' | 'in-progress' | 'partial-delivery' | 'completed' | 'on-hold' | 'cancelled';
    settlementStatus: 'unpaid' | 'prepaid' | 'partial-paid' | 'fully-paid';
    progress?: number; // 项目总进度
    createdAt: string;
    startedAt?: string;
    deliveredAt?: string;
    settledAt?: string;
    mainDesigners: string[];
    mainDesignerNames?: string[];
    assistantDesigners: string[];
    assistantDesignerNames?: string[];
    taskIds: string[];
    contactIds?: string[]; // 联系人ID数组
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
        cycle: number;
    }>;
    currentProcessStep?: {
        id: string;
        name: string;
        description: string;
        order: number;
        progressRatio: number;
        cycle: number;
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
    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [availableContacts, setAvailableContacts] = useState<any[]>([]);
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const [contactLoading, setContactLoading] = useState(false);
    const [remarkModalVisible, setRemarkModalVisible] = useState(false);
    const [remarkValue, setRemarkValue] = useState('');
    const [remarkLoading, setRemarkLoading] = useState(false);
    const [teamModalVisible, setTeamModalVisible] = useState(false);
    const [availableEnterprises, setAvailableEnterprises] = useState<any[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>('');
    const [teamLoading, setTeamLoading] = useState(false);
    const [projectNameModalVisible, setProjectNameModalVisible] = useState(false);
    const [projectNameValue, setProjectNameValue] = useState('');
    const [projectNameLoading, setProjectNameLoading] = useState(false);

    // 计算截止日期显示文本
    const getDueDateDisplayText = (dueDate: string) => {
        const due = dayjs(dueDate);
        const now = dayjs();
        const diffDays = due.diff(now, 'day');

        // 如果已经超过截止日期
        if (diffDays < 0) {
            return '已拖稿';
        }

        // 如果是当天
        if (diffDays === 0) {
            return '今天';
        }

        // 如果是明天
        if (diffDays === 1) {
            return '明天';
        }

        // 如果是后天
        if (diffDays === 2) {
            return '后天';
        }

        // 如果小于等于5天
        if (diffDays <= 5) {
            return `还剩${diffDays}天`;
        }

        // 其他情况显示具体日期
        return due.format('MM-DD');
    };

    // 获取截止日期显示颜色
    const getDueDateColor = (dueDate: string) => {
        const due = dayjs(dueDate);
        const now = dayjs();
        const diffDays = due.diff(now, 'day');

        if (diffDays < 0) {
            return '#ff4d4f'; // 红色 - 已拖稿
        }

        if (diffDays <= 2) {
            return '#ff7a45'; // 橙色 - 紧急
        }

        if (diffDays <= 5) {
            return '#faad14'; // 黄色 - 警告
        }

        return '#52c41a'; // 绿色 - 正常
    };

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
            // 获取项目任务失败
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
            message.error('获取用户列表失败');
        }
    };

    // 获取客户联系人列表
    const fetchClientContacts = async () => {
        try {
            // 获取所有客户角色的用户作为联系人
            const response = await fetch('/api/users?role=客户&limit=100');
            const data = await response.json();
            if (data.success) {
                // 根据当前项目的客户名称过滤联系人
                const filteredContacts = data.data.filter((contact: any) =>
                    contact.company === project?.clientName
                );
                setAvailableContacts(filteredContacts);
            }
        } catch (error) {
            // 获取客户联系人失败
        }
    };

    // 获取企业列表
    const fetchEnterprises = async () => {
        try {
            const response = await fetch('/api/enterprises');
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
        // 从contactNames中找到对应的contactIds
        const currentContactIds: string[] = [];
        if (project?.contactNames && project?.contactIds) {
            // 这里需要根据contactNames找到对应的contactIds
            // 由于数据结构限制，暂时使用contactIds
            setSelectedContacts(project.contactIds);
        }
        setContactModalVisible(true);
        fetchClientContacts();
    };

    // 确认联系人更新
    const handleContactUpdate = async () => {
        setContactLoading(true);
        try {
            // 根据选中的联系人ID获取联系人信息
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
                fetchProject(); // 重新获取项目信息
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
                fetchProject(); // 重新获取项目信息
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
                fetchProject(); // 重新获取项目信息
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
                fetchTasks(); // 重新获取任务列表
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
                fetchTasks(); // 重新获取任务列表
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

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchProject(), fetchTasks()]);

            // 初始化时计算并更新项目进度
            if (tasks.length > 0) {
                const initialProgress = calculateProjectProgress(tasks);
                await updateProjectProgress(initialProgress);

                // 根据任务数据更新项目设计师信息
                await updateProjectDesigners(tasks);
            }

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

    // 计算项目总进度
    const calculateProjectProgress = (tasks: Task[]) => {
        if (tasks.length === 0) return 0;

        const totalProgress = tasks.reduce((sum, task) => {
            const taskProgress = task.currentProcessStep?.progressRatio || 0;
            return sum + taskProgress;
        }, 0);

        return Math.round(totalProgress / tasks.length);
    };

    // 更新项目进度
    const updateProjectProgress = async (newProgress: number) => {
        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    progress: newProgress
                })
            });

            const data = await response.json();
            if (data.success) {
                // 项目进度已更新
            } else {
                // 更新项目进度失败
            }
        } catch (error) {
            // 更新项目进度失败
        }
    };

    // 根据任务数据更新项目设计师信息
    const updateProjectDesigners = async (tasks: Task[]) => {
        if (!id || tasks.length === 0) return;

        try {
            // 收集所有任务中的设计师信息
            const allMainDesigners: string[] = [];
            const allMainDesignerNames: string[] = [];
            const allAssistantDesigners: string[] = [];
            const allAssistantDesignerNames: string[] = [];

            // 创建设计师ID到名称的映射
            const designerIdToNameMap = new Map<string, string>();

            tasks.forEach(task => {
                // 收集主创设计师
                if (task.mainDesigners && task.mainDesigners.length > 0) {
                    task.mainDesigners.forEach((designerId, index) => {
                        if (!allMainDesigners.includes(designerId)) {
                            allMainDesigners.push(designerId);
                            // 保存设计师ID到名称的映射
                            if (task.mainDesignerNames && task.mainDesignerNames[index]) {
                                designerIdToNameMap.set(designerId, task.mainDesignerNames[index]);
                            }
                        }
                    });
                }

                // 收集助理设计师
                if (task.assistantDesigners && task.assistantDesigners.length > 0) {
                    task.assistantDesigners.forEach((designerId, index) => {
                        if (!allAssistantDesigners.includes(designerId)) {
                            allAssistantDesigners.push(designerId);
                            // 保存设计师ID到名称的映射
                            if (task.assistantDesignerNames && task.assistantDesignerNames[index]) {
                                designerIdToNameMap.set(designerId, task.assistantDesignerNames[index]);
                            }
                        }
                    });
                }
            });

            // 根据ID顺序生成名称数组
            allMainDesigners.forEach(designerId => {
                const designerName = designerIdToNameMap.get(designerId);
                if (designerName) {
                    allMainDesignerNames.push(designerName);
                }
            });

            allAssistantDesigners.forEach(designerId => {
                const designerName = designerIdToNameMap.get(designerId);
                if (designerName) {
                    allAssistantDesignerNames.push(designerName);
                }
            });

            // 更新项目设计师信息
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mainDesigners: allMainDesigners,
                    mainDesignerNames: allMainDesignerNames,
                    assistantDesigners: allAssistantDesigners,
                    assistantDesignerNames: allAssistantDesignerNames
                })
            });

            const data = await response.json();
            if (data.success) {
                // 项目设计师信息已更新
            } else {
                // 更新项目设计师信息失败
            }
        } catch (error) {
            // 更新项目设计师信息失败
        }
    };

    // 根据进度比例获取颜色
    const getProgressColor = (progressRatio: number) => {
        const colors = [
            '#d32f2f', // 0-9%: 深红色
            '#e53935', // 10-19%: 红色
            '#f44336', // 20-29%: 亮红色
            '#ff9800', // 30-39%: 橙色
            '#ffb74d', // 40-49%: 浅橙色
            '#8bc34a', // 50-59%: 绿色
            '#66bb6a', // 60-69%: 深绿色
            '#4caf50', // 70-79%: 更深的绿色
            '#388e3c', // 80-89%: 深绿色
            '#2e7d32'  // 90-100%: 最深的绿色
        ];

        const index = Math.min(Math.floor(progressRatio / 10), colors.length - 1);
        return colors[index];
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
                        {/* 基本信息 */}
                        <Card title="基本信息" style={{ marginBottom: 16 }}>
                            <Descriptions column={2}>
                                <Descriptions.Item label={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <ProjectOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                                        <span>项目名称</span>
                                    </div>
                                }>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => {
                                            const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                                            if (editIcon) {
                                                editIcon.style.opacity = '1';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                                            if (editIcon) {
                                                editIcon.style.opacity = '0';
                                            }
                                        }}
                                    >
                                        <span>{project.projectName}</span>
                                        <div
                                            className="edit-icon"
                                            style={{
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                                cursor: 'pointer',
                                                color: '#1890ff',
                                                fontSize: '14px'
                                            }}
                                            onClick={handleProjectNameEdit}
                                        >
                                            <EditOutlined />
                                        </div>
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CustomerServiceOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                                        <span>客户名称</span>
                                    </div>
                                }>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>{project.clientName}</span>
                                        {project.contactNames && project.contactNames.length > 0 && (
                                            <span
                                                style={{
                                                    color: '#666',
                                                    position: 'relative',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                                                    if (editIcon) {
                                                        editIcon.style.opacity = '1';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                                                    if (editIcon) {
                                                        editIcon.style.opacity = '0';
                                                    }
                                                }}
                                            >
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
                                                                {phone ? (
                                                                    <Tooltip title={`电话：${phone}`} placement="top">
                                                                        <span style={{ cursor: 'pointer' }}>
                                                                            {name}
                                                                        </span>
                                                                    </Tooltip>
                                                                ) : (
                                                                    <span>{name}</span>
                                                                )}
                                                                {index < names.length - 1 && '，'}
                                                            </span>
                                                        );
                                                    });
                                                })()}
                                                <div
                                                    className="edit-icon"
                                                    style={{
                                                        opacity: 0,
                                                        transition: 'opacity 0.2s',
                                                        cursor: 'pointer',
                                                        color: '#1890ff',
                                                        fontSize: '14px',
                                                        marginLeft: '4px'
                                                    }}
                                                    onClick={handleContactEdit}
                                                >
                                                    <EditOutlined />
                                                </div>
                                            </span>
                                        )}
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <TeamOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                                        <span>承接团队</span>
                                    </div>
                                }>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => {
                                            const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                                            if (editIcon) {
                                                editIcon.style.opacity = '1';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                                            if (editIcon) {
                                                editIcon.style.opacity = '0';
                                            }
                                        }}
                                    >
                                        <span>{project.undertakingTeamName || project.undertakingTeam}</span>
                                        <div
                                            className="edit-icon"
                                            style={{
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                                cursor: 'pointer',
                                                color: '#1890ff',
                                                fontSize: '14px'
                                            }}
                                            onClick={handleTeamEdit}
                                        >
                                            <EditOutlined />
                                        </div>
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CalendarOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                                        <span>创建时间</span>
                                    </div>
                                }>
                                    {dayjs(project.createdAt).format('YYYY-MM-DD HH:mm')}
                                </Descriptions.Item>
                                <Descriptions.Item label={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <UserOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                                        <span>设计主创</span>
                                    </div>
                                }>
                                    {(project.mainDesignerNames || project.mainDesigners).join('，')}
                                </Descriptions.Item>
                                <Descriptions.Item label={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <UserSwitchOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                                        <span>设计助理</span>
                                    </div>
                                }>
                                    {(project.assistantDesignerNames || project.assistantDesigners).join('，')}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>



                        {/* 任务列表 */}
                        <Card title="任务列表" style={{ marginBottom: 16, width: '100%' }}>
                            <Table
                                dataSource={tasks.slice(0, 5)}
                                pagination={false}
                                size="middle"
                                rowKey="_id"
                                rowClassName={(record: Task) => `task-row-${record._id}`}
                                style={{ width: '100%' }}
                                columns={[
                                    {
                                        title: '任务名称',
                                        dataIndex: 'taskName',
                                        key: 'taskName',
                                        width: '35%',
                                        render: (text: string, record: Task) => {
                                            if (record.processSteps && record.processSteps.length > 0) {
                                                const menu = {
                                                    items: record.processSteps.map(step => ({
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
                                                    })),
                                                    onClick: ({ key }: { key: string }) => handleProcessStepChange(record, key)
                                                };

                                                return (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span>{text}</span>
                                                        <Dropdown menu={menu} trigger={['click']}>
                                                            <div
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'stretch',
                                                                    borderRadius: '4px',
                                                                    overflow: 'hidden',
                                                                    border: `1px solid ${record.currentProcessStep ?
                                                                        getProgressColor(record.currentProcessStep.progressRatio) : '#d9d9d9'}`
                                                                }}
                                                            >
                                                                {/* 节点名称部分 - 浅色背景 */}
                                                                <div
                                                                    style={{
                                                                        backgroundColor: record.currentProcessStep ?
                                                                            `${getProgressColor(record.currentProcessStep.progressRatio)}20` : '#f5f5f5',
                                                                        color: record.currentProcessStep ?
                                                                            getProgressColor(record.currentProcessStep.progressRatio) : '#8c8c8c',
                                                                        padding: '2px 8px',
                                                                        fontSize: '12px',
                                                                        fontWeight: '500',
                                                                        borderRight: record.dueDate ? `1px solid ${record.currentProcessStep ?
                                                                            getProgressColor(record.currentProcessStep.progressRatio) : '#d9d9d9'}` : 'none',
                                                                        display: 'flex',
                                                                        alignItems: 'center'
                                                                    }}
                                                                >
                                                                    {record.currentProcessStep?.name || '未设置'}
                                                                </div>

                                                                {/* 截止日期部分 - 纯色背景 */}
                                                                {record.dueDate && (
                                                                    <div
                                                                        style={{
                                                                            backgroundColor: record.currentProcessStep ?
                                                                                getProgressColor(record.currentProcessStep.progressRatio) : '#8c8c8c',
                                                                            color: '#fff',
                                                                            padding: '2px 6px',
                                                                            fontSize: '10px',
                                                                            fontWeight: 'bold',
                                                                            display: 'flex',
                                                                            alignItems: 'center'
                                                                        }}
                                                                    >
                                                                        {getDueDateDisplayText(record.dueDate)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Dropdown>
                                                    </div>
                                                );
                                            }

                                            // 如果服务没有设置流程，显示"无流程"
                                            return (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span>{text}</span>
                                                    <div
                                                        style={{
                                                            backgroundColor: '#f5f5f5',
                                                            color: '#8c8c8c',
                                                            padding: '2px 8px',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            borderRadius: '4px',
                                                            border: '1px solid #8c8c8c'
                                                        }}
                                                    >
                                                        无流程
                                                    </div>
                                                </div>
                                            );
                                        }
                                    },

                                    {
                                        title: '规格',
                                        key: 'specification',
                                        width: '15%',
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
                                        width: '10%',
                                        render: (_, record: Task) => {
                                            const menuItems = [
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
                                            ];

                                            return (
                                                <Dropdown
                                                    menu={{
                                                        items: menuItems,
                                                        onClick: ({ key }) => handlePrioritySelect(record, key)
                                                    }}
                                                    trigger={['click']}
                                                >
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
                                        width: '8%',
                                        render: (_, record: Task) => `${record.quantity}${record.unit}`
                                    },


                                    {
                                        title: '设计师',
                                        key: 'designers',
                                        width: '25%',
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
                                        width: '10%',
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
                            <Card title="附加信息" style={{ marginBottom: 16 }}>
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
                                            label: (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span>备注</span>
                                                    <EditOutlined
                                                        style={{
                                                            fontSize: '12px',
                                                            color: '#1890ff',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemarkEdit();
                                                        }}
                                                    />
                                                </div>
                                            ),
                                            children: (
                                                <div style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    lineHeight: '1.6'
                                                }}>
                                                    {project.remark}
                                                </div>
                                            )
                                        }] : [])
                                    ]}
                                />
                            </Card>
                        )}

                        {/* 如果没有备注但有客户嘱托，或者都没有，显示添加备注的卡片 */}
                        {(!project.remark && (project.clientRequirements || !project.clientRequirements)) && (
                            <Card title="附加信息" style={{ marginBottom: 16 }}>
                                <Tabs
                                    size="small"
                                    items={[
                                        ...(project.clientRequirements ? [{
                                            key: 'requirements',
                                            label: '客户嘱托',
                                            children: <p>{project.clientRequirements}</p>
                                        }] : []),
                                        {
                                            key: 'remark',
                                            label: (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span>备注</span>
                                                    <EditOutlined
                                                        style={{
                                                            fontSize: '12px',
                                                            color: '#1890ff',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemarkEdit();
                                                        }}
                                                    />
                                                </div>
                                            ),
                                            children: (
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '20px',
                                                    color: '#8c8c8c'
                                                }}>
                                                    <Button
                                                        type="dashed"
                                                        icon={<EditOutlined />}
                                                        onClick={handleRemarkEdit}
                                                    >
                                                        添加备注
                                                    </Button>
                                                </div>
                                            )
                                        }
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

            {/* 联系人编辑模态窗 */}
            <Modal
                title={`编辑项目联系人 - ${project?.clientName}`}
                open={contactModalVisible}
                onOk={handleContactUpdate}
                onCancel={() => setContactModalVisible(false)}
                confirmLoading={contactLoading}
                width={500}
            >
                <div style={{ marginBottom: 16 }}>
                    <p>请选择要关联到此项目的联系人：</p>
                </div>
                <Select
                    mode="multiple"
                    placeholder="请选择联系人"
                    value={selectedContacts}
                    onChange={setSelectedContacts}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    showSearch
                    loading={contactLoading}
                >
                    {availableContacts.map(contact => (
                        <Select.Option key={contact._id} value={contact._id}>
                            {contact.realName} {contact.position && `(${contact.position})`} {contact.phone && `- ${contact.phone}`}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>

            {/* 备注编辑模态窗 */}
            <Modal
                title="编辑项目备注"
                open={remarkModalVisible}
                onOk={handleRemarkUpdate}
                onCancel={() => setRemarkModalVisible(false)}
                confirmLoading={remarkLoading}
                width={600}
            >
                <div style={{ marginBottom: 16 }}>
                    <p>请输入项目备注信息：</p>
                </div>
                <div style={{ marginBottom: 24 }}>
                    <Input.TextArea
                        placeholder="请输入备注内容..."
                        value={remarkValue}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRemarkValue(e.target.value)}
                        rows={6}
                        style={{ width: '100%' }}
                        maxLength={1000}
                        showCount
                    />
                </div>
            </Modal>

            {/* 承接团队编辑模态窗 */}
            <Modal
                title="编辑项目承接团队"
                open={teamModalVisible}
                onOk={handleTeamUpdate}
                onCancel={() => setTeamModalVisible(false)}
                confirmLoading={teamLoading}
                width={500}
            >
                <div style={{ marginBottom: 16 }}>
                    <p>请选择项目的承接团队：</p>
                </div>
                <Select
                    placeholder="请选择承接团队"
                    value={selectedTeam}
                    onChange={setSelectedTeam}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    showSearch
                    loading={teamLoading}
                >
                    {availableEnterprises.map(enterprise => (
                        <Select.Option key={enterprise._id} value={enterprise._id}>
                            {enterprise.enterpriseName}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>

            {/* 项目名称编辑模态窗 */}
            <Modal
                title="编辑项目名称"
                open={projectNameModalVisible}
                onOk={handleProjectNameUpdate}
                onCancel={handleProjectNameCancel}
                confirmLoading={projectNameLoading}
                width={500}
            >
                <div style={{ marginBottom: 16 }}>
                    <p>请输入新的项目名称：</p>
                </div>
                <Input
                    placeholder="请输入项目名称..."
                    value={projectNameValue}
                    onChange={(e) => setProjectNameValue(e.target.value)}
                    style={{ width: '100%' }}
                    maxLength={100}
                    showCount
                />
            </Modal>
        </div>
    );
};

export default ProjectDetail; 