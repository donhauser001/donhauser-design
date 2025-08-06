import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    Card,
    message,
    Space,
    Row,
    Col,
    Divider,
    DatePicker,
    InputNumber,
    Tag,
    Modal
} from 'antd';
import {
    SaveOutlined,
    PlusOutlined,
    DeleteOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface Client {
    _id: string;
    name: string;
}

interface Contact {
    _id: string;
    realName: string;
    phone: string;
    email?: string;
    username?: string;
}

interface Service {
    _id: string;
    serviceName: string;
    unitPrice: number;
    unit: string;
}

interface Task {
    taskName: string;
    serviceId: string;
    assignedDesigners: string[];
    specificationId?: string;
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
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: string;
    remarks?: string;
}

const CreateProject: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    // 获取客户列表
    const fetchClients = async () => {
        try {
            const response = await fetch('/api/clients?limit=100');
            const data = await response.json();
            if (data.success) {
                setClients(data.data);
            }
        } catch (error) {
            console.error('获取客户列表失败:', error);
        }
    };

    // 获取联系人列表
    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/users?limit=100');
            const data = await response.json();
            if (data.success) {
                setContacts(data.data);
            }
        } catch (error) {
            console.error('获取联系人列表失败:', error);
        }
    };

    // 获取服务列表
    const fetchServices = async () => {
        try {
            const response = await fetch('/api/service-pricing?limit=100');
            const data = await response.json();
            if (data.success) {
                setServices(data.data);
            }
        } catch (error) {
            console.error('获取服务列表失败:', error);
        }
    };

    useEffect(() => {
        fetchClients();
        fetchContacts();
        fetchServices();
    }, []);

    // 处理客户选择
    const handleClientChange = (clientId: string) => {
        const client = clients.find(c => c._id === clientId);
        setSelectedClient(client || null);

        if (client) {
            form.setFieldsValue({
                clientName: client.name,
                contactIds: [],
                contactNames: [],
                contactPhones: []
            });
        }
    };

    // 处理联系人选择
    const handleContactChange = (contactIds: string[]) => {
        const selectedContacts = contacts.filter(
            contact => contactIds.includes(contact._id)
        );

        form.setFieldsValue({
            contactNames: selectedContacts.map(c => c.realName),
            contactPhones: selectedContacts.map(c => c.phone)
        });
    };

    // 添加任务
    const addTask = () => {
        const newTask: Task = {
            taskName: '',
            serviceId: '',
            assignedDesigners: [],
            quantity: 1,
            unit: '',
            subtotal: 0,
            pricingPolicies: [],
            billingDescription: '',
            priority: 'medium',
            remarks: ''
        };
        setTasks([...tasks, newTask]);
    };

    // 删除任务
    const removeTask = (index: number) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    // 更新任务
    const updateTask = (index: number, field: keyof Task, value: any) => {
        const newTasks = [...tasks];
        newTasks[index] = { ...newTasks[index], [field]: value };
        setTasks(newTasks);
    };

    // 计算任务小计
    const calculateSubtotal = (task: Task) => {
        const service = services.find(s => s._id === task.serviceId);
        if (!service) return 0;

        let subtotal = service.unitPrice * task.quantity;

        // 应用价格政策
        task.pricingPolicies.forEach(policy => {
            if (policy.policyType === 'uniform_discount') {
                subtotal *= (1 - policy.discountRatio);
            }
        });

        return Math.round(subtotal * 100) / 100;
    };

    // 提交表单
    const handleSubmit = async (values: any) => {
        if (tasks.length === 0) {
            message.warning('请至少添加一个任务');
            return;
        }

        setLoading(true);
        try {
            const projectData = {
                ...values,
                tasks: tasks.map(task => ({
                    ...task,
                    subtotal: calculateSubtotal(task)
                }))
            };

            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            });

            const data = await response.json();

            if (data.success) {
                message.success('项目创建成功');
                navigate('/projects');
            } else {
                message.error(data.message || '创建失败');
            }
        } catch (error) {
            console.error('创建项目失败:', error);
            message.error('创建项目失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card
                title="创建新项目"
                extra={
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/projects')}
                        >
                            返回
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            loading={loading}
                            onClick={() => form.submit()}
                        >
                            保存项目
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        progressStatus: 'consulting',
                        settlementStatus: 'unpaid',
                        mainDesigners: [],
                        assistantDesigners: []
                    }}
                >
                    {/* 基本信息 */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="projectName"
                                label="项目名称"
                                rules={[{ required: true, message: '请输入项目名称' }]}
                            >
                                <Input placeholder="请输入项目名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="undertakingTeam"
                                label="承接团队"
                                rules={[{ required: true, message: '请选择承接团队' }]}
                            >
                                <Select placeholder="请选择承接团队">
                                    <Option value="team1">设计团队A</Option>
                                    <Option value="team2">设计团队B</Option>
                                    <Option value="team3">设计团队C</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* 客户信息 */}
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="clientId"
                                label="客户"
                                rules={[{ required: true, message: '请选择客户' }]}
                            >
                                <Select
                                    placeholder="请选择客户"
                                    onChange={handleClientChange}
                                    showSearch
                                    filterOption={(input, option) => {
                                        const label = option?.label || option?.children;
                                        return String(label).toLowerCase().includes(input.toLowerCase());
                                    }}
                                >
                                    {clients.map(client => (
                                        <Option key={client._id} value={client._id}>
                                            {client.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="contactIds"
                                label="联系人"
                                rules={[{ required: true, message: '请选择联系人' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="请选择联系人"
                                    onChange={handleContactChange}
                                    showSearch
                                    filterOption={(input, option) => {
                                        const label = option?.label || option?.children;
                                        return String(label).toLowerCase().includes(input.toLowerCase());
                                    }}
                                >
                                    {contacts.map(contact => (
                                        <Option key={contact._id} value={contact._id}>
                                            {contact.realName} ({contact.phone})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="clientRequirements" label="客户嘱托">
                                <TextArea rows={3} placeholder="请输入客户嘱托" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* 隐藏字段用于存储客户和联系人信息 */}
                    <Form.Item name="clientName" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contactNames" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contactPhones" hidden>
                        <Input />
                    </Form.Item>

                    {/* 团队信息 */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="mainDesigners"
                                label="主创设计师"
                                rules={[{ required: true, message: '请选择主创设计师' }]}
                            >
                                <Select mode="multiple" placeholder="请选择主创设计师">
                                    <Option value="designer1">设计师A</Option>
                                    <Option value="designer2">设计师B</Option>
                                    <Option value="designer3">设计师C</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="assistantDesigners"
                                label="助理设计师"
                            >
                                <Select mode="multiple" placeholder="请选择助理设计师">
                                    <Option value="assistant1">助理A</Option>
                                    <Option value="assistant2">助理B</Option>
                                    <Option value="assistant3">助理C</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* 备注 */}
                    <Form.Item name="remark" label="备注">
                        <TextArea rows={3} placeholder="请输入备注信息" />
                    </Form.Item>

                    <Divider>任务信息</Divider>

                    {/* 任务列表 */}
                    {tasks.map((task, index) => (
                        <Card
                            key={index}
                            size="small"
                            style={{ marginBottom: 16 }}
                            title={`任务 ${index + 1}`}
                            extra={
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeTask(index)}
                                />
                            }
                        >
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label="任务名称">
                                        <Input
                                            value={task.taskName}
                                            onChange={(e) => updateTask(index, 'taskName', e.target.value)}
                                            placeholder="请输入任务名称"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="服务类型">
                                        <Select
                                            value={task.serviceId}
                                            onChange={(value) => updateTask(index, 'serviceId', value)}
                                            placeholder="请选择服务类型"
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
                                        >
                                            <Option value="low">低</Option>
                                            <Option value="medium">中</Option>
                                            <Option value="high">高</Option>
                                            <Option value="urgent">紧急</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item label="数量">
                                        <InputNumber
                                            value={task.quantity}
                                            onChange={(value) => updateTask(index, 'quantity', value)}
                                            min={1}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="单位">
                                        <Input
                                            value={task.unit}
                                            onChange={(e) => updateTask(index, 'unit', e.target.value)}
                                            placeholder="如：本、张、款"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="小计">
                                        <Input
                                            value={`¥${calculateSubtotal(task)}`}
                                            disabled
                                            style={{ color: '#1890ff', fontWeight: 'bold' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="截止日期">
                                        <DatePicker
                                            value={task.dueDate ? dayjs(task.dueDate) : undefined}
                                            onChange={(date) => updateTask(index, 'dueDate', date?.format('YYYY-MM-DD'))}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="计费说明">
                                <TextArea
                                    value={task.billingDescription}
                                    onChange={(e) => updateTask(index, 'billingDescription', e.target.value)}
                                    placeholder="请详细说明计费方式"
                                    rows={2}
                                />
                            </Form.Item>

                            <Form.Item label="备注">
                                <TextArea
                                    value={task.remarks}
                                    onChange={(e) => updateTask(index, 'remarks', e.target.value)}
                                    placeholder="请输入任务备注"
                                    rows={2}
                                />
                            </Form.Item>
                        </Card>
                    ))}

                    {/* 添加任务按钮 */}
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={addTask}
                        style={{ width: '100%', marginBottom: 24 }}
                    >
                        添加任务
                    </Button>

                    {/* 总计 */}
                    {tasks.length > 0 && (
                        <Card size="small">
                            <Row justify="end">
                                <Col>
                                    <Tag color="blue" style={{ fontSize: '16px', padding: '8px 16px' }}>
                                        项目总计: ¥{tasks.reduce((sum, task) => sum + calculateSubtotal(task), 0)}
                                    </Tag>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </Form>
            </Card>
        </div>
    );
};

export default CreateProject; 