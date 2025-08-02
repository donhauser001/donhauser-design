import React, { useState } from 'react'
import { Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input

interface Project {
  id: string
  name: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  clientName: string
  assignedTo: string
  startDate: string
  endDate?: string
  budget: number
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: '企业官网设计',
      description: '为某科技公司设计现代化企业官网',
      status: 'in-progress',
      clientName: '张三',
      assignedTo: '设计师A',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      budget: 15000
    },
    {
      id: '2',
      name: '品牌设计项目',
      description: '完整的品牌视觉识别系统设计',
      status: 'completed',
      clientName: '李四',
      assignedTo: '设计师B',
      startDate: '2024-01-01',
      endDate: '2024-01-30',
      budget: 25000
    }
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [form] = Form.useForm()

  const statusColors = {
    pending: 'orange',
    'in-progress': 'blue',
    completed: 'green',
    cancelled: 'red'
  }

  const statusText = {
    pending: '待开始',
    'in-progress': '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof statusColors) => (
        <Tag color={statusColors[status]}>{statusText[status]}</Tag>
      ),
    },
    {
      title: '客户',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: '负责人',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget: number) => `¥${budget.toLocaleString()}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Project) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingProject(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    form.setFieldsValue({
      ...project,
      startDate: project.startDate ? new Date(project.startDate) : null,
      endDate: project.endDate ? new Date(project.endDate) : null,
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    setProjects(projects.filter(project => project.id !== id))
    message.success('项目删除成功')
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const projectData = {
        ...values,
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
      }

      if (editingProject) {
        // 编辑项目
        setProjects(projects.map(project =>
          project.id === editingProject.id
            ? { ...project, ...projectData }
            : project
        ))
        message.success('项目更新成功')
      } else {
        // 新增项目
        const newProject: Project = {
          id: Date.now().toString(),
          ...projectData,
        }
        setProjects([...projects, newProject])
        message.success('项目创建成功')
      }

      setIsModalVisible(false)
      form.resetFields()
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>项目管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新建项目
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProject ? '编辑项目' : '新建项目'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="status"
            label="项目状态"
            rules={[{ required: true, message: '请选择项目状态' }]}
          >
            <Select>
              <Option value="pending">待开始</Option>
              <Option value="in-progress">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="clientName"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="assignedTo"
            label="负责人"
            rules={[{ required: true, message: '请输入负责人' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="budget"
            label="预算"
            rules={[{ required: true, message: '请输入预算' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="startDate" label="开始日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="endDate" label="结束日期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Projects 