import { Tag, Spin, Progress, Tooltip } from 'antd'
import type { Task } from '../../../api/tasks'
import SpecificationSelector, { Specification } from '../../../components/SpecificationSelector'
import { Priority } from './types'
import { renderPriorityTag, getProgressConfig } from './utils'

interface TableColumnsProps {
    updatingTaskId: string | null
    onSpecificationChange: (taskId: string, specification: Specification | undefined) => Promise<void>
    onOpenProgressModal: (task: Task) => void
}

export const createTableColumns = ({
    updatingTaskId,
    onSpecificationChange,
    onOpenProgressModal
}: TableColumnsProps) => [
        {
            title: '任务名称',
            dataIndex: 'taskName',
            key: 'taskName',
            width: 200,
        },
        {
            title: '规格信息',
            key: 'specification',
            width: 300,
            render: (_: any, record: Task) => {
                if (updatingTaskId === record._id) {
                    return <Spin size="small" />
                }

                const spec = record.specification
                const specification: Specification | undefined = spec ? {
                    id: spec.id,
                    name: spec.name,
                    length: spec.length,
                    width: spec.width,
                    height: spec.height,
                    unit: spec.unit,
                    resolution: spec.resolution
                } : undefined

                return (
                    <SpecificationSelector
                        value={specification}
                        onChange={(newSpec: Specification | undefined) => onSpecificationChange(record._id, newSpec)}
                        placeholder="点击选择规格"
                    />
                )
            }
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            render: (quantity: number, record: Task) => `${quantity} ${record.unit}`
        },
        {
            title: '紧急度',
            key: 'priority',
            width: 120,
            render: (_: any, record: Task) => {
                const priority = record.priority || 'medium'
                const config = renderPriorityTag(priority as Priority)
                return (
                    <Tag color={config.color} style={{ margin: 0 }}>
                        {config.text}
                    </Tag>
                )
            }
        },
        {
            title: '进度',
            key: 'progress',
            width: 200,
            render: (_: any, record: Task) => {
                if (updatingTaskId === record._id) {
                    return <Spin size="small" />
                }

                const progress = record.progress || 0
                const { strokeColor, statusText } = getProgressConfig(record.status)

                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f5f5f5'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                        onClick={() => onOpenProgressModal(record)}
                    >
                        <Tooltip title={`点击编辑进度 - ${statusText} - ${progress}%`}>
                            <Progress
                                percent={progress}
                                size="small"
                                strokeColor={strokeColor}
                                showInfo={false}
                                style={{ flex: 1, marginRight: 8 }}
                            />
                        </Tooltip>
                        <span style={{ fontSize: '12px', color: '#666', minWidth: '35px' }}>
                            {progress}%
                        </span>
                    </div>
                )
            }
        }
    ] 