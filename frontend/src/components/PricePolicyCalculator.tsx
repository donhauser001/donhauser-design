import React from 'react'
import { PricingPolicy } from '../api/pricingPolicy'

export interface PriceCalculationResult {
  originalPrice: number
  discountedPrice: number
  discountAmount: number
  discountRatio: number
  appliedPolicy: PricingPolicy | null
  calculationDetails: string
}

export interface PricePolicyCalculatorProps {
  originalPrice: number
  quantity: number
  policies: PricingPolicy[]
  selectedPolicyIds: string[]
  unit?: string
  showDetails?: boolean
  className?: string
}

/**
 * 计算价格政策折扣
 * 注意：虽然支持传入多个政策ID，但实际使用中每个服务只能选择一个政策（单选逻辑）
 * @param originalPrice 原价
 * @param quantity 数量
 * @param policies 可用的价格政策列表
 * @param selectedPolicyIds 选中的政策ID列表（通常只包含一个ID）
 * @param unit 单位（如"天"、"个"、"次"等）
 * @returns 计算结果
 */
export const calculatePriceWithPolicies = (
  originalPrice: number,
  quantity: number,
  policies: PricingPolicy[],
  selectedPolicyIds: string[],
  unit: string = '件'
): PriceCalculationResult => {
  let bestResult: PriceCalculationResult | null = null

  // 如果没有选择任何政策，返回原价
  if (selectedPolicyIds.length === 0) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountAmount: 0,
      discountRatio: 0,
      appliedPolicy: null,
      calculationDetails: '未应用价格政策'
    }
  }

  // 遍历所有选中的政策，找到最佳折扣
  for (const policyId of selectedPolicyIds) {
    const policy = policies.find(p => p._id === policyId)
    if (!policy || policy.status !== 'active') {
      continue
    }

    let currentResult: PriceCalculationResult

    if (policy.type === 'uniform_discount') {
      // 统一折扣 - discountRatio 是计费比例（如80表示收取80%）
      const discountRatio = policy.discountRatio || 0
      const discountedPrice = (originalPrice * discountRatio) / 100
      const discountAmount = originalPrice - discountedPrice
      
      currentResult = {
        originalPrice,
        discountedPrice,
        discountAmount,
        discountRatio,
        appliedPolicy: policy,
        calculationDetails: `按${discountRatio}%计费`
      }
    } else if (policy.type === 'tiered_discount' && policy.tierSettings) {
      // 阶梯折扣 - 分段计算
      currentResult = calculateTieredDiscount(originalPrice, quantity, policy, unit)
    } else {
      continue
    }

    // 如果这个政策的折扣更好（即最终价格更低），更新最佳折扣
    if (!bestResult || currentResult.discountedPrice < bestResult.discountedPrice) {
      bestResult = currentResult
    }
  }

  return bestResult || {
    originalPrice,
    discountedPrice: originalPrice,
    discountAmount: 0,
    discountRatio: 0,
    appliedPolicy: null,
    calculationDetails: '未找到适用的价格政策'
  }
}

/**
 * 计算阶梯折扣价格（分段计算）
 * @param originalPrice 原价
 * @param quantity 数量
 * @param policy 价格政策
 * @param unit 单位
 * @returns 计算结果
 */
const calculateTieredDiscount = (
  originalPrice: number,
  quantity: number,
  policy: PricingPolicy,
  unit: string = '件'
): PriceCalculationResult => {
  if (!policy.tierSettings || policy.tierSettings.length === 0) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      discountAmount: 0,
      discountRatio: 0,
      appliedPolicy: policy,
      calculationDetails: '阶梯设置无效'
    }
  }

  const unitPrice = originalPrice / quantity // 单价
  let totalDiscountedPrice = 0
  let calculationDetails = ''
  let totalDiscountRatio = 0

  // 按阶梯设置排序
  const sortedTiers = [...policy.tierSettings].sort((a, b) => (a.startQuantity || 0) - (b.startQuantity || 0))

  let remainingQuantity = quantity // 剩余需要计算的数量

  for (let i = 0; i < sortedTiers.length; i++) {
    const tier = sortedTiers[i]
    const startQuantity = tier.startQuantity || 0
    const endQuantity = tier.endQuantity || Infinity
    const discountRatio = tier.discountRatio || 0

    if (remainingQuantity <= 0) break // 如果没有剩余数量，则停止计算

    // 计算当前阶梯适用的数量
    let tierQuantityApplicable = 0
    if (endQuantity === Infinity) {
      // 最后一个阶梯（无上限）
      tierQuantityApplicable = remainingQuantity
    } else {
      // 有上限的阶梯
      const tierCapacity = endQuantity - startQuantity + 1
      tierQuantityApplicable = Math.min(remainingQuantity, tierCapacity)
    }
    
    // Ensure tierQuantityApplicable is not negative
    tierQuantityApplicable = Math.max(0, tierQuantityApplicable)

    if (tierQuantityApplicable > 0) {
      const tierPrice = unitPrice * tierQuantityApplicable
      const tierDiscountedPrice = (tierPrice * discountRatio) / 100
      totalDiscountedPrice += tierDiscountedPrice

      // 构建计算详情
      let tierRange = ''
      if (startQuantity === endQuantity) {
        tierRange = `第${startQuantity}${unit}`
      } else if (endQuantity === Infinity) {
        tierRange = `${startQuantity}${unit}以上`
      } else {
        tierRange = `第${startQuantity}-${endQuantity}${unit}`
      }
      calculationDetails += `${tierRange}按${discountRatio}%计费: ¥${tierDiscountedPrice.toLocaleString()}<br/>`
      remainingQuantity -= tierQuantityApplicable // 更新剩余数量
    }
  }

  const discountAmount = originalPrice - totalDiscountedPrice
  totalDiscountRatio = ((originalPrice - totalDiscountedPrice) / originalPrice) * 100

  return {
    originalPrice,
    discountedPrice: totalDiscountedPrice,
    discountAmount,
    discountRatio: 100 - totalDiscountRatio, // 计费比例
    appliedPolicy: policy,
    calculationDetails: calculationDetails.trim()
  }
}

/**
 * 格式化价格计算详情
 * @param result 计算结果
 * @returns 格式化的详情字符串
 */
export const formatCalculationDetails = (result: PriceCalculationResult): string => {
  if (result.appliedPolicy) {
    const actualDiscountRatio = 100 - result.discountRatio // 实际优惠比例
    
    if (result.appliedPolicy.type === 'uniform_discount') {
      // 统一折扣简化显示
      return `优惠折扣: 按${result.discountRatio}%计费<br/>原价: ¥${result.originalPrice.toLocaleString()}<br/>优惠比例: ${actualDiscountRatio}%<br/>优惠金额: ¥${result.discountAmount.toLocaleString()}<br/>最终价格: ¥${result.discountedPrice.toLocaleString()}`
    } else {
      // 阶梯折扣简化显示
      return `计费方式:<br/>${result.calculationDetails.replace('阶梯折扣: ', '')}<br/>原价: ¥${result.originalPrice.toLocaleString()}<br/>优惠金额: ¥${result.discountAmount.toLocaleString()}<br/>最终价格: ¥${result.discountedPrice.toLocaleString()}`
    }
  }
  return result.calculationDetails
}

/**
 * 价格政策计算器组件
 * 提供价格计算和显示功能
 */
const PricePolicyCalculator: React.FC<PricePolicyCalculatorProps> = ({
  originalPrice,
  quantity,
  policies,
  selectedPolicyIds,
  unit = '件',
  showDetails = true,
  className = ''
}) => {
  const calculationResult = calculatePriceWithPolicies(
    originalPrice,
    quantity,
    policies,
    selectedPolicyIds,
    unit
  )

  const hasDiscount = calculationResult.discountRatio < 100

  return (
    <div className={className}>
      {/* 价格显示 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {hasDiscount ? (
          <>
            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>
              ¥{calculationResult.originalPrice.toLocaleString()}
            </span>
            <span style={{ color: '#f5222d', fontWeight: 'bold', fontSize: '16px' }}>
              ¥{calculationResult.discountedPrice.toLocaleString()}
            </span>
            <span style={{ color: '#52c41a', fontSize: '12px' }}>
              优惠: ¥{calculationResult.discountAmount.toLocaleString()}
            </span>
          </>
        ) : (
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
            ¥{calculationResult.originalPrice.toLocaleString()}
          </span>
        )}
      </div>

      {/* 详细信息 */}
      {showDetails && hasDiscount && calculationResult.appliedPolicy && (
        <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
          <div style={{ marginBottom: 4 }}>
            <strong>应用政策:</strong> {calculationResult.appliedPolicy.name}
          </div>
          <div 
            style={{ 
              backgroundColor: '#f6ffed', 
              padding: 8, 
              borderRadius: 4, 
              border: '1px solid #b7eb8f',
              fontSize: '11px',
              lineHeight: 1.4
            }}
            dangerouslySetInnerHTML={{ 
              __html: formatCalculationDetails(calculationResult) 
            }}
          />
        </div>
      )}
    </div>
  )
}

export default PricePolicyCalculator 