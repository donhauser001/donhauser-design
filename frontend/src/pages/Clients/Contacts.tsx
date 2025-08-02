import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Space, Input, Select, Avatar, Modal, Form, message, Switch, Dropdown, Row, Col } from 'antd'
import { SearchOutlined, PlusOutlined, UserOutlined, EditOutlined, DeleteOutlined, LockOutlined, CopyOutlined, SettingOutlined, MoreOutlined, StopOutlined } from '@ant-design/icons'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import axios from 'axios'

const { Option } = Select

interface UserData {
  id?: string
  _id?: string
  username: string
  password?: string
  email: string
  phone: string
  realName: string
  role: string
  department: string
  status: 'active' | 'inactive'
  createTime: string
  lastLogin?: string
  // 企业信息
  enterpriseId?: string
  enterpriseName?: string
  departmentId?: string
  departmentName?: string
  position?: string
  // 客户信息
  company?: string
  contactPerson?: string
  address?: string
  shippingMethod?: string
  // 用户描述
  description?: string
  // 用户权限
  permissions?: string[]
  // 用户权限组
  permissionGroups?: string[]
}



const Contacts: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRole, setSelectedRole] = useState<string>('')

  // 修改密码相关状态
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)
  const [resettingUser, setResettingUser] = useState<UserData | null>(null)
  const [passwordForm] = Form.useForm()
  const [passwordLoading, setPasswordLoading] = useState(false)

  // 数据状态
  const [users, setUsers] = useState<UserData[]>([])
  const [tableLoading, setTableLoading] = useState(false)
  const [roles, setRoles] = useState<any[]>([])

  // 客户数据状态
  const [clientData, setClientData] = useState<any[]>([])

  // 模拟企业数据
  const enterpriseData = [
    { id: '1', name: 'ABC设计有限公司', address: '北京市朝阳区建国路88号', contactPerson: '张总' },
    { id: '2', name: 'XYZ科技有限公司', address: '上海市浦东新区陆家嘴金融中心', contactPerson: '李总' },
    { id: '3', name: '创新科技集团', address: '深圳市南山区科技园', contactPerson: '王总' },
    { id: '4', name: '未来数字公司', address: '广州市天河区珠江新城', contactPerson: '刘总' },
    { id: '5', name: '智慧解决方案', address: '杭州市西湖区文三路', contactPerson: '陈总' }
  ]



  // 获取角色
  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/roles/all')
      if (response.data.success) {
        setRoles(response.data.data)
      }
    } catch (error) {
      console.error('获取角色失败:', error)
    }
  }

  // 获取客户数据
  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients')
      if (response.data.success) {
        setClientData(response.data.data)
      }
    } catch (error) {
      console.error('获取客户数据失败:', error)
    }
  }

  // 获取用户列表
  const fetchUsers = async () => {
    setTableLoading(true)
    try {
      const response = await axios.get('/api/users', {
        params: {
          search: searchText,
          role: '客户', // 只获取客户角色的用户
          status: statusFilter === 'all' ? '' : statusFilter,
          page: 1,
          limit: 100
        }
      })
      if (response.data.success) {
        setUsers(response.data.data)
      } else {
        message.error('获取用户列表失败')
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      message.error('获取用户列表失败')
    }
    setTableLoading(false)
  }

  // 监听搜索和筛选条件变化
  useEffect(() => {
    fetchUsers()
  }, [searchText, statusFilter])

  // 初始化数据
  useEffect(() => {
    fetchRoles()
    fetchClients()
  }, [])

  // 角色选项 - 只显示客户角色
  const roleOptions = roles
    .filter(role => role.roleName === '客户')
    .map((role, index) => ({
      key: role.id || `role-${index}`,
      label: role.roleName,
      value: role.roleName
    }))

  // 快递方式选项
  const shippingMethodOptions = [
    { label: '顺丰快递', value: '顺丰快递' },
    { label: '圆通快递', value: '圆通快递' },
    { label: '中通快递', value: '中通快递' },
    { label: '申通快递', value: '申通快递' },
    { label: '韵达快递', value: '韵达快递' },
    { label: 'EMS', value: 'EMS' },
    { label: '京东物流', value: '京东物流' },
    { label: '自提', value: '自提' }
  ]

  // 显示新增用户模态窗
  const showAddModal = () => {
    setEditingUser(null)
    setSelectedRole('客户')
    form.resetFields()
    form.setFieldsValue({ role: '客户', department: '外部客户' })
    setIsModalVisible(true)
  }

  // 显示编辑用户模态窗
  const showEditModal = (user: UserData) => {
    setEditingUser(user)
    setSelectedRole(user.role)

    form.setFieldsValue({
      username: user.username,
      email: user.email,
      phone: user.phone,
      realName: user.realName,
      role: user.role,
      department: user.department,
      status: user.status,
      company: user.company,
      contactPerson: user.contactPerson,
      address: user.address,
      shippingMethod: user.shippingMethod,
      description: user.description
    })
    setIsModalVisible(true)
  }

  // 处理模态窗确认
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // 客户用户设置部门为外部客户
      values.department = '外部客户'

      if (editingUser) {
        // 编辑用户 - 不更新密码
        const { password, ...updateValues } = values
        const userId = editingUser.id || editingUser._id
        if (!userId) {
          message.error('用户ID不存在')
          return
        }
        const response = await axios.put(`/api/users/${userId}`, updateValues)
        if (response.data.success) {
          message.success('联系人信息更新成功')
          fetchUsers()
        } else {
          message.error(response.data.message || '更新失败')
        }
      } else {
        // 新增用户
        const response = await axios.post('/api/users', values)
        if (response.data.success) {
          message.success('联系人创建成功')
          fetchUsers()
        } else {
          message.error(response.data.message || '创建失败')
        }
      }

      setIsModalVisible(false)
      setEditingUser(null)
      form.resetFields()
    } catch (error: any) {
      console.error('操作失败:', error)
      message.error(error?.response?.data?.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理模态窗取消
  const handleModalCancel = () => {
    setIsModalVisible(false)
    setEditingUser(null)
    form.resetFields()
  }

  // 显示重置密码模态窗
  const showResetPasswordModal = (user: UserData) => {
    setResettingUser(user)
    passwordForm.resetFields()
    setIsPasswordModalVisible(true)
  }

  // 处理重置密码确认
  const handlePasswordModalOk = async () => {
    try {
      const values = await passwordForm.validateFields()
      setPasswordLoading(true)

      const userId = resettingUser?.id || resettingUser?._id
      if (!userId) {
        message.error('用户ID不存在')
        return
      }

      const response = await axios.put(`/api/users/${userId}/reset-password`, {
        newPassword: values.password
      })

      if (response.data.success) {
        message.success('密码重置成功')
        setIsPasswordModalVisible(false)
        setResettingUser(null)
        passwordForm.resetFields()
      } else {
        message.error(response.data.message || '密码重置失败')
      }
    } catch (error: any) {
      console.error('密码重置失败:', error)
      message.error(error?.response?.data?.message || '密码重置失败')
    } finally {
      setPasswordLoading(false)
    }
  }

  // 处理重置密码取消
  const handlePasswordModalCancel = () => {
    setIsPasswordModalVisible(false)
    setResettingUser(null)
    passwordForm.resetFields()
  }

  // 删除用户
  const handleDeleteUser = (userId: string) => {
    if (!userId) {
      message.error('用户ID不存在')
      return
    }
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个联系人吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.delete(`/api/users/${userId}`)
          if (response.data.success) {
            message.success('联系人删除成功')
            fetchUsers()
          } else {
            message.error(response.data.message || '删除失败')
          }
        } catch (error: any) {
          console.error('删除失败:', error)
          message.error(error?.response?.data?.message || '删除失败')
        }
      }
    })
  }

  // 重置密码
  const handleResetPassword = (userId: string) => {
    Modal.confirm({
      title: '确认重置密码',
      content: '确定要重置这个联系人的密码吗？',
      okText: '重置',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.put(`/api/users/${userId}/reset-password`, {
            newPassword: '123456' // 默认密码
          })
          if (response.data.success) {
            message.success('密码重置成功，新密码为：123456')
          } else {
            message.error(response.data.message || '密码重置失败')
          }
        } catch (error: any) {
          console.error('密码重置失败:', error)
          message.error(error?.response?.data?.message || '密码重置失败')
        }
      }
    })
  }

  // 切换用户状态
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    if (!userId) {
      message.error('用户ID不存在')
      return
    }
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const response = await axios.put(`/api/users/${userId}`, { status: newStatus })
      if (response.data.success) {
        message.success(`联系人${newStatus === 'active' ? '启用' : '禁用'}成功`)
        fetchUsers()
      } else {
        message.error(response.data.message || '状态更新失败')
      }
    } catch (error: any) {
      console.error('状态更新失败:', error)
      message.error(error?.response?.data?.message || '状态更新失败')
    }
  }

  // 处理角色变化
  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    if (role === '客户') {
      form.setFieldsValue({ department: '外部客户' })
    }
  }

  // 处理客户选择
  const handleClientSelect = (clientId: string) => {
    const client = clientData.find(c => c.id === clientId)
    if (client) {
      form.setFieldsValue({
        company: client.companyName || client.name
      })
    }
  }

  // 处理企业选择
  const handleEnterpriseSelect = (enterpriseId: string) => {
    const enterprise = enterpriseData.find(e => e.id === enterpriseId)
    if (enterprise) {
      form.setFieldsValue({
        enterpriseName: enterprise.name,
        address: enterprise.address,
        contactPerson: enterprise.contactPerson
      })
    }
  }

  // 复制快递信息
  const handleCopyShippingInfo = (shippingInfo: string) => {
    navigator.clipboard.writeText(shippingInfo).then(() => {
      message.success('快递信息已复制到剪贴板')
    }).catch(() => {
      message.error('复制失败，请手动复制')
    })
  }

  // 获取客户开票信息
  const getClientInvoiceInfo = async (companyName: string) => {
    try {
      const client = clientData.find(c => {
        const clientName = c.companyName || c.name || c.company
        return clientName === companyName
      })

      if (!client || !client._id) {
        return null
      }

      // 直接使用当前客户数据，不需要再次请求API
      return {
        invoiceType: client.invoiceType || '未设置',
        invoiceInfo: client.invoiceInfo || '未设置',
        taxNumber: client.taxNumber || '未设置',
        companyName: client.companyName || client.name || '未设置',
        address: client.address || '未设置',
        phone: client.phone || '未设置',
        bankAccount: client.bankAccount || '未设置'
      }
    } catch (error) {
      console.error('获取客户开票信息失败:', error)
      return null
    }
  }

  // 复制开票资料
  const handleCopyInvoiceInfo = async (companyName: string) => {
    const invoiceInfo = await getClientInvoiceInfo(companyName)
    if (!invoiceInfo) {
      message.error('获取开票信息失败')
      return
    }

    const invoiceText = `发票类型：${invoiceInfo.invoiceType}
开票信息：${invoiceInfo.invoiceInfo}`

    navigator.clipboard.writeText(invoiceText).then(() => {
      message.success('开票资料已复制到剪贴板')
    }).catch(() => {
      message.error('复制失败，请手动复制')
    })
  }

  // 计算时间差
  const calculateTimeDifference = (createTime: string) => {
    const now = new Date()
    const createDate = new Date(createTime)
    const diffTime = Math.abs(now.getTime() - createDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return '今天'
    } else if (diffDays === 2) {
      return '昨天'
    } else if (diffDays <= 7) {
      return `${diffDays - 1}天前`
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks}周前`
    } else if (diffDays <= 365) {
      const months = Math.floor(diffDays / 30)
      return `${months}个月前`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years}年前`
    }
  }



  // 过滤用户数据 - 只显示客户角色的用户
  const filteredUsers = users.filter(user => {
    // 只显示客户角色的用户
    if (user.role !== '客户') {
      return false
    }

    // 搜索文本过滤
    const searchMatch = !searchText ||
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.realName.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchText.toLowerCase()))

    // 状态过滤
    const statusMatch = statusFilter === 'all' || user.status === statusFilter

    return searchMatch && statusMatch
  })

  const columns = [
    {
      title: '联系人',
      key: 'userInfo',
      render: (_: any, record: UserData) => (
        <div>
          <div style={{
            color: record.status === 'active' ? '#000' : '#999',
            fontWeight: 'bold'
          }}>
            {record.realName}
            {record.status === 'inactive' && (
              <Tag color="red" style={{ marginLeft: 8 }}>已禁用</Tag>
            )}
          </div>
        </div>
      )
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => (
        <span style={{ color: phone ? '#333' : '#999' }}>
          {phone || '-'}
        </span>
      )
    },
    {
      title: '公司',
      key: 'company',
      render: (_: any, record: UserData) => (
        <span>{record.company || '-'}</span>
      )
    },
    {
      title: '快递信息',
      key: 'shippingMethod',
      render: (_: any, record: UserData) => {
        if (record.shippingMethod) {
          return (
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopyShippingInfo(record.shippingMethod || '')}
            >
              复制快递信息
            </Button>
          )
        }
        return '-'
      }
    },
    {
      title: '发票',
      key: 'invoice',
      render: (_: any, record: UserData) => {
        if (record.company) {
          return (
            <Button
              type="link"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleCopyInvoiceInfo(record.company || '')}
            >
              复制开票资料
            </Button>
          )
        }
        return '-'
      }
    },
    {
      title: '注册时间',
      key: 'registerTime',
      render: (_: any, record: UserData) => {
        const timeDiff = calculateTimeDifference(record.createTime)
        return (
          <div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {timeDiff}
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {record.createTime}
            </div>
          </div>
        )
      }
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin: string) => (
        <span style={{ color: lastLogin === '-' ? '#999' : '#333' }}>
          {lastLogin}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: UserData) => {
        const actions = [
          {
            ...ActionTypes.EDIT,
            onClick: () => showEditModal(record)
          },
          {
            ...ActionTypes.PASSWORD,
            onClick: () => showResetPasswordModal(record)
          },
          {
            ...ActionTypes.TOGGLE_STATUS,
            label: record.status === 'active' ? '停用' : '启用',
            onClick: () => handleToggleStatus(record.id || record._id || '', record.status)
          },
          {
            ...ActionTypes.DELETE,
            onClick: () => handleDeleteUser(record.id || record._id || '')
          }
        ]

        return <ActionMenu actions={actions} />
      }
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>联系人</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          新增联系人
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input.Search
              placeholder="搜索用户名、邮箱、姓名、公司"
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="状态"
              style={{ width: 120 }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option key="all" value="all">全部状态</Option>
              <Option key="active" value="active">启用</Option>
              <Option key="inactive" value="inactive">禁用</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey={(record) => record.id || record._id || ''}
          loading={tableLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 新增/编辑用户模态窗 */}
      <Modal
        title={editingUser ? '编辑联系人' : '新增联系人'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            role: '客户',
            department: '外部客户',
            status: 'active'
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' }
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="realName"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option key="active" value="active">启用</Option>
                  <Option key="inactive" value="inactive">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="company"
                label="公司名称"
              >
                <Select
                  placeholder="请选择或输入公司名称"
                  showSearch
                  allowClear
                  onSelect={handleClientSelect}
                >
                  {clientData.map((client, index) => (
                    <Option key={client.id || `client-${index}`} value={client.companyName || client.name}>
                      {client.companyName || client.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="职位"
              >
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="shippingMethod"
            label="快递方式"
          >
            <Input.TextArea rows={3} placeholder="请输入快递方式" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>

          {!editingUser && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6个字符' }
                  ]}
                >
                  <Input.Password placeholder="请输入密码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="确认密码"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'))
                      }
                    })
                  ]}
                >
                  <Input.Password placeholder="请确认密码" />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>

      {/* 重置密码模态窗 */}
      <Modal
        title="重置密码"
        open={isPasswordModalVisible}
        onOk={handlePasswordModalOk}
        onCancel={handlePasswordModalCancel}
        confirmLoading={passwordLoading}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                }
              })
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>
        </Form>
      </Modal>


    </div>
  )
}

export default Contacts 