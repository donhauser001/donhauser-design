import React from 'react'
import { Button, Card, Table, InputNumber, Checkbox, Tooltip } from 'antd'
import { ServiceDetail, Client, Contact } from './types'
import { PricingPolicy } from '../../../api/pricingPolicy'
import { calculatePriceWithPolicies, formatCalculationDetails } from '../../../components/PricePolicyCalculator'
import RMBAmountConverter from '../../../components/RMBAmountConverter'

interface StepThreeProps {
  clients: Client[]
  contacts: Contact[]
  serviceDetails: ServiceDetail[]
  selectedClientId: string
  selectedContactIds: string[]
  projectName: string
  selectedServices: string[]
  policies: PricingPolicy[]
  isUpdateMode?: boolean
  onPrevious: () => void
  onCreateOrder: () => void
  onCancel: () => void
  onQuantityChange?: (serviceId: string, quantity: number) => void
  onPolicyChange?: (serviceId: string, policyIds: string[]) => void
}

const StepThree: React.FC<StepThreeProps> = ({
  clients,
  contacts,
  serviceDetails,
  selectedClientId,
  selectedContactIds,
  projectName,
  selectedServices,
  policies,
  isUpdateMode = false,
  onPrevious,
  onCreateOrder,
  onCancel,
  onQuantityChange,
  onPolicyChange
}) => {
  const columns = [
    {
      title: '服务名称',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 180
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 100
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      render: (price: number, record: ServiceDetail) => (
        <span>¥{price?.toLocaleString()}/{record.unit}</span>
      )
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (quantity: number, record: ServiceDetail) => (
        <InputNumber
          min={1}
          max={9999}
          value={quantity || 1}
          style={{ width: '80px' }}
          onChange={(value) => {
            if (onQuantityChange && value) {
              onQuantityChange(record._id || record.id || '', value)
            }
          }}
        />
      )
    },
    {
      title: '价格政策',
      key: 'pricingPolicies',
      width: 200,
      render: (_: any, record: ServiceDetail) => {
        // 获取该服务关联的价格政策
        const servicePolicyIds = record.pricingPolicyIds || []

        // 如果服务项目没有关联的价格政策，显示"无政策"
        if (servicePolicyIds.length === 0) {
          return <span style={{ color: '#999' }}>无政策</span>
        }

        // 获取该服务关联的价格政策
        const availablePolicies = policies.filter(policy => servicePolicyIds.includes(policy._id))

        if (availablePolicies.length === 0) {
          return <span style={{ color: '#999' }}>无可用政策</span>
        }

        return (
          <div>
            {availablePolicies.map(policy => (
              <div key={policy._id} style={{ marginBottom: 4 }}>
                <Checkbox
                  checked={record.selectedPolicies?.includes(policy._id) || false}
                  onChange={(e) => {
                    let newSelected: string[]

                    if (e.target.checked) {
                      // 如果选中，先清空所有已选政策，然后只选中当前政策（单选逻辑）
                      newSelected = [policy._id]
                    } else {
                      // 如果取消选中，清空所有政策
                      newSelected = []
                    }

                    if (onPolicyChange) {
                      onPolicyChange(record._id || record.id || '', newSelected)
                    }
                  }}
                >
                  <Tooltip title={policy.summary}>
                    <span style={{ fontSize: '12px' }}>
                      {policy.name} ({policy.alias || '无别名'})
                    </span>
                  </Tooltip>
                </Checkbox>
              </div>
            ))}
          </div>
        )
      }
    },
    {
      title: '小计',
      key: 'subtotal',
      width: 150,
      render: (_: any, record: ServiceDetail) => {
        const quantity = record.quantity || 1
        const originalPrice = (record.unitPrice || 0) * quantity

        // 如果有选中的价格政策，计算折扣价格
        if (record.selectedPolicies && record.selectedPolicies.length > 0) {
          const calculationResult = calculatePriceWithPolicies(
            originalPrice,
            quantity,
            policies,
            record.selectedPolicies,
            record.unit || '件'
          )

          return (
            <div>
              <div style={{ fontWeight: 'bold' }}>
                ¥{calculationResult.discountedPrice.toLocaleString()}
              </div>
              {calculationResult.discountRatio < 100 && (
                <div style={{ fontSize: '10px', color: '#666' }}>
                  优惠: ¥{calculationResult.discountAmount.toLocaleString()}
                </div>
              )}
            </div>
          )
        }

        return (
          <span style={{ fontWeight: 'bold' }}>
            ¥{originalPrice.toLocaleString()}
          </span>
        )
      }
    },
    {
      title: '描述',
      key: 'description',
      width: 200,
      render: (_: any, record: ServiceDetail) => {
        const quantity = record.quantity || 1
        const originalPrice = (record.unitPrice || 0) * quantity
        let description = record.priceDescription || ''

        // 如果有选中的价格政策，使用PricePolicyCalculator组件的计算详情
        if (record.selectedPolicies && record.selectedPolicies.length > 0) {
          const calculationResult = calculatePriceWithPolicies(
            originalPrice,
            quantity,
            policies,
            record.selectedPolicies,
            record.unit || '件'
          )

          if (calculationResult.appliedPolicy) {
            // 使用formatCalculationDetails格式化详情
            const formattedDetails = formatCalculationDetails(calculationResult)
            description += `<br/><br/>${formattedDetails}`
          }
        }

        return (
          <Tooltip title={description.replace(/<br\/?>/g, '\n')}>
            <div style={{
              maxWidth: 180,
              fontSize: '12px',
              lineHeight: '1.4',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
              dangerouslySetInnerHTML={{ __html: description || '无描述' }}
            />
          </Tooltip>
        )
      }
    }
  ]

  const totalAmount = serviceDetails
    .filter(service => selectedServices.includes(service._id || service.id || ''))
    .reduce((sum, service) => {
      const quantity = service.quantity || 1
      const originalPrice = (service.unitPrice || 0) * quantity

      // 如果有选中的价格政策，计算折扣价格
      if (service.selectedPolicies && service.selectedPolicies.length > 0) {
        const calculationResult = calculatePriceWithPolicies(
          originalPrice,
          quantity,
          policies,
          service.selectedPolicies,
          service.unit || '件'
        )
        return sum + calculationResult.discountedPrice
      }

      return sum + originalPrice
    }, 0)

  return (
    <div>
      {/* 客户信息 */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <div>
            <strong>客户公司：</strong>
            {clients.find(c => c.id === selectedClientId || c._id === selectedClientId)?.companyName ||
              clients.find(c => c.id === selectedClientId || c._id === selectedClientId)?.name}
          </div>
          <div>
            <strong>联系人：</strong>
            {selectedContactIds.length > 0 ?
              selectedContactIds.map(contactId => {
                const contact = contacts.find(c => c.id === contactId || c._id === contactId)
                return contact?.realName
              }).filter(Boolean).join('、') :
              '未选择'
            }
          </div>
          <div>
            <strong>项目名称：</strong>
            {projectName}
          </div>
        </div>
      </div>

      {/* 服务项目表格 */}
      <Table
        dataSource={serviceDetails.filter(service => selectedServices.includes(service._id || service.id || ''))}
        columns={columns}
        pagination={false}
        size="small"
        rowKey={(record) => record._id || record.id || ''}
        style={{ marginBottom: '20px' }}
      />

      {/* 总计信息 */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000',
          gap: 32
        }}>
          <span>共 {selectedServices.length} 项服务</span>
          <span>总计：¥{totalAmount.toLocaleString()}</span>
          <span>
            大写：<RMBAmountConverter
              amount={totalAmount}
              showSymbol={false}
              showPrefix={true}
              style={{
                fontSize: '14px',
                color: '#000',
                fontWeight: 'bold'
              }}
            />
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Button
          style={{ marginRight: 8 }}
          onClick={onCancel}
        >
          取消
        </Button>
        <Button
          style={{ marginRight: 8 }}
          onClick={onPrevious}
        >
          上一步
        </Button>
        <Button
          type="primary"
          onClick={onCreateOrder}
        >
          {isUpdateMode ? '更新订单' : '创建订单'}
        </Button>
      </div>
    </div>
  )
}

export default StepThree 