import dayjs from 'dayjs';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    FireOutlined,
    ThunderboltOutlined,
    SmileOutlined,
    MailOutlined,
    PauseOutlined
} from '@ant-design/icons';
import { Task } from './types';

// 计算截止日期显示文本
export const getDueDateDisplayText = (dueDate: string) => {
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
export const getDueDateColor = (dueDate: string) => {
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

// 状态标签颜色映射
export const getProgressStatusColor = (status: string) => {
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

export const getSettlementStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        'unpaid': 'error',
        'prepaid': 'warning',
        'partial-paid': 'orange',
        'fully-paid': 'success'
    };
    return colors[status] || 'default';
};

// 状态文本映射
export const getProgressStatusText = (status: string) => {
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

export const getSettlementStatusText = (status: string) => {
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
export const getTaskStatusText = (status: string) => {
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
export const getTaskStatusColor = (status: string) => {
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
export const getPriorityText = (priority: string) => {
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
export const getPriorityColor = (priority: string) => {
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
export const getPriorityIcon = (priority: string) => {
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
export const calculateProjectProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;

    const totalProgress = tasks.reduce((sum, task) => {
        const taskProgress = task.currentProcessStep?.progressRatio || 0;
        return sum + taskProgress;
    }, 0);

    return Math.round(totalProgress / tasks.length);
};

// 根据进度比例获取颜色
export const getProgressColor = (progressRatio: number) => {
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