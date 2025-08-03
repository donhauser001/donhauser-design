import React, { useState, useEffect } from 'react'
import { Modal, Descriptions, Table, Typography, Card, Space, Dropdown, Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Order } from '../../../api/orders'
import { calculatePriceWithPolicies, formatCalculationDetails } from '../../../components/PricePolicyCalculator'

const { Title, Text } = Typography

interface ViewOrderModalProps {
    visible: boolean
    order: Order | null
    onClose: () => void
}

interface OrderItem {
    serviceName: string
    quantity: number
    unitPrice: number
    unit: string
    priceDescription?: string
    pricingPolicies: Array<{
        policyName: string
        policyType: string
        discountRatio: number
        calculationDetails?: string
    }>
    discountedPrice: number
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ visible, order, onClose }) => {
    if (!order) return null

    // 版本选择状态：默认选择最后一个版本（索引-1表示使用最后一个）
    const [selectedVersionIndex, setSelectedVersionIndex] = useState<number>(-1)

    // 获取所有快照数据
    const snapshots = order.snapshots || []

    // 重置版本选择当订单改变时
    useEffect(() => {
        setSelectedVersionIndex(-1) // 默认选择最后一个版本
    }, [order._id])

    // 根据选中的版本获取数据
    const getSelectedSnapshot = () => {
        if (snapshots.length === 0) return null
        if (selectedVersionIndex === -1) {
            // 选择最后一个版本
            return snapshots[snapshots.length - 1]
        }
        return snapshots[selectedVersionIndex] || null
    }

    const selectedSnapshot = getSelectedSnapshot()

    // 使用选中版本的数据，如果没有快照则使用订单基本数据
    const displayData = selectedSnapshot ? {
        clientName: selectedSnapshot.clientInfo.clientName,
        contactNames: selectedSnapshot.clientInfo.contactNames,
        contactPhones: selectedSnapshot.clientInfo.contactPhones,
        projectName: selectedSnapshot.projectInfo.projectName,
        totalAmount: selectedSnapshot.totalAmount,
        totalAmountRMB: selectedSnapshot.totalAmountRMB,
        items: selectedSnapshot.items,
        version: selectedSnapshot.version,
        createdAt: selectedSnapshot.createdAt
    } : {
        clientName: order.clientName,
        contactNames: order.contactNames,
        contactPhones: order.contactPhones,
        projectName: order.projectName,
        totalAmount: order.currentAmount,
        totalAmountRMB: order.currentAmountRMB,
        items: [],
        version: order.currentVersion,
        createdAt: order.createTime
    }

    // 创建版本菜单项（按时间倒序：最新在前）
    const versionMenuItems = snapshots
        .map((snapshot, index) => ({
            key: index.toString(),
            label: index === snapshots.length - 1
                ? `v${snapshot.version} (最新)`
                : `v${snapshot.version}`,
            onClick: () => setSelectedVersionIndex(index === snapshots.length - 1 ? -1 : index)
        }))
        .reverse() // 倒序，最新版本在顶部

    // 判断是否只有一个版本
    const hasMultipleVersions = snapshots.length > 1

    // 格式化时间显示
    const formatTime = (time: string | Date) => {
        if (!time) return '-'
        const date = new Date(time)
        if (isNaN(date.getTime())) return time.toString()

        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    // 服务项目表格列定义
    const itemColumns = [
        {
            title: '服务名称',
            dataIndex: 'serviceName',
            key: 'serviceName',
            width: 200,
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80,
            render: (quantity: number, record: OrderItem) => `${quantity} ${record.unit || '件'}`
        },
        {
            title: '单价',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            width: 120,
            render: (price: number, record: OrderItem) => `¥${price.toLocaleString()}/${record.unit || '件'}`
        },
        {
            title: '价格政策',
            dataIndex: 'pricingPolicies',
            key: 'pricingPolicies',
            width: 150,
            render: (policies: OrderItem['pricingPolicies']) => {
                if (!policies || policies.length === 0) {
                    return <Text type="secondary">无政策</Text>
                }
                return policies.map(policy => policy.policyName).join('、')
            }
        },
        {
            title: '折后价格',
            dataIndex: 'discountedPrice',
            key: 'discountedPrice',
            width: 120,
            render: (price: number) => (
                <Text strong>
                    ¥{price.toLocaleString()}
                </Text>
            )
        },
        {
            title: '说明',
            dataIndex: 'priceDescription',
            key: 'priceDescription',
            render: (desc: string, record: OrderItem) => {
                let description = desc || ''
                let calculationDetails = ''

                // 如果有价格政策，生成详细的计算信息
                if (record.pricingPolicies && record.pricingPolicies.length > 0) {
                    const originalPrice = (record.unitPrice || 0) * (record.quantity || 1)

                    // 对于查看订单详情，优先使用快照中保存的详细计算结果
                    // 因为快照中包含了当时完整的计算过程和结果
                    const policyDetailsArray = record.pricingPolicies.map(policy => {
                        if (policy.calculationDetails) {
                            // 如果有预保存的计算详情，直接使用
                            return policy.calculationDetails
                        } else {
                            // 否则尝试重新计算（主要用于统一折扣政策）
                            try {
                                const mockPolicy = {
                                    _id: policy.policyName,
                                    name: policy.policyName,
                                    type: (policy.policyType === 'tiered_discount' || policy.policyType === 'uniform_discount')
                                        ? policy.policyType as 'tiered_discount' | 'uniform_discount'
                                        : 'uniform_discount' as 'uniform_discount',
                                    discountRatio: policy.discountRatio,
                                    status: 'active' as 'active',
                                    alias: '',
                                    summary: '',
                                    validUntil: new Date().toISOString(),
                                    createTime: new Date().toISOString(),
                                    updateTime: new Date().toISOString()
                                }

                                const calculationResult = calculatePriceWithPolicies(
                                    originalPrice,
                                    record.quantity || 1,
                                    [mockPolicy],
                                    [policy.policyName],
                                    record.unit || '件'
                                )

                                if (calculationResult.appliedPolicy) {
                                    return formatCalculationDetails(calculationResult)
                                }
                            } catch (error) {
                                console.warn('重新计算失败:', error)
                            }
                            // 最后的备用方案
                            return `${policy.policyName}: 按${policy.discountRatio}%计费`
                        }
                    })

                    calculationDetails = policyDetailsArray.join('<br/><br/>')
                }

                return (
                    <div>
                        {description && (
                            <div style={{
                                marginBottom: 8,
                                fontSize: '14px',
                                lineHeight: 1.4,
                                color: '#000'
                            }}>
                                {description}
                            </div>
                        )}
                        {calculationDetails && (
                            <div
                                style={{
                                    fontSize: '14px',
                                    lineHeight: 1.4,
                                    color: '#000'
                                }}
                                dangerouslySetInnerHTML={{ __html: calculationDetails }}
                            />
                        )}
                        {!description && !calculationDetails && (
                            <span style={{
                                fontSize: '14px',
                                lineHeight: 1.4,
                                color: '#000'
                            }}>
                                -
                            </span>
                        )}
                    </div>
                )
            }
        }
    ]

    return (
        <Modal
            title={`订单详情 - v${displayData.version}${selectedVersionIndex === -1 ? ' (最新)' : ''}${order.status === 'cancelled' ? ' (已取消)' : ''}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
            styles={{
                body: { maxHeight: '70vh', overflowY: 'auto' }
            }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 订单信息 */}
                <Card>
                    <Title level={5}>订单信息</Title>
                    <Descriptions
                        column={3}
                        size="small"
                        labelStyle={{ textAlign: 'left', width: '100px' }}
                        contentStyle={{ textAlign: 'left' }}
                    >
                        <Descriptions.Item label="订单号">{order.orderNo}</Descriptions.Item>
                        <Descriptions.Item label="状态">
                            {order.status === 'normal' ? '正常' : '已取消'}
                        </Descriptions.Item>
                        <Descriptions.Item label="当前版本">
                                                        {hasMultipleVersions ? (
                                <Dropdown 
                                    menu={{ items: versionMenuItems }}
                                    trigger={['click']}
                                    placement="bottomLeft"
                                >
                                    <Button 
                                        size="small" 
                                        style={{ 
                                            padding: '4px 8px',
                                            height: 'auto',
                                            border: '1px solid #d9d9d9',
                                            borderRadius: '6px',
                                            backgroundColor: '#fafafa',
                                            color: '#262626',
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            lineHeight: 1.2
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f0f0f0'
                                            e.currentTarget.style.borderColor = '#40a9ff'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#fafafa'
                                            e.currentTarget.style.borderColor = '#d9d9d9'
                                        }}
                                    >
                                        v{displayData.version} 
                                        <DownOutlined style={{ 
                                            marginLeft: 6, 
                                            fontSize: 10,
                                            color: '#8c8c8c'
                                        }} />
                                    </Button>
                                </Dropdown>
                            ) : (
                                <span style={{
                                    padding: '4px 8px',
                                    border: '1px solid #e8e8e8',
                                    borderRadius: '6px',
                                    backgroundColor: '#f8f8f8',
                                    color: '#8c8c8c',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    display: 'inline-block',
                                    lineHeight: 1.2
                                }}>
                                    v{displayData.version}
                                </span>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="客户名称">{displayData.clientName}</Descriptions.Item>
                        <Descriptions.Item label="联系人">
                            {displayData.contactNames && displayData.contactNames.length > 0 ? (
                                <div style={{ lineHeight: '1.8' }}>
                                    {displayData.contactNames.map((name, index) => {
                                        const phone = displayData.contactPhones?.[index] || ''
                                        return (
                                            <div key={index} style={{ marginBottom: '4px' }}>
                                                {name}{phone ? ` ${phone}` : ''}
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : '无'}
                        </Descriptions.Item>
                        <Descriptions.Item label="项目名称">{displayData.projectName}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{formatTime(order.createTime)}</Descriptions.Item>
                        <Descriptions.Item label="更新时间">{formatTime(displayData.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="总金额">
                            <Text strong>
                                ¥{displayData.totalAmount.toLocaleString()}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* 服务项目明细 */}
                <Card>
                    <Title level={5}>服务项目明细</Title>
                    {displayData.items && displayData.items.length > 0 ? (
                        <Table
                            columns={itemColumns}
                            dataSource={displayData.items}
                            rowKey={(record) => `${record.serviceName}-${record.serviceId || Math.random()}`}
                            pagination={false}
                            size="small"
                            scroll={{ x: 800 }}
                        />
                    ) : (
                        <Text type="secondary">暂无服务项目数据</Text>
                    )}
                </Card>

                {/* 金额汇总 */}
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <Space size="large">
                            <Text>项目数量: {displayData.items?.length || 0} 项</Text>
                            <Text>
                                总金额: <Text strong>¥{displayData.totalAmount.toLocaleString()}</Text>
                            </Text>
                            <Text type="secondary">
                                大写: {displayData.totalAmountRMB}
                            </Text>
                        </Space>
                    </div>
                </Card>
            </Space>
        </Modal>
    )
}

export default ViewOrderModal