import React from 'react'
import { Card, Form, Input, Button, Switch, InputNumber, Space } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const AdvancedSettings: React.FC = () => {
    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>高级设置</h1>

            <Card title="性能设置">
                <Form layout="vertical">
                    <Form.Item label="缓存时间" name="cacheTime">
                        <InputNumber min={0} max={3600} placeholder="缓存时间（秒）" />
                    </Form.Item>
                    <Form.Item label="最大上传文件大小" name="maxFileSize">
                        <InputNumber min={1} max={100} placeholder="最大文件大小（MB）" />
                    </Form.Item>
                    <Form.Item label="启用压缩" name="enableCompression" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Card>

            <Card title="安全设置" style={{ marginTop: 16 }}>
                <Form layout="vertical">
                    <Form.Item label="密码最小长度" name="minPasswordLength">
                        <InputNumber min={6} max={20} placeholder="密码最小长度" />
                    </Form.Item>
                    <Form.Item label="启用双因素认证" name="enable2FA" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="会话超时时间" name="sessionTimeout">
                        <InputNumber min={5} max={1440} placeholder="会话超时时间（分钟）" />
                    </Form.Item>
                </Form>
            </Card>

            <Card title="日志设置" style={{ marginTop: 16 }}>
                <Form layout="vertical">
                    <Form.Item label="启用操作日志" name="enableOperationLog" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="日志保留天数" name="logRetentionDays">
                        <InputNumber min={1} max={365} placeholder="日志保留天数" />
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

export default AdvancedSettings 