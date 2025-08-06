import React, { useState, useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  InputNumber,
  Row,
  Col,
  Dropdown,
  Menu,
  Popconfirm
} from 'antd'
import { PlusOutlined, CloseOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  getSpecifications,
  createSpecification,
  updateSpecification,
  deleteSpecification,
  Specification as DBSpecification
} from '../api/specifications'

const { Option } = Select

export interface Specification {
  id: string
  name: string
  length: number
  width: number
  height?: number
  unit: string
  resolution?: string
}

interface SpecificationSelectorProps {
  value?: Specification
  onChange?: (specification: Specification | undefined) => void
  placeholder?: string
  disabled?: boolean
}

const SpecificationSelector: React.FC<SpecificationSelectorProps> = ({
  value,
  onChange,
  placeholder = '选择或创建规格',
  disabled = false
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [isEditMode, setIsEditMode] = useState(false)
  const [specifications, setSpecifications] = useState<DBSpecification[]>([])
  const [loading, setLoading] = useState(false)

  // 获取规格列表
  const fetchSpecifications = async () => {
    setLoading(true)
    try {
      const response = await getSpecifications({ limit: 100 })
      setSpecifications(response.data)
    } catch (error) {
      console.error('获取规格列表失败:', error)
      message.error('获取规格列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpecifications()
  }, [])

  const handleCreate = () => {
    setIsEditMode(false)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = () => {
    if (value) {
      setIsEditMode(true)
      form.setFieldsValue(value)
      setIsModalVisible(true)
    }
  }

  const handleSpecificationClick = () => {
    if (value) {
      handleEdit()
    } else {
      handleCreate()
    }
  }

  const handleSelectSpecification = (spec: DBSpecification) => {
    const convertedSpec: Specification = {
      id: spec._id,
      name: spec.name,
      length: spec.length,
      width: spec.width,
      height: spec.height,
      unit: spec.unit,
      resolution: spec.resolution
    }
    onChange?.(convertedSpec)
    message.success(`已选择规格：${spec.name}`)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()

      if (isEditMode && value) {
        // 更新规格
        const response = await updateSpecification(value.id, values)
        const updatedSpec = response.data
        const convertedSpec: Specification = {
          id: updatedSpec._id,
          name: updatedSpec.name,
          length: updatedSpec.length,
          width: updatedSpec.width,
          height: updatedSpec.height,
          unit: updatedSpec.unit,
          resolution: updatedSpec.resolution
        }
        onChange?.(convertedSpec)
        message.success('规格更新成功')
      } else {
        // 创建规格
        const response = await createSpecification(values)
        const newSpec = response.data
        const convertedSpec: Specification = {
          id: newSpec._id,
          name: newSpec.name,
          length: newSpec.length,
          width: newSpec.width,
          height: newSpec.height,
          unit: newSpec.unit,
          resolution: newSpec.resolution
        }
        onChange?.(convertedSpec)
        message.success('规格创建成功')
      }

      setIsModalVisible(false)
      await fetchSpecifications() // 刷新规格列表
    } catch (error) {
      console.error('保存规格失败:', error)
      message.error('保存规格失败')
    }
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleClear = () => {
    onChange?.(undefined)
    message.success('已清除规格')
  }

  // 处理删除规格
  const handleDeleteSpecification = async (specId: string, specName: string, e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡，避免触发选择
    try {
      await deleteSpecification(specId)
      message.success(`规格"${specName}"删除成功`)
      await fetchSpecifications() // 刷新规格列表

      // 如果删除的是当前选中的规格，清除选择
      if (value && value.id === specId) {
        onChange?.(undefined)
      }
    } catch (error) {
      console.error('删除规格失败:', error)
      message.error('删除规格失败')
    }
  }

  const formatSpecification = (spec: Specification) => {
    const parts = [spec.name]
    if (spec.length && spec.width) {
      parts.push(`${spec.length}×${spec.width}`)
    }
    if (spec.height) {
      parts[parts.length - 1] += `×${spec.height}`
    }
    if (spec.unit) {
      parts.push(spec.unit)
    }
    if (spec.resolution) {
      parts.push(spec.resolution)
    }
    return parts.join(' ')
  }



  // 生成下拉菜单项
  const generateMenuItems = () => {
    const items = [
      {
        key: 'create',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', color: '#1890ff' }}>
            <PlusOutlined style={{ marginRight: 8 }} />
            新建规格
          </div>
        ),
        onClick: () => handleCreate()
      },
      {
        type: 'divider' as const
      }
    ]

    // 添加规格选项
    specifications.forEach(spec => {
      items.push({
        key: spec._id,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{formatSpecification({
              id: spec._id,
              name: spec.name,
              length: spec.length,
              width: spec.width,
              height: spec.height,
              unit: spec.unit,
              resolution: spec.resolution
            })}</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {spec.isDefault && (
                <span style={{ fontSize: '10px', color: '#52c41a', marginRight: 8 }}>默认</span>
              )}
              <Popconfirm
                title={`确定要删除规格"${spec.name}"吗？`}
                onConfirm={(e) => handleDeleteSpecification(spec._id, spec.name, e as any)}
                okText="确定"
                cancelText="取消"
                onCancel={(e) => e?.stopPropagation()}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{
                    padding: '2px 4px',
                    minWidth: 'auto',
                    color: '#ff4d4f',
                    marginLeft: 4
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>
            </div>
          </div>
        ),
        onClick: () => handleSelectSpecification(spec)
      })
    })

    return items
  }

  const menu = {
    items: generateMenuItems()
  }

  return (
    <div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {value ? (
          <div
            style={{
              padding: '4px 8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'inline-block',
              minWidth: '100px',
              position: 'relative'
            }}
            onClick={handleSpecificationClick}
            onMouseEnter={(e) => {
              const clearBtn = e.currentTarget.querySelector('.clear-btn') as HTMLElement
              if (clearBtn) clearBtn.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              const clearBtn = e.currentTarget.querySelector('.clear-btn') as HTMLElement
              if (clearBtn) clearBtn.style.opacity = '0'
            }}
          >
            {formatSpecification(value)}
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              disabled={disabled}
              className="clear-btn"
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0,
                transition: 'opacity 0.2s',
                padding: '2px',
                minWidth: 'auto',
                height: '20px',
                width: '20px'
              }}
            />
          </div>
        ) : (
          <Dropdown menu={menu} trigger={['click']} disabled={disabled}>
            <Button
              size="small"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              选择规格
              <DownOutlined style={{ marginLeft: 4, fontSize: '10px' }} />
            </Button>
          </Dropdown>
        )}
      </div>

      {/* 规格创建/编辑模态框 */}
      <Modal
        title={isEditMode ? '编辑规格' : '创建规格'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="确定"
        cancelText="取消"
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="规格名称"
                rules={[{ required: true, message: '请输入规格名称' }]}
              >
                <Input placeholder="请输入规格名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="单位"
                rules={[{ required: true, message: '请选择单位' }]}
              >
                <Select placeholder="请选择单位">
                  <Option value="mm">毫米(mm)</Option>
                  <Option value="cm">厘米(cm)</Option>
                  <Option value="m">米(m)</Option>
                  <Option value="px">像素(px)</Option>
                  <Option value="inch">英寸(inch)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="length"
                label="长度"
                rules={[{ required: true, message: '请输入长度' }]}
              >
                <InputNumber
                  placeholder="长度"
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="width"
                label="宽度"
                rules={[{ required: true, message: '请输入宽度' }]}
              >
                <InputNumber
                  placeholder="宽度"
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="height"
                label="高度"
              >
                <InputNumber
                  placeholder="高度"
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="resolution"
            label="分辨率"
          >
            <Select placeholder="请选择分辨率" allowClear>
              <Option value="72dpi">72dpi (网页)</Option>
              <Option value="150dpi">150dpi (普通打印)</Option>
              <Option value="300dpi">300dpi (高质量打印)</Option>
              <Option value="600dpi">600dpi (专业打印)</Option>
            </Select>
          </Form.Item>
        </Form>


      </Modal>
    </div>
  )
}

export default SpecificationSelector 