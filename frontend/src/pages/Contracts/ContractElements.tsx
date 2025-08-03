import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    Button,
    Space,
    Input,
    Select,
    Modal,
    Form,
    message,
    Tag,
    Tooltip,
    Popconfirm,
    Row,
    Col,
    Typography,
    Divider
} from 'antd'
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined
} from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input
const { Text, Title } = Typography

// 合同元素接口
export interface ContractElement {
    id: string
    name: string
    type: 'header' | 'signature' | 'order' | 'quotation' | 'short_text' | 'paragraph_text' | 'preset_text' | 'dropdown' | 'radio' | 'checkbox' | 'money' | 'money_cn' | 'number' | 'date' | 'project' | 'task'
    description: string
    status: 'active' | 'inactive'
    createTime: string
    updateTime: string
    createdBy: string
}

// 元素类型配置
const ELEMENT_TYPES = {
    header: { label: '抬头', color: 'blue', description: '合同抬头信息' },
    signature: { label: '签章', color: 'purple', description: '签名盖章区域' },
    order: { label: '订单', color: 'green', description: '订单数据引用' },
    quotation: { label: '报价单', color: 'cyan', description: '报价单数据引用' },
    short_text: { label: '短文本', color: 'orange', description: '单行文本输入' },
    paragraph_text: { label: '段落文本', color: 'geekblue', description: '多行文本输入' },
    preset_text: { label: '预设文本', color: 'magenta', description: '固定文本内容' },
    dropdown: { label: '下拉菜单', color: 'gold', description: '下拉选择框' },
    radio: { label: '单选框', color: 'lime', description: '单选按钮组' },
    checkbox: { label: '复选框', color: 'volcano', description: '多选复选框' },
    money: { label: '数字金额', color: 'red', description: '金额数字格式' },
    money_cn: { label: '大写金额', color: 'red', description: '金额中文大写' },
    number: { label: '数字', color: 'blue', description: '数字输入框' },
    date: { label: '日期', color: 'green', description: '日期选择器' },
    project: { label: '项目', color: 'purple', description: '项目信息引用' },
    task: { label: '任务', color: 'cyan', description: '任务信息引用' }
}

const ContractElements: React.FC = () => {
    const [elements, setElements] = useState<ContractElement[]>([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    // 模态窗状态
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingElement, setEditingElement] = useState<ContractElement | null>(null)
    const [form] = Form.useForm()

    // 模拟数据
    useEffect(() => {
        const mockData: ContractElement[] = [
            {
                id: '1',
                name: '公司抬头',
                type: 'header',
                description: '公司名称、地址、联系方式等抬头信息',
                status: 'active',
                createTime: '2025-01-18',
                updateTime: '2025-01-18',
                createdBy: '管理员'
            },
            {
                id: '2',
                name: '甲乙双方签章',
                type: 'signature',
                description: '合同结尾的甲乙双方签名盖章区域',
                status: 'active',
                createTime: '2025-01-18',
                updateTime: '2025-01-18',
                createdBy: '管理员'
            },
            {
                id: '3',
                name: '订单服务明细',
                type: 'order',
                description: '从订单中获取服务项目明细表格',
                status: 'active',
                createTime: '2025-01-18',
                updateTime: '2025-01-18',
                createdBy: '管理员'
            },
            {
                id: '4',
                name: '项目描述',
                type: 'paragraph_text',
                description: '项目具体描述的多行文本输入',
                status: 'active',
                createTime: '2025-01-18',
                updateTime: '2025-01-18',
                createdBy: '管理员'
            },
            {
                id: '5',
                name: '合同金额',
                type: 'money',
                description: '合同总金额的数字格式显示',
                status: 'active',
                createTime: '2025-01-18',
                updateTime: '2025-01-18',
                createdBy: '管理员'
            },
            {
                id: '6',
                name: '交付日期',
                type: 'date',
                description: '项目交付日期选择器',
                status: 'active',
                createTime: '2025-01-18',
                updateTime: '2025-01-18',
                createdBy: '管理员'
            },
            {
                id: '7',
                name: '服务类型',
                type: 'dropdown',
                description: '服务类型下拉选择框',
                status: 'active',
                createTime: '2025-01-18',
                updateTime: '2025-01-18',
                createdBy: '管理员'
            },
            {
                id: '8',
                name: '标准条款',
                type: 'preset_text',
                description: '固定的标准合同条款文本',
                status: 'active',
                createTime: '2025-01-18',
                updateTime: '2025-01-18',
                createdBy: '管理员'
            }
        ]
        setElements(mockData)
    }, [])

    // 过滤数据
    const filteredElements = elements.filter(element => {
        const matchSearch = !searchText ||
            element.name.toLowerCase().includes(searchText.toLowerCase()) ||
            element.description.toLowerCase().includes(searchText.toLowerCase())

        const matchType = typeFilter === 'all' || element.type === typeFilter
        const matchStatus = statusFilter === 'all' || element.status === statusFilter

        return matchSearch && matchType && matchStatus
    })

    // 操作函数
    const handleCreate = () => {
        setEditingElement(null)
        form.resetFields()
        setIsModalVisible(true)
    }

    const handleEdit = (element: ContractElement) => {
        setEditingElement(element)
        form.setFieldsValue({
            name: element.name,
            type: element.type,
            description: element.description,
            status: element.status
        })
        setIsModalVisible(true)
    }

    const handleDelete = (id: string) => {
        setElements(elements.filter(el => el.id !== id))
        message.success('删除成功')
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields()

            if (editingElement) {
                // 更新
                setElements(elements.map(el =>
                    el.id === editingElement.id
                        ? { ...el, ...values, updateTime: new Date().toISOString().split('T')[0] }
                        : el
                ))
                message.success('更新成功')
            } else {
                // 新建
                const newElement: ContractElement = {
                    id: Date.now().toString(),
                    name: values.name,
                    type: values.type,
                    description: values.description,
                    status: values.status || 'active',
                    createTime: new Date().toISOString().split('T')[0],
                    updateTime: new Date().toISOString().split('T')[0],
                    createdBy: '当前用户'
                }
                setElements([...elements, newElement])
                message.success('创建成功')
            }
            setIsModalVisible(false)
        } catch (error) {
            console.error('表单验证失败:', error)
        }
    }

    // 表格列定义
    const columns = [
        {
            title: '元素名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text: string) => <Text strong>{text}</Text>
        },
        {
            title: '元素类型',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (type: keyof typeof ELEMENT_TYPES) => {
                const config = ELEMENT_TYPES[type]
                return <Tag color={config.color}>{config.label}</Tag>
            }
        },
        {
            title: '元素说明',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text: string) => (
                <Tooltip title={text}>
                    <Text type="secondary">{text}</Text>
                </Tooltip>
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (status: string) => (
                <Tag color={status === 'active' ? 'success' : 'default'}>
                    {status === 'active' ? '启用' : '禁用'}
                </Tag>
            )
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 120
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            render: (_: any, record: ContractElement) => (
                <Space>
                    <Tooltip title="编辑">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="确定要删除这个元素吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Tooltip title="删除">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <h1>合同元素管理</h1>
                    <Text type="secondary">
                        管理合同模板中使用的各种元素，支持15种不同类型的元素
                    </Text>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        新建元素
                    </Button>
                </Col>
            </Row>

            <Card>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={8}>
                        <Input
                            placeholder="搜索元素名称或说明"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={12} sm={4}>
                        <Select
                            placeholder="元素类型"
                            style={{ width: '100%' }}
                            value={typeFilter}
                            onChange={setTypeFilter}
                        >
                            <Option value="all">全部类型</Option>
                            {Object.entries(ELEMENT_TYPES).map(([key, config]) => (
                                <Option key={key} value={key}>{config.label}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={12} sm={4}>
                        <Select
                            placeholder="状态"
                            style={{ width: '100%' }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >
                            <Option value="all">全部状态</Option>
                            <Option value="active">启用</Option>
                            <Option value="inactive">禁用</Option>
                        </Select>
                    </Col>
                </Row>

                <Divider />

                <Table
                    columns={columns}
                    dataSource={filteredElements}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 个元素`
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* 新建/编辑模态窗 */}
            <Modal
                title={editingElement ? '编辑合同元素' : '新建合同元素'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSave}
                width={600}
                okText="保存"
                cancelText="取消"
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: 'active'
                    }}
                >
                    <Form.Item
                        name="name"
                        label="元素名称"
                        rules={[{ required: true, message: '请输入元素名称' }]}
                    >
                        <Input placeholder="例如：公司抬头、项目描述、合同金额" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="元素类型"
                        rules={[{ required: true, message: '请选择元素类型' }]}
                    >
                        <Select placeholder="选择元素类型">
                            {Object.entries(ELEMENT_TYPES).map(([key, config]) => (
                                <Option key={key} value={key}>
                                    <Space>
                                        <Tag color={config.color}>{config.label}</Tag>
                                        <Text type="secondary">{config.description}</Text>
                                    </Space>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="元素说明"
                    >
                        <TextArea
                            rows={3}
                            placeholder="描述这个元素的用途和特点（可选）"
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="状态"
                    >
                        <Select>
                            <Option value="active">启用</Option>
                            <Option value="inactive">禁用</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ContractElements