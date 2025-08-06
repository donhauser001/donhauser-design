import React, { useState, useEffect } from 'react'
import {
  Modal,
  Steps,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Table,
  Tag,
  message,
  Card,
  Typography,
  Descriptions,
  Spin,
  Dropdown,
  Menu
} from 'antd'
import {
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { getOrders, Order, OrderStatus } from '../../api/orders'
import { getEmployees, User } from '../../api/users'
import { getActiveEnterprises, Enterprise } from '../../api/enterprises'
import SpecificationSelector, { Specification } from '../../components/SpecificationSelector'

const { Option } = Select
const { TextArea } = Input
const { Title, Text } = Typography
const { Step } = Steps

interface Project {
  id: string
  projectName: string
  client: string
  contact: string
  team: string // 团队企业ID
  mainDesigner: string[] // 主创设计师用户ID数组
  assistantDesigners: string[] // 助理设计师用户ID数组
  relatedContracts: string[]
  relatedOrders: string[]
  relatedSettlements: string[]
  relatedInvoices: string[]
  relatedFiles: string[]
  relatedTasks: Array<{
    serviceId: string
    specification: Specification
  }>
  relatedProposals: string[]
  clientRequirements: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold'
  startDate: string
  endDate?: string
  createdAt: string
}

interface CreateProjectModalProps {
  visible: boolean
  onCancel: () => void
  onOk: (project: Project) => void
  loading?: boolean
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  visible,
  onCancel,
  onOk,
  loading = false
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedOrderVersion, setSelectedOrderVersion] = useState<{ orderId: string; version: number } | null>(null)
  const [selectedVersionData, setSelectedVersionData] = useState<any>(null)
  const [taskSpecifications, setTaskSpecifications] = useState<Record<string, Specification>>({})
  const [orderVersionsMap, setOrderVersionsMap] = useState<Record<string, any[]>>({})
  const [employees, setEmployees] = useState<User[]>([])
  const [employeesLoading, setEmployeesLoading] = useState(false)
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [enterprisesLoading, setEnterprisesLoading] = useState(false)
  const [form] = Form.useForm()

  // 获取订单列表
  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const response = await getOrders({
        page: 1,
        limit: 50, // 获取更多数据用于前端排序
        search: searchKeyword, // 添加搜索关键词
        // 不设置status参数，获取所有状态的订单
      })
      // 按更新时间排序（最新的在前）
      const sortedOrders = response.data.sort((a, b) =>
        new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
      )
      setOrders(sortedOrders)
    } catch (error) {
      console.error('获取订单列表失败:', error)
      message.error('获取订单列表失败')
    } finally {
      setOrdersLoading(false)
    }
  }

  // 获取员工列表
  const fetchEmployees = async () => {
    setEmployeesLoading(true)
    try {
      const response = await getEmployees()
      // 过滤掉没有ID的员工，避免key重复问题
      const validEmployees = response.data.filter(employee => employee._id)
      setEmployees(validEmployees)
    } catch (error) {
      console.error('获取员工列表失败:', error)
      message.error('获取员工列表失败')
    } finally {
      setEmployeesLoading(false)
    }
  }

  // 获取企业列表
  const fetchEnterprises = async () => {
    setEnterprisesLoading(true)
    try {
      const response = await getActiveEnterprises()
      // 过滤掉没有ID的企业，避免key重复问题
      const validEnterprises = response.data.filter(enterprise => enterprise.id)
      setEnterprises(validEnterprises)
    } catch (error) {
      console.error('获取企业列表失败:', error)
      message.error('获取企业列表失败')
    } finally {
      setEnterprisesLoading(false)
    }
  }

  // 获取订单版本数据
  const fetchOrderVersionData = async (orderId: string, version: number) => {
    try {
      console.log('🔄 开始获取订单版本数据:', orderId, '版本:', version)

      // 直接从OrderVersion API获取
      const response = await fetch(`/api/order-versions/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        console.log('📦 API返回数据:', data)

        if (data.success && data.data.length > 0) {
          // 找到对应版本的数据
          const versionData = data.data.find((v: any) => v.versionNumber === version)
          if (versionData) {
            console.log('✅ 找到版本数据:', versionData)
            setSelectedVersionData(versionData)
            console.log('🔄 已设置 selectedVersionData')
            return
          } else {
            console.log('❌ 未找到指定版本:', version, '可用版本:', data.data.map((v: any) => v.versionNumber))
          }
        } else {
          console.log('❌ API返回数据为空或失败')
        }
      } else {
        console.log('❌ API请求失败:', response.status)
      }

      // 如果都找不到，使用当前版本作为默认
      console.log('⚠️ 使用当前版本作为默认')
      setSelectedVersionData({
        items: [],
        contactNames: selectedOrder?.contactNames || []
      })
    } catch (error) {
      console.error('❌ 获取订单版本数据失败:', error)
      message.error('获取订单版本数据失败')
    }
  }

  // 获取订单的所有版本
  const fetchOrderVersions = async (orderId: string) => {
    try {
      const response = await fetch(`/api/order-versions/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data.length > 0) {
          return data.data.sort((a: any, b: any) => b.versionNumber - a.versionNumber)
        }
      }
      return []
    } catch (error) {
      console.error('获取订单版本失败:', error)
      return []
    }
  }

  useEffect(() => {
    if (visible && currentStep === 0) {
      fetchOrders()
    }
  }, [visible, currentStep, searchKeyword])

  useEffect(() => {
    if (visible && currentStep === 2) {
      fetchEmployees()
      fetchEnterprises()
    }
  }, [visible, currentStep])

  // 当进入第二步且没有版本数据时，自动获取
  useEffect(() => {
    console.log('🔄 useEffect 触发，当前步骤:', currentStep, 'selectedOrder:', !!selectedOrder, 'selectedOrderVersion:', !!selectedOrderVersion, 'selectedVersionData:', !!selectedVersionData)

    if (currentStep === 1 && selectedOrder && selectedOrderVersion && !selectedVersionData) {
      console.log('🔄 进入第二步，自动获取版本数据')
      fetchOrderVersionData(selectedOrder._id, selectedOrderVersion.version)
    }
  }, [currentStep, selectedOrder, selectedOrderVersion, selectedVersionData])

  // 当模态窗打开时重置表单
  useEffect(() => {
    if (visible) {
      setCurrentStep(0)
      setSelectedOrder(null)
      setSelectedOrderVersion(null)
      setSelectedVersionData(null)
      setTaskSpecifications({})
      form.resetFields()
    }
  }, [visible, form])

  const steps = [
    {
      title: '选择订单',
      icon: <ShoppingCartOutlined />,
      content: 'order'
    },
    {
      title: '任务信息',
      icon: <FileTextOutlined />,
      content: 'task'
    },
    {
      title: '团队配置',
      icon: <TeamOutlined />,
      content: 'team'
    },
    {
      title: '确认创建',
      icon: <CheckCircleOutlined />,
      content: 'confirm'
    }
  ]



  const orderColumns = [
    {
      title: '项目',
      key: 'projectInfo',
      width: 320,
      render: (_: any, record: Order) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {record.projectName}
            {record.status === 'cancelled' && (
              <Tag color="red" style={{ marginLeft: 8, fontSize: '10px' }}>已取消</Tag>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.orderNo}</div>
        </div>
      )
    },
    {
      title: '客户信息',
      key: 'clientInfo',
      width: 250,
      render: (_: any, record: Order) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{record.clientName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.contactNames?.join(', ') || '无'}
          </div>
        </div>
      )
    },
    {
      title: '订单金额',
      dataIndex: 'currentAmount',
      key: 'currentAmount',
      width: 150,
      render: (amount: number) => `¥${amount.toLocaleString()}`
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      render: (updateTime: string) => new Date(updateTime).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'action',
      width: 130,
      render: (_: any, record: Order) => {
        const isSelected = selectedOrder?._id === record._id
        const isCancelled = record.status === 'cancelled'

        // 生成版本菜单项
        const handleVersionSelect = async (versionNumber: number) => {
          setSelectedOrder(record)
          setSelectedOrderVersion({ orderId: record._id, version: versionNumber })
          fetchOrderVersionData(record._id, versionNumber)
          message.success(`已选择 ${record.projectName} v${versionNumber}.0`)
        }

        // 获取该订单的版本列表
        const orderVersions = orderVersionsMap[record._id] || []

        // 如果还没有获取过版本，自动获取
        if (orderVersions.length === 0) {
          fetchOrderVersions(record._id).then(versions => {
            if (versions.length > 0) {
              setOrderVersionsMap(prev => ({
                ...prev,
                [record._id]: versions
              }))
            }
          })
        }

        // 生成版本菜单项
        const versionMenuItems = orderVersions.length > 0
          ? orderVersions.map((version: any) => ({
            key: `${record._id}-${version.versionNumber}`,
            label: `v${version.versionNumber}.0 (${new Date(version.createdAt).toLocaleDateString()})`,
            onClick: () => handleVersionSelect(version.versionNumber)
          }))
          : [
            {
              key: 'loading',
              label: '加载中...',
              disabled: true
            }
          ]

        const menu = {
          items: versionMenuItems
        }

        return (
          <Dropdown
            menu={menu}
            disabled={isCancelled}
            trigger={['click']}
          >
            <Button
              type={isSelected ? 'primary' : 'default'}
              size="small"
              disabled={isCancelled}
            >
              {isSelected ? '已选择' : isCancelled ? '已取消' : '选择'}
            </Button>
          </Dropdown>
        )
      }
    }
  ]

  const handleNext = () => {
    if (currentStep === 0) {
      if (!selectedOrder) {
        message.error('请先选择一个订单')
        return
      }
      if (!selectedOrderVersion) {
        message.error('请先选择订单版本')
        return
      }
    }
    setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    try {


      // 先验证表单
      let values
      try {
        values = await form.validateFields()
      } catch (validationError: any) {
        console.error('表单验证失败:', validationError)
        message.error('请检查表单信息，确保所有必填字段都已填写')
        return
      }

      // 验证是否选择了订单和版本
      if (!selectedOrder || !selectedOrderVersion) {
        message.error('请先选择订单和版本')
        return
      }

      // 规格验证（非必填）
      if (selectedVersionData && selectedVersionData.items) {
        const missingSpecs = selectedVersionData.items.filter((item: any) => !taskSpecifications[item.serviceId])
        if (missingSpecs.length > 0) {
          console.log('⚠️ 以下任务未选择规格:', missingSpecs.map((item: any) => item.serviceName))
          // 不再阻止提交，只是记录日志
        }
      } else {
        console.log('⚠️ 没有版本数据或任务数据')
      }

      // 验证必填字段
      if (!values.team) {
        message.error('请选择团队')
        return
      }

      if (!values.mainDesigner || values.mainDesigner.length === 0) {
        message.error('请选择主创设计师')
        return
      }

      // 构建任务数据，包含完整的任务信息和规格
      const relatedTasks = selectedVersionData && selectedVersionData.items ? selectedVersionData.items.map((item: any) => ({
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        quantity: item.quantity,
        unit: item.unit,
        subtotal: item.subtotal,
        specification: taskSpecifications[item.serviceId] || null // 如果没有规格则为null
      })) : []

      console.log('🔄 构建项目数据，任务数量:', relatedTasks.length)
      console.log('🔄 任务数据:', relatedTasks)

      const projectData = {
        projectName: selectedOrder.projectName,
        client: selectedOrder.clientName,
        contact: selectedOrder.contactNames?.join(', ') || '',
        team: values.team,
        mainDesigner: values.mainDesigner || [],
        assistantDesigners: values.assistantDesigners || [],
        relatedOrders: [selectedOrder._id],
        relatedTasks: relatedTasks,
        clientRequirements: values.clientRequirements,
        startDate: new Date().toISOString()
      }



      // 调用后端API创建项目
      const { createProject } = await import('../../api/projects')
      const response = await createProject(projectData)

      onOk(response.data)
    } catch (error) {
      console.error('创建项目失败:', error)
      message.error('创建项目失败，请检查表单信息')
    }
  }

  const renderStepContent = () => {
    console.log('🔄 renderStepContent 被调用，当前步骤:', currentStep)

    switch (currentStep) {
      case 0:
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>选择关联订单</Title>
              <Input.Search
                placeholder="搜索客户、联系人、项目名称、订单号"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onSearch={(value) => setSearchKeyword(value)}
                style={{ width: 400 }}
                allowClear
                enterButton
              />
            </div>

            <Spin spinning={ordersLoading}>
              <Table
                columns={orderColumns}
                dataSource={orders.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                rowKey="_id"
                pagination={false}
                size="small"
                scroll={{ x: 1000 }}
                loading={ordersLoading}
              />
            </Spin>
          </div>
        )
      case 1:
        return (
          <div>
            {selectedOrder && selectedOrderVersion && (
              <div>
                <Card style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>项目名称：</Text>
                      <Text>{selectedOrder.projectName}</Text>
                    </div>
                    <div>
                      <Text strong>客户：</Text>
                      <Text>{selectedOrder.clientName}</Text>
                    </div>
                    <div>
                      <Text strong>联系人：</Text>
                      <Text>{(selectedVersionData?.contactNames || selectedOrder.contactNames)?.join(', ') || '无'}</Text>
                    </div>
                    <div>
                      <Text strong>订单版本：</Text>
                      <Text>v{selectedOrderVersion.version}.0</Text>
                    </div>
                    <div>
                      <Text strong>合计金额：</Text>
                      <Text>¥{selectedOrder.currentAmount?.toLocaleString() || '0'}</Text>
                    </div>
                  </div>
                </Card>

                <Card title="任务规格确认">
                  {(() => {
                    console.log('🔍 渲染任务规格确认，当前步骤:', currentStep, 'selectedVersionData:', selectedVersionData)

                    if (!selectedVersionData) {
                      return <Text type="secondary">正在加载版本信息...</Text>
                    }

                    if (!selectedVersionData.items || selectedVersionData.items.length === 0) {
                      return <Text type="secondary">该版本没有任务信息</Text>
                    }

                    return (
                      <Table
                        columns={[
                          {
                            title: '任务名称',
                            dataIndex: 'serviceName',
                            key: 'serviceName',
                            width: 200,
                          },
                          {
                            title: '服务类别',
                            dataIndex: 'categoryName',
                            key: 'categoryName',
                            width: 150,
                          },
                          {
                            title: '规格选择',
                            key: 'specificationSelector',
                            width: 250,
                            render: (_: any, record: any) => (
                              <div>
                                <SpecificationSelector
                                  value={taskSpecifications[record.serviceId]}
                                  onChange={(spec) => {
                                    if (spec) {
                                      setTaskSpecifications(prev => ({
                                        ...prev,
                                        [record.serviceId]: spec
                                      }))
                                    } else {
                                      setTaskSpecifications(prev => {
                                        const newSpecs = { ...prev }
                                        delete newSpecs[record.serviceId]
                                        return newSpecs
                                      })
                                    }
                                  }}
                                  placeholder={`为"${record.serviceName}"选择规格`}
                                />
                              </div>
                            )
                          },
                          {
                            title: '数量',
                            key: 'quantity',
                            width: 120,
                            render: (_: any, record: any) => `${record.quantity} ${record.unit}`
                          },
                          {
                            title: '单价',
                            dataIndex: 'unitPrice',
                            key: 'unitPrice',
                            width: 100,
                            render: (price: number) => `¥${price.toLocaleString()}`
                          },
                          {
                            title: '小计',
                            dataIndex: 'subtotal',
                            key: 'subtotal',
                            width: 120,
                            render: (subtotal: number) => `¥${subtotal.toLocaleString()}`
                          }
                        ]}
                        dataSource={selectedVersionData.items}
                        rowKey={(record) => `${record.serviceId}`}
                        pagination={false}
                        size="small"
                        scroll={{ x: 900 }}
                      />
                    )
                  })()}
                </Card>
              </div>
            )}
          </div>
        )
      case 2:
        return (
          <div>
            <Title level={4}>项目团队配置</Title>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* 团队和设计师字段现在在Modal根级别渲染 */}
            </div>
          </div>
        )
      case 3:
        return (
          <div>
            <Title level={4}>确认项目信息</Title>
            <Card style={{ marginBottom: 16 }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="项目名称">
                  {selectedOrder?.projectName}
                </Descriptions.Item>
                <Descriptions.Item label="客户">
                  {selectedOrder?.clientName}
                </Descriptions.Item>
                <Descriptions.Item label="联系人">
                  {(() => {
                    // 优先使用版本数据中的联系人信息
                    const contactNames = selectedVersionData?.contactNames || selectedOrder?.contactNames
                    return contactNames?.join(', ') || '无'
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="团队">
                  {(() => {
                    const teamId = form.getFieldValue('team')
                    const team = enterprises.find(enterprise => enterprise.id === teamId)
                    return team ? team.enterpriseName : '未选择'
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="主创设计师">
                  {(() => {
                    const mainDesignerIds = form.getFieldValue('mainDesigner') || []
                    const mainDesigners = employees.filter(emp => mainDesignerIds.includes(emp._id))
                    return mainDesigners.length > 0
                      ? mainDesigners.map(emp => emp.realName).join(', ')
                      : '未选择'
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="助理设计师">
                  {(() => {
                    const assistantDesignerIds = form.getFieldValue('assistantDesigners') || []
                    const assistantDesigners = employees.filter(emp => assistantDesignerIds.includes(emp._id))
                    return assistantDesigners.length > 0
                      ? assistantDesigners.map(emp => emp.realName).join(', ')
                      : '无'
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="关联订单">
                  {selectedOrder?.orderNo} (v{selectedOrderVersion?.version}.0)
                </Descriptions.Item>
                <Descriptions.Item label="客户嘱托">
                  {form.getFieldValue('clientRequirements')}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="任务规格确认">
              {(() => {
                console.log('🔍 渲染任务规格确认，当前步骤:', currentStep, 'selectedVersionData:', selectedVersionData)

                if (!selectedVersionData) {
                  return <Text type="secondary">正在加载版本信息...</Text>
                }

                if (!selectedVersionData.items || selectedVersionData.items.length === 0) {
                  return <Text type="secondary">该版本没有任务信息</Text>
                }

                return (
                  <Table
                    columns={[
                      {
                        title: '任务名称',
                        dataIndex: 'serviceName',
                        key: 'serviceName',
                        width: 200,
                      },
                      {
                        title: '选择规格',
                        key: 'specification',
                        width: 300,
                        render: (_: any, record: any) => {
                          const spec = taskSpecifications[record.serviceId]
                          return spec ? (
                            <div>
                              <div style={{ fontWeight: 'bold' }}>{spec.name}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {spec.length}×{spec.width}
                                {spec.height ? `×${spec.height}` : ''} {spec.unit}
                                {spec.resolution && ` | ${spec.resolution}`}
                              </div>
                            </div>
                          ) : (
                            <Text type="danger">未选择规格</Text>
                          )
                        }
                      },
                      {
                        title: '数量',
                        dataIndex: 'quantity',
                        key: 'quantity',
                        width: 100,
                        render: (quantity: number, record: any) => `${quantity} ${record.unit}`
                      },
                      {
                        title: '小计',
                        dataIndex: 'subtotal',
                        key: 'subtotal',
                        width: 120,
                        render: (subtotal: number) => `¥${subtotal.toLocaleString()}`
                      }
                    ]}
                    dataSource={selectedVersionData.items}
                    rowKey={(record) => `${record.serviceId}`}
                    pagination={false}
                    size="small"
                  />
                )
              })()}
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  const getModalTitle = () => {
    return `新建项目 - ${steps[currentStep].title}`
  }

  const getModalFooter = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* 分页组件 */}
        {currentStep === 0 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8, fontSize: '12px', color: '#666' }}>
              第 {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, orders.length)} 条/共 {orders.length} 条
            </span>
            <Space size="small">
              <Button
                size="small"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                上一页
              </Button>
              <Button
                size="small"
                disabled={currentPage * pageSize >= orders.length}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                下一页
              </Button>
            </Space>
          </div>
        )}

        {/* 操作按钮 */}
        <Space>
          <Button onClick={onCancel}>取消</Button>
          {currentStep > 0 && (
            <Button onClick={handlePrev}>上一步</Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          ) : (
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              创建项目
            </Button>
          )}
        </Space>
      </div>
    )
  }

  return (
    <Modal
      title={getModalTitle()}
      open={visible}
      onCancel={onCancel}
      footer={getModalFooter()}
      width={1200}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          {steps.map((step, index) => (
            <Step key={index} title={step.title} icon={step.icon} />
          ))}
        </Steps>

        {renderStepContent()}

        {/* 条件渲染Form.Item，确保表单实例始终连接 */}
        {currentStep >= 2 && (
          <>
            <Form.Item
              name="team"
              label="团队"
              rules={[{ required: true, message: '请选择团队' }]}
              style={{ display: currentStep === 2 ? 'block' : 'none' }}
            >
              <Select
                placeholder="请选择承接团队"
                loading={enterprisesLoading}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {enterprises.map((enterprise, index) => (
                  <Option key={enterprise.id || `enterprise-${index}`} value={enterprise.id}>
                    {enterprise.enterpriseName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="mainDesigner"
              label="主创设计师"
              rules={[{ required: true, message: '请选择主创设计师' }]}
              style={{ display: currentStep === 2 ? 'block' : 'none' }}
            >
              <Select
                mode="multiple"
                placeholder="请选择主创设计师"
                loading={employeesLoading}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {employees.map((employee, index) => (
                  <Option key={employee._id || `employee-${index}`} value={employee._id}>
                    {employee.realName} ({employee.department})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="assistantDesigners"
              label="助理设计师"
              style={{ display: currentStep === 2 ? 'block' : 'none' }}
            >
              <Select
                mode="multiple"
                placeholder="请选择助理设计师"
                loading={employeesLoading}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {employees.map((employee, index) => (
                  <Option key={employee._id || `employee-${index}`} value={employee._id}>
                    {employee.realName} ({employee.department})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="clientRequirements"
              label="客户嘱托"
              style={{ display: currentStep === 2 ? 'block' : 'none' }}
            >
              <TextArea
                rows={4}
                placeholder="请输入客户的具体要求和嘱托（可选）"
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}

export default CreateProjectModal 