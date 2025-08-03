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
    Row,
    Col,
    Typography
} from 'antd'
import {
    PlusOutlined,
    SearchOutlined
} from '@ant-design/icons'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import {
    getContractElements,
    createContractElement,
    updateContractElement,
    deleteContractElement,
    ContractElement,
    CreateContractElementData,
    UpdateContractElementData,
    ContractElementQuery
} from '../../api/contractElements'

const { Option } = Select
const { TextArea } = Input
const { Text, Title } = Typography



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


    // 模态窗状态
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingElement, setEditingElement] = useState<ContractElement | null>(null)
    const [form] = Form.useForm()

    // 加载数据
    useEffect(() => {
        loadElements()
    }, [searchText, typeFilter])

    const loadElements = async () => {
        setLoading(true)
        try {
            const query: ContractElementQuery = {
                search: searchText || undefined,
                type: typeFilter !== 'all' ? typeFilter : undefined
            }
            const response = await getContractElements(query)
            if (response.success) {
                setElements(response.data)
            } else {
                message.error('加载数据失败')
            }
        } catch (error) {
            console.error('加载合同元素失败:', error)
            message.error('加载数据失败')
        } finally {
            setLoading(false)
        }
    }



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
            description: element.description
        })
        setIsModalVisible(true)
    }

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
        const actionText = newStatus === 'active' ? '启用' : '停用'

        Modal.confirm({
            title: `确认${actionText}`,
            content: `确定要${actionText}这个合同元素吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await updateContractElement(id, { status: newStatus })
                    if (response.success) {
                        message.success(`${actionText}成功`)
                        loadElements() // 重新加载数据
                    } else {
                        message.error(response.message || `${actionText}失败`)
                    }
                } catch (error) {
                    console.error(`${actionText}合同元素失败:`, error)
                    message.error(`${actionText}失败`)
                }
            }
        })
    }

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个合同元素吗？删除后无法恢复。',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await deleteContractElement(id)
                    if (response.success) {
                        message.success('删除成功')
                        loadElements() // 重新加载数据
                    } else {
                        message.error(response.message || '删除失败')
                    }
                } catch (error) {
                    console.error('删除合同元素失败:', error)
                    message.error('删除失败')
                }
            }
        })
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields()

            if (editingElement) {
                // 更新
                const updateData: UpdateContractElementData = {
                    name: values.name,
                    type: values.type,
                    description: values.description
                }
                const response = await updateContractElement(editingElement._id, updateData)
                if (response.success) {
                    message.success('更新成功')
                    setIsModalVisible(false)
                    loadElements() // 重新加载数据
                } else {
                    message.error(response.message || '更新失败')
                }
            } else {
                // 新建
                const createData: CreateContractElementData = {
                    name: values.name,
                    type: values.type,
                    description: values.description
                }
                const response = await createContractElement(createData)
                if (response.success) {
                    message.success('创建成功')
                    setIsModalVisible(false)
                    loadElements() // 重新加载数据
                } else {
                    message.error(response.message || '创建失败')
                }
            }
        } catch (error) {
            console.error('保存合同元素失败:', error)
            message.error('操作失败')
        }
    }

    // 表格列定义
    const columns = [
        {
            title: '元素名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text: string, record: ContractElement) => (
                <Space>
                    <Text strong>{text}</Text>
                    {record.status === 'inactive' && (
                        <Tag color="default">已禁用</Tag>
                    )}
                </Space>
            )
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
            render: (text: string | undefined) => (
                <Tooltip title={text || ''}>
                    <Text type="secondary">{text || '-'}</Text>
                </Tooltip>
            )
        },

        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 160,
            render: (text: string) => {
                if (!text) return '-'
                try {
                    const date = new Date(text)
                    return date.toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    })
                } catch (error) {
                    return text
                }
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 100,
            render: (_: any, record: ContractElement) => {
                const actions = [
                    {
                        ...ActionTypes.EDIT,
                        onClick: () => handleEdit(record)
                    },
                    {
                        ...ActionTypes.TOGGLE_STATUS,
                        label: record.status === 'active' ? '停用' : '启用',
                        onClick: () => handleToggleStatus(record._id, record.status)
                    },
                    {
                        ...ActionTypes.DELETE,
                        onClick: () => handleDelete(record._id)
                    }
                ]

                return <ActionMenu actions={actions} />
            }
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

                </Row>



                <Table
                    columns={columns}
                    dataSource={elements}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 个元素`
                    }}
                    scroll={{ x: 700 }}
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


                </Form>
            </Modal>
        </div>
    )
}

export default ContractElements