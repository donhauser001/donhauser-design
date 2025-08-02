import React from 'react'

export interface RMBAmountConverterProps {
  amount: number
  showSymbol?: boolean
  showPrefix?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * 将数字转换为人民币大写
 * @param num 数字
 * @param showPrefix 是否显示"人民币"前缀
 * @returns 人民币大写字符串
 */
export const convertToRMB = (num: number, showPrefix: boolean = false): string => {
  if (num === 0) return '零元整'

  // 处理负数
  const isNegative = num < 0
  const absNum = Math.abs(num)

  // 分离整数和小数部分
  const integerPart = Math.floor(absNum)
  const decimalPart = Math.round((absNum - integerPart) * 100)

  // 数字到中文的映射
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const units = ['', '拾', '佰', '仟']
  const bigUnits = ['', '万', '亿', '万亿']

  /**
   * 转换四位数字
   * @param num 四位数字
   * @param needZero 是否需要补零
   * @returns 转换结果
   */
  const convertFourDigits = (num: number, needZero: boolean = false): string => {
    if (num === 0) return ''

    const numStr = num.toString().padStart(4, '0')
    let result = ''
    let lastDigit = 0

    for (let i = 0; i < 4; i++) {
      const digit = parseInt(numStr[i])
      const unit = units[3 - i]

      if (digit === 0) {
        if (lastDigit !== 0 && i < 3) {
          result += '零'
        }
      } else {
        result += digits[digit] + unit
      }

      lastDigit = digit
    }

    // 去除末尾的零
    result = result.replace(/零+$/, '')

    return result
  }

  /**
   * 转换整数部分
   * @param num 整数
   * @returns 转换结果
   */
  const convertInteger = (num: number): string => {
    if (num === 0) return ''

    const numStr = num.toString()
    const len = numStr.length
    let result = ''

    // 按四位分组处理
    for (let i = 0; i < len; i += 4) {
      const group = parseInt(numStr.slice(Math.max(0, len - i - 4), len - i))
      const bigUnit = bigUnits[Math.floor(i / 4)]

      if (group !== 0) {
        const groupResult = convertFourDigits(group, i > 0)
        if (groupResult) {
          result = groupResult + bigUnit + result
        }
      } else if (i > 0 && result && !result.startsWith('零')) {
        result = '零' + result
      }
    }

    return result
  }

  /**
   * 转换小数部分
   * @param num 小数部分（0-99）
   * @returns 转换结果
   */
  const convertDecimal = (num: number): string => {
    if (num === 0) return ''

    const jiao = Math.floor(num / 10)
    const fen = num % 10

    let result = ''

    if (jiao > 0) {
      result += digits[jiao] + '角'
    }

    if (fen > 0) {
      result += digits[fen] + '分'
    }

    return result
  }

  // 开始转换
  let result = ''

  // 转换整数部分
  if (integerPart > 0) {
    result += convertInteger(integerPart) + '元'
  }

  // 转换小数部分
  const decimalResult = convertDecimal(decimalPart)
  if (decimalResult) {
    result += decimalResult
  } else if (integerPart > 0) {
    result += '整'
  }

  // 处理特殊情况
  if (result === '') {
    result = '零元整'
  }

  // 添加负号
  if (isNegative) {
    result = '负' + result
  }

  // 添加人民币前缀
  if (showPrefix) {
    result = '人民币' + result
  }

  return result
}

/**
 * 人民币大写转换组件
 * 将数字金额转换为人民币大写格式
 */
const RMBAmountConverter: React.FC<RMBAmountConverterProps> = ({
  amount,
  showSymbol = true,
  showPrefix = false,
  className = '',
  style = {}
}) => {
  const rmbText = convertToRMB(amount, showPrefix)

  return (
    <span
      className={className}
      style={{
        fontWeight: 'bold',
        color: '#d32f2f',
        ...style
      }}
    >
      {showSymbol && '￥'}
      {rmbText}
    </span>
  )
}

export default RMBAmountConverter 