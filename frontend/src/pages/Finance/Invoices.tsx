import React from 'react'
import { Card, Table, Tag, Button, Space, Input, Select } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const { Option } = Select

const Invoices: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>发票管理</h1>
        <Button type="primary" icon={<PlusOutlined />}>
          新建发票
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="搜索发票号"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select placeholder="发票状态" style={{ width: 120 }}>
              <Option value="all">全部状态</Option>
              <Option value="draft">草稿</Option>
              <Option value="issued">已开具</Option>
              <Option value="paid">已付款</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={[
            { title: '发票号', dataIndex: 'invoiceNo', key: 'invoiceNo' },
            { title: '客户名称', dataIndex: 'clientName', key: 'clientName' },
            { title: '发票金额', dataIndex: 'amount', key: 'amount' },
            { title: '状态', dataIndex: 'status', key: 'status' },
            { title: '开具时间', dataIndex: 'issueTime', key: 'issueTime' },
            { title: '操作', key: 'action', render: () => <Space><Button type="link" size="small">查看</Button></Space> }
          ]}
          dataSource={[]}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )
}

export default Invoices 