import React from 'react'
import { Card, Form, Input, Button, Switch, Select, Space } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const { Option } = Select

const GeneralSettings: React.FC = () => {
    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>常规设置</h1>

            <Card title="系统信息">
                <Form layout="vertical">
                    <Form.Item label="系统名称" name="systemName">
                        <Input placeholder="请输入系统名称" />
                    </Form.Item>
                    <Form.Item label="系统版本" name="systemVersion">
                        <Input placeholder="系统版本号" disabled />
                    </Form.Item>
                    <Form.Item label="系统语言" name="systemLanguage">
                        <Select placeholder="请选择系统语言">
                            <Option value="zh-CN">简体中文</Option>
                            <Option value="en-US">English</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="时区设置" name="timezone">
                        <Select placeholder="请选择时区">
                            <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
                            <Option value="UTC">协调世界时 (UTC)</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="显示设置" style={{ marginTop: 16 }}>
                <Form layout="vertical">
                    <Form.Item label="主题模式" name="theme" valuePropName="checked">
                        <Switch checkedChildren="深色" unCheckedChildren="浅色" />
                    </Form.Item>
                    <Form.Item label="显示菜单图标" name="showMenuIcon" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="显示面包屑" name="showBreadcrumb" valuePropName="checked">
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

export default GeneralSettings 