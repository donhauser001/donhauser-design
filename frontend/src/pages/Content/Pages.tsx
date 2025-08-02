import React from 'react'
import { Card, Table, Tag, Button, Space, Input, Select } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const { Option } = Select

const Pages: React.FC = () => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>页面管理</h1>
                <Button type="primary" icon={<PlusOutlined />}>
                    新建页面
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索页面标题"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                        />
                        <Select placeholder="页面状态" style={{ width: 120 }}>
                            <Option value="all">全部状态</Option>
                            <Option value="draft">草稿</Option>
                            <Option value="published">已发布</Option>
                            <Option value="archived">已归档</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={[
                        { title: '页面标题', dataIndex: 'title', key: 'title' },
                        { title: '页面类型', dataIndex: 'pageType', key: 'pageType' },
                        { title: '状态', dataIndex: 'status', key: 'status' },
                        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
                        { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime' },
                        { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">编辑</Button></Space> }
                    ]}
                    dataSource={[]}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    )
}

export default Pages 