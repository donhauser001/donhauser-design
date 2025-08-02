import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Space, Input, Select, Modal, Form, message, DatePicker, InputNumber } from 'antd'
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import axios from 'axios'
import dayjs from 'dayjs'

const { Option } = Select
const { TextArea } = Input

interface OrderData {
  id?: string
  _id?: string
  orderNo: string
  clientName: string
  clientId: string
  amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'
  createTime: string
  updateTime?: string
  description?: string
  projectName?: string
  quotationId?: string
  selectedServices?: string[]
  paymentMethod?: string
  deliveryDate?: string
  contactPerson?: string
  contactPhone?: string
  address?: string
  remark?: string
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null)
  const [form] = Form.useForm()
  const [clients, setClients] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [quotations, setQuotations] = useState<any[]>([])
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedContactId, setSelectedContactId] = useState<string>('')
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [projectName, setProjectName] = useState<string>('')
  const [serviceDetails, setServiceDetails] = useState<any[]>([])

  // 获取订单列表
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/orders', {
        params: {
          search: searchText,
          status: statusFilter === 'all' ? '' : statusFilter,
          page: 1,
          limit: 100
        }
      })
      if (response.data.success) {
        setOrders(response.data.data)
      } else {
        message.error('获取订单列表失败')
      }
    } catch (error) {
      console.error('获取订单列表失败:', error)
      // 使用模拟数据
      setOrders(mockOrders)
    }
    setLoading(false)
  }

  // 获取客户列表
  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients')
      if (response.data.success) {
        setClients(response.data.data)
      }
    } catch (error) {
      console.error('获取客户列表失败:', error)
    }
  }

  // 模拟订单数据
  const mockOrders: OrderData[] = [
    {
      id: '1',
      orderNo: 'ORD202401001',
      clientName: 'ABC科技有限公司',
      clientId: '1',
      amount: 15000,
      status: 'confirmed',
      createTime: '2024-01-15 10:30:00',
      description: '网站设计项目',
      projectName: '企业官网设计',
      quotationId: 'quotation_001',
      selectedServices: ['service_001', 'service_002'],
      paymentMethod: '银行转账',
      deliveryDate: '2024-02-15',
      contactPerson: '张经理',
      contactPhone: '13800138001',
      address: '北京市朝阳区建国路88号',
      remark: '客户要求高质量设计'
    },
    {
      id: '2',
      orderNo: 'ORD202401002',
      clientName: 'XYZ设计工作室',
      clientId: '2',
      amount: 25000,
      status: 'processing',
      createTime: '2024-01-10 14:20:00',
      description: '品牌设计服务',
      projectName: '品牌形象设计',
      quotationId: 'quotation_002',
      selectedServices: ['service_003', 'service_004'],
      paymentMethod: '支付宝',
      deliveryDate: '2024-02-10',
      contactPerson: '李设计师',
      contactPhone: '13800138002',
      address: '上海市浦东新区陆家嘴金融中心',
      remark: '需要创意性设计'
    },
    {
      id: '3',
      orderNo: 'ORD202401003',
      clientName: '创新科技集团',
      clientId: '3',
      amount: 35000,
      status: 'pending',
      createTime: '2024-01-20 09:15:00',
      description: '移动应用开发',
      projectName: '移动端APP开发',
      quotationId: 'quotation_003',
      selectedServices: ['service_005', 'service_006'],
      paymentMethod: '微信支付',
      deliveryDate: '2024-03-20',
      contactPerson: '王总监',
      contactPhone: '13800138003',
      address: '深圳市南山区科技园',
      remark: '技术导向型项目'
    },
    {
      id: '4',
      orderNo: 'ORD202401004',
      clientName: '未来数字公司',
      clientId: '4',
      amount: 18000,
      status: 'completed',
      createTime: '2024-01-05 16:45:00',
      description: 'UI/UX设计',
      projectName: '用户界面设计',
      quotationId: 'quotation_004',
      selectedServices: ['service_007'],
      paymentMethod: '银行转账',
      deliveryDate: '2024-01-25',
      contactPerson: '刘经理',
      contactPhone: '13800138004',
      address: '广州市天河区珠江新城',
      remark: '已完成交付'
    },
    {
      id: '5',
      orderNo: 'ORD202401005',
      clientName: '智慧解决方案',
      clientId: '5',
      amount: 42000,
      status: 'cancelled',
      createTime: '2024-01-12 11:30:00',
      description: '系统集成项目',
      projectName: '企业管理系统集成',
      quotationId: 'quotation_005',
      selectedServices: ['service_008', 'service_009', 'service_010'],
      paymentMethod: '银行转账',
      deliveryDate: '2024-03-12',
      contactPerson: '陈主管',
      contactPhone: '13800138005',
      address: '杭州市西湖区文三路',
      remark: '客户取消项目'
    }
  ]

  // 监听搜索和筛选条件变化
  useEffect(() => {
    fetchOrders()
  }, [searchText, statusFilter])

  // 初始化数据
  useEffect(() => {
    fetchClients()
  }, [])

  // 当步骤切换时，确保表单状态保持一致
  useEffect(() => {
    if (currentStep === 1) {
      // 确保表单值与状态变量同步
      if (selectedClientId) {
        form.setFieldsValue({ clientId: selectedClientId })
      }
      if (selectedContactId) {
        form.setFieldsValue({ contactId: selectedContactId })
      }
      if (projectName) {
        form.setFieldsValue({ projectName: projectName })
      }
    }
  }, [currentStep, selectedClientId, selectedContactId, projectName, form])

  // 获取服务项目详细信息
  const fetchServiceDetails = async (serviceIds: string[]) => {
    try {
      if (serviceIds.length === 0) {
        setServiceDetails([])
        return
      }

      const response = await axios.get('/api/servicePricing/by-ids', {
        params: {
          ids: serviceIds.join(',')
        }
      })

      if (response.data.success) {
        setServiceDetails(response.data.data)
      } else {
        console.error('获取服务项目详情失败:', response.data.message)
        setServiceDetails([])
      }
    } catch (error) {
      console.error('获取服务项目详情失败:', error)
      setServiceDetails([])
    }
  }

  // 显示新增订单模态窗
  const showAddModal = () => {
    setEditingOrder(null)
    form.resetFields()
    form.setFieldsValue({
      status: 'pending',
      createTime: dayjs()
    })
    setSelectedClientId('') // 重置客户选择状态
    setSelectedContactId('') // 重置联系人选择状态
    setProjectName('') // 重置项目名称状态
    setServiceDetails([]) // 重置服务详情状态
    setCurrentStep(1) // 重置步骤
    setIsModalVisible(true)
  }

  // 处理客户选择
  const handleClientSelect = async (clientId: string) => {
    try {
      // 获取客户详情
      const clientResponse = await axios.get(`/api/clients/${clientId}`)
      if (clientResponse.data.success) {
        const client = clientResponse.data.data

        // 获取该客户的联系人列表 - 包含已禁用的联系人
        const contactsResponse = await axios.get('/api/users', {
          params: {
            role: '客户'
          }
        })

        if (contactsResponse.data.success) {
          // 过滤出属于该公司的联系人
          const clientContacts = contactsResponse.data.data.filter((contact: any) => {
            return contact.company === (client.companyName || client.name)
          })
          setContacts(clientContacts)

          console.log('客户公司名称:', client.companyName || client.name)
          console.log('找到的联系人:', clientContacts)
        }

        // 根据客户的quotationId获取报价单
        if (client.quotationId) {
          try {
            const quotationResponse = await axios.get(`/api/quotations/${client.quotationId}`)
            if (quotationResponse.data.success) {
              const quotation = quotationResponse.data.data
              setQuotations([quotation])
              setSelectedQuotation(quotation)

              // 获取服务项目详情
              if (quotation.selectedServices && quotation.selectedServices.length > 0) {
                await fetchServiceDetails(quotation.selectedServices)
              }
            }
          } catch (error) {
            console.error('获取报价单失败:', error)
            message.warning('该客户关联的报价单不存在或已被删除')
            setQuotations([])
            setSelectedQuotation(null)
            setServiceDetails([])
          }
        } else {
          // 如果客户没有关联报价单，获取该客户的所有报价单
          const quotationsResponse = await axios.get('/api/quotations', {
            params: {
              clientId: clientId,
              status: 'active' // 只获取活跃的报价单
            }
          })

          if (quotationsResponse.data.success) {
            setQuotations(quotationsResponse.data.data)
            if (quotationsResponse.data.data.length > 0) {
              const quotation = quotationsResponse.data.data[0]
              setSelectedQuotation(quotation)

              // 获取服务项目详情
              if (quotation.selectedServices && quotation.selectedServices.length > 0) {
                await fetchServiceDetails(quotation.selectedServices)
              }
            }
          }
        }

        // 更新表单
        form.setFieldsValue({
          clientId: clientId,
          clientName: client.companyName || client.name,
          contactId: undefined // 清空之前选择的联系人
        })
        setSelectedClientId(clientId) // 保存选择的客户ID

        // 检查之前选择的联系人是否仍然属于新选择的客户
        if (selectedContactId) {
          const previousContact = contacts.find(contact =>
            (contact.id || contact._id) === selectedContactId
          )
          if (!previousContact || previousContact.company !== (client.companyName || client.name)) {
            setSelectedContactId('') // 如果联系人不属于新客户，则重置
            form.setFieldsValue({ contactId: undefined })
          }
        } else {
          setSelectedContactId('') // 重置联系人选择状态
        }
      }
    } catch (error) {
      console.error('获取客户信息失败:', error)
      message.error('获取客户信息失败')
    }
  }



  // 显示编辑订单模态窗
  const showEditModal = (order: OrderData) => {
    setEditingOrder(order)
    form.setFieldsValue({
      ...order,
      createTime: order.createTime ? dayjs(order.createTime) : undefined,
      deliveryDate: order.deliveryDate ? dayjs(order.deliveryDate) : undefined
    })
    setIsModalVisible(true)
  }

  // 处理模态窗确认
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // 构建订单数据
      const orderData = {
        clientId: selectedClientId,
        clientName: form.getFieldValue('clientName'),
        contactId: selectedContactId,
        projectName: projectName,
        quotationId: selectedQuotation?._id || selectedQuotation?.id,
        amount: 0, // 暂时设为0，后续可以根据服务定价计算
        status: 'pending',
        createTime: new Date().toISOString(),
        description: selectedQuotation?.description || '',
        selectedServices: selectedQuotation?.selectedServices || []
      }

      if (editingOrder) {
        // 编辑订单
        const orderId = editingOrder.id || editingOrder._id
        const response = await axios.put(`/api/orders/${orderId}`, orderData)
        if (response.data.success) {
          message.success('订单更新成功')
          fetchOrders()
        } else {
          message.error(response.data.message || '更新失败')
        }
      } else {
        // 新增订单
        const response = await axios.post('/api/orders', orderData)
        if (response.data.success) {
          message.success('订单创建成功')
          fetchOrders()
        } else {
          message.error(response.data.message || '创建失败')
        }
      }

      setIsModalVisible(false)
      setEditingOrder(null)
      setCurrentStep(1)
      setContacts([])
      setQuotations([])
      setSelectedQuotation(null)
      setSelectedClientId('')
      setSelectedContactId('')
      setProjectName('')
      setServiceDetails([])
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
    setEditingOrder(null)
    setCurrentStep(1)
    setContacts([])
    setQuotations([])
    setSelectedQuotation(null)
    form.resetFields()
  }

  // 删除订单
  const handleDeleteOrder = (order: OrderData) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除订单 ${order.orderNo} 吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const orderId = order.id || order._id
          const response = await axios.delete(`/api/orders/${orderId}`)
          if (response.data.success) {
            message.success('订单删除成功')
            fetchOrders()
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

  // 确认订单
  const handleConfirmOrder = (order: OrderData) => {
    Modal.confirm({
      title: '确认订单',
      content: `确定要确认订单 ${order.orderNo} 吗？`,
      okText: '确认',
      okType: 'primary',
      cancelText: '取消',
      onOk: async () => {
        try {
          const orderId = order.id || order._id
          const response = await axios.put(`/api/orders/${orderId}`, { status: 'confirmed' })
          if (response.data.success) {
            message.success('订单确认成功')
            fetchOrders()
          } else {
            message.error(response.data.message || '确认失败')
          }
        } catch (error: any) {
          console.error('确认失败:', error)
          message.error(error?.response?.data?.message || '确认失败')
        }
      }
    })
  }

  // 取消订单
  const handleCancelOrder = (order: OrderData) => {
    Modal.confirm({
      title: '取消订单',
      content: `确定要取消订单 ${order.orderNo} 吗？`,
      okText: '取消订单',
      okType: 'danger',
      cancelText: '返回',
      onOk: async () => {
        try {
          const orderId = order.id || order._id
          const response = await axios.put(`/api/orders/${orderId}`, { status: 'cancelled' })
          if (response.data.success) {
            message.success('订单取消成功')
            fetchOrders()
          } else {
            message.error(response.data.message || '取消失败')
          }
        } catch (error: any) {
          console.error('取消失败:', error)
          message.error(error?.response?.data?.message || '取消失败')
        }
      }
    })
  }

  // 过滤订单数据
  const filteredOrders = orders.filter(order => {
    // 搜索文本过滤
    const searchMatch = !searchText ||
      order.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.projectName?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.description?.toLowerCase().includes(searchText.toLowerCase())

    // 状态过滤
    const statusMatch = statusFilter === 'all' || order.status === statusFilter

    return searchMatch && statusMatch
  })

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 150,
    },
    {
      title: '客户名称',
      dataIndex: 'clientName',
      key: 'clientName',
      width: 200,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 180,
    },
    {
      title: '关联报价单',
      dataIndex: 'quotationId',
      key: 'quotationId',
      width: 120,
      render: (quotationId: string) => quotationId ? '是' : '否'
    },
    {
      title: '订单金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => `¥${amount.toLocaleString()}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colorMap: { [key: string]: string } = {
          'pending': 'orange',
          'confirmed': 'blue',
          'processing': 'purple',
          'completed': 'green',
          'cancelled': 'red'
        }
        const textMap: { [key: string]: string } = {
          'pending': '待确认',
          'confirmed': '已确认',
          'processing': '处理中',
          'completed': '已完成',
          'cancelled': '已取消'
        }
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      render: (time: string) => time ? time.split(' ')[0] : '-'
    },
    {
      title: '交付日期',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: 120,
      render: (date: string) => date || '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: OrderData) => {
        const actions = []

        // 查看按钮
        actions.push(
          <Button
            key="view"
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showEditModal(record)}
          >
            查看
          </Button>
        )

        // 编辑按钮（非已完成和已取消状态）
        if (record.status !== 'completed' && record.status !== 'cancelled') {
          actions.push(
            <Button
              key="edit"
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            >
              编辑
            </Button>
          )
        }

        // 确认按钮（待确认状态）
        if (record.status === 'pending') {
          actions.push(
            <Button
              key="confirm"
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleConfirmOrder(record)}
            >
              确认
            </Button>
          )
        }

        // 取消按钮（非已完成和已取消状态）
        if (record.status !== 'completed' && record.status !== 'cancelled') {
          actions.push(
            <Button
              key="cancel"
              type="link"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleCancelOrder(record)}
            >
              取消
            </Button>
          )
        }

        // 删除按钮
        actions.push(
          <Button
            key="delete"
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteOrder(record)}
          >
            删除
          </Button>
        )

        return <Space size="small">{actions}</Space>
      },
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>订单管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          新建订单
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input.Search
              placeholder="搜索订单号、客户名称、项目名称、描述"
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="订单状态"
              style={{ width: 120 }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待确认</Option>
              <Option value="confirmed">已确认</Option>
              <Option value="processing">处理中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey={(record) => record.id || record._id || ''}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 新增/编辑订单模态窗 */}
      <Modal
        title={editingOrder ? '编辑订单' : '新建订单'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
        width={1000}
        destroyOnHidden
      >
        {editingOrder ? (
          // 编辑模式 - 使用原有表单
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              status: 'pending'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item
                name="orderNo"
                label="订单号"
                rules={[{ required: true, message: '请输入订单号' }]}
              >
                <Input placeholder="请输入订单号" />
              </Form.Item>

              <Form.Item
                name="clientId"
                label="客户"
                rules={[{ required: true, message: '请选择客户' }]}
              >
                <Select placeholder="请选择客户" showSearch>
                  {clients.map(client => (
                    <Option key={client.id || client._id} value={client.id || client._id}>
                      {client.companyName || client.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="amount"
                label="订单金额"
                rules={[{ required: true, message: '请输入订单金额' }]}
              >
                <InputNumber
                  placeholder="请输入金额"
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  formatter={(value: number | string | undefined) => {
                    if (value === undefined || value === null) return ''
                    return `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }}
                  parser={(value: string | undefined) => {
                    if (!value) return ''
                    return value.replace(/\¥\s?|(,*)/g, '')
                  }}
                />
              </Form.Item>

              <Form.Item
                name="status"
                label="订单状态"
                rules={[{ required: true, message: '请选择订单状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="pending">待确认</Option>
                  <Option value="confirmed">已确认</Option>
                  <Option value="processing">处理中</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="cancelled">已取消</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="createTime"
                label="创建时间"
              >
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="deliveryDate"
                label="交付日期"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="paymentMethod"
                label="支付方式"
              >
                <Select placeholder="请选择支付方式">
                  <Option value="银行转账">银行转账</Option>
                  <Option value="支付宝">支付宝</Option>
                  <Option value="微信支付">微信支付</Option>
                  <Option value="现金">现金</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="contactPerson"
                label="联系人"
              >
                <Input placeholder="请输入联系人" />
              </Form.Item>

              <Form.Item
                name="contactPhone"
                label="联系电话"
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </div>

            <Form.Item
              name="description"
              label="项目描述"
              rules={[{ required: true, message: '请输入项目描述' }]}
            >
              <TextArea rows={3} placeholder="请输入项目描述" />
            </Form.Item>

            <Form.Item
              name="address"
              label="交付地址"
            >
              <TextArea rows={2} placeholder="请输入交付地址" />
            </Form.Item>

            <Form.Item
              name="remark"
              label="备注"
            >
              <TextArea rows={2} placeholder="请输入备注信息" />
            </Form.Item>
          </Form>
        ) : (
          // 新建模式 - 使用步骤式表单
          <div>
            {/* 步骤指示器 */}
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: currentStep >= 1 ? '#1890ff' : '#d9d9d9',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  1
                </div>
                <div style={{
                  width: 60,
                  height: 2,
                  backgroundColor: currentStep >= 2 ? '#1890ff' : '#d9d9d9',
                  margin: '0 8px'
                }}></div>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: currentStep >= 2 ? '#1890ff' : '#d9d9d9',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  2
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                {currentStep === 1 ? '选择客户和联系人' : '选择服务项目'}
              </div>
            </div>

                        <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: 'pending',
                createTime: dayjs()
              }}
            >
              {currentStep === 1 ? (
                // 第一步：选择客户和联系人
                <div>
                  <Form.Item
                    name="clientId"
                    label="选择客户"
                    rules={[{ required: true, message: '请选择客户' }]}
                  >
                    <Select
                      placeholder="请选择客户"
                      showSearch
                      value={selectedClientId}
                      onChange={handleClientSelect}
                      filterOption={(input, option) =>
                        (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {clients.map(client => (
                        <Option
                          key={client.id || client._id}
                          value={client.id || client._id}
                          disabled={client.status === 'inactive'}
                        >
                          {client.companyName || client.name}
                          {client.status === 'inactive' && <Tag color="red" style={{ marginLeft: 8 }}>已禁用</Tag>}
                        </Option>
                      ))}
                    </Select>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      {clients.some(client => client.status === 'inactive') &&
                        "如果你选择的客户显示为（已禁用）请先取消禁用后再来操作"
                      }
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="contactId"
                    label={
                      <span>
                        选择联系人
                        {contacts.length > 0 && (
                          <span style={{ fontSize: 12, color: '#666', marginLeft: 8, fontWeight: 'normal' }}>
                            (共找到 {contacts.length} 个)
                          </span>
                        )}
                      </span>
                    }
                    rules={[{ required: true, message: '请选择联系人' }]}
                  >
                    <Select
                      placeholder={contacts.length === 0 ? "请先选择客户" : "请选择联系人"}
                      disabled={contacts.length === 0}
                      value={selectedContactId}
                      onChange={(value: string | undefined) => {
                        setSelectedContactId(value || '')
                        form.setFieldsValue({ contactId: value })
                      }}
                    >
                      {contacts.map(contact => (
                        <Option
                          key={contact.id || contact._id}
                          value={contact.id || contact._id}
                          disabled={contact.status === 'inactive'}
                        >
                          {contact.realName} - {contact.phone}
                          {contact.status === 'inactive' && <Tag color="red" style={{ marginLeft: 8 }}>已禁用</Tag>}
                        </Option>
                      ))}
                    </Select>
                    {contacts.length > 0 && contacts.some(contact => contact.status === 'inactive') && (
                      <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                        如果你选择的用户显示为（已禁用）请先取消禁用后再来操作
                      </div>
                    )}
                  </Form.Item>

                  <Form.Item
                    name="projectName"
                    label="项目名称"
                    rules={[{ required: true, message: '请输入项目名称' }]}
                  >
                    <Input
                      placeholder="请输入项目名称"
                      value={projectName}
                      onChange={(e) => {
                        setProjectName(e.target.value)
                        form.setFieldsValue({ projectName: e.target.value })
                      }}
                    />
                  </Form.Item>

                  <div style={{ textAlign: 'center', marginTop: 24 }}>
                    {/* 调试信息 */}
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                      客户: {selectedClientId ? '已选择' : '未选择'} |
                      联系人: {selectedContactId ? '已选择' : '未选择'} |
                      项目名称: {projectName ? '已填写' : '未填写'}
                    </div>
                    <Button
                      type="primary"
                      onClick={() => setCurrentStep(2)}
                      disabled={!selectedClientId || !selectedContactId || !projectName}
                    >
                      下一步
                    </Button>
                  </div>
                </div>
              ) : (
                // 第二步：显示服务项目
                <div>
                  {selectedQuotation ? (
                    <div>
                      <div style={{ marginBottom: 16 }}>
                        <h4>服务项目列表</h4>
                        <div style={{ marginBottom: 8, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                          <div><strong>报价单名称：</strong>{selectedQuotation.name}</div>
                          <div><strong>报价单描述：</strong>{selectedQuotation.description || '无'}</div>
                        </div>
                        <Table
                          dataSource={serviceDetails}
                          pagination={false}
                          size="small"
                          columns={[
                            {
                              title: '项目名称',
                              dataIndex: 'serviceName',
                              key: 'serviceName',
                              width: 150,
                            },
                            {
                              title: '项目别名',
                              dataIndex: 'alias',
                              key: 'alias',
                              width: 120,
                            },
                            {
                              title: '单价',
                              dataIndex: 'unitPrice',
                              key: 'unitPrice',
                              width: 100,
                              render: (price: number) => `¥${price.toLocaleString()}`
                            },
                            {
                              title: '单位',
                              dataIndex: 'unit',
                              key: 'unit',
                              width: 80,
                            },
                            {
                              title: '价格政策',
                              dataIndex: 'pricingPolicyNames',
                              key: 'pricingPolicyNames',
                              width: 200,
                              render: (policies: string[]) => {
                                if (!policies || policies.length === 0) {
                                  return '无'
                                }
                                return policies.map((policy, index) => (
                                  <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                                    {policy}
                                  </Tag>
                                ))
                              }
                            }
                          ]}
                        />
                      </div>

                      <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Button
                          style={{ marginRight: 8 }}
                          onClick={() => setCurrentStep(1)}
                        >
                          上一步
                        </Button>
                        <Button
                          type="primary"
                          onClick={handleModalOk}
                        >
                          创建订单
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                      <div style={{ marginBottom: 16 }}>
                        <h4>该客户暂无关联的报价单</h4>
                        <p style={{ color: '#666' }}>请先为客户创建报价单，或联系管理员设置客户关联的报价单。</p>
                      </div>
                      <Button
                        style={{ marginRight: 8 }}
                        onClick={() => setCurrentStep(1)}
                      >
                        上一步
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Form>
              </div>
            )}
          </Modal>
    </div>
  )
}

export default Orders 