import React, { useState, useMemo } from 'react'
import {
    Modal,
    Card,
    Tabs,
    Select,
    Row,
    Col,
    Typography,
    Button,
    Space,
    Alert,
    Divider,
    Table,
    Tag,
    Form,
    Input,
    DatePicker,
    Checkbox,
    Radio
} from 'antd'
import {
    CodeOutlined,
    EyeOutlined,
    CopyOutlined,
    DownloadOutlined
} from '@ant-design/icons'
import type { ContractElement } from '../ContractElements'

const { Text, Title } = Typography
const { Option } = Select
const { TextArea } = Input

interface ContractElementPreviewProps {
    visible: boolean
    element: ContractElement | null
    onClose: () => void
}

// 模拟数据
const MOCK_DATA = {
    company: {
        name: '北京设计有限公司',
        address: '北京市朝阳区创意大厦8层',
        phone: '010-12345678',
        email: 'contact@design.com',
        website: 'www.design.com',
        legal_representative: '张三',
        registration_number: '91110000123456789X',
        representative: '李四'
    },
    client: {
        company: '客户科技有限公司',
        representative: '王五',
        contact_person: '赵六',
        phone: '13800138000',
        email: 'client@client.com',
        address: '上海市浦东新区科技园区'
    },
    contract: {
        title: '网站设计服务合同',
        number: 'HT-2025-001',
        date: '2025年1月18日',
        start_date: '2025年1月20日',
        end_date: '2025年3月20日',
        duration: '60天',
        type: '设计服务合同'
    },
    project: {
        name: '企业官网设计项目',
        description: '为客户设计和开发企业官方网站',
        amount: '¥58,000',
        duration: '45天',
        start_date: '2025年1月20日',
        delivery_date: '2025年3月5日',
        manager: '张项目',
        status: '进行中'
    },
    order: {
        orderNo: 'ORD-2025-001',
        totalAmount: 58000,
        totalAmountRMB: '伍万捌仟元整',
        createTime: '2025年1月18日',
        status: '正常',
        items: [
            {
                serviceName: '网站设计',
                quantity: 1,
                unitPrice: 15000,
                amount: 15000,
                description: 'UI/UX设计，包含首页及内页设计'
            },
            {
                serviceName: '前端开发',
                quantity: 20,
                unitPrice: 800,
                amount: 16000,
                description: '响应式前端页面开发'
            },
            {
                serviceName: '后端开发',
                quantity: 1,
                unitPrice: 25000,
                amount: 25000,
                description: '内容管理系统开发'
            }
        ]
    },
    quotation: {
        name: '标准网站设计报价',
        number: 'QUO-2025-001',
        totalAmount: 60000,
        validUntil: '2025年2月18日',
        items: [
            {
                serviceName: '品牌设计',
                description: 'LOGO设计及VI系统',
                price: 20000
            },
            {
                serviceName: '网站设计',
                description: '响应式网站设计',
                price: 25000
            },
            {
                serviceName: '开发实施',
                description: '前后端开发及部署',
                price: 15000
            }
        ]
    },
    document: {
        title: '设计服务合同',
        date: '2025年1月18日',
        version: 'v1.0'
    },
    page: {
        number: 1,
        total: 5,
        header: '设计服务合同',
        footer: '第1页 共5页'
    }
}

const ContractElementPreview: React.FC<ContractElementPreviewProps> = ({
    visible,
    element,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState('preview')
    const [mockDataSet, setMockDataSet] = useState('default')

    // 替换变量的函数
    const replaceVariables = (template: string, data: any): string => {
        if (!template) return ''
        
        return template.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
            const keys = variable.trim().split('.')
            let value = data
            
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key]
                } else {
                    return `{{${variable}}}` // 保留未找到的变量
                }
            }
            
            return String(value || '')
        })
    }

    // 渲染预览内容
    const renderPreview = () => {
        if (!element) return null

        const content = element.content as any

        switch (element.type) {
            case 'table':
                return renderTablePreview(content)
            case 'dynamic_data':
                return renderDynamicDataPreview(content)
            case 'form_field':
                return renderFormFieldPreview(content)
            default:
                return renderTemplatePreview(content)
        }
    }

    // 渲染模板预览
    const renderTemplatePreview = (content: any) => {
        const processedTemplate = replaceVariables(content.template || '', MOCK_DATA)
        
        return (
            <div
                style={content.style || {}}
                dangerouslySetInnerHTML={{ __html: processedTemplate }}
            />
        )
    }

    // 渲染表格预览
    const renderTablePreview = (content: any) => {
        const dataSource = content.dataSource || 'order.items'
        const columns = content.columns || []
        
        // 获取数据源
        const keys = dataSource.split('.')
        let data = MOCK_DATA
        for (const key of keys) {
            data = data[key as keyof typeof data] as any
        }

        if (!Array.isArray(data)) {
            return <Alert message="数据源不是数组类型" type="warning" />
        }

        // 构建表格列
        const tableColumns = columns.map((col: string) => ({
            title: col,
            dataIndex: col,
            key: col,
            render: (value: any) => String(value || '-')
        }))

        return (
            <Table
                columns={tableColumns}
                dataSource={data}
                rowKey={(record, index) => index?.toString() || '0'}
                pagination={false}
                size="small"
            />
        )
    }

    // 渲染动态数据预览
    const renderDynamicDataPreview = (content: any) => {
        const dataSource = content.dataSource || 'order.items'
        const template = content.template || 'list'
        const fields = content.fields || []

        // 获取数据源
        const keys = dataSource.split('.')
        let data = MOCK_DATA
        for (const key of keys) {
            data = data[key as keyof typeof data] as any
        }

        if (template === 'table' && Array.isArray(data)) {
            const tableColumns = fields.map((field: string) => ({
                title: field,
                dataIndex: field,
                key: field,
                render: (value: any) => String(value || '-')
            }))

            return (
                <Table
                    columns={tableColumns}
                    dataSource={data}
                    rowKey={(record, index) => index?.toString() || '0'}
                    pagination={false}
                    size="small"
                />
            )
        }

        if (template === 'list' && Array.isArray(data)) {
            return (
                <div>
                    {data.map((item, index) => (
                        <Card key={index} size="small" style={{ marginBottom: 8 }}>
                            {fields.map((field: string) => (
                                <div key={field}>
                                    <Text strong>{field}: </Text>
                                    <Text>{String(item[field] || '-')}</Text>
                                </div>
                            ))}
                        </Card>
                    ))}
                </div>
            )
        }

        if (content.customTemplate) {
            return renderTemplatePreview({ template: content.customTemplate })
        }

        return <Alert message="无法预览此动态数据配置" type="warning" />
    }

    // 渲染表单字段预览
    const renderFormFieldPreview = (content: any) => {
        const { type, label, placeholder, defaultValue, rules } = content

        const formItemProps = {
            label,
            rules: rules?.map((rule: string) => ({ 
                required: rule === 'required',
                message: `请输入${label}`
            }))
        }

        switch (type) {
            case 'textarea':
                return (
                    <Form.Item {...formItemProps}>
                        <TextArea 
                            placeholder={placeholder}
                            defaultValue={defaultValue}
                            rows={4}
                        />
                    </Form.Item>
                )
            case 'number':
                return (
                    <Form.Item {...formItemProps}>
                        <Input 
                            type="number"
                            placeholder={placeholder}
                            defaultValue={defaultValue}
                        />
                    </Form.Item>
                )
            case 'date':
                return (
                    <Form.Item {...formItemProps}>
                        <DatePicker placeholder={placeholder} />
                    </Form.Item>
                )
            case 'select':
                return (
                    <Form.Item {...formItemProps}>
                        <Select placeholder={placeholder}>
                            <Option value="option1">选项1</Option>
                            <Option value="option2">选项2</Option>
                            <Option value="option3">选项3</Option>
                        </Select>
                    </Form.Item>
                )
            case 'checkbox':
                return (
                    <Form.Item {...formItemProps}>
                        <Checkbox>{label}</Checkbox>
                    </Form.Item>
                )
            case 'radio':
                return (
                    <Form.Item {...formItemProps}>
                        <Radio.Group>
                            <Radio value="option1">选项1</Radio>
                            <Radio value="option2">选项2</Radio>
                            <Radio value="option3">选项3</Radio>
                        </Radio.Group>
                    </Form.Item>
                )
            default:
                return (
                    <Form.Item {...formItemProps}>
                        <Input 
                            placeholder={placeholder}
                            defaultValue={defaultValue}
                        />
                    </Form.Item>
                )
        }
    }

    // 渲染代码视图
    const renderCodeView = () => {
        if (!element) return null

        const codeContent = JSON.stringify(element.content, null, 2)
        
        return (
            <div>
                <Alert
                    message="元素配置代码"
                    description="以下是该元素的JSON配置代码"
                    type="info"
                    style={{ marginBottom: 16 }}
                />
                <pre style={{
                    backgroundColor: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '12px',
                    lineHeight: '1.5'
                }}>
                    {codeContent}
                </pre>
            </div>
        )
    }

    const tabItems = [
        {
            key: 'preview',
            label: (
                <Space>
                    <EyeOutlined />
                    预览效果
                </Space>
            ),
            children: (
                <div>
                    <Row justify="space-between" style={{ marginBottom: 16 }}>
                        <Col>
                            <Space>
                                <Text strong>预览：</Text>
                                <Text type="secondary">{element?.name}</Text>
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                <Select
                                    size="small"
                                    value={mockDataSet}
                                    onChange={setMockDataSet}
                                    style={{ width: 120 }}
                                >
                                    <Option value="default">默认数据</Option>
                                    <Option value="empty">空数据</Option>
                                </Select>
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => {
                                        navigator.clipboard.writeText(JSON.stringify(element?.content))
                                        // message.success('已复制到剪贴板')
                                    }}
                                >
                                    复制
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                    
                    <Card style={{ minHeight: '200px' }}>
                        {renderPreview()}
                    </Card>
                </div>
            )
        },
        {
            key: 'code',
            label: (
                <Space>
                    <CodeOutlined />
                    配置代码
                </Space>
            ),
            children: renderCodeView()
        }
    ]

    return (
        <Modal
            title={`预览合同元素 - ${element?.name}`}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    关闭
                </Button>,
                <Button 
                    key="download" 
                    type="primary" 
                    icon={<DownloadOutlined />}
                    onClick={() => {
                        // 这里可以实现下载功能
                        console.log('下载元素')
                    }}
                >
                    导出元素
                </Button>
            ]}
            width={800}
            destroyOnClose
        >
            {element && (
                <div>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={12}>
                            <Text strong>类型：</Text>
                            <Tag color="blue">{element.type}</Tag>
                        </Col>
                        <Col span={12}>
                            <Text strong>分类：</Text>
                            <Text>{element.category}</Text>
                        </Col>
                    </Row>
                    
                    <Text type="secondary">{element.description}</Text>
                    
                    <Divider />
                    
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                    />
                </div>
            )}
        </Modal>
    )
}

export default ContractElementPreview