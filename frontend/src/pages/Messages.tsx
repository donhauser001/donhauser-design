import React from 'react'
import { Card, List, Avatar, Tag, Button, Space, Input, Select } from 'antd'
import { SearchOutlined, BellOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons'

const { Option } = Select

const Messages: React.FC = () => {
    const messages = [
        {
            id: '1',
            title: '新项目创建通知',
            content: '项目"企业官网设计"已创建，请及时处理',
            type: 'notification',
            status: 'unread',
            time: '2024-01-20 10:30',
            sender: '系统'
        },
        {
            id: '2',
            title: '客户反馈',
            content: '客户对项目进度提出了新的要求',
            type: 'feedback',
            status: 'read',
            time: '2024-01-19 15:20',
            sender: '张三'
        },
        {
            id: '3',
            title: '任务分配',
            content: '您有一个新的设计任务需要处理',
            type: 'task',
            status: 'unread',
            time: '2024-01-18 09:15',
            sender: '项目经理'
        }
    ]

    const getIcon = (type: string) => {
        switch (type) {
            case 'notification':
                return <BellOutlined style={{ color: '#1890ff' }} />
            case 'feedback':
                return <MessageOutlined style={{ color: '#52c41a' }} />
            case 'task':
                return <MailOutlined style={{ color: '#faad14' }} />
            default:
                return <BellOutlined />
        }
    }

    const getTypeText = (type: string) => {
        switch (type) {
            case 'notification':
                return '通知'
            case 'feedback':
                return '反馈'
            case 'task':
                return '任务'
            default:
                return '消息'
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>消息列表</h1>
                <Space>
                    <Button>全部已读</Button>
                    <Button type="primary">清空消息</Button>
                </Space>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索消息内容"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                        />
                        <Select placeholder="消息类型" style={{ width: 120 }}>
                            <Option value="all">全部类型</Option>
                            <Option value="notification">通知</Option>
                            <Option value="feedback">反馈</Option>
                            <Option value="task">任务</Option>
                        </Select>
                        <Select placeholder="消息状态" style={{ width: 120 }}>
                            <Option value="all">全部状态</Option>
                            <Option value="unread">未读</Option>
                            <Option value="read">已读</Option>
                        </Select>
                    </Space>
                </div>

                <List
                    itemLayout="horizontal"
                    dataSource={messages}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button type="link" size="small">查看</Button>,
                                <Button type="link" size="small">删除</Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={getIcon(item.type)} />}
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span>{item.title}</span>
                                        {item.status === 'unread' && (
                                            <Tag color="red" style={{ marginLeft: 8 }}>未读</Tag>
                                        )}
                                        <Tag color="blue" style={{ marginLeft: 8 }}>{getTypeText(item.type)}</Tag>
                                    </div>
                                }
                                description={
                                    <div>
                                        <div>{item.content}</div>
                                        <div style={{ marginTop: 4, fontSize: 12, color: '#666' }}>
                                            发送者: {item.sender} | 时间: {item.time}
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    )
}

export default Messages 