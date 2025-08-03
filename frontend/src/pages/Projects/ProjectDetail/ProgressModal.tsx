import React from 'react'
import { Modal, Slider, InputNumber, Select, Progress, Typography } from 'antd'

const { Text } = Typography
import { ProgressModalProps } from './types'
import { PRIORITY_OPTIONS, PROGRESS_MARKS } from './constants'

export const ProgressModal: React.FC<ProgressModalProps> = ({
    visible,
    editingTask,
    editingProgress,
    editingPriority,
    updatingTaskId,
    onOk,
    onCancel,
    onProgressChange,
    onPriorityChange
}) => {
    return (
        <Modal
            title="编辑任务进度和紧急度"
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            okText="确定"
            cancelText="取消"
            width={500}
            confirmLoading={updatingTaskId === editingTask?._id}
        >
            {editingTask && (
                <div>
                    <div style={{ marginBottom: 16 }}>
                        <Text strong>任务：</Text>
                        <Text>{editingTask.taskName}</Text>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <Text strong>当前进度：</Text>
                        <Text>{editingProgress}%</Text>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <Text strong>调整进度：</Text>
                        <div style={{ marginTop: 8 }}>
                            <Slider
                                min={0}
                                max={100}
                                value={editingProgress}
                                onChange={onProgressChange}
                                marks={PROGRESS_MARKS}
                            />
                        </div>
                        <div style={{ marginTop: 8, textAlign: 'center' }}>
                            <InputNumber
                                min={0}
                                max={100}
                                value={editingProgress}
                                onChange={(value) => onProgressChange(value || 0)}
                                style={{ width: 80 }}
                                addonAfter="%"
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <Text strong>设置紧急度：</Text>
                        <div style={{ marginTop: 8 }}>
                            <Select
                                value={editingPriority}
                                onChange={onPriorityChange}
                                style={{ width: '100%' }}
                                options={PRIORITY_OPTIONS}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <Progress
                            percent={editingProgress}
                            strokeColor={editingProgress === 100 ? '#52c41a' : '#1890ff'}
                            showInfo={false}
                        />
                    </div>
                </div>
            )}
        </Modal>
    )
} 