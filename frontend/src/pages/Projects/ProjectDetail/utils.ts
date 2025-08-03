import type { UploadFile } from 'antd/es/upload/interface'
import { Priority } from './types'
import { PRIORITY_CONFIG } from './constants'

// 格式化文件大小
export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 获取文件类型颜色
export const getFileTypeColor = (file: UploadFile) => {
    const fileName = file.name || ''
    const extension = fileName.split('.').pop()?.toLowerCase()

    // 图片类型
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
    if (imageExtensions.includes(extension || '') || file.type?.startsWith('image/')) {
        return 'green'
    }

    // 视频类型
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv']
    if (videoExtensions.includes(extension || '') || file.type?.startsWith('video/')) {
        return 'red'
    }

    // 音频类型
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac']
    if (audioExtensions.includes(extension || '') || file.type?.startsWith('audio/')) {
        return 'orange'
    }

    // 文档类型
    if (extension === 'pdf' || file.type?.includes('pdf')) {
        return 'volcano'
    }
    if (['doc', 'docx'].includes(extension || '') || file.type?.includes('word')) {
        return 'blue'
    }
    if (['xls', 'xlsx'].includes(extension || '') || file.type?.includes('excel')) {
        return 'green'
    }
    if (['ppt', 'pptx'].includes(extension || '') || file.type?.includes('powerpoint')) {
        return 'orange'
    }

    // 压缩文件
    if (['zip', 'rar', '7z'].includes(extension || '')) {
        return 'purple'
    }

    // 默认颜色
    return 'default'
}

// 获取文件图标颜色
export const getFileIconColor = (file: UploadFile) => {
    const fileName = file.name || ''
    const extension = fileName.split('.').pop()?.toLowerCase()

    // 图片类型
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
    if (imageExtensions.includes(extension || '') || file.type?.startsWith('image/')) {
        return '#52c41a'
    }

    // 视频类型
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv']
    if (videoExtensions.includes(extension || '') || file.type?.startsWith('video/')) {
        return '#ff4d4f'
    }

    // 音频类型
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac']
    if (audioExtensions.includes(extension || '') || file.type?.startsWith('audio/')) {
        return '#fa8c16'
    }

    // 文档类型
    if (extension === 'pdf' || file.type?.includes('pdf')) {
        return '#fa541c'
    }
    if (['doc', 'docx'].includes(extension || '') || file.type?.includes('word')) {
        return '#1890ff'
    }
    if (['xls', 'xlsx'].includes(extension || '') || file.type?.includes('excel')) {
        return '#52c41a'
    }
    if (['ppt', 'pptx'].includes(extension || '') || file.type?.includes('powerpoint')) {
        return '#fa8c16'
    }

    // 压缩文件
    if (['zip', 'rar', '7z'].includes(extension || '')) {
        return '#722ed1'
    }

    // 默认颜色
    return '#8c8c8c'
}

// 渲染优先级标签
export const renderPriorityTag = (priority: Priority) => {
    const config = PRIORITY_CONFIG[priority]
    return {
        color: config.color,
        text: `${config.icon} ${config.text}`
    }
}

// 获取进度条颜色和状态文本
export const getProgressConfig = (status: string) => {
    let strokeColor = '#1890ff'
    let statusText = '进行中'

    if (status === 'completed') {
        strokeColor = '#52c41a'
        statusText = '已完成'
    } else if (status === 'cancelled') {
        strokeColor = '#ff4d4f'
        statusText = '已取消'
    } else if (status === 'on-hold') {
        strokeColor = '#faad14'
        statusText = '暂停中'
    } else if (status === 'pending') {
        strokeColor = '#d9d9d9'
        statusText = '待开始'
    }

    return { strokeColor, statusText }
} 