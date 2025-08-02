import React from 'react'
import { Card, Table, Tag, Button, Space, Input, Select } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const { Option } = Select

const Menus: React.FC = () => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>菜单管理</h1>
                <Button type="primary" icon={<PlusOutlined />}>
                    新建菜单
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索菜单名称"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                        />
                        <Select placeholder="菜单类型" style={{ width: 120 }}>
                            <Option value="all">全部类型</Option>
                            <Option value="main">主导航</Option>
                            <Option value="footer">底部导航</Option>
                            <Option value="sidebar">侧边栏</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={[
                        { title: '菜单名称', dataIndex: 'menuName', key: 'menuName' },
                        { title: '菜单类型', dataIndex: 'menuType', key: 'menuType' },
                        { title: '排序', dataIndex: 'sort', key: 'sort' },
                        { title: '状态', dataIndex: 'status', key: 'status' },
                        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
                        { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">编辑</Button></Space> }
                    ]}
                    dataSource={[]}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    )
}

export default Menus 