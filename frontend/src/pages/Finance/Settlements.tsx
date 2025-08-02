import React from 'react'
import { Card, Table, Tag, Button, Space, Input, Select } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const { Option } = Select

const Settlements: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>结算单</h1>
        <Button type="primary" icon={<PlusOutlined />}>
          新建结算单
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="搜索结算单号"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select placeholder="结算状态" style={{ width: 120 }}>
              <Option value="all">全部状态</Option>
              <Option value="pending">待结算</Option>
              <Option value="completed">已结算</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={[
            { title: '结算单号', dataIndex: 'settlementNo', key: 'settlementNo' },
            { title: '客户名称', dataIndex: 'clientName', key: 'clientName' },
            { title: '结算金额', dataIndex: 'amount', key: 'amount' },
            { title: '状态', dataIndex: 'status', key: 'status' },
            { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
            { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button></Space> }
          ]}
          dataSource={[]}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )
}

export default Settlements 