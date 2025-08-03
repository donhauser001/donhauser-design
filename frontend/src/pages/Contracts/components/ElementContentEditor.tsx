import React, { useState } from 'react'
import {
    Input,
    Select,
    Tabs,
    Card,
    Row,
    Col,
    Button,
    Space,
    Tag,
    Typography,
    Alert,
    Divider,
    Form,
    InputNumber,
    Switch,
    ColorPicker,
    Upload,
    message
} from 'antd'
import {
    CodeOutlined,
    EyeOutlined,
    UploadOutlined,
    PlusOutlined,
    DeleteOutlined,
    FormatPainterOutlined
} from '@ant-design/icons'
import type { Color } from 'antd/es/color-picker'

const { TextArea } = Input
const { Option } = Select
const { Text, Title } = Typography

interface ElementContentEditorProps {
    type: string
    value: any
    onChange: (content: any) => void
    variables: string[]
}

const ElementContentEditor: React.FC<ElementContentEditorProps> = ({
    type,
    value = {},
    onChange,
    variables
}) => {
    const [activeTab, setActiveTab] = useState('template')

    const handleTemplateChange = (template: string) => {
        onChange({
            ...value,
            template
        })
    }

    const handleStyleChange = (styleKey: string, styleValue: any) => {
        onChange({
            ...value,
            style: {
                ...value.style,
                [styleKey]: styleValue
            }
        })
    }

    const insertVariable = (variable: string) => {
        const template = value.template || ''
        const newTemplate = template + `{{${variable}}}`
        handleTemplateChange(newTemplate)
    }

    // 渲染模板编辑器
    const renderTemplateEditor = () => (
        <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <Text strong>模板内容</Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                        使用 {`{{变量名}}`} 插入动态数据
                    </Text>
                </Col>
                <Col span={12}>
                    <Text strong>可用变量</Text>
                </Col>
            </Row>
            
            <Row gutter={16}>
                <Col span={12}>
                    <TextArea
                        rows={12}
                        value={value.template || ''}
                        onChange={e => handleTemplateChange(e.target.value)}
                        placeholder="输入模板内容，使用 {{变量名}} 插入动态数据"
                        style={{ fontFamily: 'monospace' }}
                    />
                </Col>
                <Col span={12}>
                    <Card size="small" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <Space wrap>
                            {variables.map(variable => (
                                <Tag
                                    key={variable}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => insertVariable(variable)}
                                >
                                    {variable}
                                </Tag>
                            ))}
                        </Space>
                        {variables.length === 0 && (
                            <Text type="secondary">请先在变量选项卡中选择变量</Text>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )

    // 渲染样式编辑器
    const renderStyleEditor = () => (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item label="字体大小">
                        <Select
                            value={value.style?.fontSize}
                            onChange={val => handleStyleChange('fontSize', val)}
                            placeholder="选择字体大小"
                        >
                            <Option value="12px">12px</Option>
                            <Option value="14px">14px</Option>
                            <Option value="16px">16px</Option>
                            <Option value="18px">18px</Option>
                            <Option value="20px">20px</Option>
                            <Option value="24px">24px</Option>
                            <Option value="28px">28px</Option>
                            <Option value="32px">32px</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="字体粗细">
                        <Select
                            value={value.style?.fontWeight}
                            onChange={val => handleStyleChange('fontWeight', val)}
                            placeholder="选择字体粗细"
                        >
                            <Option value="normal">正常</Option>
                            <Option value="bold">粗体</Option>
                            <Option value="lighter">细体</Option>
                            <Option value="bolder">特粗</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="文本对齐">
                        <Select
                            value={value.style?.textAlign}
                            onChange={val => handleStyleChange('textAlign', val)}
                            placeholder="选择对齐方式"
                        >
                            <Option value="left">左对齐</Option>
                            <Option value="center">居中</Option>
                            <Option value="right">右对齐</Option>
                            <Option value="justify">两端对齐</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="文本颜色">
                        <ColorPicker
                            value={value.style?.color}
                            onChange={(color: Color) => handleStyleChange('color', color.toHexString())}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="背景颜色">
                        <ColorPicker
                            value={value.style?.backgroundColor}
                            onChange={(color: Color) => handleStyleChange('backgroundColor', color.toHexString())}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="行高">
                        <InputNumber
                            value={parseFloat(value.style?.lineHeight || '1.5')}
                            onChange={val => handleStyleChange('lineHeight', val?.toString())}
                            min={1}
                            max={3}
                            step={0.1}
                            placeholder="1.5"
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="内边距">
                        <Input
                            value={value.style?.padding}
                            onChange={e => handleStyleChange('padding', e.target.value)}
                            placeholder="例如: 10px 15px"
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="外边距">
                        <Input
                            value={value.style?.margin}
                            onChange={e => handleStyleChange('margin', e.target.value)}
                            placeholder="例如: 20px 0"
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="边框">
                        <Input
                            value={value.style?.border}
                            onChange={e => handleStyleChange('border', e.target.value)}
                            placeholder="例如: 1px solid #ccc"
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )

    // 渲染表格编辑器
    const renderTableEditor = () => (
        <div>
            <Alert
                message="表格配置"
                description="配置表格的列和数据源"
                type="info"
                style={{ marginBottom: 16 }}
            />
            
            <Form.Item label="数据源">
                <Select
                    value={value.dataSource}
                    onChange={val => onChange({ ...value, dataSource: val })}
                    placeholder="选择数据源"
                >
                    <Option value="order.items">订单项目</Option>
                    <Option value="quotation.items">报价项目</Option>
                    <Option value="project.details">项目详情</Option>
                    <Option value="client.info">客户信息</Option>
                </Select>
            </Form.Item>

            <Form.Item label="表格列">
                <div>
                    {(value.columns || []).map((column: string, index: number) => (
                        <Tag
                            key={index}
                            closable
                            onClose={() => {
                                const newColumns = [...(value.columns || [])]
                                newColumns.splice(index, 1)
                                onChange({ ...value, columns: newColumns })
                            }}
                            style={{ margin: '4px' }}
                        >
                            {column}
                        </Tag>
                    ))}
                    <Select
                        style={{ width: 200 }}
                        placeholder="添加列"
                        onSelect={(val: string) => {
                            const newColumns = [...(value.columns || []), val]
                            onChange({ ...value, columns: newColumns })
                        }}
                    >
                        <Option value="serviceName">服务名称</Option>
                        <Option value="quantity">数量</Option>
                        <Option value="unitPrice">单价</Option>
                        <Option value="amount">金额</Option>
                        <Option value="description">描述</Option>
                    </Select>
                </div>
            </Form.Item>
        </div>
    )

    // 渲染动态数据编辑器
    const renderDynamicDataEditor = () => (
        <div>
            <Alert
                message="动态数据配置"
                description="配置如何从订单或报价单中获取数据"
                type="info"
                style={{ marginBottom: 16 }}
            />
            
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="数据源">
                        <Select
                            value={value.dataSource}
                            onChange={val => onChange({ ...value, dataSource: val })}
                            placeholder="选择数据源"
                        >
                            <Option value="order">订单数据</Option>
                            <Option value="order.items">订单项目列表</Option>
                            <Option value="quotation">报价单数据</Option>
                            <Option value="quotation.items">报价项目列表</Option>
                            <Option value="project">项目数据</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="显示模板">
                        <Select
                            value={value.template}
                            onChange={val => onChange({ ...value, template: val })}
                            placeholder="选择显示模板"
                        >
                            <Option value="list">列表形式</Option>
                            <Option value="table">表格形式</Option>
                            <Option value="cards">卡片形式</Option>
                            <Option value="custom">自定义模板</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            {value.template === 'custom' && (
                <Form.Item label="自定义模板">
                    <TextArea
                        rows={6}
                        value={value.customTemplate}
                        onChange={e => onChange({ ...value, customTemplate: e.target.value })}
                        placeholder="输入自定义模板，使用 {{变量名}} 插入数据"
                    />
                </Form.Item>
            )}

            <Form.Item label="包含字段">
                <div>
                    {(value.fields || []).map((field: string, index: number) => (
                        <Tag
                            key={index}
                            closable
                            onClose={() => {
                                const newFields = [...(value.fields || [])]
                                newFields.splice(index, 1)
                                onChange({ ...value, fields: newFields })
                            }}
                            style={{ margin: '4px' }}
                        >
                            {field}
                        </Tag>
                    ))}
                    <Select
                        style={{ width: 200 }}
                        placeholder="添加字段"
                        onSelect={(val: string) => {
                            const newFields = [...(value.fields || []), val]
                            onChange({ ...value, fields: newFields })
                        }}
                    >
                        {variables.map(variable => (
                            <Option key={variable} value={variable}>
                                {variable}
                            </Option>
                        ))}
                    </Select>
                </div>
            </Form.Item>
        </div>
    )

    // 渲染表单字段编辑器
    const renderFormFieldEditor = () => (
        <div>
            <Alert
                message="表单字段配置"
                description="配置可填写的表单元素"
                type="info"
                style={{ marginBottom: 16 }}
            />
            
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item label="字段类型">
                        <Select
                            value={value.type}
                            onChange={val => onChange({ ...value, type: val })}
                            placeholder="选择字段类型"
                        >
                            <Option value="input">单行文本</Option>
                            <Option value="textarea">多行文本</Option>
                            <Option value="number">数字</Option>
                            <Option value="date">日期</Option>
                            <Option value="select">下拉选择</Option>
                            <Option value="checkbox">复选框</Option>
                            <Option value="radio">单选框</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="字段标签">
                        <Input
                            value={value.label}
                            onChange={e => onChange({ ...value, label: e.target.value })}
                            placeholder="输入字段标签"
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="占位符">
                        <Input
                            value={value.placeholder}
                            onChange={e => onChange({ ...value, placeholder: e.target.value })}
                            placeholder="输入占位符文本"
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="默认值">
                        <Input
                            value={value.defaultValue}
                            onChange={e => onChange({ ...value, defaultValue: e.target.value })}
                            placeholder="输入默认值"
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="验证规则">
                        <Select
                            mode="multiple"
                            value={value.rules}
                            onChange={val => onChange({ ...value, rules: val })}
                            placeholder="选择验证规则"
                        >
                            <Option value="required">必填</Option>
                            <Option value="email">邮箱格式</Option>
                            <Option value="phone">手机号格式</Option>
                            <Option value="number">数字格式</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )

    // 根据类型选择编辑器
    const getContentEditor = () => {
        switch (type) {
            case 'table':
                return renderTableEditor()
            case 'dynamic_data':
                return renderDynamicDataEditor()
            case 'form_field':
                return renderFormFieldEditor()
            default:
                return renderTemplateEditor()
        }
    }

    const tabItems = [
        {
            key: 'template',
            label: '内容',
            children: getContentEditor()
        },
        {
            key: 'style',
            label: '样式',
            children: renderStyleEditor()
        }
    ]

    return (
        <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
        />
    )
}

export default ElementContentEditor