import { message } from 'antd';
import { ProjectFormData, Task } from './types';

export const createProject = async (projectData: any, servicesData: any[]) => {
    try {
        const requestData = {
            project: projectData,
            services: servicesData
        };

        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || '项目创建失败');
        }
    } catch (error) {
        console.error('创建项目失败:', error);
        throw error;
    }
};

export const validateProjectData = (formData: ProjectFormData, tasks: Task[]): boolean => {
    // 验证基本信息
    if (!formData.projectName?.trim()) {
        message.error('请输入项目名称');
        return false;
    }

    if (!formData.clientId) {
        message.error('请选择客户');
        return false;
    }

    if (!formData.contactIds || formData.contactIds.length === 0) {
        message.error('请选择联系人');
        return false;
    }

    if (!formData.undertakingTeam) {
        message.error('请选择承接团队');
        return false;
    }

    if (!formData.mainDesigners || formData.mainDesigners.length === 0) {
        message.error('请选择主创设计师');
        return false;
    }

    // 验证任务信息
    if (tasks.length === 0) {
        message.error('请至少添加一个任务');
        return false;
    }

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (!task.taskName?.trim()) {
            message.error(`任务 ${i + 1} 的名称不能为空`);
            return false;
        }

        if (!task.serviceId) {
            message.error(`任务 ${i + 1} 请选择服务类型`);
            return false;
        }

        if (!task.quantity || task.quantity <= 0) {
            message.error(`任务 ${i + 1} 的数量必须大于0`);
            return false;
        }

        if (!task.unit?.trim()) {
            message.error(`任务 ${i + 1} 请输入单位`);
            return false;
        }
    }

    return true;
}; 