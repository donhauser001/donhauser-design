import { useState, useEffect } from 'react';
import { message } from 'antd';
import { Project, Task } from '../types';
import { calculateProjectProgress } from '../utils';

export const useProjectDetail = (projectId: string) => {
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    // 获取项目详情
    const fetchProject = async () => {
        if (!projectId) return;

        try {
            const response = await fetch(`/api/projects/${projectId}`);
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
        if (!projectId) return;

        try {
            const response = await fetch(`/api/projects/${projectId}/tasks`);
            const data = await response.json();

            if (data.success) {
                setTasks(data.data || []);
            } else {
                message.error('获取任务列表失败');
            }
        } catch (error) {
            message.error('获取任务列表失败');
        }
    };

    // 更新项目进度
    const updateProjectProgress = async (newProgress: number) => {
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
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
        if (!projectId || tasks.length === 0) return;

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
            const response = await fetch(`/api/projects/${projectId}`, {
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

    // 初始化数据
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
    }, [projectId]);

    return {
        project,
        tasks,
        loading,
        fetchProject,
        fetchTasks,
        updateProjectProgress,
        updateProjectDesigners
    };
}; 