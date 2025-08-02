import React from 'react'
import { Card, Table, Tag, Button, Space, Input, Select } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const { Option } = Select

const Articles: React.FC = () => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>文章管理</h1>
                <Button type="primary" icon={<PlusOutlined />}>
                    新建文章
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索文章标题"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                        />
                        <Select placeholder="文章分类" style={{ width: 120 }}>
                            <Option value="all">全部分类</Option>
                            <Option value="news">新闻</Option>
                            <Option value="blog">博客</Option>
                            <Option value="case">案例</Option>
                        </Select>
                        <Select placeholder="发布状态" style={{ width: 120 }}>
                            <Option value="all">全部状态</Option>
                            <Option value="draft">草稿</Option>
                            <Option value="published">已发布</Option>
                            <Option value="archived">已归档</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={[
                        { title: '文章标题', dataIndex: 'title', key: 'title' },
                        { title: '分类', dataIndex: 'category', key: 'category' },
                        { title: '作者', dataIndex: 'author', key: 'author' },
                        { title: '状态', dataIndex: 'status', key: 'status' },
                        { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime' },
                        { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">编辑</Button></Space> }
                    ]}
                    dataSource={[]}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    )
}

export default Articles 