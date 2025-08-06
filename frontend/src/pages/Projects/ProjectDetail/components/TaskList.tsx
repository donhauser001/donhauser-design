import React from 'react';
import { Card, Table, Button, Tag, Space, Tooltip, Dropdown } from 'antd';
import { EditOutlined, WalletOutlined, CreditCardOutlined, DollarOutlined, CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SpecificationSelector from '../../../../components/SpecificationSelector';
import { Task } from '../types';
import {
    getDueDateDisplayText,
    getProgressColor,
    getPriorityText,
    getPriorityColor,
    getPriorityIcon,
    getSettlementStatusText
} from '../utils';

interface TaskListProps {
    tasks: Task[];
    projectId: string;
    onAssignDesigners: (task: Task) => void;
    onPrioritySelect: (task: Task, priority: string) => void;
    onSpecificationChange: (task: Task, specification: any) => void;
    onProcessStepChange: (task: Task, stepId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
    tasks,
    projectId,
    onAssignDesigners,
    onPrioritySelect,
    onSpecificationChange,
    onProcessStepChange
}) => {
    const navigate = useNavigate();

    const columns = [
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
                        onClick: ({ key }: { key: string }) => onProcessStepChange(record, key)
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
                    onChange={(specification) => onSpecificationChange(record, specification)}
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
                                <span style={{ color: '#ff4500' }}>🔥</span>
                                <span>十万火急</span>
                            </div>
                        )
                    },
                    {
                        key: 'high',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#ffa500' }}>⚡</span>
                                <span>尽快完成</span>
                            </div>
                        )
                    },
                    {
                        key: 'medium',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#2c65da' }}>⏰</span>
                                <span>正常进行</span>
                            </div>
                        )
                    },
                    {
                        key: 'low',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#159ebb' }}>😊</span>
                                <span>不太着急</span>
                            </div>
                        )
                    },
                    {
                        key: 'waiting',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#9370db' }}>📧</span>
                                <span>等待反馈</span>
                            </div>
                        )
                    },
                    {
                        key: 'on-hold',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#808080' }}>⏸️</span>
                                <span>暂时搁置</span>
                            </div>
                        )
                    },
                    {
                        key: 'completed',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#f35c43' }}>✅</span>
                                <span>完工大吉</span>
                            </div>
                        )
                    }
                ];

                return (
                    <Dropdown
                        menu={{
                            items: menuItems,
                            onClick: ({ key }) => onPrioritySelect(record, key)
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
                                    onClick={() => onAssignDesigners(record)}
                                >
                                    指定
                                </Button>
                            )}
                        </div>
                        {hasAnyDesigners && (
                            <EditOutlined
                                className="edit-icon"
                                onClick={() => onAssignDesigners(record)}
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
    ];

    return (
        <Card title="任务列表" style={{ marginBottom: 16, width: '100%' }}>
            <Table
                dataSource={tasks.slice(0, 5)}
                pagination={false}
                size="middle"
                rowKey="_id"
                rowClassName={(record: Task) => `task-row-${record._id}`}
                style={{ width: '100%' }}
                columns={columns}
            />
            {tasks.length > 5 && (
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                    <Button type="link" onClick={() => navigate(`/projects/${projectId}/tasks`)}>
                        查看全部任务 ({tasks.length})
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default TaskList; 