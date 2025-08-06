import React from 'react';
import { Form, Input, Select, Row, Col, Card, Button, DatePicker, InputNumber, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Task, Service } from '../types';

const { Option } = Select;
const { TextArea } = Input;

interface TasksTabProps {
    tasks: Task[];
    services: Service[];
    addTask: () => void;
    removeTask: (index: number) => void;
    updateTask: (index: number, field: keyof Task, value: any) => void;
    calculateSubtotal: (task: Task) => number;
}

const TasksTab: React.FC<TasksTabProps> = ({
    tasks,
    services,
    addTask,
    removeTask,
    updateTask,
    calculateSubtotal
}) => {
    return (
        <div>
            {/* 任务列表 */}
            {tasks.map((task, index) => (
                <Card
                    key={index}
                    size="small"
                    style={{
                        marginBottom: 16,
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#1890ff', fontWeight: 'bold' }}>任务 {index + 1}</span>
                            {task.priority && (
                                <Tag color={
                                    task.priority === 'urgent' ? 'red' :
                                        task.priority === 'high' ? 'orange' :
                                            task.priority === 'medium' ? 'blue' : 'green'
                                }>
                                    {task.priority === 'urgent' ? '紧急' :
                                        task.priority === 'high' ? '高' :
                                            task.priority === 'medium' ? '中' : '低'}
                                </Tag>
                            )}
                        </div>
                    }
                    extra={
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeTask(index)}
                            size="small"
                        />
                    }
                >
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item label="任务名称" required>
                                <Input
                                    value={task.taskName}
                                    onChange={(e) => updateTask(index, 'taskName', e.target.value)}
                                    placeholder="请输入任务名称"
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="服务类型" required>
                                <Select
                                    value={task.serviceId}
                                    onChange={(value) => updateTask(index, 'serviceId', value)}
                                    placeholder="请选择服务类型"
                                    style={{ borderRadius: '6px' }}
                                >
                                    {services.map(service => (
                                        <Option key={service._id} value={service._id}>
                                            {service.serviceName} ({service.unitPrice}元/{service.unit})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="优先级">
                                <Select
                                    value={task.priority}
                                    onChange={(value) => updateTask(index, 'priority', value)}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <Option value="low">低</Option>
                                    <Option value="medium">中</Option>
                                    <Option value="high">高</Option>
                                    <Option value="urgent">紧急</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item label="数量" required>
                                <InputNumber
                                    value={task.quantity}
                                    onChange={(value) => updateTask(index, 'quantity', value)}
                                    min={1}
                                    style={{ width: '100%', borderRadius: '6px' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="单位" required>
                                <Input
                                    value={task.unit}
                                    onChange={(e) => updateTask(index, 'unit', e.target.value)}
                                    placeholder="如：本、张、款"
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="小计">
                                <Input
                                    value={`¥${calculateSubtotal(task)}`}
                                    disabled
                                    style={{
                                        color: '#1890ff',
                                        fontWeight: 'bold',
                                        borderRadius: '6px',
                                        backgroundColor: '#f0f8ff'
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="截止日期">
                                <DatePicker
                                    value={task.dueDate ? dayjs(task.dueDate) : undefined}
                                    onChange={(date) => updateTask(index, 'dueDate', date?.format('YYYY-MM-DD'))}
                                    style={{ width: '100%', borderRadius: '6px' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label="计费说明">
                                <TextArea
                                    value={task.billingDescription}
                                    onChange={(e) => updateTask(index, 'billingDescription', e.target.value)}
                                    placeholder="请详细说明计费方式"
                                    rows={2}
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="任务备注">
                                <TextArea
                                    value={task.remarks}
                                    onChange={(e) => updateTask(index, 'remarks', e.target.value)}
                                    placeholder="请输入任务备注"
                                    rows={2}
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            ))}

            {/* 添加任务按钮 */}
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={addTask}
                    size="large"
                    style={{
                        width: '200px',
                        height: '50px',
                        borderRadius: '8px',
                        borderStyle: 'dashed',
                        borderColor: '#1890ff',
                        color: '#1890ff'
                    }}
                >
                    添加任务
                </Button>
            </div>

            {/* 总计 */}
            {tasks.length > 0 && (
                <Card
                    size="small"
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '8px'
                    }}
                >
                    <Row justify="space-between" align="middle">
                        <Col>
                            <div style={{ color: 'white', fontSize: '14px' }}>
                                项目包含 <strong>{tasks.length}</strong> 个任务
                            </div>
                        </Col>
                        <Col>
                            <Tag
                                color="white"
                                style={{
                                    fontSize: '18px',
                                    padding: '12px 20px',
                                    color: '#1890ff',
                                    fontWeight: 'bold',
                                    borderRadius: '6px'
                                }}
                            >
                                项目总计: ¥{tasks.reduce((sum, task) => sum + calculateSubtotal(task), 0)}
                            </Tag>
                        </Col>
                    </Row>
                </Card>
            )}
        </div>
    );
};

export default TasksTab; 