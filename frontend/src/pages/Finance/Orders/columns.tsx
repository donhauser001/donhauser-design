import { Tag } from 'antd'
import { EyeOutlined, CheckOutlined, CloseOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { Order } from '../../../api/orders'
import ActionMenu, { ActionTypes } from '../../../components/ActionMenu'

interface ColumnsProps {
    handleDeleteOrder: (order: Order) => void
    handleConfirmOrder: (order: Order) => void
    handleCancelOrder: (order: Order) => void
    handleRestoreOrder: (order: Order) => void
    handleUpdateOrder: (order: Order) => void
}

export const getColumns = ({
    handleDeleteOrder,
    handleConfirmOrder,
    handleCancelOrder,
    handleRestoreOrder,
    handleUpdateOrder
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
                // 获取最后一个版本的快照数据
                const snapshots = record.snapshots || []
                const lastSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null

                if (lastSnapshot) {
                    // 显示最后一个版本的客户和联系人信息
                    return (
                        <div>
                            <div>{lastSnapshot.clientInfo.clientName}</div>
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {lastSnapshot.clientInfo.contactNames && lastSnapshot.clientInfo.contactNames.length > 0
                                    ? lastSnapshot.clientInfo.contactNames.join('、')
                                    : '-'}
                            </div>
                        </div>
                    )
                } else {
                    // 如果没有快照，显示当前版本数据
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
            }
        },
        {
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',
            width: 180,
            render: (projectName: string, record: Order) => {
                // 获取最后一个版本的快照数据
                const snapshots = record.snapshots || []
                const lastSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null

                if (lastSnapshot) {
                    // 显示最后一个版本的项目名称
                    return lastSnapshot.projectInfo.projectName
                } else {
                    // 如果没有快照，显示当前版本数据
                    return projectName
                }
            }
        },
        {
            title: '订单金额',
            dataIndex: 'currentAmount',
            key: 'currentAmount',
            width: 120,
            render: (amount: number, record: Order) => {
                // 获取最后一个版本的快照数据
                const snapshots = record.snapshots || []
                const lastSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null

                if (lastSnapshot) {
                    // 显示最后一个版本的金额和项目数量
                    const itemCount = lastSnapshot.items?.length || 0
                    return `¥${lastSnapshot.totalAmount.toLocaleString()} (${itemCount}项)`
                } else {
                    // 如果没有快照，显示当前版本数据
                    const currentSnapshot = record.snapshots?.find(s => s.version === record.currentVersion)
                    const itemCount = currentSnapshot?.items?.length || 0
                    return `¥${amount.toLocaleString()} (${itemCount}项)`
                }
            }
        },
        {
            title: '版本',
            key: 'version',
            width: 80,
            render: (_: any, record: Order) => {
                const snapshots = record.snapshots || []
                const lastSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null

                if (lastSnapshot) {
                    return `v${lastSnapshot.version}`
                } else {
                    return `v${record.currentVersion}`
                }
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 150,
            render: (time: string) => time ? time.split(' ')[0] : '-'
        },
        {
            title: '操作',
            key: 'action',
            width: 80,
            render: (_: any, record: Order) => {
                const actions = []

                // 更新按钮
                actions.push({
                    key: 'update',
                    label: '更新',
                    icon: <EyeOutlined />,
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