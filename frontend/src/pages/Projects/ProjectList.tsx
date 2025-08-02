import React from 'react'
import { Card, Table, Tag, Button, Space, Input, Select } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const { Option } = Select

const ProjectList: React.FC = () => {
  const columns = [
    {
      title: '项目名称',
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
          'pending': 'orange',
          'in-progress': 'blue',
          'completed': 'green',
          'cancelled': 'red'
        }
        const textMap: { [key: string]: string } = {
          'pending': '待开始',
          'in-progress': '进行中',
          'completed': '已完成',
          'cancelled': '已取消'
        }
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>
      }
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget: number) => `¥${budget.toLocaleString()}`
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>删除</Button>
        </Space>
      ),
    },
  ]

  const data = [
    {
      key: '1',
      name: '企业官网设计',
      client: 'ABC科技有限公司',
      status: 'in-progress',
      assignee: '设计师A',
      budget: 15000,
      startDate: '2024-01-15',
    },
    {
      key: '2',
      name: '品牌设计项目',
      client: 'XYZ设计工作室',
      status: 'completed',
      assignee: '设计师B',
      budget: 25000,
      startDate: '2024-01-01',
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>项目列表</h1>
        <Button type="primary" icon={<PlusOutlined />}>
          新建项目
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="搜索项目名称"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select placeholder="项目状态" style={{ width: 120 }}>
              <Option value="all">全部状态</Option>
              <Option value="pending">待开始</Option>
              <Option value="in-progress">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
            <Select placeholder="负责人" style={{ width: 120 }}>
              <Option value="all">全部负责人</Option>
              <Option value="designer-a">设计师A</Option>
              <Option value="designer-b">设计师B</Option>
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

export default ProjectList 