import React, { useState } from 'react'
import {
    Card,
    Form,
    Input,
    Select,
    Switch,
    Button,
    Space,
    Divider,
    message,
    Row,
    Col,
    Typography,
    Alert
} from 'antd'
import {
    SettingOutlined,
    SaveOutlined,
    ReloadOutlined,
    FormOutlined,
    SecurityScanOutlined,
    NotificationOutlined
} from '@ant-design/icons'

const { Option } = Select
const { Title, Text } = Typography

interface FormSettings {
    // 基本设置
    defaultFormType: string
    autoSave: boolean
    autoSaveInterval: number
    maxFileSize: number
    allowedFileTypes: string[]

    // 安全设置
    requireCaptcha: boolean
    maxSubmissionsPerUser: number
    enableRateLimit: boolean
    rateLimitWindow: number
    rateLimitMax: number

    // 通知设置
    emailNotification: boolean
    adminEmail: string
    submissionNotification: boolean

    // 高级设置
    enableAnalytics: boolean
    dataRetentionDays: number
    enableExport: boolean
    exportFormats: string[]
}

const FormSettings: React.FC = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    // 默认设置
    const defaultSettings: FormSettings = {
        defaultFormType: 'contract',
        autoSave: true,
        autoSaveInterval: 30,
        maxFileSize: 10,
        allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'docx'],
        requireCaptcha: true,
        maxSubmissionsPerUser: 5,
        enableRateLimit: true,
        rateLimitWindow: 3600,
        rateLimitMax: 10,
        emailNotification: true,
        adminEmail: 'admin@example.com',
        submissionNotification: true,
        enableAnalytics: true,
        dataRetentionDays: 365,
        enableExport: true,
        exportFormats: ['excel', 'csv', 'pdf']
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            const values = await form.validateFields()

            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000))

            message.success('设置保存成功')
        } catch (error) {
            console.error('设置保存失败:', error)
            message.error('设置保存失败')
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        form.setFieldsValue(defaultSettings)
        message.info('设置已重置为默认值')
    }

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                    <SettingOutlined style={{ marginRight: '8px' }} />
                    表单设置
                </h1>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    配置表单系统的全局设置和参数
                </p>
            </div>

            <Form
                form={form}
                layout="vertical"
                initialValues={defaultSettings}
            >
                {/* 基本设置 */}
                <Card
                    title={
                        <Space>
                            <FormOutlined />
                            基本设置
                        </Space>
                    }
                    style={{ marginBottom: '24px' }}
                >
                    <Row gutter={[24, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="defaultFormType"
                                label="默认表单类型"
                                tooltip="创建新表单时的默认类型"
                            >
                                <Select>
                                    <Option value="contract">合同模板</Option>
                                    <Option value="customer">客户表单</Option>
                                    <Option value="survey">问卷调查</Option>
                                    <Option value="application">申请表单</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="autoSave"
                                label="自动保存"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="autoSaveInterval"
                                label="自动保存间隔（秒）"
                                tooltip="表单编辑时自动保存的时间间隔"
                            >
                                <Select>
                                    <Option value={15}>15秒</Option>
                                    <Option value={30}>30秒</Option>
                                    <Option value={60}>1分钟</Option>
                                    <Option value={300}>5分钟</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="maxFileSize"
                                label="最大文件大小（MB）"
                                tooltip="表单中上传文件的最大大小限制"
                            >
                                <Select>
                                    <Option value={5}>5MB</Option>
                                    <Option value={10}>10MB</Option>
                                    <Option value={20}>20MB</Option>
                                    <Option value={50}>50MB</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* 安全设置 */}
                <Card
                    title={
                        <Space>
                            <SecurityScanOutlined />
                            安全设置
                        </Space>
                    }
                    style={{ marginBottom: '24px' }}
                >
                    <Row gutter={[24, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="requireCaptcha"
                                label="启用验证码"
                                valuePropName="checked"
                                tooltip="表单提交时是否需要验证码"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="enableRateLimit"
                                label="启用频率限制"
                                valuePropName="checked"
                                tooltip="限制用户提交表单的频率"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="maxSubmissionsPerUser"
                                label="每用户最大提交次数"
                                tooltip="同一用户对同一表单的最大提交次数"
                            >
                                <Select>
                                    <Option value={1}>1次</Option>
                                    <Option value={3}>3次</Option>
                                    <Option value={5}>5次</Option>
                                    <Option value={10}>10次</Option>
                                    <Option value={-1}>无限制</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="rateLimitWindow"
                                label="频率限制窗口（秒）"
                                tooltip="频率限制的时间窗口"
                            >
                                <Select>
                                    <Option value={3600}>1小时</Option>
                                    <Option value={7200}>2小时</Option>
                                    <Option value={86400}>24小时</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="rateLimitMax"
                                label="频率限制最大次数"
                                tooltip="在时间窗口内的最大提交次数"
                            >
                                <Select>
                                    <Option value={5}>5次</Option>
                                    <Option value={10}>10次</Option>
                                    <Option value={20}>20次</Option>
                                    <Option value={50}>50次</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* 通知设置 */}
                <Card
                    title={
                        <Space>
                            <NotificationOutlined />
                            通知设置
                        </Space>
                    }
                    style={{ marginBottom: '24px' }}
                >
                    <Row gutter={[24, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="emailNotification"
                                label="启用邮件通知"
                                valuePropName="checked"
                                tooltip="表单提交时是否发送邮件通知"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="submissionNotification"
                                label="提交通知"
                                valuePropName="checked"
                                tooltip="新表单提交时是否通知管理员"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="adminEmail"
                                label="管理员邮箱"
                                tooltip="接收通知的管理员邮箱地址"
                                rules={[
                                    { type: 'email', message: '请输入有效的邮箱地址' }
                                ]}
                            >
                                <Input placeholder="admin@example.com" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* 高级设置 */}
                <Card
                    title={
                        <Space>
                            <SettingOutlined />
                            高级设置
                        </Space>
                    }
                    style={{ marginBottom: '24px' }}
                >
                    <Row gutter={[24, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="enableAnalytics"
                                label="启用数据分析"
                                valuePropName="checked"
                                tooltip="收集表单使用数据用于分析"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="enableExport"
                                label="启用数据导出"
                                valuePropName="checked"
                                tooltip="允许导出表单提交数据"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="dataRetentionDays"
                                label="数据保留天数"
                                tooltip="表单提交数据的保留时间"
                            >
                                <Select>
                                    <Option value={30}>30天</Option>
                                    <Option value={90}>90天</Option>
                                    <Option value={180}>180天</Option>
                                    <Option value={365}>365天</Option>
                                    <Option value={-1}>永久保留</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="exportFormats"
                                label="导出格式"
                                tooltip="支持的数据导出格式"
                            >
                                <Select mode="multiple">
                                    <Option value="excel">Excel</Option>
                                    <Option value="csv">CSV</Option>
                                    <Option value="pdf">PDF</Option>
                                    <Option value="json">JSON</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* 操作按钮 */}
                <Card>
                    <Space>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSave}
                            loading={loading}
                        >
                            保存设置
                        </Button>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleReset}
                        >
                            重置为默认
                        </Button>
                    </Space>
                </Card>
            </Form>

            {/* 提示信息 */}
            <Alert
                message="设置说明"
                description="这些设置将影响整个表单系统的行为。修改后请谨慎测试，确保不会影响现有功能。"
                type="info"
                showIcon
                style={{ marginTop: '24px' }}
            />
        </div>
    )
}

export default FormSettings 