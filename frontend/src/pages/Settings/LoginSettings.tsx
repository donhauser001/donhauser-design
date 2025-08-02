import React from 'react'
import { Card, Form, Input, Button, Switch, InputNumber, Space } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const LoginSettings: React.FC = () => {
    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>登录设置</h1>

            <Card title="登录配置">
                <Form layout="vertical">
                    <Form.Item label="允许注册" name="allowRegister" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="邮箱验证" name="emailVerification" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="手机验证" name="phoneVerification" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="图形验证码" name="captcha" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Card>

            <Card title="密码策略" style={{ marginTop: 16 }}>
                <Form layout="vertical">
                    <Form.Item label="密码最小长度" name="minPasswordLength">
                        <InputNumber min={6} max={20} placeholder="密码最小长度" />
                    </Form.Item>
                    <Form.Item label="密码复杂度要求" name="passwordComplexity" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="密码过期天数" name="passwordExpireDays">
                        <InputNumber min={0} max={365} placeholder="密码过期天数（0表示永不过期）" />
                    </Form.Item>
                </Form>
            </Card>

            <Card title="登录限制" style={{ marginTop: 16 }}>
                <Form layout="vertical">
                    <Form.Item label="最大登录失败次数" name="maxLoginAttempts">
                        <InputNumber min={1} max={10} placeholder="最大登录失败次数" />
                    </Form.Item>
                    <Form.Item label="锁定时间（分钟）" name="lockTime">
                        <InputNumber min={5} max={1440} placeholder="锁定时间（分钟）" />
                    </Form.Item>
                    <Form.Item label="会话超时时间" name="sessionTimeout">
                        <InputNumber min={5} max={1440} placeholder="会话超时时间（分钟）" />
                    </Form.Item>
                </Form>
            </Card>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Space>
                    <Button type="primary" icon={<SaveOutlined />} size="large">
                        保存设置
                    </Button>
                    <Button size="large">
                        重置
                    </Button>
                </Space>
            </div>
        </div>
    )
}

export default LoginSettings 