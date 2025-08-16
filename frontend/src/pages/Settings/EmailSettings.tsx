import React, { useState, useEffect } from 'react'
import {
    Card,
    Form,
    Input,
    Button,
    Switch,
    InputNumber,
    Space,
    Select,
    Divider,
    message,
    Row,
    Col,
    Spin
} from 'antd'
import {
    SaveOutlined,
    SendOutlined,
    MailOutlined,
    KeyOutlined,
    SecurityScanOutlined,
    ExperimentOutlined
} from '@ant-design/icons'
import {
    getEmailSetting,
    saveEmailSetting,
    sendTestEmail,
    CreateEmailSettingRequest,
    TestEmailRequest
} from '../../api/emailSettings'

const { Option } = Select

const EmailSettings: React.FC = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [testLoading, setTestLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [hasPassword, setHasPassword] = useState(false) // 记录是否已设置密码

    // 加载邮件设置
    useEffect(() => {
        loadEmailSetting()
    }, [])

    const loadEmailSetting = async () => {
        try {
            setInitialLoading(true)
            const setting = await getEmailSetting()
            if (setting) {
                // 检查是否存在用户名，如果有则说明已配置过密码
                setHasPassword(!!setting.username && setting.requireAuth)

                form.setFieldsValue({
                    enableEmail: setting.enableEmail,
                    smtpHost: setting.smtpHost,
                    smtpPort: setting.smtpPort,
                    securityType: setting.securityType,
                    requireAuth: setting.requireAuth,
                    username: setting.username,
                    // password 不设置，让用户重新输入
                    senderName: setting.senderName,
                    senderEmail: setting.senderEmail,
                    replyEmail: setting.replyEmail,
                    enableRateLimit: setting.enableRateLimit,
                    maxEmailsPerHour: setting.maxEmailsPerHour,
                    sendInterval: setting.sendInterval
                })
            }
        } catch (error) {
            console.error('加载邮件设置失败:', error)
            message.error('加载邮件设置失败')
        } finally {
            setInitialLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            // 只验证保存邮件设置所需的字段，不包括测试邮件字段
            const values = await form.validateFields([
                'enableEmail', 'smtpHost', 'smtpPort', 'securityType', 'requireAuth',
                'username', 'password', 'senderName', 'senderEmail', 'replyEmail',
                'enableRateLimit', 'maxEmailsPerHour', 'sendInterval'
            ])

            const settingData: CreateEmailSettingRequest = {
                enableEmail: values.enableEmail || false,
                smtpHost: values.smtpHost,
                smtpPort: values.smtpPort,
                securityType: values.securityType,
                requireAuth: values.requireAuth || false,
                username: values.username,
                password: values.password,
                senderName: values.senderName,
                senderEmail: values.senderEmail,
                replyEmail: values.replyEmail,
                enableRateLimit: values.enableRateLimit || false,
                maxEmailsPerHour: values.maxEmailsPerHour || 100,
                sendInterval: values.sendInterval || 2
            }

            await saveEmailSetting(settingData)
            // 保存成功后，如果有密码则记录状态
            if (values.password) {
                setHasPassword(true)
            }
            message.success('邮件设置保存成功')
        } catch (error: any) {
            console.error('保存失败:', error)
            message.error(error.response?.data?.message || '保存失败，请检查输入内容')
        } finally {
            setLoading(false)
        }
    }

    const handleTestEmail = async () => {
        try {
            setTestLoading(true)

            // 获取表单所有值
            const allValues = form.getFieldsValue()

            // 检查是否填写了测试邮件地址
            if (!allValues.testEmail) {
                message.error('请先填写测试邮件地址')
                return
            }

            // 验证SMTP配置字段
            const requiredFields = [
                'smtpHost', 'smtpPort', 'securityType', 'requireAuth', 'username',
                'senderName', 'senderEmail', 'testEmail'
            ]

            // 如果没有保存过密码，则密码字段必填
            if (!hasPassword) {
                requiredFields.push('password')
            }

            const values = await form.validateFields(requiredFields)

            // 如果当前密码为空但已有保存的密码，则使用保存的设置发送测试
            // 这种情况下，后端会自动使用已保存的SMTP配置

            const testData: TestEmailRequest = {
                // SMTP配置
                smtpHost: values.smtpHost,
                smtpPort: values.smtpPort,
                securityType: values.securityType,
                requireAuth: values.requireAuth || false,
                username: values.username,
                password: values.password,
                // 发件人信息
                senderName: values.senderName,
                senderEmail: values.senderEmail,
                replyEmail: values.replyEmail,
                // 测试邮件信息
                testEmail: values.testEmail,
                testSubject: values.testSubject || '邮件配置测试',
                testContent: values.testContent || '这是一封测试邮件，用于验证SMTP配置是否正确。如果您收到此邮件，说明邮件服务配置成功。'
            }

            await sendTestEmail(testData)
            message.success(`测试邮件已发送到 ${values.testEmail}，请检查收件箱`)
        } catch (error: any) {
            console.error('测试邮件发送失败:', error)
            message.error(error.response?.data?.message || '发送测试邮件失败')
        } finally {
            setTestLoading(false)
        }
    }

    const handleReset = () => {
        form.resetFields()
        message.info('已重置为默认设置')
    }

    if (initialLoading) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Spin size="large" />
                <p style={{ marginTop: '16px', color: '#666' }}>加载邮件设置中...</p>
            </div>
        )
    }

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                    <MailOutlined style={{ marginRight: '8px' }} />
                    邮件设置
                </h1>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    配置系统邮件服务，用于发送通知、验证码等邮件
                </p>
            </div>

            <Form form={form} layout="vertical">
                <Row gutter={24}>
                    {/* 左列 */}
                    <Col xs={24} lg={12}>
                        {/* SMTP服务器配置 */}
                        <Card
                            title={
                                <span>
                                    <SecurityScanOutlined style={{ marginRight: '8px' }} />
                                    SMTP服务器配置
                                </span>
                            }
                        >
                            <Form.Item
                                label="启用邮件服务"
                                name="enableEmail"
                                valuePropName="checked"
                                tooltip="关闭后系统将不会发送任何邮件"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                label="SMTP服务器地址"
                                name="smtpHost"
                                rules={[{ required: true, message: '请输入SMTP服务器地址' }]}
                            >
                                <Input
                                    placeholder="如：smtp.gmail.com, smtp.qq.com"
                                    prefix={<MailOutlined />}
                                />
                            </Form.Item>

                            <Form.Item
                                label="SMTP端口"
                                name="smtpPort"
                                rules={[{ required: true, message: '请输入SMTP端口' }]}
                                tooltip="常用端口：25（非加密）、587（TLS）、465（SSL）"
                            >
                                <InputNumber
                                    min={1}
                                    max={65535}
                                    placeholder="587"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="安全连接类型"
                                name="securityType"
                                rules={[{ required: true, message: '请选择安全连接类型' }]}
                            >
                                <Select placeholder="请选择安全连接类型">
                                    <Option value="none">无加密</Option>
                                    <Option value="tls">TLS/STARTTLS</Option>
                                    <Option value="ssl">SSL</Option>
                                </Select>
                            </Form.Item>
                        </Card>

                        {/* 身份验证 */}
                        <Card
                            title={
                                <span>
                                    <KeyOutlined style={{ marginRight: '8px' }} />
                                    身份验证
                                </span>
                            }
                            style={{ marginTop: '16px' }}
                        >
                            <Form.Item
                                label="需要身份验证"
                                name="requireAuth"
                                valuePropName="checked"
                                tooltip="大多数SMTP服务器都需要身份验证"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                label="用户名"
                                name="username"
                                rules={[{ required: true, message: '请输入用户名' }]}
                            >
                                <Input placeholder="通常是完整的邮箱地址" />
                            </Form.Item>

                            <Form.Item
                                label="密码"
                                name="password"
                                rules={[{
                                    required: !hasPassword,
                                    message: hasPassword ? '留空则保持当前密码不变' : '请输入密码'
                                }]}
                                tooltip={hasPassword ?
                                    "留空则保持当前密码不变，如使用Gmail等服务，可能需要应用专用密码" :
                                    "如使用Gmail等服务，可能需要应用专用密码"
                                }
                            >
                                <Input.Password
                                    placeholder={hasPassword ?
                                        "留空则保持当前密码不变" :
                                        "请输入SMTP密码或应用专用密码"
                                    }
                                />
                            </Form.Item>
                        </Card>

                        {/* 发送限制 */}
                        <Card
                            title="发送限制"
                            style={{ marginTop: '16px' }}
                        >
                            <Form.Item
                                label="启用发送限制"
                                name="enableRateLimit"
                                valuePropName="checked"
                                tooltip="防止邮件发送过于频繁"
                            >
                                <Switch />
                            </Form.Item>

                            <Form.Item
                                label="每小时最大发送数量"
                                name="maxEmailsPerHour"
                                tooltip="防止超出邮件服务商限制"
                            >
                                <InputNumber
                                    min={1}
                                    max={10000}
                                    placeholder="100"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="发送间隔（秒）"
                                name="sendInterval"
                                tooltip="两封邮件之间的最小间隔时间"
                            >
                                <InputNumber
                                    min={0}
                                    max={3600}
                                    placeholder="2"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Card>
                    </Col>

                    {/* 右列 */}
                    <Col xs={24} lg={12}>
                        {/* 发件人信息 */}
                        <Card
                            title={
                                <span>
                                    <SendOutlined style={{ marginRight: '8px' }} />
                                    发件人信息
                                </span>
                            }
                        >
                            <Form.Item
                                label="发件人名称"
                                name="senderName"
                                rules={[{ required: true, message: '请输入发件人名称' }]}
                            >
                                <Input placeholder="如：东豪设计管理系统" />
                            </Form.Item>

                            <Form.Item
                                label="发件人邮箱"
                                name="senderEmail"
                                rules={[
                                    { required: true, message: '请输入发件人邮箱' },
                                    { type: 'email', message: '请输入有效的邮箱地址' }
                                ]}
                            >
                                <Input placeholder="noreply@yourdomain.com" />
                            </Form.Item>

                            <Form.Item
                                label="回复邮箱"
                                name="replyEmail"
                                rules={[
                                    { type: 'email', message: '请输入有效的邮箱地址' }
                                ]}
                                tooltip="用户回复邮件时的收件地址，留空则使用发件人邮箱"
                            >
                                <Input placeholder="support@yourdomain.com" />
                            </Form.Item>
                        </Card>

                        {/* 发送测试 */}
                        <Card
                            title={
                                <span>
                                    <ExperimentOutlined style={{ marginRight: '8px' }} />
                                    发送测试
                                </span>
                            }
                            style={{ marginTop: '16px' }}
                        >
                            <Form.Item
                                label="测试邮件地址"
                                name="testEmail"
                                rules={[
                                    { type: 'email', message: '请输入有效的邮箱地址' }
                                ]}
                                tooltip="用于接收测试邮件的邮箱地址"
                            >
                                <Input
                                    placeholder="test@example.com"
                                    prefix={<MailOutlined />}
                                />
                            </Form.Item>

                            <Form.Item
                                label="测试邮件主题"
                                name="testSubject"
                            >
                                <Input placeholder="邮件配置测试" />
                            </Form.Item>

                            <Form.Item
                                label="测试邮件内容"
                                name="testContent"
                            >
                                <Input.TextArea
                                    rows={3}
                                    placeholder="这是一封测试邮件，用于验证SMTP配置是否正确。如果您收到此邮件，说明邮件服务配置成功。"
                                />
                            </Form.Item>

                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    loading={testLoading}
                                    onClick={handleTestEmail}
                                >
                                    发送测试邮件
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Form>

            <Divider />

            {/* 操作按钮 */}
            <div style={{ textAlign: 'center' }}>
                <Space size="large">
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        size="large"
                        loading={loading}
                        onClick={handleSave}
                    >
                        保存设置
                    </Button>
                    <Button
                        size="large"
                        onClick={handleReset}
                    >
                        重置
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default EmailSettings