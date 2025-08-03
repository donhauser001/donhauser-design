import React, { useState } from 'react'
import { Card, Form, Button, Space, message, Divider, Typography } from 'antd'
import SpecificationSelector, { Specification } from './SpecificationSelector'

const { Title, Text } = Typography

const SpecificationSelectorExample: React.FC = () => {
  const [form] = Form.useForm()
  const [selectedSpec, setSelectedSpec] = useState<Specification | undefined>()

  const handleSubmit = (values: any) => {
    console.log('表单数据:', values)
    message.success('表单提交成功！')
  }

  const handleSpecificationChange = (spec: Specification | undefined) => {
    setSelectedSpec(spec)
    form.setFieldsValue({ specification: spec })
  }

  const handleClearForm = () => {
    form.resetFields()
    setSelectedSpec(undefined)
    message.success('表单已清空')
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>规格选择器组件示例</Title>
      
      <Card title="基本用法" style={{ marginBottom: '24px' }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="specification"
            label="选择规格"
            rules={[{ required: true, message: '请选择规格' }]}
          >
            <SpecificationSelector
              value={selectedSpec}
              onChange={handleSpecificationChange}
              placeholder="请选择或创建规格"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                提交表单
              </Button>
              <Button onClick={handleClearForm}>
                清空表单
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="当前选择的规格" style={{ marginBottom: '24px' }}>
        {selectedSpec ? (
          <div>
            <Text strong>规格名称：</Text>
            <Text>{selectedSpec.name}</Text>
            <br />
            <Text strong>尺寸：</Text>
            <Text>
              {selectedSpec.length}×{selectedSpec.width}
              {selectedSpec.height ? `×${selectedSpec.height}` : ''} {selectedSpec.unit}
            </Text>
            <br />
            {selectedSpec.resolution && (
              <>
                <Text strong>分辨率：</Text>
                <Text>{selectedSpec.resolution}</Text>
                <br />
              </>
            )}
            <Text strong>规格ID：</Text>
            <Text code>{selectedSpec.id}</Text>
          </div>
        ) : (
          <Text type="secondary">未选择规格</Text>
        )}
      </Card>

      <Card title="功能说明">
        <div style={{ lineHeight: '1.8' }}>
          <Title level={4}>主要功能：</Title>
          <ul>
            <li><Text strong>选择现有规格：</Text>从下拉菜单中选择已保存的规格</li>
            <li><Text strong>创建新规格：</Text>点击"新建规格"按钮创建自定义规格</li>
            <li><Text strong>编辑规格：</Text>点击已选择的规格可以编辑其属性</li>
            <li><Text strong>预设规格：</Text>提供常用规格的快速选择</li>
            <li><Text strong>清除选择：</Text>悬停时显示清除按钮</li>
          </ul>

          <Divider />

          <Title level={4}>支持的规格类型：</Title>
          <ul>
            <li><Text strong>纸张规格：</Text>A4、A3、名片等标准纸张尺寸</li>
            <li><Text strong>数字媒体：</Text>网页横幅、手机屏幕等像素尺寸</li>
            <li><Text strong>打印规格：</Text>海报、宣传册等大尺寸规格</li>
            <li><Text strong>自定义规格：</Text>支持任意尺寸和单位的自定义规格</li>
          </ul>

          <Divider />

          <Title level={4}>单位支持：</Title>
          <ul>
            <li><Text code>mm</Text> - 毫米（适用于打印设计）</li>
            <li><Text code>cm</Text> - 厘米（适用于大尺寸设计）</li>
            <li><Text code>m</Text> - 米（适用于超大尺寸设计）</li>
            <li><Text code>px</Text> - 像素（适用于数字媒体）</li>
            <li><Text code>inch</Text> - 英寸（适用于国际标准）</li>
          </ul>

          <Divider />

          <Title level={4}>分辨率选项：</Title>
          <ul>
            <li><Text code>72dpi</Text> - 网页显示</li>
            <li><Text code>150dpi</Text> - 普通打印</li>
            <li><Text code>300dpi</Text> - 高质量打印</li>
            <li><Text code>600dpi</Text> - 专业打印</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

export default SpecificationSelectorExample 