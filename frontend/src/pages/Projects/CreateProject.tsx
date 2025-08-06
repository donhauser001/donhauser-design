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
    Modal,
    Tabs
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
    company?: string;
    position?: string;
}

interface Enterprise {
    _id: string;
    enterpriseName: string;
    enterpriseAlias?: string;
    creditCode: string;
    status: 'active' | 'inactive';
}

interface Designer {
    _id: string;
    realName: string;
    position?: string;
    role: string;
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
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [designers, setDesigners] = useState<Designer[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    // 根据选择的客户过滤联系人
    const filteredContacts = selectedClient
        ? contacts.filter(contact => contact.company === selectedClient.name)
        : [];

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

    // 获取企业列表
    const fetchEnterprises = async () => {
        try {
            const response = await fetch('/api/enterprises?status=active&limit=100');
            const data = await response.json();
            if (data.success) {
                setEnterprises(data.data);
            }
        } catch (error) {
            console.error('获取企业列表失败:', error);
        }
    };

    // 获取设计师列表（员工和超级管理员）
    const fetchDesigners = async () => {
        try {
            const response = await fetch('/api/users?limit=100');
            const data = await response.json();
            if (data.success) {
                // 过滤出员工和超级管理员角色的用户
                const designerUsers = data.data.filter((user: any) =>
                    user.role === '员工' || user.role === '超级管理员'
                );
                setDesigners(designerUsers);
            }
        } catch (error) {
            console.error('获取设计师列表失败:', error);
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
        fetchEnterprises();
        fetchDesigners();
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
        const selectedContacts = filteredContacts.filter(
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
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>创建新项目</span>
                        <Tag color="blue">项目信息</Tag>
                    </div>
                }
                extra={
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/projects')}
                        >
                            返回列表
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            loading={loading}
                            onClick={() => form.submit()}
                            size="large"
                        >
                            保存项目
                        </Button>
                    </Space>
                }
                style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    marginBottom: '24px'
                }}
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
                    <Tabs
                        defaultActiveKey="basic"
                        type="card"
                        size="large"
                        style={{ marginBottom: 24 }}
                        items={[
                            {
                                key: 'basic',
                                label: (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#1890ff' }}>📋</span>
                                        <span>基本信息</span>
                                    </div>
                                ),
                                children: (
                                    <div>
                                        {/* 基本信息 */}
                                        <Card
                                            size="small"
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ color: '#1890ff' }}>📋</span>
                                                    <span>基本信息</span>
                                                </div>
                                            }
                                            style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
                                        >
                                            <Row gutter={24}>
                                                <Col span={24}>
                                                    <Form.Item
                                                        name="projectName"
                                                        label="项目名称"
                                                        rules={[{ required: true, message: '请输入项目名称' }]}
                                                    >
                                                        <Input placeholder="请输入项目名称" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Card>

                                        {/* 客户信息 */}
                                        <Card
                                            size="small"
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ color: '#52c41a' }}>👥</span>
                                                    <span>客户信息</span>
                                                </div>
                                            }
                                            style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
                                        >
                                            <Row gutter={24}>
                                                <Col span={12}>
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
                                                    <Form.Item
                                                        name="contactIds"
                                                        label="联系人"
                                                        rules={[{ required: true, message: '请选择联系人' }]}
                                                    >
                                                        <Select
                                                            mode="multiple"
                                                            placeholder={selectedClient ? `请选择 ${selectedClient.name} 的联系人` : '请先选择客户'}
                                                            onChange={handleContactChange}
                                                            showSearch
                                                            disabled={!selectedClient}
                                                            filterOption={(input, option) => {
                                                                const label = option?.label || option?.children;
                                                                return String(label).toLowerCase().includes(input.toLowerCase());
                                                            }}
                                                        >
                                                            {filteredContacts.map(contact => (
                                                                <Option key={contact._id} value={contact._id}>
                                                                    {contact.realName} {contact.position ? `(${contact.position})` : ''}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item name="clientRequirements" label="客户嘱托">
                                                        <TextArea rows={6} placeholder="请输入客户嘱托" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Card>

                                        {/* 团队信息 */}
                                        <Card
                                            size="small"
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ color: '#fa8c16' }}>👨‍🎨</span>
                                                    <span>团队信息</span>
                                                </div>
                                            }
                                            style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
                                        >
                                            <Row gutter={24}>
                                                <Col span={8}>
                                                    <Form.Item
                                                        name="undertakingTeam"
                                                        label="承接团队"
                                                        rules={[{ required: true, message: '请选择承接团队' }]}
                                                    >
                                                        <Select
                                                            placeholder="请选择承接团队"
                                                            showSearch
                                                            filterOption={(input, option) => {
                                                                const label = option?.label || option?.children;
                                                                return String(label).toLowerCase().includes(input.toLowerCase());
                                                            }}
                                                        >
                                                            {enterprises.map(enterprise => (
                                                                <Option key={enterprise._id} value={enterprise._id}>
                                                                    {enterprise.enterpriseAlias || enterprise.enterpriseName}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item
                                                        name="mainDesigners"
                                                        label="主创设计师"
                                                        rules={[{ required: true, message: '请选择主创设计师' }]}
                                                    >
                                                        <Select
                                                            mode="multiple"
                                                            placeholder="请选择主创设计师"
                                                            showSearch
                                                            filterOption={(input, option) => {
                                                                const label = option?.label || option?.children;
                                                                return String(label).toLowerCase().includes(input.toLowerCase());
                                                            }}
                                                        >
                                                            {designers.map(designer => (
                                                                <Option key={designer._id} value={designer._id}>
                                                                    {designer.realName} {designer.position ? `(${designer.position})` : ''}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={8}>
                                                    <Form.Item
                                                        name="assistantDesigners"
                                                        label="助理设计师"
                                                    >
                                                        <Select
                                                            mode="multiple"
                                                            placeholder="请选择助理设计师"
                                                            showSearch
                                                            filterOption={(input, option) => {
                                                                const label = option?.label || option?.children;
                                                                return String(label).toLowerCase().includes(input.toLowerCase());
                                                            }}
                                                        >
                                                            {designers.map(designer => (
                                                                <Option key={designer._id} value={designer._id}>
                                                                    {designer.realName} {designer.position ? `(${designer.position})` : ''}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Card>

                                        {/* 备注 */}
                                        <Card
                                            size="small"
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ color: '#722ed1' }}>📝</span>
                                                    <span>备注信息</span>
                                                </div>
                                            }
                                            style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
                                        >
                                            <Form.Item name="remark" label="项目备注">
                                                <TextArea rows={3} placeholder="请输入项目备注信息" />
                                            </Form.Item>
                                        </Card>
                                    </div>
                                )
                            },
                            {
                                key: 'tasks',
                                label: (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#eb2f96' }}>📋</span>
                                        <span>任务信息</span>
                                        <Tag color="orange">{tasks.length}</Tag>
                                    </div>
                                ),
                                children: (
                                    <div>
                                        {/* 任务信息 */}
                                        <Card
                                            size="small"
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ color: '#eb2f96' }}>📋</span>
                                                    <span>任务信息</span>
                                                    <Tag color="orange">{tasks.length} 个任务</Tag>
                                                </div>
                                            }
                                            style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
                                        >

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
                                )
                            },
                            {
                                key: 'order',
                                label: (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ color: '#13c2c2' }}>💰</span>
                                        <span>订单信息</span>
                                    </div>
                                ),
                                children: (
                                    <div>
                                        {/* 订单信息 */}
                                        <Card
                                            size="small"
                                            title={
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ color: '#13c2c2' }}>💰</span>
                                                    <span>订单信息</span>
                                                </div>
                                            }
                                            style={{ marginBottom: '24px', border: '1px solid #e8e8e8' }}
                                        >
                                            <Row gutter={24}>
                                                <Col span={12}>
                                                    <Form.Item name="orderNumber" label="订单编号">
                                                        <Input placeholder="系统自动生成" disabled />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item name="orderDate" label="订单日期">
                                                        <DatePicker 
                                                            style={{ width: '100%' }} 
                                                            placeholder="请选择订单日期"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={24}>
                                                <Col span={12}>
                                                    <Form.Item name="paymentTerms" label="付款条件">
                                                        <Select placeholder="请选择付款条件">
                                                            <Option value="advance">预付款</Option>
                                                            <Option value="installment">分期付款</Option>
                                                            <Option value="completion">完工付款</Option>
                                                            <Option value="monthly">月结</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item name="deliveryDate" label="交付日期">
                                                        <DatePicker 
                                                            style={{ width: '100%' }} 
                                                            placeholder="请选择交付日期"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={24}>
                                                <Col span={24}>
                                                    <Form.Item name="orderRemarks" label="订单备注">
                                                        <TextArea rows={4} placeholder="请输入订单备注信息" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </div>
                                )
                            }
                        ]}
                    />

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
                </Form>
            </Card>
        </div>
    );
};

export default CreateProject; 