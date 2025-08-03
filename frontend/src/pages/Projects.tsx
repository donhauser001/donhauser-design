import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  message,
  Input,
  Select,
  Tooltip,
  Avatar
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  FileOutlined,
  CheckCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import CreateProjectModal from './Projects/CreateProjectModal'

interface Project {
  id: string
  projectName: string
  client: string
  contact: string
  mainDesigner: string
  assistantDesigners: string[]
  relatedContracts: string[]
  relatedOrders: string[]
  relatedSettlements: string[]
  relatedInvoices: string[]
  relatedFiles: string[]
  relatedTasks: string[]
  relatedProposals: string[]
  clientRequirements: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold'
  startDate: string
  endDate?: string
  createdAt: string
}

const Projects: React.FC = () => {
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      projectName: '企业官网设计',
      client: 'ABC科技有限公司',
      contact: '张三',
      mainDesigner: '设计师A',
      assistantDesigners: ['设计师B', '设计师C'],
      relatedContracts: ['合同001'],
      relatedOrders: ['订单001'],
      relatedSettlements: ['结算单001'],
      relatedInvoices: ['发票001'],
      relatedFiles: ['设计稿.pdf', '需求文档.docx'],
      relatedTasks: ['任务1', '任务2', '任务3'],
      relatedProposals: ['提案001'],
      clientRequirements: '需要现代化的企业官网设计，突出公司科技感和专业性',
      status: 'in-progress',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      projectName: '品牌设计项目',
      client: 'XYZ设计工作室',
      contact: '李四',
      mainDesigner: '设计师B',
      assistantDesigners: ['设计师D'],
      relatedContracts: ['合同002'],
      relatedOrders: ['订单002'],
      relatedSettlements: ['结算单002'],
      relatedInvoices: ['发票002'],
      relatedFiles: ['品牌手册.pdf'],
      relatedTasks: ['任务4', '任务5'],
      relatedProposals: ['提案002'],
      clientRequirements: '完整的品牌视觉识别系统设计，包括logo、色彩、字体等',
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-01-30',
      createdAt: '2023-12-25'
    },
    {
      id: '3',
      projectName: '移动应用UI设计',
      client: '创新科技公司',
      contact: '王五',
      mainDesigner: '设计师C',
      assistantDesigners: ['设计师A'],
      relatedContracts: ['合同003'],
      relatedOrders: ['订单003'],
      relatedSettlements: ['结算单003'],
      relatedInvoices: ['发票003'],
      relatedFiles: ['UI设计稿.sketch', '原型图.fig'],
      relatedTasks: ['任务6', '任务7', '任务8'],
      relatedProposals: ['提案003'],
      clientRequirements: '设计一套现代化的移动应用UI，注重用户体验和视觉美感',
      status: 'pending',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      createdAt: '2024-01-20'
    }
  ])

  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    search: '',
    status: '',
    mainDesigner: '',
    client: ''
  })

  const statusColors = {
    pending: 'orange',
    'in-progress': 'blue',
    completed: 'green',
    cancelled: 'red',
    'on-hold': 'purple'
  }

  const statusText = {
    pending: '待开始',
    'in-progress': '进行中',
    completed: '已完成',
    cancelled: '已取消',
    'on-hold': '暂停中'
  }

  // 过滤项目数据
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchParams.search ||
      project.projectName.toLowerCase().includes(searchParams.search.toLowerCase()) ||
      project.client.toLowerCase().includes(searchParams.search.toLowerCase())

    const matchesStatus = !searchParams.status || project.status === searchParams.status
    const matchesDesigner = !searchParams.mainDesigner || project.mainDesigner === searchParams.mainDesigner
    const matchesClient = !searchParams.client || project.client === searchParams.client

    return matchesSearch && matchesStatus && matchesDesigner && matchesClient
  })

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 200,
      render: (text: string, record: Project) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            创建时间: {record.createdAt}
          </div>
        </div>
      )
    },
    {
      title: '客户信息',
      key: 'clientInfo',
      width: 150,
      render: (_: any, record: Project) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.client}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            联系人: {record.contact}
          </div>
        </div>
      )
    },
    {
      title: '设计团队',
      key: 'designTeam',
      width: 180,
      render: (_: any, record: Project) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: '12px' }}>主创: {record.mainDesigner}</span>
          </div>
          {record.assistantDesigners && record.assistantDesigners.length > 0 && (
            <div>
              <span style={{ fontSize: '12px', color: '#666' }}>
                助理: {record.assistantDesigners.join(', ')}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      title: '关联信息',
      key: 'relatedInfo',
      width: 200,
      render: (_: any, record: Project) => (
        <div style={{ fontSize: '12px' }}>
          <div style={{ marginBottom: 2 }}>
            <FileTextOutlined style={{ marginRight: 4 }} />
            合同: {record.relatedContracts?.length || 0}个
          </div>
          <div style={{ marginBottom: 2 }}>
            <DollarOutlined style={{ marginRight: 4 }} />
            订单: {record.relatedOrders?.length || 0}个
          </div>
          <div style={{ marginBottom: 2 }}>
            <FileOutlined style={{ marginRight: 4 }} />
            文件: {record.relatedFiles?.length || 0}个
          </div>
          <div>
            <CheckCircleOutlined style={{ marginRight: 4 }} />
            任务: {record.relatedTasks?.length || 0}个
          </div>
        </div>
      )
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: keyof typeof statusColors) => (
        <Tag color={statusColors[status]}>{statusText[status]}</Tag>
      )
    },
    {
      title: '时间',
      key: 'time',
      width: 120,
      render: (_: any, record: Project) => (
        <div style={{ fontSize: '12px' }}>
          <div>开始: {record.startDate}</div>
          {record.endDate && <div>结束: {record.endDate}</div>}
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Project) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]

  const handleAdd = () => {
    setIsModalVisible(true)
  }

  const handleEdit = (project: Project) => {
    // 暂时禁用编辑功能，使用新的分步骤模态窗
    message.info('编辑功能正在开发中')
  }

  const handleView = (project: Project) => {
    navigate(`/projects/${project.id}`)
  }

  const handleDelete = (id: string) => {
    // 使用简单的确认对话框
    if (window.confirm('确定要删除这个项目吗？删除后无法恢复。')) {
      setProjects(projects.filter(project => project.id !== id))
      message.success('项目删除成功')
    }
  }

  const handleCreateProject = (projectData: Project) => {
    setProjects([...projects, projectData])
    setIsModalVisible(false)
    message.success('项目创建成功')
  }

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, search: value }))
  }

  const handleStatusChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, status: value === 'all' ? '' : value }))
  }

  const handleDesignerChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, mainDesigner: value === 'all' ? '' : value }))
  }

  const handleClientChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, client: value === 'all' ? '' : value }))
  }

  const handleRefresh = () => {
    setLoading(true)
    // 模拟加载
    setTimeout(() => {
      setLoading(false)
      message.success('数据已刷新')
    }, 1000)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>项目管理</h1>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            刷新
          </Button>
          <Button onClick={() => navigate('/projects/task-board')}>
            任务看板
          </Button>
          <Button onClick={() => navigate('/projects/proposal-center')}>
            提案中心
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建项目
          </Button>
        </Space>
      </div>

      {/* 项目列表 */}
      <Card title="项目列表">
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="搜索项目名称"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Select
              placeholder="项目状态"
              style={{ width: 120 }}
              onChange={handleStatusChange}
              allowClear
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'pending', label: '待开始' },
                { value: 'in-progress', label: '进行中' },
                { value: 'completed', label: '已完成' },
                { value: 'cancelled', label: '已取消' },
                { value: 'on-hold', label: '暂停中' }
              ]}
            />
            <Select
              placeholder="主创设计师"
              style={{ width: 150 }}
              onChange={handleDesignerChange}
              allowClear
              options={[
                { value: 'all', label: '全部设计师' },
                { value: '设计师A', label: '设计师A' },
                { value: '设计师B', label: '设计师B' },
                { value: '设计师C', label: '设计师C' }
              ]}
            />
            <Select
              placeholder="客户"
              style={{ width: 150 }}
              onChange={handleClientChange}
              allowClear
              options={[
                { value: 'all', label: '全部客户' },
                { value: 'ABC科技有限公司', label: 'ABC科技有限公司' },
                { value: 'XYZ设计工作室', label: 'XYZ设计工作室' },
                { value: '创新科技公司', label: '创新科技公司' }
              ]}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新建项目分步骤模态框 */}
      <CreateProjectModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreateProject}
        loading={loading}
      />
    </div>
  )
}

export default Projects 