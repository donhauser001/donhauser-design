import React from 'react'
import { Card, Table, Tag, Button, Space, Input, Select, Progress } from 'antd'
import { SearchOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons'

const { Option } = Select

const ProposalCenter: React.FC = () => {
  const columns = [
    {
      title: '提案名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '客户',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: { [key: string]: string } = {
          'draft': 'default',
          'submitted': 'blue',
          'reviewing': 'orange',
          'approved': 'green',
          'rejected': 'red'
        }
        const textMap: { [key: string]: string } = {
          'draft': '草稿',
          'submitted': '已提交',
          'reviewing': '审核中',
          'approved': '已通过',
          'rejected': '已拒绝'
        }
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>
      }
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget: number) => `¥${budget.toLocaleString()}`
    },
    {
      title: '完成度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => <Progress percent={progress} size="small" />
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" size="small" icon={<FileTextOutlined />}>查看</Button>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">提交</Button>
        </Space>
      ),
    },
  ]

  const data = [
    {
      key: '1',
      name: '企业品牌设计提案',
      client: 'ABC科技有限公司',
      status: 'submitted',
      budget: 50000,
      progress: 80,
      createTime: '2024-01-15',
    },
    {
      key: '2',
      name: '网站建设方案',
      client: 'XYZ设计工作室',
      status: 'reviewing',
      budget: 30000,
      progress: 60,
      createTime: '2024-01-10',
    },
    {
      key: '3',
      name: '产品包装设计提案',
      client: 'DEF制造公司',
      status: 'draft',
      budget: 20000,
      progress: 30,
      createTime: '2024-01-20',
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>提案中心</h1>
        <Button type="primary" icon={<PlusOutlined />}>
          新建提案
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="搜索提案名称"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select placeholder="提案状态" style={{ width: 120 }}>
              <Option value="all">全部状态</Option>
              <Option value="draft">草稿</Option>
              <Option value="submitted">已提交</Option>
              <Option value="reviewing">审核中</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
            <Select placeholder="客户" style={{ width: 150 }}>
              <Option value="all">全部客户</Option>
              <Option value="abc">ABC科技有限公司</Option>
              <Option value="xyz">XYZ设计工作室</Option>
              <Option value="def">DEF制造公司</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )
}

export default ProposalCenter 