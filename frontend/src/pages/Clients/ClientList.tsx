import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  Rate,
  message,
  Typography,
  Divider,
  Tooltip
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  StarFilled,
  CopyOutlined
} from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import FileUpload from '../../components/FileUpload'
import ActionMenu, { ActionTypes } from '../../components/ActionMenu'
import axios from 'axios'

const { Option } = Select
const { TextArea } = Input
const { Title, Text } = Typography

// 客户接口定义
interface Client {
  _id: string
  name: string
  address: string
  invoiceType: string
  invoiceInfo: string
  category: string
  quotationId?: string
  rating: number
  files: Array<{
    path: string
    originalName: string
    size: number
  }>
  summary: string
  status: 'active' | 'inactive'
  createTime: string
  updateTime: string
}

// 客户分类接口
interface ClientCategory {
  _id: string
  name: string
  status: 'active' | 'inactive'
}

// 报价单接口
interface Quotation {
  _id: string
  name: string
  status: 'active' | 'inactive'
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [categories, setCategories] = useState<ClientCategory[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // 模态窗状态
  const [modalVisible, setModalVisible] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [form] = Form.useForm()
  const [showInvoiceInfo, setShowInvoiceInfo] = useState(true)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // 获取客户列表数据
  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients')
      if (response.data.success) {
        setClients(response.data.data)
      } else {
        message.error('获取客户列表失败')
      }
    } catch (error) {
      console.error('获取客户列表失败:', error)
      message.error('获取客户列表失败')
    }
  }

  // 获取客户分类数据
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/client-categories')
      if (response.data.success) {
        setCategories(response.data.data)
      } else {
        message.error('获取客户分类失败')
      }
    } catch (error) {
      console.error('获取客户分类失败:', error)
      message.error('获取客户分类失败')
    }
  }

  // 获取报价单数据
  const fetchQuotations = async () => {
    try {
      const response = await axios.get('/api/quotations')
      if (response.data.success) {
        setQuotations(response.data.data)
      } else {
        message.error('获取报价单失败')
      }
    } catch (error) {
      console.error('获取报价单失败:', error)
      message.error('获取报价单失败')
    }
  }

  // 获取数据
  useEffect(() => {
    setLoading(true)

    // 并行获取所有数据
    Promise.all([
      fetchClients(),
      fetchCategories(),
      fetchQuotations()
    ]).finally(() => {
      setLoading(false)
    })
  }, [])

  // 表格列定义
  const columns = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: Client) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>
              {name}
              {record.rating === 5 && (
                <StarFilled style={{ color: '#faad14', marginLeft: 8, fontSize: '16px' }} />
              )}
              {record.status === 'inactive' && (
                <Tag color="red" style={{ marginLeft: 8, fontSize: '12px' }}>
                  已禁用
                </Tag>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      title: '发票',
      dataIndex: 'invoiceType',
      key: 'invoiceType',
      width: 120,
      render: (invoiceType: string, record: Client) => (
        <Button
          type="link"
          size="small"
          icon={<CopyOutlined />}
          onClick={() => copyInvoiceInfo(record)}
          style={{ padding: 0, height: 'auto' }}
        >
          复制发票信息
        </Button>
      )
    },
    {
      title: '客户分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => (
        <Tag color="green">{category}</Tag>
      )
    },
    {
      title: '报价单',
      dataIndex: 'quotationId',
      key: 'quotationId',
      width: 150,
      render: (quotationId: string) => {
        const quotation = quotations.find(q => q._id === quotationId)
        return quotation ? (
          <Tag color="orange">{quotation.name}</Tag>
        ) : (
          <Text type="secondary">未设置</Text>
        )
      }
    },
    {
      title: '客户评级',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating: number) => (
        <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
      )
    },
    {
      title: '文件数量',
      dataIndex: 'files',
      key: 'files',
      width: 100,
      render: (files: Array<{ path: string; originalName: string; size: number }>) => (
        <Tag color="blue">{files.length} 个文件</Tag>
      )
    },

    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: Client) => {
        const actions = [
          {
            key: 'view',
            label: '查看',
            icon: <EyeOutlined />,
            onClick: () => handleView(record)
          },
          {
            ...ActionTypes.EDIT,
            onClick: () => handleEdit(record)
          },
          {
            ...ActionTypes.TOGGLE_STATUS,
            label: record.status === 'active' ? '禁用' : '启用',
            onClick: () => handleStatusChange(record)
          },
          {
            ...ActionTypes.DELETE,
            onClick: () => handleDelete(record._id)
          }
        ]

        return <ActionMenu actions={actions} />
      }
    },
  ]

  // 过滤数据
  const filteredClients = clients.filter(client => {
    if (searchText && !client.name.includes(searchText)) {
      return false
    }
    if (statusFilter !== 'all' && client.status !== statusFilter) {
      return false
    }
    if (categoryFilter !== 'all' && client.category !== categoryFilter) {
      return false
    }
    return true
  })

  // 复制发票信息到剪贴板
  const copyInvoiceInfo = async (client: Client) => {
    try {
      const invoiceText = `票种类别：${client.invoiceType}\n开票信息：${client.invoiceInfo}`
      await navigator.clipboard.writeText(invoiceText)
      message.success('发票信息已复制到剪贴板')
    } catch (error) {
      console.error('复制失败:', error)
      message.error('复制失败，请手动复制')
    }
  }

  // 处理查看客户
  const handleView = (client: Client) => {
    setEditingClient(client)
    setModalVisible(true)
    form.setFieldsValue(client)
  }

  // 处理编辑客户
  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setModalVisible(true)
    form.setFieldsValue(client)
    setShowInvoiceInfo(client.invoiceType !== '不开票')

    // 初始化文件列表
    const initialFiles: UploadFile[] = client.files.map((file, index) => {
      return {
        uid: `existing-${index}-${Date.now()}`, // 使用唯一key避免重复
        name: file.originalName, // 使用原始文件名
        size: file.size, // 使用实际文件大小
        status: 'done' as const,
        url: file.path,
        response: { data: { url: file.path } }
      }
    })
    setFileList(initialFiles)
  }

  // 状态切换
  const handleStatusChange = async (client: Client) => {
    try {
      const newStatus = client.status === 'active' ? 'inactive' : 'active'
      const response = await axios.put(`/api/clients/${client._id}`, { status: newStatus })
      if (response.data.success) {
        message.success(`客户${newStatus === 'active' ? '启用' : '禁用'}成功`)
        fetchClients() // 重新获取客户列表
      } else {
        message.error(response.data.message || '状态更新失败')
      }
    } catch (error: any) {
      console.error('状态更新失败:', error)
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else {
        message.error('状态更新失败')
      }
    }
  }

  // 处理删除客户
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个客户吗？此操作不可恢复。',
      onOk: async () => {
        try {
          const response = await axios.delete(`/api/clients/${id}`)
          if (response.data.success) {
            message.success('客户删除成功')
            fetchClients() // 重新获取客户列表
          } else {
            message.error(response.data.message || '删除失败')
          }
        } catch (error: any) {
          console.error('删除失败:', error)
          if (error.response?.data?.message) {
            message.error(error.response.data.message)
          } else {
            message.error('删除失败')
          }
        }
      }
    })
  }

  // 处理新增客户
  const handleAdd = () => {
    setEditingClient(null)
    form.resetFields()
    setModalVisible(true)
    setShowInvoiceInfo(false) // 新增时默认隐藏开票信息（因为默认选择"不开票"）
    setFileList([]) // 清空文件列表
  }

  // 处理文件变化
  const handleFilesChange = (files: UploadFile[]) => {
    console.log('客户文件列表变化:', files)
    setFileList(files)
  }

  // 处理保存客户
  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      // 处理文件数据，保留完整的文件信息
      const files = fileList
        .filter(file => file.status === 'done')
        .map(file => {
          if (file.response?.data?.url) {
            // 新上传的文件
            return {
              path: file.response.data.url,
              originalName: file.name || '未知文件',
              size: file.size || 0
            }
          } else if (file.response?.url) {
            // 兼容旧格式
            return {
              path: file.response.url,
              originalName: file.name || '未知文件',
              size: file.size || 0
            }
          } else if (file.url) {
            // 已存在的文件
            return {
              path: file.url,
              originalName: file.name || '未知文件',
              size: file.size || 0
            }
          }
          return null
        })
        .filter(Boolean)

      const clientData = {
        ...values,
        files: files
      }

      if (editingClient) {
        // 编辑客户
        const response = await axios.put(`/api/clients/${editingClient._id}`, clientData)
        if (response.data.success) {
          message.success('客户信息更新成功')
          fetchClients() // 重新获取客户列表
        } else {
          message.error(response.data.message || '更新失败')
        }
      } else {
        // 新增客户
        const response = await axios.post('/api/clients', clientData)
        if (response.data.success) {
          message.success('客户创建成功')
          fetchClients() // 重新获取客户列表
        } else {
          message.error(response.data.message || '创建失败')
        }
      }

      setModalVisible(false)
      form.resetFields()
      setFileList([])
    } catch (error: any) {
      console.error('保存失败:', error)
      if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else {
        message.error('保存失败，请检查表单信息')
      }
    }
  }



  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>客户管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增客户
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="搜索客户名称"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="客户状态"
              style={{ width: 120 }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option key="all" value="all">全部状态</Option>
              <Option key="active" value="active">启用</Option>
              <Option key="inactive" value="inactive">已禁用</Option>
            </Select>
            <Select
              placeholder="客户分类"
              style={{ width: 120 }}
              value={categoryFilter}
              onChange={setCategoryFilter}
            >
              <Option value="all">全部分类</Option>
              {categories.map(category => (
                <Option key={category._id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredClients}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      {/* 客户详情/编辑模态窗 */}
      <Modal
        title={editingClient ? '客户详情' : '新增客户'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingClient(null)
          form.resetFields()
        }}
        width={800}
        footer={editingClient ? [
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            关闭
          </Button>,
          <Button key="edit" type="primary" onClick={handleSave}>
            保存修改
          </Button>
        ] : [
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            创建客户
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          disabled={!!editingClient && !editingClient._id}
          initialValues={{
            invoiceType: '不开票',
            rating: 3,
            status: 'active'
          }}
        >
          <Form.Item
            name="name"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>

          <Form.Item
            name="address"
            label="地址"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <TextArea rows={2} placeholder="请输入详细地址" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="invoiceType"
                label="票种类别"
                rules={[{ required: true, message: '请选择票种类别' }]}
              >
                <Select
                  placeholder="请选择票种类别"
                  onChange={(value) => {
                    if (value === '不开票') {
                      form.setFieldsValue({ invoiceInfo: '' });
                      setShowInvoiceInfo(false);
                    } else {
                      setShowInvoiceInfo(true);
                    }
                  }}
                >
                  <Option key="增值税专用发票" value="增值税专用发票">增值税专用发票</Option>
                  <Option key="增值税普通发票" value="增值税普通发票">增值税普通发票</Option>
                  <Option key="不开票" value="不开票">不开票</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rating"
                label="客户评级"
              >
                <Rate />
              </Form.Item>
            </Col>
          </Row>

          {showInvoiceInfo && (
            <Form.Item
              name="invoiceInfo"
              label="开票信息"
            >
              <TextArea rows={4} placeholder="请输入开票信息，包括公司名称、税号、开户行、账号等" />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="客户分类"
                rules={[{ required: true, message: '请选择客户分类' }]}
              >
                <Select placeholder="请选择客户分类">
                  {categories.map(category => (
                    <Option key={category._id} value={category.name}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option key="active" value="active">启用</Option>
                  <Option key="inactive" value="inactive">已禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="quotationId"
                label="报价单"
              >
                <Select
                  placeholder="请选择报价单"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                  optionFilterProp="children"
                >
                  {quotations.map(quotation => (
                    <Option key={quotation._id} value={quotation._id}>
                      {quotation.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>



          <Form.Item
            name="files"
            label="客户常用文件"
          >
            <FileUpload
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
              maxSize={20}
              maxCount={20}
              multiple={true}
              businessType="clients"
              subDirectory={editingClient?._id}
              action="/api/upload"
              placeholder="上传客户相关文件"
              helpText="支持图片、文档、压缩包等格式，单个文件不超过 20MB，最多 20 个文件"
              data={{
                category: 'client-files',
                type: 'document',
                clientId: editingClient?._id
              }}
              value={fileList}
              onChange={handleFilesChange}
            />
          </Form.Item>

          <Form.Item
            name="summary"
            label="客户摘要"
          >
            <TextArea rows={3} placeholder="请输入客户摘要信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ClientList 