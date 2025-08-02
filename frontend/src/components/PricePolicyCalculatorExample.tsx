import React, { useState, useEffect } from 'react'
import { Card, Table, InputNumber, Select, Space, Button, Divider, Typography } from 'antd'
import PricePolicyCalculator, { 
  calculatePriceWithPolicies, 
  formatCalculationDetails,
  type PriceCalculationResult 
} from './PricePolicyCalculator'
import { getAllPricingPolicies, type PricingPolicy } from '../api/pricingPolicy'

const { Title, Text } = Typography
const { Option } = Select

/**
 * PricePolicyCalculator 使用示例
 * 展示组件的各种使用场景
 */
const PricePolicyCalculatorExample: React.FC = () => {
  const [policies, setPolicies] = useState<PricingPolicy[]>([])
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([])
  const [originalPrice, setOriginalPrice] = useState(1000)
  const [quantity, setQuantity] = useState(5)
  const [unit, setUnit] = useState('件')
  const [showDetails, setShowDetails] = useState(true)

  // 加载价格政策
  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const data = await getAllPricingPolicies()
        setPolicies(data)
      } catch (error) {
        console.error('加载价格政策失败:', error)
      }
    }
    loadPolicies()
  }, [])

  // 计算价格
  const calculationResult = calculatePriceWithPolicies(
    originalPrice,
    quantity,
    policies,
    selectedPolicyIds,
    unit
  )

  // 示例数据
  const exampleData = [
    {
      id: '1',
      serviceName: '网站建设',
      unitPrice: 200,
      quantity: 1,
      unit: '个',
      selectedPolicyIds: ['policy-1']
    },
    {
      id: '2',
      serviceName: '技术培训',
      unitPrice: 150,
      quantity: 10,
      unit: '小时',
      selectedPolicyIds: ['policy-2']
    },
    {
      id: '3',
      serviceName: '设计服务',
      unitPrice: 100,
      quantity: 20,
      unit: '张',
      selectedPolicyIds: []
    }
  ]

  // 表格列定义
  const columns = [
    {
      title: '服务名称',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 120
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 80,
      render: (price: number) => `¥${price}`
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 60
    },
    {
      title: '价格计算',
      key: 'price',
      render: (_: any, record: any) => (
        <PricePolicyCalculator
          originalPrice={record.unitPrice * record.quantity}
          quantity={record.quantity}
          policies={policies}
          selectedPolicyIds={record.selectedPolicyIds}
          unit={record.unit}
          showDetails={false} // 表格中不显示详情
        />
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>PricePolicyCalculator 使用示例</Title>
      
      {/* 基础用法示例 */}
      <Card title="1. 基础用法" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>参数设置：</Text>
            <Space style={{ marginTop: 8 }}>
              <span>原价：</span>
              <InputNumber
                value={originalPrice}
                onChange={setOriginalPrice}
                min={1}
                style={{ width: 120 }}
              />
              <span>数量：</span>
              <InputNumber
                value={quantity}
                onChange={setQuantity}
                min={1}
                style={{ width: 120 }}
              />
              <span>单位：</span>
              <Select
                value={unit}
                onChange={setUnit}
                style={{ width: 80 }}
              >
                <Option value="件">件</Option>
                <Option value="个">个</Option>
                <Option value="天">天</Option>
                <Option value="小时">小时</Option>
                <Option value="张">张</Option>
              </Select>
            </Space>
          </div>

          <div>
            <Text strong>政策选择：</Text>
            <Select
              mode="multiple"
              value={selectedPolicyIds}
              onChange={setSelectedPolicyIds}
              placeholder="选择价格政策"
              style={{ width: 300, marginTop: 8 }}
              maxTagCount={1}
            >
              {policies.map(policy => (
                <Option key={policy._id} value={policy._id}>
                  {policy.name} ({policy.type === 'uniform_discount' ? '统一' : '阶梯'})
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text strong>显示选项：</Text>
            <Button
              type={showDetails ? 'primary' : 'default'}
              onClick={() => setShowDetails(!showDetails)}
              style={{ marginTop: 8 }}
            >
              {showDetails ? '隐藏详情' : '显示详情'}
            </Button>
          </div>

          <Divider />

          <div>
            <Text strong>计算结果：</Text>
            <div style={{ marginTop: 8 }}>
              <PricePolicyCalculator
                originalPrice={originalPrice}
                quantity={quantity}
                policies={policies}
                selectedPolicyIds={selectedPolicyIds}
                unit={unit}
                showDetails={showDetails}
              />
            </div>
          </div>
        </Space>
      </Card>

      {/* 仅使用计算函数示例 */}
      <Card title="2. 仅使用计算函数" style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle">
          <div>
            <Text strong>计算结果对象：</Text>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: 12, 
              borderRadius: 4,
              fontSize: '12px',
              overflow: 'auto'
            }}>
              {JSON.stringify(calculationResult, null, 2)}
            </pre>
          </div>

          <div>
            <Text strong>格式化详情：</Text>
            <div 
              style={{ 
                backgroundColor: '#f6ffed', 
                padding: 12, 
                borderRadius: 4,
                border: '1px solid #b7eb8f',
                fontSize: '12px',
                lineHeight: 1.4
              }}
              dangerouslySetInnerHTML={{ 
                __html: formatCalculationDetails(calculationResult) 
              }}
            />
          </div>
        </Space>
      </Card>

      {/* 表格中使用示例 */}
      <Card title="3. 在表格中使用" style={{ marginBottom: 24 }}>
        <Table
          columns={columns}
          dataSource={exampleData}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>

      {/* 不同场景示例 */}
      <Card title="4. 不同场景示例">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 无折扣场景 */}
          <div>
            <Text strong>无折扣场景：</Text>
            <div style={{ marginTop: 8 }}>
              <PricePolicyCalculator
                originalPrice={500}
                quantity={2}
                policies={policies}
                selectedPolicyIds={[]}
                unit="个"
                showDetails={false}
              />
            </div>
          </div>

          {/* 统一折扣场景 */}
          <div>
            <Text strong>统一折扣场景：</Text>
            <div style={{ marginTop: 8 }}>
              <PricePolicyCalculator
                originalPrice={1000}
                quantity={1}
                policies={policies}
                selectedPolicyIds={policies.filter(p => p.type === 'uniform_discount').slice(0, 1).map(p => p._id)}
                unit="件"
                showDetails={true}
              />
            </div>
          </div>

          {/* 阶梯折扣场景 */}
          <div>
            <Text strong>阶梯折扣场景：</Text>
            <div style={{ marginTop: 8 }}>
              <PricePolicyCalculator
                originalPrice={2000}
                quantity={8}
                policies={policies}
                selectedPolicyIds={policies.filter(p => p.type === 'tiered_discount').slice(0, 1).map(p => p._id)}
                unit="个"
                showDetails={true}
              />
            </div>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default PricePolicyCalculatorExample 