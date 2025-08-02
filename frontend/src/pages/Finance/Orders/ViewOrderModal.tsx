import React from 'react'
import { Modal, Descriptions, Table, Tag, Typography, Card, Space, Divider } from 'antd'
import { Order } from '../../../api/orders'

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
    }>
    discountedPrice: number
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ visible, order, onClose }) => {
    if (!order) return null

    // 获取最后一个快照的数据
    const snapshots = order.snapshots || []
    const lastSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null

    // 使用最后一个快照的数据，如果没有快照则使用订单基本数据
    const displayData = lastSnapshot ? {
        clientName: lastSnapshot.clientInfo.clientName,
        contactNames: lastSnapshot.clientInfo.contactNames,
        contactPhones: lastSnapshot.clientInfo.contactPhones,
        projectName: lastSnapshot.projectInfo.projectName,
        totalAmount: lastSnapshot.totalAmount,
        totalAmountRMB: lastSnapshot.totalAmountRMB,
        items: lastSnapshot.items,
        version: lastSnapshot.version,
        createdAt: lastSnapshot.createdAt
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
            width: 100,
            render: (price: number) => `¥${price.toLocaleString()}`
        },
        {
            title: '价格政策',
            dataIndex: 'pricingPolicies',
            key: 'pricingPolicies',
            width: 150,
            render: (policies: OrderItem['pricingPolicies']) => (
                <div>
                    {policies && policies.length > 0 ? (
                        policies.map((policy, index) => (
                            <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                                {policy.policyName}
                            </Tag>
                        ))
                    ) : (
                        <Text type="secondary">无</Text>
                    )}
                </div>
            )
        },
        {
            title: '折后价格',
            dataIndex: 'discountedPrice',
            key: 'discountedPrice',
            width: 120,
            render: (price: number) => (
                <Text strong style={{ color: '#f50' }}>
                    ¥{price.toLocaleString()}
                </Text>
            )
        },
        {
            title: '说明',
            dataIndex: 'priceDescription',
            key: 'priceDescription',
            render: (desc: string) => desc || '-'
        }
    ]

    return (
        <Modal
            title={
                <Space>
                    <span>订单详情</span>
                    <Tag color="blue">v{displayData.version}</Tag>
                    {order.status === 'cancelled' && <Tag color="red">已取消</Tag>}
                </Space>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1000}
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* 基本信息 */}
                <Card>
                    <Title level={5}>基本信息</Title>
                    <Descriptions column={2} size="small">
                        <Descriptions.Item label="订单号">{order.orderNo}</Descriptions.Item>
                        <Descriptions.Item label="状态">
                            {order.status === 'normal' ? (
                                <Tag color="green">正常</Tag>
                            ) : (
                                <Tag color="red">已取消</Tag>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="创建时间">{formatTime(order.createTime)}</Descriptions.Item>
                        <Descriptions.Item label="更新时间">{formatTime(displayData.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="当前版本">v{displayData.version}</Descriptions.Item>
                        <Descriptions.Item label="总金额">
                            <Text strong style={{ color: '#f50', fontSize: '16px' }}>
                                {displayData.totalAmountRMB}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* 客户信息 */}
                <Card>
                    <Title level={5}>客户信息</Title>
                    <Descriptions column={1} size="small">
                        <Descriptions.Item label="客户名称">{displayData.clientName}</Descriptions.Item>
                        <Descriptions.Item label="联系人">
                            {displayData.contactNames && displayData.contactNames.length > 0 ? (
                                <Space wrap>
                                    {displayData.contactNames.map((name, index) => (
                                        <Tag key={index}>{name}</Tag>
                                    ))}
                                </Space>
                            ) : '无'}
                        </Descriptions.Item>
                        <Descriptions.Item label="联系电话">
                            {displayData.contactPhones && displayData.contactPhones.length > 0 ? (
                                <Space wrap>
                                    {displayData.contactPhones.map((phone, index) => (
                                        <Tag key={index} color="geekblue">{phone}</Tag>
                                    ))}
                                </Space>
                            ) : '无'}
                        </Descriptions.Item>
                        <Descriptions.Item label="项目名称">{displayData.projectName}</Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* 服务项目明细 */}
                <Card>
                    <Title level={5}>服务项目明细</Title>
                    {displayData.items && displayData.items.length > 0 ? (
                        <Table
                            columns={itemColumns}
                            dataSource={displayData.items}
                            rowKey={(record, index) => `${record.serviceName}-${index}`}
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
                    <Title level={5}>金额汇总</Title>
                    <div style={{ textAlign: 'right' }}>
                        <Space direction="vertical" size="small">
                            <Text>项目数量: {displayData.items?.length || 0} 项</Text>
                            <Text style={{ fontSize: '18px' }}>
                                总金额: <Text strong style={{ color: '#f50' }}>{displayData.totalAmountRMB}</Text>
                            </Text>
                        </Space>
                    </div>
                </Card>
            </Space>
        </Modal>
    )
}

export default ViewOrderModal