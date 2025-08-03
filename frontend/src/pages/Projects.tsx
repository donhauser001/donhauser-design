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
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  FileOutlined,
  CheckCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import CreateProjectModal from './Projects/CreateProjectModal'
import ActionMenu, { ActionTypes } from '../components/ActionMenu'
import { getProjects, deleteProject, Project as ApiProject, ProjectQuery } from '../api/projects'
import { getActiveEnterprises, Enterprise } from '../api/enterprises'
import { getEmployees, User } from '../api/users'

// 使用API中的Project类型
type Project = ApiProject

const Projects: React.FC = () => {
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [employees, setEmployees] = useState<User[]>([])

  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState<ProjectQuery>({
    search: '',
    status: '',
    team: '',
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

  // 获取项目数据
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await getProjects(searchParams)
      setProjects(response.data)
    } catch (error) {
      console.error('获取项目列表失败:', error)
      message.error('获取项目列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 获取企业和员工数据
  const fetchData = async () => {
    try {
      const [enterprisesResponse, employeesResponse] = await Promise.all([
        getActiveEnterprises(),
        getEmployees()
      ])
      setEnterprises(enterprisesResponse.data)
      setEmployees(employeesResponse.data)
    } catch (error) {
      console.error('获取数据失败:', error)
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchData()
  }, [searchParams])

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
            创建时间: {new Date(record.createdAt).toLocaleDateString()}
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
            <span style={{ fontSize: '12px' }}>
              主创: {(() => {
                const mainDesigners = employees.filter(emp => record.mainDesigner.includes(emp._id))
                return mainDesigners.map(emp => emp.realName).join(', ')
              })()}
            </span>
          </div>
          {record.assistantDesigners && record.assistantDesigners.length > 0 && (
            <div>
              <span style={{ fontSize: '12px', color: '#666' }}>
                助理: {(() => {
                  const assistantDesigners = employees.filter(emp => record.assistantDesigners.includes(emp._id))
                  return assistantDesigners.map(emp => emp.realName).join(', ')
                })()}
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
            任务: {record.relatedTaskIds?.length || 0}个
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
      width: 80,
      render: (_: any, record: Project) => {
        const actions = [
          {
            ...ActionTypes.VIEW,
            onClick: () => handleView(record)
          },
          {
            ...ActionTypes.EDIT,
            onClick: () => handleEdit(record)
          },
          {
            ...ActionTypes.DELETE,
            onClick: () => handleDelete(record._id)
          }
        ]

        return <ActionMenu actions={actions} />
      }
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
    navigate(`/projects/${project._id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id)
      message.success('项目删除成功')
      fetchProjects() // 重新获取项目列表
    } catch (error) {
      console.error('删除项目失败:', error)
      message.error('删除项目失败')
    }
  }

  const handleCreateProject = async (projectData: any) => {
    try {
      await fetchProjects() // 重新获取项目列表
      setIsModalVisible(false)
      message.success('项目创建成功')
    } catch (error) {
      console.error('创建项目失败:', error)
      message.error('创建项目失败')
    }
  }

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, search: value }))
  }

  const handleStatusChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, status: value === 'all' ? '' : value }))
  }

  const handleTeamChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, team: value === 'all' ? '' : value }))
  }

  const handleClientChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, client: value === 'all' ? '' : value }))
  }

  const handleRefresh = () => {
    fetchProjects()
    fetchData()
    message.success('数据已刷新')
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
              placeholder="团队"
              style={{ width: 150 }}
              onChange={handleTeamChange}
              allowClear
              options={[
                { value: 'all', label: '全部团队' },
                ...enterprises.map(enterprise => ({
                  value: enterprise.id,
                  label: enterprise.enterpriseName
                }))
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
          dataSource={projects}
          rowKey="_id"
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