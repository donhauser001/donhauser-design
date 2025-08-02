import React from 'react'
import { Card, Table, Tag, Button, Space, Input, Select } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const { Option } = Select

const ContractList: React.FC = () => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h1>合同列表</h1>
                <Button type="primary" icon={<PlusOutlined />}>
                    新建合同
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space>
                        <Input
                            placeholder="搜索合同编号"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                        />
                        <Select placeholder="合同状态" style={{ width: 120 }}>
                            <Option value="all">全部状态</Option>
                            <Option value="draft">草稿</Option>
                            <Option value="pending">待签署</Option>
                            <Option value="signed">已签署</Option>
                            <Option value="completed">已完成</Option>
                            <Option value="expired">已过期</Option>
                        </Select>
                    </Space>
                </div>

                <Table
                    columns={[
                        { title: '合同编号', dataIndex: 'contractNo', key: 'contractNo' },
                        { title: '合同名称', dataIndex: 'contractName', key: 'contractName' },
                        { title: '客户名称', dataIndex: 'clientName', key: 'clientName' },
                        { title: '合同金额', dataIndex: 'amount', key: 'amount' },
                        { title: '状态', dataIndex: 'status', key: 'status' },
                        { title: '签署日期', dataIndex: 'signDate', key: 'signDate' },
                        { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button></Space> }
                    ]}
                    dataSource={[]}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    )
}

export default ContractList 