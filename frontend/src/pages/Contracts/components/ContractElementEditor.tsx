import React, { useState, useEffect } from 'react'
import {
    Modal,
    Form,
    Input,
    Select,
    Radio,
    Switch,
    Tabs,
    Card,
    Row,
    Col,
    Button,
    Space,
    Tag,
    Divider,
    Typography,
    Alert,
    Tooltip
} from 'antd'
import { 
    InfoCircleOutlined, 
    PlusOutlined, 
    DeleteOutlined,
    EyeOutlined 
} from '@ant-design/icons'
import type { ContractElement } from '../ContractElements'
import DynamicVariableSelector from './DynamicVariableSelector'
import ElementContentEditor from './ElementContentEditor'

const { Option } = Select
const { TextArea } = Input
const { Text, Title } = Typography

interface ContractElementEditorProps {
    visible: boolean
    element: ContractElement | null
    onSave: (data: Partial<ContractElement>) => void
    onCancel: () => void
}

// 元素类型配置
const ELEMENT_TYPE_CONFIGS = {
    header: {
        label: '页眉',
        description: '文档顶部的标题区域，通常包含公司信息和文档标题',
        defaultContent: {
            template: '<div class="header"><h2>{{company.name}}</h2><p>{{document.title}}</p></div>',
            style: { textAlign: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px' }
        },
        commonVariables: ['company.name', 'company.address', 'document.title', 'document.date']
    },
    footer: {
        label: '页脚',
        description: '文档底部的信息区域，通常包含页码和联系信息',
        defaultContent: {
            template: '<div class="footer"><p>{{company.address}} | {{company.phone}} | 第{{page.number}}页</p></div>',
            style: { textAlign: 'center', borderTop: '1px solid #ccc', paddingTop: '10px', fontSize: '12px' }
        },
        commonVariables: ['company.address', 'company.phone', 'page.number', 'page.total']
    },
    letterhead: {
        label: '合同抬头',
        description: '合同开头的标题和基本信息',
        defaultContent: {
            template: '<div class="letterhead"><h1>{{contract.title}}</h1><p>合同编号：{{contract.number}}</p><p>签署日期：{{contract.date}}</p></div>',
            style: { textAlign: 'center', marginBottom: '30px' }
        },
        commonVariables: ['contract.title', 'contract.number', 'contract.date', 'company.name']
    },
    signature: {
        label: '合同落款',
        description: '合同结尾的签名区域',
        defaultContent: {
            template: '<div class="signature"><div class="party-a"><p>甲方：{{client.company}}</p><p>代表：{{client.representative}}</p><p>日期：_______</p></div><div class="party-b"><p>乙方：{{company.name}}</p><p>代表：{{company.representative}}</p><p>日期：_______</p></div></div>',
            style: { display: 'flex', justifyContent: 'space-between', marginTop: '40px' }
        },
        commonVariables: ['client.company', 'client.representative', 'company.name', 'company.representative']
    },
    clause: {
        label: '条款内容',
        description: '标准合同条款文本',
        defaultContent: {
            template: '<div class="clause"><h3>{{clause.title}}</h3><p>{{clause.content}}</p></div>',
            style: { marginBottom: '20px' }
        },
        commonVariables: ['clause.title', 'clause.content', 'clause.number']
    },
    table: {
        label: '表格元素',
        description: '数据展示表格',
        defaultContent: {
            template: 'table',
            columns: ['name', 'value'],
            dataSource: 'project.details'
        },
        commonVariables: ['project.name', 'project.amount', 'project.details']
    },
    dynamic_data: {
        label: '动态数据',
        description: '从订单/报价单调用的数据',
        defaultContent: {
            dataSource: 'order.items',
            template: 'list',
            fields: ['serviceName', 'quantity', 'unitPrice']
        },
        commonVariables: ['order.orderNo', 'order.items', 'order.totalAmount', 'quotation.name', 'quotation.items']
    },
    form_field: {
        label: '表单字段',
        description: '可填写的表单元素',
        defaultContent: {
            type: 'input',
            label: '{{field.label}}',
            placeholder: '请输入{{field.label}}',
            required: false
        },
        commonVariables: ['field.label', 'field.value', 'field.default']
    }
}

const ContractElementEditor: React.FC<ContractElementEditorProps> = ({
    visible,
    element,
    onSave,
    onCancel
}) => {
    const [form] = Form.useForm()
    const [activeTab, setActiveTab] = useState('basic')
    const [selectedType, setSelectedType] = useState<keyof typeof ELEMENT_TYPE_CONFIGS>('clause')
    const [selectedVariables, setSelectedVariables] = useState<string[]>([])
    const [previewVisible, setPreviewVisible] = useState(false)

    useEffect(() => {
        if (visible) {
            if (element) {
                // 编辑模式
                form.setFieldsValue({
                    name: element.name,
                    type: element.type,
                    category: element.category,
                    description: element.description,
                    status: element.status
                })
                setSelectedType(element.type)
                setSelectedVariables(element.variables || [])
            } else {
                // 新建模式
                form.resetFields()
                setSelectedType('clause')
                setSelectedVariables([])
            }
            setActiveTab('basic')
        }
    }, [visible, element, form])

    const handleTypeChange = (type: keyof typeof ELEMENT_TYPE_CONFIGS) => {
        setSelectedType(type)
        const config = ELEMENT_TYPE_CONFIGS[type]
        setSelectedVariables(config.commonVariables || [])
        
        // 自动设置默认内容
        form.setFieldValue('content', config.defaultContent)
    }

    const handleSave = async () => {
        try {
            const values = await form.validateFields()
            const formData = {
                ...values,
                variables: selectedVariables,
                type: selectedType
            }
            onSave(formData)
        } catch (error) {
            console.error('表单验证失败:', error)
        }
    }

    const renderTypeSpecificFields = () => {
        const config = ELEMENT_TYPE_CONFIGS[selectedType]
        
        return (
            <Card size="small" title={`${config.label}配置`}>
                <Alert 
                    message={config.description} 
                    type="info" 
                    showIcon 
                    style={{ marginBottom: 16 }}
                />
                
                <ElementContentEditor
                    type={selectedType}
                    value={form.getFieldValue('content')}
                    onChange={(content) => form.setFieldValue('content', content)}
                    variables={selectedVariables}
                />
            </Card>
        )
    }

    const tabItems = [
        {
            key: 'basic',
            label: '基本信息',
            children: (
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="元素名称"
                            rules={[{ required: true, message: '请输入元素名称' }]}
                        >
                            <Input placeholder="例如：标准合同抬头" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="type"
                            label="元素类型"
                            rules={[{ required: true, message: '请选择元素类型' }]}
                        >
                            <Select
                                placeholder="选择元素类型"
                                onChange={handleTypeChange}
                                value={selectedType}
                            >
                                {Object.entries(ELEMENT_TYPE_CONFIGS).map(([key, config]) => (
                                    <Option key={key} value={key}>
                                        <Space>
                                            {config.label}
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                {config.description}
                                            </Text>
                                        </Space>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="category"
                            label="分类"
                            rules={[{ required: true, message: '请输入分类' }]}
                        >
                            <Select
                                placeholder="选择或输入分类"
                                mode="tags"
                                options={[
                                    { label: '标准模板', value: '标准模板' },
                                    { label: '数据展示', value: '数据展示' },
                                    { label: '签名落款', value: '签名落款' },
                                    { label: '条款内容', value: '条款内容' },
                                    { label: '动态数据', value: '动态数据' }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="状态"
                            initialValue="active"
                        >
                            <Radio.Group>
                                <Radio value="active">启用</Radio>
                                <Radio value="inactive">禁用</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="描述"
                            rules={[{ required: true, message: '请输入元素描述' }]}
                        >
                            <TextArea 
                                rows={3} 
                                placeholder="描述这个元素的用途和特点"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            )
        },
        {
            key: 'content',
            label: '内容设计',
            children: (
                <div>
                    {renderTypeSpecificFields()}
                </div>
            )
        },
        {
            key: 'variables',
            label: '动态变量',
            children: (
                <div>
                    <Alert
                        message="动态变量说明"
                        description="选择可以在此元素中使用的动态变量，这些变量在生成合同时会被实际数据替换"
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    
                    <DynamicVariableSelector
                        selected={selectedVariables}
                        onChange={setSelectedVariables}
                        elementType={selectedType}
                    />
                    
                    <Divider />
                    
                    <div>
                        <Text strong>已选择的变量：</Text>
                        <div style={{ marginTop: 8 }}>
                            {selectedVariables.map(variable => (
                                <Tag 
                                    key={variable}
                                    closable
                                    onClose={() => {
                                        setSelectedVariables(selectedVariables.filter(v => v !== variable))
                                    }}
                                    style={{ margin: '4px' }}
                                >
                                    {variable}
                                </Tag>
                            ))}
                            {selectedVariables.length === 0 && (
                                <Text type="secondary">暂无选择的变量</Text>
                            )}
                        </div>
                    </div>
                </div>
            )
        }
    ]

    return (
        <Modal
            title={
                <Space>
                    {element ? '编辑合同元素' : '新建合同元素'}
                    <Tooltip title="预览效果">
                        <Button 
                            type="text" 
                            icon={<EyeOutlined />} 
                            size="small"
                            onClick={() => setPreviewVisible(true)}
                        />
                    </Tooltip>
                </Space>
            }
            open={visible}
            onCancel={onCancel}
            onOk={handleSave}
            width={1000}
            okText="保存"
            cancelText="取消"
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: 'active',
                    type: 'clause'
                }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                />
            </Form>
        </Modal>
    )
}

export default ContractElementEditor