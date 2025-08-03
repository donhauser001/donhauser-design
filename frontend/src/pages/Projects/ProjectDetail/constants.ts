import { Priority, ProjectStatus } from './types'

export const STATUS_COLORS: Record<ProjectStatus, string> = {
    pending: 'orange',
    'in-progress': 'blue',
    completed: 'green',
    cancelled: 'red',
    'on-hold': 'purple'
} as const

export const STATUS_TEXT: Record<ProjectStatus, string> = {
    pending: '待开始',
    'in-progress': '进行中',
    completed: '已完成',
    cancelled: '已取消',
    'on-hold': '暂停中'
} as const

export const PRIORITY_CONFIG: Record<Priority, { color: string; text: string; icon: string }> = {
    low: { color: '#52c41a', text: '低', icon: '🟢' },
    medium: { color: '#faad14', text: '中', icon: '🟡' },
    high: { color: '#ff7a45', text: '高', icon: '🟠' },
    urgent: { color: '#ff4d4f', text: '紧急', icon: '🔴' }
} as const

export const PRIORITY_OPTIONS = [
    { value: 'low', label: '🟢 低' },
    { value: 'medium', label: '🟡 中' },
    { value: 'high', label: '🟠 高' },
    { value: 'urgent', label: '🔴 紧急' }
]

export const PROGRESS_MARKS = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%'
} as const 