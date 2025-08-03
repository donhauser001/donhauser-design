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
    EyeOutlined,
    CopyOutlined
} from '@ant-design/icons'
import ContractElementEditor from './components/ContractElementEditor'
import ContractElementPreview from './components/ContractElementPreview'

const { Option } = Select
const { Text } = Typography

// 合同元素类型定义
export interface ContractElement {
    id: string
    name: string
    type: 'header' | 'footer' | 'letterhead' | 'signature' | 'clause' | 'table' | 'dynamic_data' | 'form_field'
    category: string
    description: string
    content: string | object
    variables: string[] // 支持的动态变量
    status: 'active' | 'inactive'
    isDefault: boolean
    createTime: string
    updateTime: string
    createdBy: string
}

// 元素类型配置
const ELEMENT_TYPES = {
    header: { label: '页眉', color: 'blue', description: '文档顶部的标题区域' },
    footer: { label: '页脚', color: 'green', description: '文档底部的信息区域' },
    letterhead: { label: '合同抬头', color: 'purple', description: '合同开头的标题和基本信息' },
    signature: { label: '合同落款', color: 'orange', description: '合同结尾的签名区域' },
    clause: { label: '条款内容', color: 'cyan', description: '标准合同条款文本' },
    table: { label: '表格元素', color: 'geekblue', description: '数据展示表格' },
    dynamic_data: { label: '动态数据', color: 'magenta', description: '从订单/报价单调用的数据' },
    form_field: { label: '表单字段', color: 'gold', description: '可填写的表单元素' }
}

const ContractElements: React.FC = () => {
    const [elements, setElements] = useState<ContractElement[]>([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    // 模态窗状态
    const [isEditorVisible, setIsEditorVisible] = useState(false)
    const [isPreviewVisible, setIsPreviewVisible] = useState(false)
    const [editingElement, setEditingElement] = useState<ContractElement | null>(null)
    const [previewElement, setPreviewElement] = useState<ContractElement | null>(null)

    // 模拟数据
    useEffect(() => {
        const mockData: ContractElement[] = [
            {
                id: '1',
                name: '标准合同抬头',
                type: 'letterhead',
                category: '标准模板',
                description: '公司标准合同抬头，包含公司logo和基本信息',
                content: {
                    template: '<div class="letterhead"><h1>{{company.name}}</h1><p>{{company.address}}</p></div>',
                    style: { fontSize: '18px', textAlign: 'center', marginBottom: '20px' }
                },
                variables: ['company.name', 'company.address', 'company.phone'],
                status: 'active',
                isDefault: true,
                createTime: '2025-01-18',
                updateTime: '2025-01-18',
                createdBy: '管理员'
            },
            {
                id: '2',
                name: '项目信息表格',
                type: 'table',
                category: '数据展示',
                description: '显示项目基本信息的表格',
                content: {
                    template: '<table><tr><td>项目名称：</td><td>{{project.name}}</td></tr><tr><td>项目金额：</td><td>{{project.amount}}</td></tr></table>',
                    fields: ['project.name', 'project.amount', 'project.duration']
                },
                variables: ['project.name', 'project.amount', 'project.duration'],
                status: 'active',
                isDefault: false,
                createTime: '2025-01-18',
                updateTime: '2025-01-18',
                createdBy: '管理员'
            },
            {
                id: '3',
                name: '订单服务明细',
                type: 'dynamic_data',
                category: '动态数据',
                description: '自动调用订单中的服务项目明细',
                content: {
                    dataSource: 'order.items',
                    template: 'table',
                    columns: ['serviceName', 'quantity', 'unitPrice', 'amount']
                },
                variables: ['order.orderNo', 'order.items', 'order.totalAmount'],
                status: 'active',
                isDefault: false,
                createTime: '2025-01-18',
                updateTime: '2025-01-18',
                createdBy: '管理员'
            },
            {
                id: '4',
                name: '甲乙双方签署区',
                type: 'signature',
                category: '签名落款',
                description: '合同结尾的甲乙双方签名区域',
                content: {
                    template: '<div class="signature-area"><div class="party-a"><p>甲方：{{client.company}}</p><p>代表：{{client.representative}}</p><p>日期：_______</p></div><div class="party-b"><p>乙方：{{company.name}}</p><p>代表：{{company.representative}}</p><p>日期：_______</p></div></div>',
                    style: { display: 'flex', justifyContent: 'space-between', marginTop: '40px' }
                },
                variables: ['client.company', 'client.representative', 'company.name', 'company.representative'],
                status: 'active',
                isDefault: true,
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
        setIsEditorVisible(true)
    }

    const handleEdit = (element: ContractElement) => {
        setEditingElement(element)
        setIsEditorVisible(true)
    }

    const handlePreview = (element: ContractElement) => {
        setPreviewElement(element)
        setIsPreviewVisible(true)
    }

    const handleCopy = (element: ContractElement) => {
        const newElement = {
            ...element,
            id: Date.now().toString(),
            name: `${element.name} - 副本`,
            createTime: new Date().toISOString().split('T')[0],
            updateTime: new Date().toISOString().split('T')[0]
        }
        setElements([...elements, newElement])
        message.success('元素复制成功')
    }

    const handleDelete = (id: string) => {
        setElements(elements.filter(el => el.id !== id))
        message.success('删除成功')
    }

    const handleSave = (elementData: Partial<ContractElement>) => {
        if (editingElement) {
            // 更新
            setElements(elements.map(el => 
                el.id === editingElement.id 
                    ? { ...el, ...elementData, updateTime: new Date().toISOString().split('T')[0] }
                    : el
            ))
            message.success('更新成功')
        } else {
            // 新建
            const newElement: ContractElement = {
                id: Date.now().toString(),
                name: elementData.name || '',
                type: elementData.type || 'clause',
                category: elementData.category || '',
                description: elementData.description || '',
                content: elementData.content || '',
                variables: elementData.variables || [],
                status: 'active',
                isDefault: false,
                createTime: new Date().toISOString().split('T')[0],
                updateTime: new Date().toISOString().split('T')[0],
                createdBy: '当前用户'
            }
            setElements([...elements, newElement])
            message.success('创建成功')
        }
        setIsEditorVisible(false)
    }

    // 表格列定义
    const columns = [
        {
            title: '元素名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text: string, record: ContractElement) => (
                <div>
                    <Text strong>{text}</Text>
                    {record.isDefault && <Tag color="gold" size="small" style={{ marginLeft: 8 }}>默认</Tag>}
                </div>
            )
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (type: keyof typeof ELEMENT_TYPES) => {
                const config = ELEMENT_TYPES[type]
                return <Tag color={config.color}>{config.label}</Tag>
            }
        },
        {
            title: '分类',
            dataIndex: 'category',
            key: 'category',
            width: 120
        },
        {
            title: '描述',
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
            title: '动态变量',
            dataIndex: 'variables',
            key: 'variables',
            width: 150,
            render: (variables: string[]) => (
                <div>
                    {variables.slice(0, 2).map(variable => (
                        <Tag key={variable} size="small" style={{ margin: '2px' }}>
                            {variable}
                        </Tag>
                    ))}
                    {variables.length > 2 && (
                        <Tooltip title={variables.slice(2).join(', ')}>
                            <Tag size="small">+{variables.length - 2}</Tag>
                        </Tooltip>
                    )}
                </div>
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
            width: 180,
            render: (_: any, record: ContractElement) => (
                <Space>
                    <Tooltip title="预览">
                        <Button 
                            type="text" 
                            icon={<EyeOutlined />} 
                            size="small"
                            onClick={() => handlePreview(record)}
                        />
                    </Tooltip>
                    <Tooltip title="编辑">
                        <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="复制">
                        <Button 
                            type="text" 
                            icon={<CopyOutlined />} 
                            size="small"
                            onClick={() => handleCopy(record)}
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
                        创建和管理可复用的合同元素，支持动态数据调用和多种元素类型
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
                            placeholder="搜索元素名称或描述"
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
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* 元素编辑器 */}
            <ContractElementEditor
                visible={isEditorVisible}
                element={editingElement}
                onSave={handleSave}
                onCancel={() => setIsEditorVisible(false)}
            />

            {/* 元素预览 */}
            <ContractElementPreview
                visible={isPreviewVisible}
                element={previewElement}
                onClose={() => setIsPreviewVisible(false)}
            />
        </div>
    )
}

export default ContractElements