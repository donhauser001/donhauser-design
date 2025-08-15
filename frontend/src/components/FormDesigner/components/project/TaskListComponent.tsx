import React, { useEffect, useState } from 'react';
import { Table, Alert, Typography, Tag, Card } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

const { Text } = Typography;

// 任务列表项接口
interface TaskListItem {
    id: string;
    taskName: string;
    taskCategory: string;  // 任务类别
    specification: string; // 规格
    quantity: number;
    unit: string;
}

interface TaskListComponentProps {
    component: FormComponent;
}

const TaskListComponent: React.FC<TaskListComponentProps> = ({ component }) => {
    const { components, getComponentValue, updateComponent, theme } = useFormDesignerStore();
    const primaryColor = theme.primaryColor || '#1890ff';
    const [taskListItems, setTaskListItems] = useState<TaskListItem[]>([]);
    const [loading, setLoading] = useState(false);

    // 检查画布上是否存在项目名称组件和订单组件
    const hasProjectNameComponent = components.some((comp: FormComponent) => comp.type === 'projectName');
    const hasOrderComponent = components.some((comp: FormComponent) => comp.type === 'order');

    // 获取选中的项目ID（从项目名称组件的componentValues中获取）
    const getSelectedProjectId = (): string | null => {
        const projectNameComponent = components.find(comp => comp.type === 'projectName');
        if (!projectNameComponent) return null;

        const selectedProject = getComponentValue(projectNameComponent.id);

        if (typeof selectedProject === 'object' && selectedProject?._id) {
            return selectedProject._id;
        }

        return null;
    };

    // 获取当前选中的项目（用于监听值变化）
    const projectNameComponent = components.find(comp => comp.type === 'projectName');
    const selectedProject = projectNameComponent ? getComponentValue(projectNameComponent.id) : null;

    // 加载项目任务
    const loadProjectTasks = async (projectId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/tasks/project/${projectId}`);
            const data = await response.json();

            if (data.success && data.data) {
                // 将任务转换为任务列表项格式
                const taskListData: TaskListItem[] = data.data.map((task: any) => {
                    // 处理规格信息
                    let specificationName = '无规格';
                    if (task.specification && task.specification.name) {
                        specificationName = task.specification.name;
                    }

                    // 使用真实的服务类别数据
                    const categoryName = task.categoryName || '默认类别';

                    return {
                        id: task._id,
                        taskName: task.taskName,
                        taskCategory: categoryName,  // 真实的服务类别
                        specification: specificationName,  // 规格
                        quantity: task.quantity,
                        unit: task.unit
                    };
                });

                setTaskListItems(taskListData);
            }
        } catch (error) {
            console.error('获取项目任务失败:', error);
            setTaskListItems([]);
        } finally {
            setLoading(false);
        }
    };

    // 自动控制项目名称组件的"来自项目表"开关
    // 只有在没有订单组件的情况下才自动控制，避免冲突
    useEffect(() => {
        if (hasProjectNameComponent && !hasOrderComponent) {
            const projectNameComponent = components.find(comp => comp.type === 'projectName');
            if (projectNameComponent && !projectNameComponent.fromProjectTable) {
                updateComponent(projectNameComponent.id, { fromProjectTable: true });
            }
        }
    }, [hasProjectNameComponent, hasOrderComponent, components, updateComponent]);

    // 监听项目选择变化
    useEffect(() => {
        if (hasProjectNameComponent) {
            const projectId = getSelectedProjectId();
            if (projectId) {
                loadProjectTasks(projectId);
            } else {
                setTaskListItems([]);
            }
        }
    }, [hasProjectNameComponent, selectedProject?._id]);

    // 如果没有项目名称组件，显示提示信息
    if (!hasProjectNameComponent) {
        return (
            <div style={{
                width: '100%',
                ...component.style
            }}>
                <Alert
                    message="任务列表组件需要配合项目名称组件使用，请先在画布中添加项目名称组件"
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    style={{ fontSize: '12px' }}
                />
                {component.fieldDescription && (
                    <div style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        marginTop: '4px',
                        lineHeight: '1.4'
                    }}>
                        提示：{component.fieldDescription}
                    </div>
                )}
            </div>
        );
    }



    // 定义表格列
    const columns = [
        {
            title: '任务名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: '35%',
            render: (text: string) => (
                <Text strong style={{ fontSize: '14px' }}>{text}</Text>
            )
        },
        {
            title: '任务类别',
            dataIndex: 'taskCategory',
            key: 'taskCategory',
            width: '20%',
            render: (category: string) => (
                <Tag color={primaryColor}>{category}</Tag>
            )
        },
        {
            title: '规格',
            dataIndex: 'specification',
            key: 'specification',
            width: '25%',
            render: (specification: string) => (
                <Tag color="green">{specification}</Tag>
            )
        },
        {
            title: '数量',
            key: 'quantity',
            width: '20%',
            render: (record: TaskListItem) => (
                <Text strong style={{ color: primaryColor }}>
                    {record.quantity} {record.unit}
                </Text>
            )
        }
    ];

    // 获取标题显示内容
    const getCardTitle = () => {
        const { titleDisplay = 'show', customTitle = '任务列表' } = component;

        if (titleDisplay === 'hide') {
            return undefined;
        } else if (titleDisplay === 'custom') {
            return customTitle || '任务列表';
        } else {
            return '任务列表';
        }
    };

    // 计算总数量
    const getTotalQuantity = () => {
        return taskListItems.reduce((total, task) => total + task.quantity, 0);
    };

    // 静态文本模式：只显示纯文本，无任何容器
    if (component.displayMode === 'text') {
        if (taskListItems.length === 0) {
            return (
                <Text type="secondary" style={{ fontSize: '14px' }}>
                    {selectedProject ? '该项目暂无任务' : '请在项目名称组件中选择一个项目'}
                </Text>
            );
        }
        return (
            <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
                {taskListItems.map(task => task.taskName).join('、')}
            </Text>
        );
    }

    // 列表模式：显示完整的卡片和表格
    return (
        <div style={{
            width: '100%',
            ...component.style
        }}>
            <Card
                title={getCardTitle()}
                size="small"
                style={{ width: '100%' }}
                extra={
                    taskListItems.length > 0 && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            共 {taskListItems.length} 项任务，总数量: {getTotalQuantity()}
                        </Text>
                    )
                }
            >
                {taskListItems.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#999',
                        backgroundColor: '#fafafa',
                        borderRadius: '6px'
                    }}>
                        <Text type="secondary">
                            {selectedProject ? '该项目暂无任务' : '请在项目名称组件中选择一个项目'}
                        </Text>
                    </div>
                ) : (
                    // 列表模式：显示完整表格
                    <Table
                        dataSource={taskListItems}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        scroll={{ x: 'max-content' }}
                        loading={loading}
                    />
                )}
            </Card>

            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4'
                }}>
                    提示：{component.fieldDescription}
                </div>
            )}


        </div>
    );
};

export default TaskListComponent; 