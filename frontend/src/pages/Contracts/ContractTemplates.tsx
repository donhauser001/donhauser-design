import React from 'react'
import { Card, Table, Tag, Button, Space, Input, Select } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const { Option } = Select

const ContractTemplates: React.FC = () => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>合同模板</h1>
                <Button type="primary" icon={<PlusOutlined />}>
                    新建模板
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索模板名称"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                        />
                        <Select placeholder="模板类型" style={{ width: 120 }}>
                            <Option value="all">全部类型</Option>
                            <Option value="design">设计服务</Option>
                            <Option value="consulting">咨询服务</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={[
                        { title: '模板名称', dataIndex: 'templateName', key: 'templateName' },
                        { title: '模板类型', dataIndex: 'templateType', key: 'templateType' },
                        { title: '使用次数', dataIndex: 'usageCount', key: 'usageCount' },
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

export default ContractTemplates 