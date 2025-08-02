import React from 'react'
import { Card, Form, Input, Button, Switch, Upload, Space } from 'antd'
import { UploadOutlined, SaveOutlined } from '@ant-design/icons'

const WebsiteSettings: React.FC = () => {
    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>网站设置</h1>

            <Card title="基本信息">
                <Form layout="vertical">
                    <Form.Item label="网站名称" name="siteName">
                        <Input placeholder="请输入网站名称" />
                    </Form.Item>
                    <Form.Item label="网站描述" name="siteDescription">
                        <Input.TextArea rows={3} placeholder="请输入网站描述" />
                    </Form.Item>
                    <Form.Item label="网站关键词" name="siteKeywords">
                        <Input placeholder="请输入网站关键词，用逗号分隔" />
                    </Form.Item>
                    <Form.Item label="网站Logo" name="siteLogo">
                        <Upload>
                            <Button icon={<UploadOutlined />}>上传Logo</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="网站图标" name="siteFavicon">
                        <Upload>
                            <Button icon={<UploadOutlined />}>上传图标</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="联系方式" style={{ marginTop: 16 }}>
                <Form layout="vertical">
                    <Form.Item label="联系电话" name="phone">
                        <Input placeholder="请输入联系电话" />
                    </Form.Item>
                    <Form.Item label="联系邮箱" name="email">
                        <Input placeholder="请输入联系邮箱" />
                    </Form.Item>
                    <Form.Item label="公司地址" name="address">
                        <Input.TextArea rows={2} placeholder="请输入公司地址" />
                    </Form.Item>
                </Form>
            </Card>

            <Card title="系统设置" style={{ marginTop: 16 }}>
                <Form layout="vertical">
                    <Form.Item label="维护模式" name="maintenanceMode" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="注册功能" name="allowRegister" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="评论功能" name="allowComment" valuePropName="checked">
                        <Switch />
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

export default WebsiteSettings 