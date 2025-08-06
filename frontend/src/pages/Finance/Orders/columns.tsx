import { Tag } from 'antd'
import { EyeOutlined, EditOutlined, CheckOutlined, CloseOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { Order } from '../../../api/orders'
import ActionMenu, { ActionTypes } from '../../../components/ActionMenu'

interface ColumnsProps {
    handleDeleteOrder: (order: Order) => void
    handleConfirmOrder: (order: Order) => void
    handleCancelOrder: (order: Order) => void
    handleRestoreOrder: (order: Order) => void
    handleUpdateOrder: (order: Order) => void
    handleViewOrder: (order: Order) => void
}

export const getColumns = ({
    handleDeleteOrder,
    handleConfirmOrder,
    handleCancelOrder,
    handleRestoreOrder,
    handleUpdateOrder,
    handleViewOrder
}: ColumnsProps) => [
        {
            title: '订单号',
            dataIndex: 'orderNo',
            key: 'orderNo',
            width: 150,
            render: (orderNo: string, record: Order) => (
                <div>
                    <span>{orderNo}</span>
                    {record.status === 'cancelled' && (
                        <Tag color="red" style={{ marginLeft: 8 }}>已取消</Tag>
                    )}
                </div>
            )
        },
        {
            title: '客户',
            dataIndex: 'clientName',
            key: 'clientName',
            width: 200,
            render: (clientName: string, record: Order) => {
                return (
                    <div>
                        <div>{clientName}</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            {record.contactNames && record.contactNames.length > 0
                                ? record.contactNames.join('、')
                                : '-'}
                        </div>
                    </div>
                )
            }
        },
        {
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',
            width: 180,
            render: (projectName: string, record: Order) => {
                return projectName
            }
        },
        {
            title: '订单金额',
            dataIndex: 'currentAmount',
            key: 'currentAmount',
            width: 120,
            render: (amount: number, record: Order) => {
                // 使用最新的版本信息
                const itemCount = record.latestVersionInfo?.totalItems || 0
                const displayAmount = record.currentAmount || amount || 0
                return `¥${displayAmount.toLocaleString()} (${itemCount}项)`
            }
        },
        {
            title: '版本',
            key: 'version',
            width: 80,
            render: (_: any, record: Order) => {
                return `v${record.currentVersion || 1}`
            }
        },
        {
            title: '更新时间',
            key: 'updateTime',
            width: 150,
            render: (_: any, record: Order) => {
                const timeToDisplay = record.updateTime || record.createTime

                if (!timeToDisplay) return '-'

                const date = new Date(timeToDisplay)
                // 检查是否是有效日期
                if (isNaN(date.getTime())) {
                    // 如果是字符串格式（如 "2025-01-18"），直接返回
                    return timeToDisplay.toString().split(' ')[0]
                }

                // 格式化为中文日期时间格式
                return date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_: any, record: Order) => {
                const actions = []

                // 查看按钮
                actions.push({
                    key: 'view',
                    label: '查看',
                    icon: <EyeOutlined />,
                    onClick: () => handleViewOrder(record)
                })

                // 更新按钮
                actions.push({
                    key: 'update',
                    label: '更新',
                    icon: <EditOutlined />,
                    onClick: () => handleUpdateOrder(record)
                })

                // 取消按钮（正常状态）
                if (record.status === 'normal') {
                    actions.push({
                        key: 'cancel',
                        label: '取消',
                        icon: <CloseOutlined />,
                        onClick: () => handleCancelOrder(record)
                    })
                }

                // 恢复按钮（已取消状态）
                if (record.status === 'cancelled') {
                    actions.push({
                        key: 'restore',
                        label: '恢复',
                        icon: <CheckCircleOutlined />,
                        onClick: () => handleRestoreOrder(record)
                    })
                }

                // 删除按钮
                actions.push({
                    ...ActionTypes.DELETE,
                    onClick: () => handleDeleteOrder(record)
                })

                return <ActionMenu actions={actions} />
            },
        },
    ] 