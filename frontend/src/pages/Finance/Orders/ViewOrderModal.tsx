import React, { useState, useEffect } from 'react'
import { Modal, Descriptions, Table, Typography, Card, Space, Dropdown, Button, Spin } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Order } from '../../../api/orders'
import { getOrderVersions, OrderVersion } from '../../../api/orderVersions'

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
    const [selectedVersionIndex, setSelectedVersionIndex] = useState<number>(-1)
    const [orderVersions, setOrderVersions] = useState<OrderVersion[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setSelectedVersionIndex(-1)
        if (visible && order?._id) {
            fetchOrderVersions()
        }
    }, [visible, order?._id])

    const fetchOrderVersions = async () => {
        if (!order?._id) return

        setLoading(true)
        try {
            const response = await getOrderVersions(order._id)
            if (response.success) {
                setOrderVersions(response.data)
            }
        } catch (error) {
            console.error('获取订单版本失败:', error)
        } finally {
            setLoading(false)
        }
    }

    const getSelectedVersion = () => {
        if (orderVersions.length === 0) return null
        if (selectedVersionIndex === -1) {
            // 返回版本号最大的版本作为最新版本
            return orderVersions.reduce((latest, current) =>
                current.versionNumber > latest.versionNumber ? current : latest
            )
        }
        return orderVersions[selectedVersionIndex] || null
    }

    const selectedVersion = getSelectedVersion()

    const displayData = selectedVersion ? {
        clientName: selectedVersion.clientName,
        contactNames: selectedVersion.contactNames,
        contactPhones: selectedVersion.contactPhones,
        projectName: selectedVersion.projectName,
        totalAmount: selectedVersion.totalAmount,
        totalAmountRMB: selectedVersion.totalAmountRMB,
        items: selectedVersion.items,
        version: selectedVersion.versionNumber,
        createdAt: selectedVersion.createdAt
    } : {
        clientName: order?.clientName || '',
        contactNames: order?.contactNames || [],
        contactPhones: order?.contactPhones || [],
        projectName: order?.projectName || '',
        totalAmount: order?.currentAmount || 0,
        totalAmountRMB: order?.currentAmountRMB || '',
        items: [],
        version: order?.currentVersion || 0,
        createdAt: order?.createTime || ''
    }

    const versionMenuItems = orderVersions
        .map((version, index) => {
            // 找到版本号最大的作为最新版本
            const maxVersionNumber = Math.max(...orderVersions.map(v => v.versionNumber))
            const isLatest = version.versionNumber === maxVersionNumber

            return {
                key: index.toString(),
                label: isLatest
                    ? `v${version.versionNumber} (最新)`
                    : `v${version.versionNumber}`,
                onClick: () => setSelectedVersionIndex(isLatest ? -1 : index)
            }
        })
        .sort((a, b) => {
            // 按版本号降序排序，最新版本在最前面
            const versionA = parseInt(a.label.match(/v(\d+)/)?.[1] || '0')
            const versionB = parseInt(b.label.match(/v(\d+)/)?.[1] || '0')
            return versionB - versionA
        })

    const hasMultipleVersions = orderVersions.length > 1

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
                // 去重政策名称，避免重复显示
                const uniquePolicyNames = [...new Set(policies.map(policy => policy.policyName))]
                return uniquePolicyNames.join('、')
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

                if (record.pricingPolicies && record.pricingPolicies.length > 0) {
                    const originalPrice = (record.unitPrice || 0) * (record.quantity || 1)

                    // 去重政策，避免重复显示
                    const uniquePolicies = record.pricingPolicies.filter((policy, index, self) => 
                        index === self.findIndex(p => p.policyName === policy.policyName)
                    )

                    const policyDetailsArray = uniquePolicies.map(policy => {
                        if (policy.calculationDetails) {
                            return policy.calculationDetails
                        } else {
                            const discountAmount = originalPrice * (1 - policy.discountRatio)
                            return `${policy.policyName}: 原价¥${originalPrice.toLocaleString()}，折扣${(policy.discountRatio * 100).toFixed(0)}%，优惠¥${discountAmount.toLocaleString()}`
                        }
                    })

                    calculationDetails = policyDetailsArray.join('\n')
                }

                return (
                    <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                        {description && <div style={{ marginBottom: '4px' }}>{description.replace(/<br\s*\/?>/gi, '\n')}</div>}
                        {calculationDetails && (
                            <div style={{ color: '#666', whiteSpace: 'pre-line' }}>
                                {calculationDetails.replace(/<br\s*\/?>/gi, '\n')}
                            </div>
                        )}
                    </div>
                )
            }
        }
    ]

    const renderVersionSelector = () => {
        if (hasMultipleVersions) {
            return (
                <Dropdown menu={{ items: versionMenuItems }} placement="bottomRight">
                    <Button
                        type="text"
                        size="small"
                        style={{
                            padding: '4px 8px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px',
                            backgroundColor: '#fafafa',
                            color: '#1890ff',
                            fontSize: '12px',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            lineHeight: 1.2
                        }}
                    >
                        切换版本
                        <DownOutlined style={{
                            marginLeft: 4,
                            fontSize: 10,
                            color: '#1890ff'
                        }} />
                    </Button>
                </Dropdown>
            )
        }

        return (
            <Text type="secondary" style={{ fontSize: '12px' }}>
                (仅有1个版本)
            </Text>
        )
    }

    if (!order) {
        return (
            <Modal
                title="订单详情"
                open={visible}
                onCancel={onClose}
                width={1000}
                footer={null}
                destroyOnHidden
            >
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Text type="secondary">订单数据不存在</Text>
                </div>
            </Modal>
        )
    }

    return (
        <Modal
            title={`订单详情 - v${displayData.version}${selectedVersionIndex === -1 ? ' (最新)' : ''}${order?.status === 'cancelled' ? ' (已取消)' : ''}`}
            open={visible}
            onCancel={onClose}
            width={1000}
            footer={null}
            destroyOnHidden
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Title level={5} style={{ marginBottom: 16 }}>基本信息</Title>
                    <Descriptions
                        column={2}
                        size="small"
                        styles={{
                            label: { fontWeight: 'bold', color: '#666' },
                            content: { textAlign: 'left' }
                        }}
                    >
                        <Descriptions.Item label="订单号">{order?.orderNo}</Descriptions.Item>
                        <Descriptions.Item label="状态">
                            {order?.status === 'normal' ? '正常' : '已取消'}
                        </Descriptions.Item>
                        <Descriptions.Item label="当前版本">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Text>v{displayData.version}</Text>
                                {renderVersionSelector()}
                            </div>
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
                        <Descriptions.Item label="创建时间">{formatTime(order?.createTime || '')}</Descriptions.Item>
                        <Descriptions.Item label="更新时间">{formatTime(displayData.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="总金额">
                            <Text strong>
                                ¥{displayData.totalAmount.toLocaleString()}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card>
                    <Title level={5}>服务项目明细</Title>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Spin size="large" />
                            <div style={{ marginTop: 16 }}>
                                <Text type="secondary">正在加载订单版本数据...</Text>
                            </div>
                        </div>
                    ) : displayData.items && displayData.items.length > 0 ? (
                        <Table
                            columns={itemColumns}
                            dataSource={displayData.items}
                            rowKey={(record, index) => `${record.serviceName}-${index}`}
                            pagination={false}
                            size="small"
                            scroll={{ x: 800 }}
                        />
                    ) : (
                        <div>
                            <Text type="secondary">暂无服务项目数据</Text>
                            <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
                                调试信息: orderVersions.length={orderVersions.length},
                                selectedVersion={selectedVersion ? '存在' : '不存在'},
                                items.length={displayData.items?.length || 0}
                            </div>
                        </div>
                    )}
                </Card>

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