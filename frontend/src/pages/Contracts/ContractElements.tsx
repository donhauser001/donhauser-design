import React from 'react'
import { Card, Table, Tag, Button, Space, Input, Select } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const { Option } = Select

const ContractElements: React.FC = () => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>合同元素</h1>
                <Button type="primary" icon={<PlusOutlined />}>
                    新增元素
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索元素名称"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                        />
                        <Select placeholder="元素类型" style={{ width: 120 }}>
                            <Option value="all">全部类型</Option>
                            <Option value="clause">条款</Option>
                            <Option value="condition">条件</Option>
                            <Option value="payment">付款</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={[
                        { title: '元素名称', dataIndex: 'elementName', key: 'elementName' },
                        { title: '元素类型', dataIndex: 'elementType', key: 'elementType' },
                        { title: '描述', dataIndex: 'description', key: 'description' },
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

export default ContractElements 